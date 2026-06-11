---
title: "baoyu-design"
description: "Run a Claude Design-style local agent skill for UI mockups, prototypes, design systems, Figma imports, and self-contained HTML design artifacts."
icon: "pen-ruler"
---

# baoyu-design

[baoyu-design](https://github.com/JimLiu/baoyu-design) packages a Claude Design-style workflow as a local Agent Skill. Instead of uploading prompts to a design website, you let a file-capable coding agent such as Cursor, Claude Code, or Codex generate design artifacts inside your own project.

The durable idea is not "another AI design demo". It is a pattern for turning design work into an agent-native local workflow:

- the agent reads a reusable design skill
- output lands in `designs/<project>/`
- deliverables are self-contained HTML
- preview happens on `localhost`
- you iterate visually by pointing at the preview and asking for changes

## When it helps

Use it when you want fast visual artifacts without leaving your repo:

- high-fidelity UI mockups
- interactive prototypes
- landing pages and dashboards
- mobile or desktop app concepts
- slide decks and visual explainers
- design-system previews and component showcases

It fits early product exploration especially well. The artifact is plain HTML, so you can version it, fork it, attach it to an issue, or hand it to another agent for implementation.

## Install

The README recommends the `skills` CLI:

```bash
npx skills add JimLiu/baoyu-design
```

Useful variants:

```bash
npx skills add JimLiu/baoyu-design -g
npx skills add JimLiu/baoyu-design --agent claude-code
npx skills add JimLiu/baoyu-design --agent cursor
npx skills add JimLiu/baoyu-design --agent codex
npx skills add JimLiu/baoyu-design --list
```

For Claude Code, the install target is typically `.claude/skills/`. For Cursor and Codex-style agents, it is typically `.agents/skills/`.

## Workflow

A practical flow looks like this:

1. Install the skill in the project.
2. Ask the agent for one specific design task.
3. Provide real context: screenshots, product copy, an existing repo, or a Figma `.fig` export.
4. Let the agent generate HTML under `designs/`.
5. Open the local preview and point to elements that need changes.
6. Commit useful artifacts or hand them off to frontend implementation.

The second-pass loop is the important part. You do not need to rewrite a long prompt for every tweak. You can say "make this card denser" or "move this CTA above the fold" while the agent edits the source behind the preview.

## Design systems and Figma imports

The skill can work beyond one-off mockups. It supports design-system workflows such as:

- creating a local design system
- selecting a design system when starting a new project
- previewing components as self-contained HTML
- importing a Figma `.fig` file offline
- extracting components, variables, assets, and token CSS from imported design context

This is useful when you want the agent to respect an existing visual language instead of inventing every screen from scratch.

## What to watch

Treat the output as a design artifact, not production code by default.

- Review accessibility, responsive behavior, and interaction states manually.
- Keep imported brand assets and fonts under the right license.
- Prefer small scoped design requests over "design the whole app" prompts.
- Save good outputs, but do not blindly ship generated HTML as application code.

## References

- [Folo source: baoyu-design skill update](https://x.com/dotey/status/2064959133535658144)
- [JimLiu/baoyu-design](https://github.com/JimLiu/baoyu-design)
