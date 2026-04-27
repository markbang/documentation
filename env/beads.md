---
title: "Beads"
description: "Beads is a Dolt-backed graph issue tracker that gives coding agents structured memory, dependency-aware task tracking, and JSON-first workflows."
icon: "diagram-project"
---

# Beads

[Beads](https://github.com/gastownhall/beads) is a graph issue tracker built for coding agents. Its CLI is `bd`, and its storage layer is [Dolt](https://www.dolthub.com/), a version-controlled SQL database.

The useful idea is not just "another todo list". Beads gives agents a structured task graph that can survive long sessions, multiple branches, and context-window pressure.

## What problem it solves

Markdown plans are easy to start but hard to maintain once a task becomes long-running:

- dependencies are implicit
- multiple agents can edit the same file
- closed work keeps taking context space
- resuming a task requires rereading a lot of prose
- handoff between branches or machines is fragile

Beads turns task state into a database-backed graph so agents can query what is ready, claim work, link blockers, and preserve an audit trail.

## Core model

Beads stores issues as structured records rather than free-form notes.

Important concepts:

- **Issues**: tasks, bugs, epics, messages, or other work items.
- **Dependencies**: parent-child links, blockers, related items, duplicates, and superseded items.
- **Ready queue**: `bd ready` lists work with no open blockers.
- **Claims**: `bd update <id> --claim` lets an agent atomically take a task.
- **Compaction**: old closed work can decay into summaries to reduce context cost.
- **JSON output**: commands are designed for agents and scripts to parse.

This makes Beads closer to an agent memory layer than a normal human-only issue tracker.

## Basic workflow

Install the CLI once, then initialize it inside a project:

```bash
brew install beads
cd your-project
bd init
```

Then tell agents how to use it:

```bash
echo "Use 'bd' for task tracking" >> AGENTS.md
```

Common commands:

| Command | Use |
| --- | --- |
| `bd ready` | List unblocked tasks. |
| `bd create "Title" -p 0` | Create a high-priority task. |
| `bd update <id> --claim` | Claim a task atomically. |
| `bd dep add <child> <parent>` | Add a dependency or hierarchy link. |
| `bd show <id>` | Inspect details and audit history. |

## Storage modes

Beads has two main storage modes:

- **Embedded mode**: `bd init` uses an in-process Dolt database. This is the default and fits most personal or single-writer workflows.
- **Server mode**: `bd init --server` connects to a `dolt sql-server`, which is better when multiple writers need concurrent access.

It also supports **git-free usage** with `BEADS_DIR` and `bd init --stealth`, useful for CI, evaluation runs, monorepos, non-git version control, or personal task tracking that should not modify the shared repository.

## When to use it

Beads is worth considering when:

- a coding task spans many turns or days
- multiple agents or branches need to coordinate
- task dependencies matter more than a flat checklist
- you want machine-readable task state instead of prose plans
- you need to preserve progress without stuffing everything into the prompt

For a short one-off change, plain Markdown is simpler. For long-horizon agent work, Beads gives the harness a more reliable external memory surface.

## How it fits with agent harness design

In an agent harness, Beads belongs in the **memory and coordination** layer:

- it externalizes task state from the model context
- it gives agents a queryable ready queue
- it reduces merge conflicts through generated IDs and structured storage
- it makes handoff easier because task status is not hidden in chat history

This complements tools like `git worktree`, browser harnesses, and repo-local `AGENTS.md` instructions. The pattern is the same: move durable state out of the model and into inspectable project infrastructure.

## Things to check before adopting

- Decide whether `.beads/` should be committed, ignored, or used in stealth mode.
- Prefer JSON output for agent automation.
- For multi-agent workflows, test claiming and dependency updates before relying on them.
- Verify install binaries or checksums before trusting downloaded tools.
- Keep task titles and dependencies small enough for agents to scan quickly.

## References

- [gastownhall/beads](https://github.com/gastownhall/beads)
- [Beads documentation](https://gastownhall.github.io/beads/)
- [Dolt](https://www.dolthub.com/)
