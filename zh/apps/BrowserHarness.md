---
title: "Browser Harness"
description: "Browser Harness 是 Browser Use 团队推出的轻量级浏览器控制层，基于 CDP 直接连接真实浏览器，适合 Codex、Claude Code 等 Agent 在执行任务时动态补齐缺失能力。"
icon: "globe"
---

# Browser Harness

[Browser Harness](https://github.com/browser-use/browser-harness) 是 Browser Use 团队开源的一个浏览器控制层。它的核心思路很直接：

- 通过 **CDP** 直连 Chrome
- 保持 harness 本身足够**薄**
- 缺什么能力，就让 Agent 在任务过程中**把缺的 helper 写出来**

它不是传统意义上那种“先把所有流程都写死”的浏览器测试框架，更像是一个专门给 **Codex**、**Claude Code** 这类编码 Agent 使用的轻量桥接层。

## 为什么值得关注

现在很多浏览器自动化工具都能“让 AI 点网页”。  
Browser Harness 更特别的地方在于，它是按 **agentic workflow** 的思路设计的：

- 可以直接配合 **Codex**、**Claude Code**
- 可以接入你自己的**真实浏览器**
- 如果执行到一半发现 helper 不够，Agent 可以**现场补代码**
- 也支持免费远程浏览器，适合云端或 sub-agent 场景

官方 README 对它的定义是 **self-healing browser harness**。  
也就是说，它默认接受这样一个现实：浏览器任务不会总是刚好被预设函数完整覆盖，所以“执行中自我补齐能力”本身就是设计目标的一部分。

## 它怎么工作

这个项目本身刻意做得很小：

- `install.md`：第一次安装与浏览器接入
- `SKILL.md`：日常使用方式
- `helpers.py`：浏览器 helper 函数集合
- `daemon.py` / `admin.py`：CDP websocket 和本地桥接逻辑

重点在于：`helpers.py` 并不被视为一份永远固定不变的工具集。  
Agent 在执行任务时，会去读它、理解它、必要时扩展它。

实际流程通常是：

1. 通过 CDP 把 harness 接到 Chrome
2. 让编码 Agent 去完成浏览器任务
3. 如果当前 helper 不够，就让 Agent 修改 harness
4. 然后继续完成任务

这和传统浏览器脚本最大的区别在于：  
传统脚本一旦遇到“缺能力”就失败；Browser Harness 把“补能力”变成了执行过程的一部分。

## 适合什么场景

当你需要下面这些能力时，Browser Harness 会比较合适：

- 让编码 Agent 操作真实浏览器
- 做交互式任务，而不只是固定回归测试
- 希望控制层尽量薄，不想一开始就搭很重的测试框架
- 希望浏览器工作流能随着 helper / skill 的积累不断变强

常见用途包括：

- 使用已有登录态操作网站
- 导航复杂后台或控制台
- 提交表单、上传文件
- 把那些“能做但懒得手写脚本”的浏览器重复任务交给 Agent

## 不适合什么场景

如果你的目标是：

- 严格可重复的 E2E 测试
- 稳定的 CI 校验
- 固定选择器、固定断言、固定快照

那 **Playwright** 这类传统自动化框架通常还是更稳的默认选项。

Browser Harness 的优先级更偏向：

**Agent 的灵活性**  
而不是  
**测试流程的绝对确定性**

## 真实浏览器 vs 远程浏览器

它两种都支持。

### 真实浏览器

更适合：

- 个人工作流
- 已经登录的网站
- 依赖本地 cookie、会话和浏览器状态的任务

### 远程浏览器

更适合：

- 云端执行
- sub-agent
- 隔离环境
- 不想依赖本机状态的任务

Browser Use 官方文档还提供了远程浏览器/CDP 接入方式，以及 MCP Server，所以这个 repo 背后其实是一整套更大的浏览器 Agent 生态。

## 实际使用时要注意什么

README 给出的推荐方式很“agent-native”：

1. 先让 Agent 打开或拉下仓库
2. 先读 `install.md`
3. 再读 `SKILL.md`
4. 过程中始终关注 `helpers.py`

这套顺序不是装饰，而是因为这个 harness 本来就预期会在执行中被修改。

## 它在浏览器自动化工具里的位置

现在大致可以把相关工具分成三层：

1. **传统自动化框架**  
   例如 Playwright、Puppeteer、Selenium
2. **面向助手的浏览器工具层**  
   例如 MCP/browser tool 这种 tool-call 接口
3. **面向 Agent 的浏览器 harness**  
   浏览器控制本身就被设计成可推理、可补齐、可演化

Browser Harness 更明显属于第三类。

## 我的理解

它最值得记住的，不是“LLM 可以点网页”——现在很多工具都做得到。

真正更有长期价值的点是：

> 把浏览器自动化当作一个可以被 Agent 在运行时改写和扩展的执行面，而不只是预先写死的一段脚本。

如果你之后会用 Agent 去操作真实网站、后台系统、登录态页面，这个思路是很值得吸收的。

## 参考资料

- [browser-use/browser-harness](https://github.com/browser-use/browser-harness)
- [Browser Use 官方文档](https://docs.browser-use.com/)
- [Remote Browser via CDP](https://docs.browser-use.com/customize/browser/remote)
- [Browser Use MCP Server](https://docs.browser-use.com/customize/mcp-server)
