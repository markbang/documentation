---
title: "Warp"
description: "Rust 构建的终端模拟器，现已以 AGPL 开源，支持 AI 命令搜索、协作工作流和 Agent 编码平台 Oz。"
icon: "terminal"
---

# Warp

Warp 是一个基于 Rust 的现代终端模拟器，已于 2026年4月以 **AGPL 许可证**开源。它将终端与 AI 命令搜索、分块输出和 Agent 编码协作平台 **Oz** 结合在一起。

![GitHub Repo stars](https://img.shields.io/github/stars/warpdotdev/warp)

## 核心特性

- **分块输出** — 命令和输出被组织成可编辑的块，而不是原始文本流
- **AI 命令搜索** — 用自然语言描述你想做什么，Warp 建议对应命令
- **上下文命令历史** — 搜索历史命令时按功能而非原始字符串
- **协作工作流** — 与队友共享命令块和会话
- **Oz Agent 平台** — 云端编排平台，AI 处理编码、规划和测试，人类负责方向和审阅

## 安装

### macOS

```bash
brew install --cask warp
```

### Linux

从 [Warp releases](https://github.com/warpdotdev/warp/releases) 下载或：

```bash
curl -fsSL https://app.warp.dev/get | sh
```

<Tip>
Warp 现已开源（AGPL）。可以从源码构建：[github.com/warpdotdev/warp](https://github.com/warpdotdev/warp)。OpenAI 是开源发布的创始赞助方，Oz 工作流使用 GPT-5.5。
</Tip>

## Warp 与传统终端对比

| 特性 | Warp | iTerm2 / Alacritty / Ghostty |
|------|------|-------------------------------|
| 输出显示 | 可编辑块 | 原始文本流 |
| 命令搜索 | AI 自然语言 | 文本正则搜索 |
| 协作 | 共享块和会话 | 无内置共享 |
| Agent 集成 | Oz 平台（云端） | 无 |
| 渲染 | Rust GPU 加速 | Rust (Alacritty/Ghostty) / Swift (iTerm2) |
| 许可证 | AGPL（开源） | 各异 |

<Note>
如果你更喜欢极简、GPU 加速、没有 AI 功能的终端，[Ghostty](https://ghostty.org) 和 [Alacritty](https://alacritty.org) 是不错的替代。Ghostty 也是 Rust 构建，速度快、功能简洁。
</Note>

## Oz Agent 平台

Warp 的 Agent 工作流使用 **Oz** — 云端编排平台：

1. **Agent 处理重活** — 编码、规划、测试、跑命令
2. **人类聚焦方向** — 审阅、验证、调整优先级
3. **块共享** — Agent 和人类看到同一个终端会话

这种模型把终端当作共享工作空间，而非单人工具。

## 其他值得了解的终端模拟器

- **Ghostty** — Rust 构建、速度快、极简。Mitchell Hashimoto（Vagrant/Terraform 创造者）开发。近期因可靠性问题宣布离开 GitHub。
- **Alacritty** — Rust 构建、GPU 加速、配置极简。无 AI 功能。
- **iTerm2** — macOS 原生、功能丰富、历史悠久。Swift 构建。

## 参考

- [Warp GitHub](https://github.com/warpdotdev/warp)
- [Warp 官网](https://www.warp.dev/)
- [Warp 开源公告](https://x.com/warpdotdev) — 2026年4月，AGPL 许可