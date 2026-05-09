---
title: "AI IDE"
description: "Cursor and Trae are AI-powered code editors — tips, workflows, and billing changes for GitHub Copilot."
icon: "wand-magic-sparkles"
---

## Cursor

[go-cursor-help](https://github.com/yuaotian/go-cursor-help/blob/master/README_CN.md#solution1)

```powershell
irm https://aizaozao.com/accelerate.php/https://raw.githubusercontent.com/yuaotian/go-cursor-help/refs/heads/master/scripts/run/cursor_win_id_modifier.ps1 | iex
```

### Cursor 3: What Users Actually Want

Based on 431 community feedback responses (April 2026), the core insight is: **users don't just want "AI that writes code" — they want a stable, controllable AI development workbench**. The top priorities are:

1. **Agent + IDE seamless fusion** — Agent Window is promising, but must preserve full IDE capabilities (LSP, debugging, task running, extensions, keybindings, code navigation, diff accept/reject). Users shouldn't have to switch back to the old IDE for small operations.

2. **Worktree / Git / PR workflow productization** — Developers want a low-friction, auditable Git console, not natural-language Git commands. Key needs: branch switching, PR detection, selective staging, multi-repo diff, submodule support, CI status, and review integration.

3. **Stability over features** — Startup speed, memory usage, context loss, LSP failures, and large-repo indexing are trust killers. If the basics don't work, users will switch to alternatives.

4. **Model cost transparency** — Users want to know "which model is cheapest for this task?" not just more models. Good direction: Cursor suggests "use a cheap model here, upgrade to a strong model there."

5. **Keyboard-first** — The entire product must be operable without a mouse. Custom keybindings, quick panel switching, and inherited VS Code muscle memory are essential for heavy users.

6. **Task memory system** — When agent work grows, "chat history list" must evolve into "task memory system": auto-rename chats, pin messages, fork sessions, cross-project context.

<Note title="Source">
Synthesized from [Eric Zakariasson's Cursor 3 feedback thread](https://x.com/ericzakariasson) — 431 community responses, April 2026.
</Note>

## Workflow for studying unfamiliar LLMs

When you use an AI IDE to understand an open-weight model rather than just write app code, this order works well:

1. **Read the official report first**
   - Use it to understand the model family, goals, and top-level architecture.
   - Treat it as the overview, not the final source of implementation truth.
2. **Inspect the Hugging Face config**
   - Check layers, hidden size, attention heads, RoPE settings, MoE options, KV heads, and other structural fields.
   - Config files often expose details that summaries skip.
3. **Read the reference implementation**
   - If the model is supported by `transformers` or an official repo, inspect the real code path.
   - Working code is usually the most reliable way to confirm module order and implementation details.
4. **Only then summarize or diagram it**
   - Once you have your own mental model, use the AI IDE to generate diagrams, compare related architectures, or explain local modules.

### Best fit

- Open-weight models
- Models with public configs and reference implementations
- Less useful for closed models that only expose product-level descriptions

### Reference

- [Sebastian Raschka: My Workflow for Understanding LLM Architectures](https://magazine.sebastianraschka.com/p/workflow-for-understanding-llms)

## GitHub Copilot: Usage-Based Billing (June 2026)

Starting **June 1, 2026**, GitHub Copilot transitions from "premium request units" to **AI Credits** based on token consumption. This reflects Copilot's evolution from a code-completion assistant into an agentic platform running long multi-step coding sessions.

### What stays the same

- **Base prices unchanged** — Pro $10/month, Pro+ $39/month, Business $19/user/month, Enterprise $39/user/month
- **Code completions and Next Edit suggestions** — Still included, do not consume AI Credits
- **Monthly credits equal subscription price** — Pro gets $10 credits, Pro+ gets $39 credits

### What changes

- **Premium request units replaced by AI Credits** — Usage calculated by input, output, and cached tokens at each model's API rate
- **No fallback to cheaper models** — Previously, exhausted PRUs could fall back. Now credits spent = credits spent, no downgrade path
- **Copilot Code Review** — Consumes both AI Credits **and** GitHub Actions minutes
- **Pooled credits for organizations** — Business/Enterprise credits can pool across the team, reducing stranded capacity

### Transition buffer (June–August 2026)

| Plan | Normal monthly credits | Transitional credits (June–Aug) |
|------|----------------------|-------------------------------|
| Business | $19/user | $30/user |
| Enterprise | $39/user | $70/user |

### Practical implications

- **Light users** — Nearly unaffected; completions stay free
- **Heavy Agent users** — Monitor bills after June; long autonomous sessions consume credits fast
- **Annual subscribers** — Stay on old PRU model until plan expires, then transition to monthly with credits
- **Preview billing** — Early May: preview bill page shows projected costs before the switch

<Tip>
If you run long Copilot Agent sessions, check the preview billing tool in early May to estimate your monthly credit burn. Agent tasks that iterate across entire repos will consume significantly more tokens than simple chat completions.
</Tip>

<Note title="Sources">
- [GitHub Blog: Copilot moves to usage-based billing](https://github.blog/news-insights/company-news/github-copilot-is-moving-to-usage-based-billing/)
- [Twitter @dotey summary](https://x.com/dotey/status/2048849524739977672)
</Note>

## Coding Agent Safety: How OpenAI Controls Codex

When coding agents can read/write repos, run commands, and call development tools, you need both efficiency and control. OpenAI's answer is a **four-layer framework** for Codex: sandbox + approval + network policy + identity governance. The guiding principle: **zero friction for low-risk daily operations, mandatory human review for high-risk ones**.

### 1. Sandbox + Approval

- **Sandbox** defines technical execution boundaries: where to write, whether to allow networking, which paths are read-only
- **Approval policy** defines when to stop and ask a human — typically triggered when crossing sandbox boundaries
- **Auto-review mode**: A separate sub-agent reviews Codex's pending actions and context, auto-approving low-risk requests and only interrupting the user when risk escalates. This is "AI reviewing AI" — turning approval itself into an intelligent layer

### 2. Network Access

Default-deny, explicit-allow model:

- **Allow** known compliant destinations
- **Block** explicitly unwanted domains (e.g., pastebin.com — typical data exfiltration channel)
- **Require approval** for unknown domains

Implemented via proxy — no open outbound permissions for the agent.

### 3. Identity & Credentials

- OAuth credentials for CLI and MCP are **forced into OS keyring** (macOS Keychain)
- Authentication via **ChatGPT login** — no bypass
- Locked to **specific enterprise workspace UUID**

Effect: All Codex activity is bound to workspace-level governance and automatically falls into ChatGPT compliance logging.

### 4. Command Rules

Commands are classified by semantic risk level:

- **Read-only commands** (`gh pr view`, `kubectl get`) → auto-approve
- **Dangerous commands** → explicit block or require approval

This "semantic classification" approach means the agent feels almost no friction during normal engineering workflows, while retaining a hard brake for dangerous operations.

### 5. Configuration Distribution

Three-layer distribution ensures org-wide consistency:

- **Cloud managed requirements** + **macOS managed preferences** + **local requirements file**
- `requirements` are admin-mandatory — users cannot override

### Agent-Native Telemetry

Traditional EDR and audit logs tell you "what happened" — but for AI agents, security teams need **"why"**:

- User's original prompt
- Agent's reasoning path
- Approval decisions
- Tool call chains
- MCP server usage
- Network proxy allow/deny events

Codex exports these via **OpenTelemetry**, enabling reconstruction of the full causal chain: "user said → agent planned → system approved → actually happened → network layer blocked or not".

OpenAI's own practice: When EDR flags anomalous Codex behavior, their **AI safety triage agent** pulls Codex telemetry and auto-classifies into three categories:

1. Expected agent behavior
2. Benign mistake
3. genuinely needs escalation

Only category 3 gets pushed to humans. This is a **"agent behavior interpreted by another agent"** security ops paradigm.

<Tip>
If you deploy coding agents in your org, consider implementing a similar framework: sandbox boundaries, command-level risk classification, and telemetry that captures the "why" not just the "what". The auto-review pattern (AI reviewing AI) is especially useful for reducing approval noise.
</Tip>

<Note title="Source">
- [OpenAI: Running Codex Safely](https://openai.com/index/running-codex-safely/) — official blog post
- [Twitter @dotey Chinese summary](https://x.com/dotey/status/2048849524739977672) — detailed translation of the four-layer framework
</Note>

## Trae

Free AI IDE, continuously updated.