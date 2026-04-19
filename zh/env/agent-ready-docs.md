---
title: "让文档站对 AI Agent 更友好"
description: "面向文档站的 AI Agent 适配实操清单，帮助编码代理与 AI 搜索工具更好地发现和解析你的文档，涵盖 llms.txt 声明文件配置、Markdown 纯文本输出、Content-Signal 内容信号标注、API 与 MCP 协议发现以及大规模文档站结构优化建议。"
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

## 按阶段落地最省事

推荐这样推进：

1. 先修好 `robots.txt`、`sitemap.xml`、标题、描述
2. 再加 `llms.txt`
3. 再补 Markdown 输出：`Accept: text/markdown` 或 `/index.md`
4. 需要时再补 `Content-Signal`
5. 站点真的有 API 或 MCP，再做协议发现

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

- [Cloudflare：Introducing the Agent Readiness score](https://blog.cloudflare.com/agent-readiness/)
- [Cloudflare Style Guide：AI tooling](https://developers.cloudflare.com/style-guide/ai-tooling/)
- [Cloudflare：robots.txt setting and Content Signals](https://developers.cloudflare.com/bots/additional-configurations/managed-robots-txt/)
- [llms.txt 规范](https://llmstxt.org/)
