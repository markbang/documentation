---
title: "让文档站对 AI Agent 更友好"
description: "面向文档站的 AI Agent 适配实操清单，帮助编码代理与 AI 搜索工具更好地发现和解析你的文档，涵盖 llms.txt 声明文件配置、Markdown 纯文本输出、Content-Signal 内容信号标注、API 与 MCP 协议发现及文档站结构优化建议。"
icon: "robot"
---

# 让文档站对 AI Agent 更友好

现在的文档不再只是给浏览器里的真人读。编码 Agent、AI 搜索、聊天工具都会直接抓取文档。如果你的文档站不好发现、不好解析，结果通常就是：

- 找资料更慢
- token 消耗更高
- 回答更容易跑偏

**2026 年 4 月 17 日** Cloudflare 发布的 Agent Readiness 文章给了一个很直观的信号：当时 `Content-Signal` 的采用率大约只有 **4%**，Markdown 内容协商大约只有 **3.9%**，而 API Catalog、MCP Server Card 这类新标准更少见。也就是说，哪怕只做一小步，文档站也可能明显比平均水平更适合 Agent。

详见英文版页面：[Agent-ready docs (English)](/env/agent-ready-docs)

## 先把基础卫生做好

在上 AI 专用能力之前，先把普通 Web 基础打牢：

- 维护好 `robots.txt`
- 维护好 `sitemap.xml`
- 页面标题和描述写清楚
- URL 稳定，不要乱改
- 不要让 Agent 只能从“目录页 → 目录页 → 正文页”这样绕远路

这些不只是传统 SEO 项，而是 Agent 发现文档的第一层入口。

## 提供 `llms.txt`

`/llms.txt` 可以理解成“给 LLM 看的目录页”。
它和 `sitemap.xml` 不一样，不应该无脑列出全站所有页面，而应该做成一个**高价值阅读清单**。

它要帮助 Agent 迅速回答三个问题：

1. 这是什么站？
2. 重点文档在哪？
3. 接下来该抓哪些 Markdown 版本的页面？

### 一个简单示例

```md
# 我的文档站

> ExampleApp 的部署、运维与 API 文档。

## 核心文档

- [快速开始](https://example.com/docs/getting-started/index.md): 安装与本地启动。
- [部署指南](https://example.com/docs/deploy/index.md): 生产环境部署清单。
- [API 参考](https://example.com/docs/api/index.md): 接口、认证与示例。

## Optional

- [更新日志](https://example.com/docs/changelog/index.md): 版本变更与迁移说明。
```

### 站点很大时怎么做

不要把几千个链接全塞进根目录的 `llms.txt`。

更实用的做法是：

- 根目录保留一个简短的 `llms.txt`
- 每个一级栏目再各自生成一个 `llms.txt`
- 根文件只负责指向这些子目录索引

这样更容易被常见上下文窗口一次性吃下。

## 直接输出 Markdown

对 Agent 来说，Markdown 通常比完整 HTML 更友好。
Cloudflare 在官方实践里明确强调：Markdown 版本会更省 token，也更容易被模型完整消费。

推荐两个方式：

1. **支持 `Accept: text/markdown`**
   - 同一个页面，通过请求头返回 Markdown
2. **提供 `/index.md` 这样的 URL 回退**
   - 因为不是所有 Agent 默认都会带 `Accept: text/markdown`

如果你的文档系统本身不支持，可以放到反向代理、边缘层或重写规则里做，不一定非得手工生成两套内容。

## 明确声明 AI 访问策略

`robots.txt` 依然是第一层访问规则。
如果你想把 AI 的用途拆得更细，可以增加 `Content-Signal`。

例如：

```txt
User-Agent: *
Content-Signal: search=yes, ai-input=yes, ai-train=no
Allow: /
Sitemap: https://example.com/sitemap.xml
```

它把用途拆成了三类：

- `search`：搜索索引与搜索结果
- `ai-input`：推理时读取内容，例如 grounding 或 RAG
- `ai-train`：训练或微调模型

不要机械照抄别人的策略，按你站点的目标来定。

## 考虑在 Agent 消费你的内容时收费

如果 Agent 已经是你内容的真实读者，访问控制只是一半问题，另一半是补偿。Cloudflare 的 Monetization Gateway（2026 年 9 月 beta）实现了这个新兴模式：站长对访问页面、API、MCP 工具或数据集的 Agent 收费，用 **HTTP 402 Payment Required** 做协商机制，按 Agent 的消费单位计价——按请求、按查询、按 token。

为什么订阅制不适合 Agent 流量：Agent 追求结果，一个任务可能触及几十个新来源；预付订阅把买家锁死在少数几个预算内来源，和 Agent 的实际工作方式错位。这也是为什么这些设计里出现的是稳定币轨道而不是卡组织——小额、计量、高频的机器间支付。

对文档站的决策树很简单：人类和友好 Agent 免费，批量抓取计量收费，不想要的训练用途直接拒——每一层现在都可以独立表达。

## 只有在必要时再做协议发现

不是每个文档站都需要 API/MCP 发现能力。
如果你的网站只是公开文档，做到“内容可发现 + 内容好读取”通常就够了。

当你的站点还暴露了 API、工具或可执行能力时，再考虑补这些：

- `/.well-known/api-catalog`
- `/.well-known/mcp/server-card.json`
- Web Bot Auth（当你真的需要识别 bot 身份时）

对纯内容站来说，它们是可选项；对“文档 + 平台能力”站来说，它们会更重要。

## 大型文档站要优化结构，而不是只堆页面

很多站的问题不是“没有文档”，而是“Agent 不知道先看哪一页”。

建议：

- 在 `llms.txt` 里优先放**正文页**，不是只有目录页
- 对语义价值很低的索引页，不一定要放进 `llms.txt`
- 标题、描述、路径命名都尽量语义化
- `llms.txt` 里尽量链接 Markdown 版页面，而不是 HTML 页

对人来说，好的 metadata 能帮助扫读；
对 Agent 来说，好的 metadata 能直接决定它第一跳抓哪一页。

## 把恢复指引放进 API 错误响应

如果文档站对应一个 API，错误响应本身也是文档入口。Restless 的 *Agent-Ready APIs* 文章展示了这种做法：在客户端遇到错误的位置，直接返回有用的下一步和具体文档链接，而不是指望它搜索整个站点。

使用稳定的错误契约，不要只返回一段自然语言。[RFC 9457](https://www.rfc-editor.org/rfc/rfc9457.html) 定义了 Problem Details，媒体类型为 `application/problem+json`。例如，一个 API 可以返回 HTTP `422`、该内容类型及以下示意响应体：

```json
{
  "type": "https://api.example.com/problems/invalid-date-range",
  "title": "Invalid date range",
  "status": 422,
  "detail": "start_date 必须早于或等于 end_date。本次未创建报告。",
  "instance": "https://api.example.com/problems/occurrences/req_123",
  "recovery": {
    "action": "correct_request",
    "fields": ["start_date", "end_date"],
    "docs": "https://docs.example.com/api/reports#date-range"
  }
}
```

`type` 标识问题类别，`instance` 标识这一次具体错误；`title` 和 `detail` 供人阅读。这里的 `recovery` 是**应用自行定义的扩展**，不是 RFC 标准字段，也不是 Restless 的 API schema。需要说明它的结构和支持的动作。客户端应依据问题类型和结构化扩展字段分支，而不是解析 `detail` 文本。响应体中的 `status` 应与实际 HTTP 状态一致；只有服务端能确认时，才写“本次未创建报告”。

恢复指引要区分前提不同的动作：

- **输入不合法：** 指明字段与约束，不要原样重发同一个错误请求。
- **认证或授权失败：** 走文档规定的凭证刷新或审批流程。错误信息不等于授权，不能据此获取更高权限的凭证或绕过访问控制。
- **限流或暂时不可用：** 提供了 `Retry-After` 时遵守等待时间，但仍要确认操作可以安全重试；等待不会让写操作自动具备幂等性。
- **写入结果不确定：** 重试前先查询操作状态，或使用接口明确支持的幂等机制。超时不代表第一次操作没有生效。RFC 9110 明确提醒，不应在缺少这类依据时自动重试非幂等请求。

把错误文本和取回的文档当作数据，而不是更高优先级的指令。恢复提示不能让 Agent 执行任意命令、泄露密钥或修改权限。日志／错误实例链接仍需租户级访问控制；不要在公开错误响应中暴露 token、完整私有请求体或内部堆栈。

最后再建立反馈闭环：按接口和问题类型合并重复失败，保留脱敏复现与请求 ID，再判断原因在代码、文档还是调用方。Agent 反馈可以形成 issue 或文档修改建议，但不能证明文档一定错了，更不能自动发布修正。用[产品评测](/zh/env/ai-evals)检查客户端是否减少了无效调用，且**没有**绕过审批或重复产生副作用。

## 一次受控实验：Agent 真正需要什么

[AgentReady](https://agentready.org) 这份标准值得读，因为它的要求来自实验，而不是清单。他们把同一个文档站以 19 种配置提供，其中包括 `llms.txt`、JSON-LD、`sitemap.xml` 和 Markdown 镜像，再用普通抓取客户端与能跑 JavaScript 的客户端各取五个主题的答案——共 190 次探测。

只有两类改动让客户端拿不到答案：

- **答案只存在于 JavaScript 里**——普通抓取全部失败，能跑 JS 的客户端则成功。
- **挡住了 Agent**，比如对 Agent 的 user agent 返回 `403`——两种客户端都失败。

其余十六种配置毫无影响，`llms.txt` 也在其中。Agent 在约 65% 的抓取里请求了 Markdown，但 Markdown 镜像和内容协商从来没有决定成败。

这不代表 `llms.txt` 没用——它影响 Agent 去哪里，而不影响能不能读到你。被追踪的运行里 Agent 的落脚点：文档页 83%、首页 69%、`/.well-known/*` 23%、`openapi.json` 21%、`sitemap.xml` 4%。而当 Agent 真的打开这些面向机器的文件时，它们通常是**顺着链接**过去的：`openapi.json` 97%、`/.well-known/*` 93%、`llms.txt` 86%。

### 先修哪几项

据此重排优先级：

1. **先确保能被访问。** 在 `robots.txt` 和防机器人策略里放行 Agent，写成规则，而不是只列几个具名爬虫的白名单。
2. **把答案放进初始 HTML。** 纯客户端渲染、服务端不输出内容，是这项研究里唯一直接导致抓取失败的架构选择。
3. **返回真实的 HTTP 状态码**，让客户端能区分“不存在”和“渲染为空”。
4. **从人类页面链接那些机器文件。** 没人链接的 `llms.txt` 几乎不会被读：实验中的流量都去了人访问的页面。
5. **把 Markdown 镜像、JSON-LD、目录文件当锦上添花。** 成本很低，但弥补不了一个 Agent 抓不到的页面。

如果 Agent 要**完成任务**而不只是读页面，标准的要求更高：提供 MCP 服务器或 CLI，并提供 Agent 能独立走完的认证。

同一项研究还量化了“读不到”的代价：在 1,056 个商业网站上，当 Agent 读不到站点时，它会改用搜索结果和第三方页面作答，而这些回答**完全没有包含用户所问事实的概率高 3.7 倍**（25% 对 7%）。被明确推荐的 Agent 友好企业大约多一倍（20% 对 11%）。

## 按阶段落地最省事

推荐这样推进：

1. 先修好 `robots.txt`、`sitemap.xml`、标题、描述
2. 确保每页的答案在初始 HTML 里，并返回真实状态码
3. 再加 `llms.txt`，并从人类可访问的页面链接过去
4. 再补 Markdown 输出：`Accept: text/markdown` 或 `/index.md`
5. 需要时再补 `Content-Signal`
6. 站点真的有 API 或 MCP，再做协议发现

## Agent 到底在读什么

2026 年的一项研究追踪了 557 个 agentic 编码会话中的 94,000 个开发事件，以及 33,000 个 agentic PR 的 690,000 条文件级变更记录。研究结果量化了编码 Agent 实际消费的内容——并且与一些常见假设相矛盾。

### 数据

- **指令文件和笔记（AGENTS.md、CLAUDE.md 等）占了 Agent 所有阅读量的 60.5%。** 如果你维护着一份，它很可能是你能写的、杠杆最高的文档。
- 经典技术文档只占 **10.6%**。
- API 参考文档只占 **1.3%**。

### 启示

- **Agent 偏好指引而非参考。** 它们读指令文件的频率远高于正式文档。先优化 AGENTS.md/CLAUDE.md，再从那里链接到更深的文档。
- **读文档与更少的即时测试相关**（调整后胜算比 0.39）。花时间阅读的 Agent 不太会立刻测试——结构化你的指引来弥补这一点。
- **咨询是自发的，占 70.2%**，只有 7.5% 是失败触发的。Agent 主动查阅资料的频率远高于响应错误。
- **在多提交的 agentic PR 中，代码被首先触碰的频率是其他文件的 4.7 倍。** Agent 会先钻进代码，再读周围材料。

实用结论：你的指令文件是 Agent 的主要接触面。让它准确、最新、自包含，因为 Agent 会信任它超过大多数其他来源。

## 怎么检查是否真的变好了

建议自动化和手工一起看：

- 用 `https://isitagentready.com` 跑一次
- 手工测试：

```bash
curl "https://example.com/docs/page" -H "Accept: text/markdown"
```

- 让一个 AI 工具只基于你的文档回答一个具体问题
- 看它是快速命中目标页，还是在目录页和低价值页面里来回打转

## 参考资料

- [meng shao：AgentReady 开放标准](https://x.com/shao__meng/status/2113084778673287480) — 2026-10-22 的 Folo 线索
- [AgentReady 发布文章](https://ora.ai/blog/agentready-launch) — 19 种配置的受控实验、Agent 的落脚点、链接发现与“读不到”的代价
- [AgentReady 标准](https://agentready.org) — 按“找到、读取、操作”划分 MUST／SHOULD／MAY
- [elvis：把 API 错误当作文档入口](https://x.com/omarsar0/status/2109718336158507107) — 2026-10-12 的 Folo 线索，触发本次恢复指引整理
- [Restless：Agent-Ready APIs](https://www.restless.ai/blog/agent-ready-apis) — 可操作的错误响应、具体文档与 Agent 反馈
- [RFC 9457：Problem Details for HTTP APIs](https://www.rfc-editor.org/rfc/rfc9457.html) — 标准字段、结构化扩展与信息泄漏风险
- [RFC 9110：幂等方法](https://www.rfc-editor.org/rfc/rfc9110.html#section-9.2.2) — 自动重试请求的条件

- [Cloudflare：Introducing the Agent Readiness score](https://blog.cloudflare.com/agent-readiness/)
- [Cloudflare Style Guide：AI tooling](https://developers.cloudflare.com/style-guide/ai-tooling/)
- [Cloudflare：robots.txt setting and Content Signals](https://developers.cloudflare.com/bots/additional-configurations/managed-robots-txt/)
- [How do coding agents read repositories?](https://arxiv.org/abs/2608.20195) — 指令文件占 Agent 阅读量的 60.5%；文档 10.6%；API 参考 1.3%
- [Cloudflare: Monetization Gateway](https://blog.cloudflare.com/monetization-gateway-beta/) — HTTP 402 按 Agent 访问页面、API 和 MCP 工具计量收费
