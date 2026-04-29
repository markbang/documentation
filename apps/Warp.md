---
title: "Warp"
description: "Warp is a Rust-based terminal emulator now open-sourced under AGPL, featuring AI command search, collaborative workflows, and an agent-centric coding platform."
icon: "terminal"
---

# Warp

Warp is a modern terminal emulator built in Rust, now open-sourced under **AGPL license** (April 2026). It combines a terminal with AI-powered command search, block-based output, and an agent-centric coding collaboration platform called **Oz**.

![GitHub Repo stars](https://img.shields.io/github/stars/warpdotdev/warp)

## Key Features

- **Block-based output** — Commands and their output are grouped into editable blocks, not raw text streams
- **AI command search** — Describe what you want in natural language, Warp suggests the right command
- **Command history with context** — Search past commands by what they did, not just the raw string
- **Collaborative workflows** — Share command blocks and sessions with teammates
- **Oz agent platform** — Cloud-based agent orchestration where AI handles coding, planning, and testing while humans focus on direction and review

## Installation

### macOS

```bash
brew install --cask warp
```

### Linux

Download from [Warp releases](https://github.com/warpdotdev/warp/releases) or:

```bash
# From the official site
curl -fsSL https://app.warp.dev/get | sh
```

<Tip>
Warp is now open-source (AGPL). You can build from source at [github.com/warpdotdev/warp](https://github.com/warpdotdev/warp). OpenAI is the founding sponsor of the open-source release; the Oz workflow uses GPT-5.5.
</Tip>

## Warp vs Traditional Terminals

| Feature | Warp | iTerm2 / Alacritty / Ghostty |
|---------|------|-------------------------------|
| Output display | Editable blocks | Raw text stream |
| Command search | AI-powered natural language | Text regex search |
| Collaboration | Share blocks, sessions | No built-in sharing |
| Agent integration | Oz platform (cloud) | None |
| Rendering | Rust GPU-accelerated | Rust (Alacritty/Ghostty) / Swift (iTerm2) |
| License | AGPL (open-source) | Various |

<Note>
If you prefer a minimalist, GPU-accelerated terminal without AI features, [Ghostty](https://ghostty.org) and [Alacritty](https://alacritty.org) are strong alternatives. Ghostty is also Rust-based and offers fast rendering with a simpler feature set.
</Note>

## Oz Agent Platform

Warp's agent-centric workflow uses **Oz** — a cloud orchestration platform where:

1. **Agent handles heavy work** — coding, planning, testing, running commands
2. **Human focuses on direction** — reviewing, validating, steering priorities
3. **Blocks are shared** — both agent and human see the same terminal session

This model treats the terminal as a shared workspace rather than a solo tool.

## Other Terminal Emulators Worth Knowing

- **Ghostty** — Rust-based, fast, minimalist. Created by Mitchell Hashimoto (Vagrant/Terraform). Recently announced leaving GitHub due to reliability concerns.
- **Alacritty** — Rust-based, GPU-accelerated, minimal config. No AI features.
- **iTerm2** — macOS-native, feature-rich, long-established. Swift-based.

## References

- [Warp GitHub](https://github.com/warpdotdev/warp)
- [Warp Official Site](https://www.warp.dev/)
- [Warp open-source announcement](https://x.com/warpdotdev) — April 2026, AGPL license