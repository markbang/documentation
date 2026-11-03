---
title: "Agent 规模下的 Git"
description: "Git 如何用对象、引用和 packfile 存储与传输历史，为什么大量并发 Agent 会压垮 Git 服务端，OpenAI Pando 后端做了哪些取舍，以及现在就能在客户端做的优化。"
icon: "code-merge"
---

# Agent 规模下的 Git

编码 Agent 会成倍放大 Git 流量。一个工程师可能同时有好几个改动在跑 CI，每次推送又会触发好几个 job 去拉同一个提交，每个 Agent 沙箱都需要一份检出。2025 年底起，OpenAI 的 monorepo 服务端开始跟不上：fetch 和 push 变慢，合并失败，可靠性一度低于 90%。

OpenAI 的解法是 **Pando**，一个兼容 Git 的新后端。本页借它的设计讲清楚 Git 怎么搬运数据、服务端在哪里会成为瓶颈，最后给出不用自建后端、在客户端就能做的优化。

## Git 怎么存历史

一个仓库要同步两样东西：**对象**和**引用**。

- **对象**按内容寻址，且不可变。**blob** 存一个文件的内容，**tree** 把名字映射到 blob 或其他 tree，**commit** 指向一个根 tree 和若干父提交，**tag** 给某个对象起名。改一个文件，会生成新的 blob，以及从它到根目录的一串新 tree；没变的文件和目录直接复用已有对象。
- **引用**是指向提交的名字，比如 `refs/heads/main`。在分支上提交，就是新建一个提交对象并移动这个引用。
- 对象可以**松散**存储（一个对象一个文件），也可以打进 **packfile**，相似对象之间用增量（delta）存储。

本地就能逐层看到：

```bash
git cat-file -p HEAD              # 提交：tree、父提交、作者
git cat-file -p 'HEAD^{tree}'     # tree：名字 -> blob/tree ID
git count-objects -v              # 松散对象与打包对象
git ls-remote origin | wc -l      # 服务端公布了多少个引用
```

## fetch 和 push 怎么搬数据

- **fetch。** 客户端告诉服务端想要（**want**）哪些提交、已经有（**have**）哪些。服务端遍历从想要的提交可达的所有对象，去掉客户端已有的，把剩下的打成 packfile 发过去。完整 clone 什么都没有，所以要收下全部可达对象。
- **push。** 服务端先公布自己的引用。客户端据此省掉服务端已有的对象，发出的 pack **依赖**服务端已有对象，所以单靠这个 pack 无法重建历史。
- **引用更新会竞争。** 两次推送可能都想把同一分支从同一个旧提交移到不同的新提交，服务端只能接受一个、拒绝另一个。

所以 Git 服务端有两类负载：**大量写者**往不同分支推，**大量读者**拉同一段历史。Agent 会让两者同时上涨。

## 扩展 Git 服务端的三种思路

| 设计 | 写入如何排序 | 瓶颈在哪 |
| --- | --- | --- |
| **多副本 + 三阶段提交** | 每次推送复制到所有副本，每次引用更新要多数副本同意 | 副本磁盘和网络往返都在推送路径上，负载一高写入就慢 |
| **对象存储里的共享预写日志（WAL）** | pack 可以并行上传，但每次引用更新都要用 compare-and-swap 追加到同一个清单 | 所有推送争同一个清单；副本要先读取、索引新 pack 才能对外提供，读者要等 |
| **Pando：按引用排序** | 每个分支独立更新；pack 只存一次、反复复用 | 放弃了“所有引用在同一时刻”的一致视图 |

两种传统设计都维护了**整个仓库的写入全序**，这正是互不相干的分支推送也要互相等待的原因。

## Pando 改了什么

Pando 保留 Git 协议和 Git 客户端，工程师和 Agent 的用法都不变。它放松了大多数 Git 服务端默认的两个前提：

1. **不提供整个仓库的时间点快照。** Pando 对每个引用提供**因果一致性**：拉取某个分支时能拿到该版本需要的历史，但同时看多个分支的读者，看到的可能是不同时刻的状态。实际上，用户和 Agent 依赖的是单个分支内的更新顺序，而不是全局顺序。
2. **不为每个客户端单独生成 pack。** 每次 fetch 都定制 pack 很耗 CPU 和磁盘。Pando 直接复用已存的 pack，哪怕客户端会多下载几个已有的对象。

一次 push 和一次 fetch 的过程：

- **push。** Pando 把收到的 pack 流式写入对象存储，一遍解码完成校验，不解包到本地仓库。随后用一个多键事务记录**引用版本**（新的提交、提供它的 pack、它依赖的更早版本）并移动引用指针，推送者马上就能读到自己的写入。整个过程的元数据操作次数是常数。
- **fetch。** Pando 根据客户端已有的内容挑选需要的已存 pack，元数据读取次数随两个版本之间距离的对数增长。它返回 pack 的 URL，客户端从区域缓存下载。
- **只公布主干。** 推送新分支时，Pando 只公布主干分支，而不是全部引用。分支到了数百万个时，光是完整的引用公布就可能超过 100 MiB。只公布主干还让推上来的 pack 可以复用：任何已有主干的读者，用这一个 pack 就能拉到该分支。代价是对同一分支多次推送、或分支叠在分支上时，主干以外的对象要重复发送。在 OpenAI 的 monorepo 里，pack 中位数仍不到 20 KiB，p99 不到 3 MiB。

服务端主要做协商和挑选 pack，所以普通硬件就够用；扩容只需加服务器，并同步扩展元数据存储和对象存储。OpenAI 称推送延迟中位数降低了近 5 倍，Pando 每天提供接近 1 PB 的 Git 数据。

<Note>
Pando 只在 OpenAI 内部使用。公开的仓库是 OpenAI 自己构建的 Git 客户端，不是这个后端。文中数字来自 OpenAI 的文章，没有公布基线或硬件细节。
</Note>

## 可以长期沿用的教训

- **想清楚真正需要哪种一致性。** 全部引用的全局快照很昂贵，而大多数工作流只依赖单个分支内的顺序。
- **度量“推送到可拉取”的延迟：** 一个 Agent 推送后，另一个 Agent 或 CI job 要等多久才能拉到这个提交。Agent 之间协作等的就是这个数字。
- **让读取可缓存。** 把同样的字节发给许多读者，比给每个读者算一个最优响应更划算。
- **保留协议，替换后端。** 保持 Git 兼容，人、Agent 和工具都不用迁移。

## 现在就能做的事

大多数团队在需要换服务端之前，会先碰到客户端的瓶颈。先减少每个 Agent 和 CI job 下载的数据量：

- **无 blob 的部分克隆。** `git clone --filter=blob:none <url>` 只下载提交和 tree，文件内容等检出时用到再拉。
- **稀疏检出。** `git sparse-checkout set <dir>...` 只在工作区里保留 Agent 需要的目录。
- **Scalar。** `scalar clone <url>` 一步配好大仓库方案：只克隆提交和 tree、开启稀疏检出、注册后台维护，并应用推荐配置。已有的克隆用 `scalar register`。
- **并行 Agent 共享对象库。** 每个 Agent 用一个 [Git worktree](/zh/env/git-worktree)，而不是单独 clone，对象只拉一次。
- **CI 浅克隆。** 除非 job 需要历史，否则保持 `actions/checkout` 默认的 `fetch-depth: 1`，见 [GitHub Actions](/zh/env/github-workflow)。

## 参考资料

- [Folo 来源：OpenAI News，Scaling Git at OpenAI](https://openai.com/index/scaling-git-at-openai)
- [The New Stack：OpenAI built itself a new Git backend, too](https://thenewstack.io/openai-pando-git-backend/)
- [Git 文档：partial clone](https://git-scm.com/docs/partial-clone)
- [Git 文档：git-sparse-checkout](https://git-scm.com/docs/git-sparse-checkout)
- [Git 文档：scalar](https://git-scm.com/docs/scalar)
- [Pro Git：Git 内部原理，Git 对象](https://git-scm.com/book/zh/v2/Git-%E5%86%85%E9%83%A8%E5%8E%9F%E7%90%86-Git-%E5%AF%B9%E8%B1%A1)
- [Pro Git：传输协议](https://git-scm.com/book/zh/v2/Git-%E5%86%85%E9%83%A8%E5%8E%9F%E7%90%86-%E4%BC%A0%E8%BE%93%E5%8D%8F%E8%AE%AE)
