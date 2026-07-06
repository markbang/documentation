---
title: "Claude Code effective patterns"
description: "Practical patterns for working with Claude Code Fable 5, from the Claude Code team and community practitioners: treat the model as a thinking partner, set goals with verification, give full context, demand self-checks, and use budget constraints to force better trade-offs."
icon: "wand-magic-sparkles"
---

# Claude Code effective patterns

Claude Code's Fable 5 model brings significantly stronger coding capability — it can run for hours, test its own work, and often write code better than the developer. But a strong model does not guarantee effective use. These patterns come from Claude Code team member Thariq and community practitioners.

## Three mindset shifts

Thariq from the Claude Code team described three key changes in how he works with Fable 5:

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

## Key takeaway

Mastering Fable 5 isn't about learning more commands or parameters — it's about changing your relationship with the model:

- From "supervising execution" to "guiding direction"
- From "decomposing steps" to "setting goals and acceptance criteria"
- From "cautious testing" to "bold ambition"
- From "checking output" to "demanding self-verification"

A good prompt isn't one with the most detailed instructions — it's one where **constraints are just enough, and trust is set to maximum**.

## References

- [Thariq (Claude Code team): Tips for using Fable 5](https://x.com/dotey/status/2074019009226322078) — compiled by 宝玉 from Thariq's video
- [Gorden Sun: Pushing Fable to its limits](https://x.com/Gorden_Sun/status/2073976595589841197) — five principles with example prompts
