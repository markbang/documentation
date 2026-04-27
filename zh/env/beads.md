---
title: "Beads"
description: "Beads 是基于 Dolt 的图状 issue tracker，为编码 Agent 提供结构化记忆、依赖感知任务跟踪和 JSON 友好的工作流。"
icon: "diagram-project"
---

# Beads

[Beads](https://github.com/gastownhall/beads) 是一个面向编码 Agent 的图状 issue tracker。它的命令行工具叫 `bd`，底层存储使用 [Dolt](https://www.dolthub.com/) 这个带版本控制能力的 SQL 数据库。

它最值得关注的点不是“又一个待办清单”，而是给 Agent 一个结构化任务图，让长任务、多分支、多 Agent 协作和上下文压缩都更容易处理。

## 它解决什么问题

Markdown 计划很好起步，但任务一长就容易失控：

- 依赖关系藏在自然语言里
- 多个 Agent 可能改同一份计划文件
- 已完成内容继续占上下文
- 恢复任务时要重读大量描述
- 分支、机器或 Agent 之间交接很脆弱

Beads 把任务状态变成数据库里的图。Agent 可以查询哪些任务已经 ready、声明自己要做哪一项、记录阻塞关系，并保留操作历史。

## 核心模型

Beads 把 issue 存成结构化记录，而不是纯文本笔记。

几个关键概念：

- **Issue**：任务、bug、epic、消息或其他工作项。
- **依赖关系**：父子任务、阻塞、关联、重复和替代关系。
- **Ready 队列**：`bd ready` 列出当前没有开放阻塞的任务。
- **声明任务**：`bd update <id> --claim` 让 Agent 原子化认领任务。
- **压缩**：旧的已关闭任务可以被总结，减少上下文消耗。
- **JSON 输出**：命令设计上更方便 Agent 和脚本解析。

所以它更像 Agent 的外部记忆层，而不是只给人看的 issue 系统。

## 基本用法

先安装 CLI，再在项目里初始化：

```bash
brew install beads
cd your-project
bd init
```

然后告诉 Agent 使用它：

```bash
echo "Use 'bd' for task tracking" >> AGENTS.md
```

常用命令：

| 命令 | 用途 |
| --- | --- |
| `bd ready` | 列出没有阻塞的任务。 |
| `bd create "Title" -p 0` | 创建高优先级任务。 |
| `bd update <id> --claim` | 原子化认领任务。 |
| `bd dep add <child> <parent>` | 添加依赖或层级关系。 |
| `bd show <id>` | 查看详情和操作历史。 |

## 存储模式

Beads 主要有两种存储模式：

- **Embedded mode**：`bd init` 使用进程内 Dolt 数据库，是默认模式，适合多数个人或单写者工作流。
- **Server mode**：`bd init --server` 连接外部 `dolt sql-server`，更适合多写者并发访问。

它还支持通过 `BEADS_DIR` 和 `bd init --stealth` 做 **git-free usage**，适合 CI、评测、monorepo、非 git 版本控制，或者不想污染共享仓库的个人任务跟踪。

## 什么时候用

这些场景可以考虑 Beads：

- 编码任务会跨很多轮或很多天
- 多个 Agent 或多个分支需要协作
- 任务依赖比普通 checklist 更重要
- 希望任务状态机器可读，而不是只写在自然语言计划里
- 想保留进度，但不想把全部历史塞进 prompt

如果只是一次性小改动，普通 Markdown 更简单。只要任务开始变成长周期 Agent 工作流，Beads 就能给 harness 一个更可靠的外部记忆面。

## 它在 Agent harness 里的位置

在 Agent harness 设计里，Beads 属于**记忆与协调层**：

- 把任务状态从模型上下文里外化出来
- 给 Agent 一个可查询的 ready 队列
- 通过生成 ID 和结构化存储减少冲突
- 让交接更容易，因为任务状态不再只藏在聊天历史里

它可以和 `git worktree`、browser harness、仓库里的 `AGENTS.md` 配合使用。背后的思路一样：把稳定状态从模型里拿出来，放进可检查的项目基础设施。

## 采用前要检查什么

- 决定 `.beads/` 应该提交、忽略，还是用 stealth mode。
- 给 Agent 自动化时优先使用 JSON 输出。
- 多 Agent 场景里，先测试认领任务和依赖更新。
- 信任下载的二进制前，先确认校验和或签名策略。
- 任务标题和依赖关系保持简短，方便 Agent 快速扫描。

## 参考资料

- [gastownhall/beads](https://github.com/gastownhall/beads)
- [Beads documentation](https://gastownhall.github.io/beads/)
- [Dolt](https://www.dolthub.com/)
