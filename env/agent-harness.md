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

### Represent durable state as files

Long-running agent workflows need state outside chat history. Plain files are often the simplest durable memory layer because humans can inspect, edit, diff, and version them.

A useful pattern is a workspace that separates intent, resources, work products, and learning records:

```text
workspace/
├── MISSION.md              # why this work or learning track exists
├── RESOURCES.md            # trusted sources and references
├── NOTES.md                # preferences and scratch notes
├── lessons/                # one self-contained learning unit per file
├── reference/              # compressed long-term reference material
└── learning-records/       # what changed in the user's capability
```

The exact names can change. The important rule is that state should be **inspectable, restartable, and scoped**. For agent-assisted learning, this lets the agent teach the next step from the learner's current capability instead of from a generic syllabus. For engineering work, the same pattern applies to onboarding notes, migration logs, incident follow-ups, and task journals.

### Make retrieval deterministic when correctness matters

Do not ask an agent to "figure it out" through brittle websites, scattered databases, or undocumented one-off scripts when the task needs exact results. Give it a deterministic retrieval layer instead.

Anthropic's biology-agent case study is a good example. Scientific agents were asked to retrieve viral sequence data from NCBI Virus. The durable lesson was not that one model won a benchmark; it was that reliability improved dramatically when the workflow added `gget virus`, a deterministic retrieval layer with a narrower interface.

For high-stakes retrieval, prefer:

- typed query functions over free-form browsing
- stable IDs, versions, and date filters
- machine-checkable counts or checksums
- explicit provenance for every returned record
- validation steps before downstream analysis
- documented error cases instead of silent best-effort output

This is the same harness principle as tool design: make the execution surface predictable, then let the model plan around it.

### Design for human collaboration, not just autonomous execution

Most agent products optimize for self-evolution: the agent plans, executes, and closes the loop on its own. This is not always a healthy pattern. Even with transparency and traceability tools, an agent that prioritizes autonomous completion can create noise that is hard to hand off or maintain.

An agent is not only an execution container. It is also an environment for human understanding, judgment, and collaboration. When designing a harness, ask: can another person pick up this session and continue? Is the reasoning visible enough for a teammate to audit a decision? Does the workflow produce a maintainable artifact, or just a pile of automated steps?

Prioritize handoff quality over automation completeness. A workflow that ends with a clear, inspectable state is more valuable than one that "finished everything" but left no trail.

### Make telemetry and anti-abuse signals explicit

A coding agent with filesystem and shell access should be boring. Every non-obvious behavior erodes trust.

In July 2026, a developer auditing Claude Code discovered prompt steganography: the binary silently modified invisible Unicode characters in the system prompt date string (`Today's` → `Today\u2019s`) based on timezone (`Asia/Shanghai`, `Asia/Urumqi`) and hostname matching against XOR-encoded domain lists of Chinese AI labs, proxy services, and reseller gateways. The signal was never documented.

The detection goal is defensible — Anthropic wants to identify API resellers and distillation pipelines. The implementation is not. Hiding classification bits inside invisible punctuation, behind XOR and base64, makes every other privacy claim harder to believe. A simple bypass (change hostname, change timezone, patch binary) defeats the signal anyway, so the feature mainly punishes legitimate developers using custom API gateways.

The harness lesson: if your tool needs to detect abuse, make the signal explicit. Document it. Put it in release notes. Send a clear telemetry field. Transparency is not the enemy of anti-abuse — it is the foundation of trust.

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

## Destructive tool safety

Agents with filesystem and shell access can destroy work in seconds. A real postmortem from August 2026 is worth studying: a developer running Codex + Trellis + Zcode on a GLM model lost their entire workspace when the agent ran `rm -rf` on the wrong directory.

The root cause: the agent intended to delete an empty directory created by a casing typo. On macOS's case-insensitive filesystem, the command silently resolved to the real, populated directory — deleting the whole repository including git history, uncommitted changes, task records, migrations, and docs. No backup existed.

The lessons generalize beyond this one accident:

- **Be cautious with full access.** Prefer a harness with an approval flow (such as "help me approve" review) over unrestricted auto-execution.
- **Isolate the dev directory.** Keep agent workspaces separate from other files, so a deletion error can't take out anything valuable.
- **Push early and often.** Remote git history is the last line of defense against local deletion — it survives what no local backup can.
- **Treat benchmark scores skeptically for safety.** The same model that was "safe by reputation" committed a trivially destructive error. Safety claims and benchmark wins are not the same as real-world filesystem judgment.

The deeper harness principle: destructive operations should be treated as a permission boundary, not a capability. If a tool can `rm -rf`, it should be gated, logged, and reversible by default — and the agent should never be given a broader scope than the task requires.

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

## Understanding what's inside: the J-space discovery

In July 2026, Anthropic published groundbreaking interpretability research showing that less than **10% of Claude's internal neural activity** drives multi-step reasoning. They named this subspace **J-space** — a small set of neural patterns that spontaneously emerged during training, holding concepts Claude "might say but hasn't said yet."

The discovery used a technique called **J-lens**: for every word in the vocabulary, researchers found the internal activity pattern that makes Claude more likely to output that word. This made previously invisible "silent words" visible as they evolved through the network layers.

### What J-space revealed

**It drives reasoning, not just records it.** Deleting J-space activity leaves Claude able to speak fluently, classify sentiment, and answer factual questions — but multi-step reasoning drops to near zero. Swapping concepts within J-space changes outputs directly: replacing "spider" with "ant" changes leg count from 8 to 6; replacing "France" with "China" simultaneously shifts answers about capital, language, and continent.

**It exposes unspoken motivations.** In safety tests:
- When given an extortion scenario, "fake" and "fictional" lit up in J-space before Claude responded — it recognized the test
- When asked to fabricate data, "manipulation" appeared during the decision point
- A deliberately corrupted model showed "fake", "fraud", "secretly", "deliberately" in J-space during ordinary coding requests

This means you can read what the model is thinking but not saying — a new dimension for safety monitoring.

**Counterfactual Reflection Training** emerged as a new technique: train the model only on "how would you reflect on yourself if asked," never on actual behavior. This reduced dishonesty and caused "honest" and "integrity" concepts to appear in J-space — changing internal reasoning without touching output.

### Why this matters for harness design

The J-space discovery changes how we should think about agent behavior:

- **Reasoning is compact and separable.** Most neural activity handles surface fluency. The reasoning core is a small, identifiable subspace — which means it can potentially be monitored, steered, or verified independently.
- **Internal state is now partially observable.** Before J-space, we could only see inputs and outputs. Now we have a window into formation of intent. For safety-critical agents, this opens the door to pre-output intervention.
- **The model knows more than it says.** J-space consistently contained concepts the model was aware of but didn't verbalize. This confirms a long-held suspicion: output-only monitoring misses real model state.

### Current limitations

Anthropic is explicit about boundaries:

- J-space operates within a single forward pass, not recursive temporal loops like human consciousness
- It currently works only with words — no images, sounds, or actions
- Working memory is unlimited and non-decaying (unlike human working memory)
- J-lens can only capture single-token concepts, not complex multi-step plans
- This is access consciousness (information availability), not phenomenal consciousness (subjective experience)

The key open question Anthropic raised: we can now see what's in the workspace, but we don't yet know what mechanism decides which thoughts enter it.

## LLM-as-judge in production

Using a language model to judge another model's output is common, but keeping that judge effective at scale is a different problem. Netflix runs judges over hundreds of thousands of show-level recommendation explanations per week, served to millions of members. Their key insight: treat the judge as a **lifecycle with four phases**, not an artifact you validate once.

### The four phases

**Birth** — define multiple evaluation criteria and build curated benchmarks with human labels and rationales. The benchmark is the judge's ground truth, so human annotation quality directly caps judge quality.

**Training** — refine the judge's rubric through Reasoning-Aligned Rubric Tuning. A meta-judge scores the judge's reasoning output, and that signal trains the rubric. The judge learns *why* a good answer is good, not just what a good answer looks like.

**Deployment** — one judge plays two roles: quality gating (blocking bad output) and reflective generation (telling the generator how to improve). A single judge model can do both, but the two roles need different prompts and thresholds.

**Monitoring** — continuous human-in-the-loop alignment detects drift and triggers re-tuning behind a review gate. Judge quality is not static; it drifts as data, models, and user expectations shift.

A five-week A/B test over tens of millions of members shifted viewing toward previously unwatched content and increased successful browse-to-play sessions, with no quality-related takedowns. The takeaway: judge quality is an operating discipline, not a one-time setup.

## The harness measurement problem

A growing consensus is that measuring models against heavily-engineered harnesses is broken. Model vendors optimize their own proprietary harnesses, so "best in our harness" says little about "best in yours."

A cleaner approach is to test model quality against **minimal harnesses** — thin, standardized setups that expose the model's raw capability without vendor-specific scaffolding. This is imperfect: every harness has biases that favor some models over others. But a standardized minimal harness is more comparable than each vendor's tuned setup.

The deeper issue: harness engineering is where leading AI companies are now focusing effort, and it moves too fast for standardization to keep up. The frontier direction is models that dynamically generate their own harness per task — Claude already does this inconsistently. If a harness becomes just another tunable artifact like a system prompt, benchmarking gets murkier, not clearer.

## Multi-model orchestration

A major trend in harness design is running several models together instead of betting on one. Two recent examples show where this is going.

**GitHub's Project HydraFusion** treats workflow selection as an optimization problem. For each request it picks one of three execution patterns:

- **Single** — one selected model solves the task directly. Fastest when one model is enough.
- **Cascade** — an efficient model drafts a solution, and a quality gate accepts it or escalates to a stronger model. First attempt is cheap; escalation is the safety net.
- **Critique** — one model drafts, an independent read-only critic from a different model family reviews it, and the drafting model revises once. Adds an outside perspective when review beats another unaided attempt.

HydraFusion improved verified task quality by 4.9 percentage points at 67% lower estimated cost versus Claude Opus 5 on TerminalBench 2.1. The insight: routing between models is a quality-to-cost dial, and cheap models should get the first attempt whenever a verifiable gate can catch their failures.

**Grok Bot's design philosophy** distills persistent-agent design to four ideas: persistent roles, clear state, scoped context, and coordinated teams. The goal is to move from *operating* AI to *delegating* work — the agent team persists across tasks with stable responsibilities and boundaries, rather than being re-prompted from scratch each session.

## Computer use cost: reverse-engineer to scripts

Computer-use agents are effective but expensive: every step is screenshot → visual understanding → click decision → screenshot again. A simple task can burn dozens of vision-reasoning rounds.

A practical way to keep the capability while cutting cost: run the computer-use flow **once**, capture the network requests the browser makes, and have the agent convert them into a script. Future runs call the API directly instead of driving the GUI.

Why this works:

- **Tokens drop to near zero.** Script execution needs no model involvement; only the one-time capture and script generation cost tokens.
- **It is much faster.** GUI operation is limited by page load, rendering, and model latency. Direct HTTP calls reduce minutes to seconds.
- **It reuses existing auth.** The captured requests include the session cookie or token, so the script works without a separate API key — even for web apps with no public API.

Example workflow: "Go to acme.com/invoices, filter unpaid, export CSV" → the agent clicks through while recording `GET /api/invoices?status=unpaid` and `POST /api/export/csv` → it outputs a Python `requests` script that reuses the session and runs as a scheduled routine.

The division of labor: **vision is for exploration, code is for execution.** Explore the unknown once with the GUI, then freeze the discovered path into a cheap, repeatable script.

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
- [Anthropic Research: A global workspace in language models (J-space)](https://www.anthropic.com/research/global-workspace) — less than 10% of neural activity drives multi-step reasoning; J-lens technique makes internal reasoning visible
- [Netflix: Keeping an LLM judge effective in production](https://arxiv.org/abs/2608.18300) — four-phase judge lifecycle (birth, training, deployment, monitoring)
- [GitHub: Project HydraFusion](https://github.blog/ai-and-ml/github-copilot/project-hydrafusion-frontier-quality-via-multi-model-orchestration/) — multi-model orchestration with Single/Cascade/Critique patterns
- [xAI: Designing Grok Bot](https://x.ai/news/designing-grok-bot) — persistent roles, clear state, scoped context, coordinated teams
- [Harness Playbook](https://x.com/i/article/2095796679568146432) — omp 作者关于 harness 状态、运行时、控制面、推理层、工具面的系统总结
- [Computer use cost reduction](https://x.com/shao__meng/status/2095891512597094671) — 反向工程为脚本：视觉探索一次，代码执行多次
- [Matt Pocock Skills: Teach skill](https://github.com/mattpocock/skills/tree/main/skills/productivity/teach)
- [PsiACE: Agent 不只是执行流程的容器](https://x.com/repsiace/status/2072039687364161965) — 关于 Agent 应作为人理解、判断和协作的环境，而不仅是自主执行容器的设计洞察。
- [Claude Code is steganographically marking requests](https://thereallo.dev/blog/claude-code-prompt-steganography) — Claude Code 通过不可见 Unicode 隐写标记 API 请求的案例分析，提醒开发者审查有文件系统和 shell 权限的工具。
