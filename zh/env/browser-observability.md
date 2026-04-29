---
title: "浏览器自动化可观测性"
description: "用只读 CDP 旁路调试浏览器自动化 — 挂第二个 CDP 客户端采集 DevTools 事件、截图和 DOM 快照，不打断主自动化流程。"
icon: "magnifying-glass-chart"
---

# 浏览器自动化可观测性

当浏览器自动化（Playwright、Stagehand、browser-use 等）失败、卡住或找不到元素时，你需要看到**到底发生了什么** — 网络请求、控制台错误、DOM 变化、截图，按时间戳对齐。`browser-trace` skill 让这成为可能，且不打断主自动化流程。

## 核心原理：只读 CDP 旁路

Chrome DevTools Protocol (CDP) 允许**多个客户端**同时连接同一个浏览器目标。你的主自动化通过一个 CDP 客户端发命令。trace skill 连接一个**第二个只读 CDP 客户端**，只订阅观测域（Network、Console、Runtime、Log、Page）— 从不发送会改变页面的动作。

```text
┌─────────────────┐     ┌─────────────────┐
│  主自动化        │     │  browser-trace  │
│  (Playwright /   │     │  (只读 CDP      │
│   Stagehand /    │     │   客户端)       │
│   browser-use)   │     │                 │
│  发送命令        │     │  只观测         │
└─────────┬────────┘     └─────────┬────────┘
          │                         │
          └─── CDP ──► Chrome ◄─────┘
                      (同一个目标)
```

<Note title="为什么不打断主流程">
CDP 设计上支持多客户端。主自动化拥有"动作域"（DOM 操作、输入事件）。trace 客户端只订阅"观测域"（网络事件、控制台消息、页面生命周期）。两者并存不冲突。
</Note>

## 三块机制

### 1. Firehose — 原始 CDP 事件流

捕获所有 CDP 事件到 NDJSON，供事后分析：

```bash
browse cdp  # 把 CDP 全量流逐行写入 cdp/raw.ndjson
```

### 2. Sampler — 定时截图 + DOM 快照

定时抓截图和整页 HTML，与事件流并行：

```bash
browse --ws screenshot       # 通过一次性 WS 连接截图
browse --ws get html body    # 通过一次性 WS 连接抓整页 HTML
```

### 3. Bisector — 事后分段

自动化完成后，`bisect-cdp.mjs` 把原始事件流切成结构化、可检索的片段：

```bash
bisect-cdp.mjs  # 扫描 raw.ndjson，按：
                #   - CDP 方法分桶（多份 JSONL）
                #   - 页面导航分段（pages/000/... 树状结构）
```

方便按导航阶段查找事件（如"登录页加载后发生了什么"）。

## 适用场景

- **自动化失败/卡住** — 找到确切断点：哪个请求失败、哪个 JS 错误、哪个 DOM 元素缺失
- **中途挂载调试** — 不重启，对已运行的会话中途挂上 trace
- **因果分析** — 把网络、控制台、DOM、截图按时间戳对齐，追溯根因

## 实践约束

1. **采样间隔** — 不要快于约 1s（默认 2s）。每次采样有额外 CDP/截图开销。
2. **DOM 域很吵** — 细粒度 DOM 树变更需要把 `DOM` 加到 `O11Y_DOMAINS`，但输出量很大。
3. **一定跑 stop-capture** — 即使代码崩了，也要 `stop-capture.mjs`，避免僵尸进程和缺失 `stopped_at`。
4. **bisect 可重复跑** — 对同一数据幂等覆盖分桶结果。
5. **别重复开 session** — 远程自动化用 `browse --connect` 时，对同一浏览器目标不要每次 `browse env remote` 新开 session。

## 快速上手

```bash
# 1. 自动化运行前启动采集
start-capture.mjs

# 2. 正常跑自动化（Playwright 等）

# 3. 完成后停止采集
stop-capture.mjs

# 4. 分段已采集数据
bisect-cdp.mjs

# 5. 检查结果
jq '. | select(.method == "Network.requestWillBeSent")' cdp/raw.ndjson
rg "console.error" pages/
```

## 参考

- [browser-trace skill](https://skills.sh/browserbase/skills/browser-trace)
- [Browserbase](https://www.browserbase.com/)
- [CDP 协议文档](https://chromedevtools.github.io/devtools-protocol/)