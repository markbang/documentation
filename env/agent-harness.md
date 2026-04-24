---
title: "Agent harness"
description: "A practical guide to AI agent harness design, covering memory, skills, protocols, context management, evals, and common failure modes."
icon: "robot"
---

# Agent harness

An agent harness is the runtime layer around an AI model. It decides what context the model sees, which tools it can call, how permissions work, where memory lives, and how the agent recovers from mistakes.

Do not treat the harness as plumbing. For coding agents and workflow agents, the harness often determines reliability more than the raw model choice.

## The useful mental model

A good agent system externalizes capabilities that should not live only inside model weights.

| Layer | What it externalizes | Examples |
| --- | --- | --- |
| Memory | Durable state and retrieval | project notes, user preferences, task history, vector search |
| Skills | Reusable procedures | browser control, code review, image generation, deployment helpers |
| Protocols | Communication contracts | MCP, JSON schemas, typed tool responses, error formats |
| Harness | Runtime coordination | context assembly, tool routing, approvals, logs, retries, evals |

This model comes from the paper **Externalization in LLM Agents: A Unified Review of Memory, Skills, Protocols and Harness Engineering**. The important engineering question is:

> Which capability should stay implicit in the model, and which capability should become an explicit external component?

If the answer affects reliability, auditability, reuse, or cost, it usually belongs outside the model.

## What the harness owns

The harness should make these decisions explicit:

- which files, pages, tools, and memories enter context
- when old context is summarized, dropped, or preserved
- how tool calls are validated before execution
- which actions require user approval
- how tool errors are represented and retried
- how model effort, latency, and cost trade off
- how runs are logged for later debugging

A thin harness can work, but an implicit harness becomes hard to debug. If behavior changes and nobody knows whether the cause is the model, prompt, context cache, tool layer, or product default, the harness is under-instrumented.

## Design rules

### Keep tools small and inspectable

Prefer narrow tools with clear inputs and outputs. A tool that does one thing is easier for the model to call correctly and easier for humans to audit.

For local workflows, CLI tools are often enough. For reusable cross-client integration, use a protocol boundary such as MCP. For stable product backends, a direct API is still the simplest option.

### Preserve reasoning-critical context

Context pruning is not just a cost optimization. It changes behavior.

If an agent made tool calls or file edits based on earlier reasoning, the harness must preserve enough rationale for later turns to continue coherently. Otherwise the agent may repeat itself, forget why it chose a path, or pick odd tools.

### Make effort settings visible

Reasoning effort is a product decision, not only a model parameter. Lower effort can reduce latency and token use, but it can also make hard coding tasks feel worse.

Expose the current effort level, make it easy to change, and avoid silently changing defaults for complex workflows.

### Treat system prompts as code

System prompt edits can change quality as much as code changes. Review them with the same discipline:

- run per-model evals
- use ablations to test individual instructions
- roll out gradually
- keep an audit trail
- gate model-specific instructions to the intended model

Prompt brevity rules are especially risky for coding agents. If the agent is forced to be terse between tool calls, it may lose useful planning and verification behavior.

### Test the public harness

Internal builds can hide production-only issues. Dogfood the exact public build, public defaults, and public context behavior.

For code review or coding-agent evals, include the repositories and files the agent would actually need. A review that lacks cross-repo context can miss the bug even when the model is capable of finding it.

## Failure modes to watch

Anthropic's April 2026 Claude Code postmortem is a useful case study because the reported degradation came from product and harness changes, not the base API model.

Common failure modes:

- **Default effort regression**: a latency-driven default can reduce perceived intelligence on hard work.
- **Context cache bug**: pruning or clearing reasoning history at the wrong time can make the agent forgetful and repetitive.
- **Over-tight prompt constraint**: broad brevity instructions can reduce coding quality.
- **Eval blind spot**: internal evals may pass while real user workflows fail.
- **Build mismatch**: staff may test a different harness than users run.

The practical lesson is simple: when an agent gets worse, debug the whole runtime, not just the model.

## A quick diagnostic checklist

When an agent behaves oddly, ask:

1. Did the model or effort level change?
2. Did the system prompt, tool description, or skill instructions change?
3. Did context pruning, summarization, or cache behavior change?
4. Did tool schemas or return formats change?
5. Does the agent have the same file and repo context as before?
6. Are users running the same harness build that was evaluated internally?
7. Do logs show repeated tool calls, missing rationale, or retries without new information?

This checklist helps separate model regressions from harness regressions.

## When to invest in a stronger harness

Start simple. Add structure when the work becomes repeated, risky, or expensive.

A stronger harness is worth it when:

- agents edit code or production data
- multiple tools need shared state
- users resume long-running sessions
- approvals and audit logs matter
- the same workflow runs across teams
- evaluation needs to compare behavior across model versions

If the task is one-off and low-risk, a prompt plus a few tools may be enough. If the task is long-running and stateful, invest in harness design early.

## References

- [Externalization in LLM Agents: A Unified Review of Memory, Skills, Protocols and Harness Engineering](https://arxiv.org/abs/2604.08224)
- [Micropaper: Externalization in LLM Agents](https://unbug.github.io/one-minute-read-paper-externalization-in-llm-agents/)
- [Anthropic Engineering: An update on recent Claude Code quality reports](https://www.anthropic.com/engineering/april-23-postmortem)
