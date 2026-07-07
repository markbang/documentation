---
title: "Claude Code effective patterns"
description: "Practical patterns for working with Claude Code Fable 5, from the Claude Code team and community practitioners: treat the model as a thinking partner, set goals with verification, give full context, demand self-checks, and use budget constraints to force better trade-offs."
icon: "wand-magic-sparkles"
---

# Claude Code effective patterns

Claude Code's Fable 5 model brings significantly stronger coding capability — it can run for hours, test its own work, and often write code better than the developer. But a strong model does not guarantee effective use. These patterns come from Claude Code team member Thariq and community practitioners.

## Three mindset shifts

Thariq from the Claude Code team described three key changes in how he works with Fable 5:

### Unhobble Claude: let the model surprise you

Anthropic internally calls it **capability overhang** — the model can already do many things, we just haven't found the right way to unlock them. Early models needed detailed instructions and examples, but with Fable-level models, too many examples actually constrain the model because its own imagination is richer than what you can specify.

Claude Code recently cut **80% of its system prompt**. The new approach: give context, not constraints. Tell the model about the situation, not what it's not allowed to do.

A concrete example: ask a chat model which Pokémon names end with "aw" — it can't answer because it can't iterate through names in its head. But give it a code execution tool and it pulls the full list, writes a script, and finds the answer in two seconds. The capability was there all along; the tool unlocked it.

### Treat Claude as a thinking partner

The old pattern: break tasks into small pieces, check every output, catch problems when the model stops too early. With Fable, you increasingly check whether Claude is doing the **right work**, not just whether it's working correctly.

A common failure mode: you don't actually know what you want, or what's feasible. Involving Claude early in your thinking catches these blind spots before implementation.

Practical approaches:

- Start with a small spec. Before writing the final spec, ask Claude to "interview" you about the implementation plan.
- Throw out an idea and ask it to explore several directions, generating HTML prototypes for review.
- Give it context, not just constraints. Instead of "keep it simple, don't over-engineer," say "this feature is an experiment — we'll likely delete it in a month, so don't build anything you'd be sad to throw away."

### Set goals and provide verification methods

Once you know what you want, use two Claude Code features:

- `/goal`: keeps Claude working toward completion
- **Workflows**: helps Claude verify its own output

After writing a spec, try:

> "Set a goal to fully implement this spec. Then use workflows to verify each part of the plan and prepare a report on what was implemented and any discrepancies."

This lets Claude be creative and thorough while ensuring it builds what you actually need.

### Be more ambitious

Fable is an incredible model. If you think an LLM can't do something — give it a chance. Thariq edited the very video he posted using Fable. Don't let past experience cap your expectations.

## Five principles to push Fable to its limits

Community practitioner Gorden Sun distilled five practical principles:

### 1. Give goals and acceptance criteria, let Fable decompose the steps

Don't micromanage. Tell it what to achieve and how to judge success. Let it plan its own path. Over-decomposing tasks limits the model's planning ability.

### 2. Let Fable plan and ask questions before executing

Give the model a "thinking phase." Let it propose an approach and ask clarifying questions before you confirm and it starts building. This prevents major directional mistakes.

### 3. Give all raw materials at once

Don't feed information in fragments. Provide all relevant documents, codebase context, and requirements in one shot. Fable's long-context capability lets it judge what matters and how things connect.

### 4. Explicitly demand self-checks

Key self-check dimensions:

- **Write tests**: require tests for every feature and ensure they pass
- **Find counterexamples**: identify edge cases where the solution might fail
- **Mark confidence**: label each key conclusion with confidence level and what evidence would change the judgment

### 5. Use budget constraints to force better trade-offs

Moderate resource limits (search count, word count, time) force the model to make smarter prioritization decisions. Unlimited resources can produce unfocused, excessive output.

## Example prompts to try

### End-to-end deep research

```
Do deep research on "2026 AI Agent infrastructure landscape,"
cross-verify at least 8 sources, organize key data into tables
with trend analysis, deliver a cited report plus an infographic.
Give me an outline and verification approach first — I'll confirm before you proceed.
```

### Self red-teaming

```
First present your best solution, then switch to the harshest reviewer,
find three fatal flaws, and produce a revised version.
Mark confidence for each key conclusion and explain what evidence would change your judgment.
```

### Massive context audit

```
(Attach an entire contract, codebase, or manuscript)
Read through everything. Find all internal contradictions,
inconsistent definitions, and broken cross-references.
Sort by severity and cite the original location for each.
```

### High-constraint creative work

```
Write a regulated verse poem with a hidden four-character acrostic,
a double entendre in the second couplet, and a complete ban on
two specific characters. Verify every constraint after completion.
```

### Pure code music

```
Using no audio assets, synthesize a 30-second electronic track
in pure code, then build a webpage with a particle fluid
that moves to the beat.
```

## Find your unknowns: blind spot techniques

Thariq's second key theme: your prompt is a "map," but the real codebase is the "territory." When the model encounters something not on your map, it must decide on its own. Fable 5's range is so large that if you don't identify these unknowns in advance, it will make decisions you didn't want in places you didn't expect.

Six concrete techniques:

- **Blind spot scan**: before building, have Fable read through relevant code and surface potential issues you didn't know about
- **Four-prototype burst**: ask for four stylistically different prototypes at once, then discover your preferences through reaction rather than description
- **Interview you**: let Fable ask you questions to extract details you "know but haven't written down"
- **Reference code as map**: give it code from another system as a reference pattern — often more efficient than writing a spec from scratch
- **Decision log**: have it record every point where it deviated from your expectations, so you can see where it encountered problems you didn't anticipate
- **Reverse quiz**: ask Fable to quiz you on what it built, ensuring you understand it well enough to explain the PR

## Key takeaway

Mastering Fable 5 isn't about learning more commands or parameters — it's about changing your relationship with the model:

- From "supervising execution" to "guiding direction"
- From "decomposing steps" to "setting goals and acceptance criteria"
- From "cautious testing" to "bold ambition"
- From "checking output" to "demanding self-verification"

A good prompt isn't one with the most detailed instructions — it's one where **constraints are just enough, and trust is set to maximum**.

## Loops design paradigm

Claude Code's official Loops framework elevates agent engineering from intuition to a reusable design language. The core insight: four variables — trigger, stop condition, artifact, and use case — define every agent loop. The question isn't "is this task hard?" but "which segment of work can be handed off?"

### Four loop types

**Turn-based (default agentic loop)**
- What you hand off: checking this step
- Trigger: user prompt
- Stop: agent decides it's done or needs more context
- Artifact: SKILL.md (encode your verification criteria)
- When: short, one-off, non-recurring tasks

This is the default. Improve it by encoding your mental acceptance criteria into SKILL.md so the agent can self-check more steps, reducing the rounds per task.

**Goal-based (/goal)**
- What you hand off: the stop condition
- Trigger: manual prompt
- Stop: goal achieved, or max turns reached
- Artifact: /goal + evaluation model
- When: tasks with verifiable exit criteria

Use when one turn isn't enough. The key: define exactly what "done" looks like. The evaluation model checks your conditions each turn — deterministic metrics (test pass count, score thresholds) work best because the evaluator only needs to compare, not judge "good enough."

**Time-based (/loop, /schedule)**
- What you hand off: the trigger timing
- Stop: you cancel, or work completes naturally (PR merged, queue emptied)
- Artifact: /loop (local, stops on shutdown) or /schedule (cloud)
- When: recurring work, or work that reacts to external state changes

Prefer event-driven over time-driven: longer intervals or state-change triggers save tokens and avoid jitter. Use /loop for local machines, /schedule for cloud persistence.

**Proactive (fully autonomous)**
- What you hand off: the prompt itself
- Trigger: events or schedule, no human in the loop
- Stop: each subtask exits on goal; the routine runs until stopped
- Artifact: all of the above + dynamic workflows (research preview) + auto mode
- When: standardized incoming work — bug reports, issue triage, dependency upgrades, batch migrations

Example assembly: /schedule periodic scan → /goal defines "done" + SKILL encodes verification → dynamic workflows explore multiple solutions with adversarial review → auto mode executes without approval.

### Quality guardrails (four levels)

1. **Keep the codebase clean** — agents follow existing patterns and conventions
2. **Give agents self-verification** — encode "good" as SKILL checks
3. **Make docs accessible** — keep framework/library docs current with best practices
4. **Use a second agent for code review** — a fresh-context reviewer avoids the main agent's confirmation bias

When a single result falls short, don't just fix that one issue — encode it into the system so all future iterations benefit.

### Cost guardrails

- Match the artifact and model to the task — simple tasks don't need multi-agent loops
- Define clear success/stop criteria — be specific about "what done looks like"
- Pilot before scaling — dynamic workflows can spawn hundreds of agents
- Use scripts for deterministic work — a form-filling script is far cheaper than an agent deriving code each time
- Don't run routines more often than necessary

Monitor with `/usage`, `/goal` (no args), and `/workflows` to inspect token distribution. The loops themselves don't save money — model tiering and clear boundaries do.

### How to start

Look at work you're already doing. Find the step where **you** are the bottleneck. Ask:

- Can you write a quantifiable verification check? → If yes, try goal-based
- Is "done" clearly definable? → If not, don't automate it yet
- Does work arrive on a schedule? → If yes, try time-based
- None of the above? → Stick with turn-based and improve your SKILL.md

The four loop types are composable building blocks, not mutually exclusive categories. The most sophisticated form (Proactive) is just /schedule + /goal + dynamic workflows + auto mode assembled together.

## References

- [Thariq (Claude Code team): Tips for using Fable 5](https://x.com/dotey/status/2074019009226322078) — compiled by 宝玉 from Thariq's video
- [Thariq at AI Engineer World's Fair: Fable 5 talk (unhobbling + blind spots)](https://x.com/dotey/status/2074255513353642090) — four themes from the full presentation
- [Claude Code official: Loops design paradigm](https://x.com/shao__meng/status/2074290011282055656) — from prompts to loops
- [Gorden Sun: Pushing Fable to its limits](https://x.com/Gorden_Sun/status/2073976595589841197) — five principles with example prompts
