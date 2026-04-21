---
title: "Git worktree"
description: "Use git worktree to check out multiple branches from one repository simultaneously for parallel feature work and multi-agent coding."
icon: "code-branch"
---

# Git worktree

`git worktree` lets one repository expose **multiple working directories at the same time**.  
Instead of cloning the same repo again and again, you can keep one shared repository object store and open several branches in parallel.

This is especially useful when:

- you are fixing one bug while another feature is in progress
- you want a clean review branch without stashing current work
- multiple AI agents need isolated working directories
- you want to compare branches side by side

## Why use it instead of another clone

The main benefits are:

- faster than recloning
- less disk usage than multiple full clones
- one shared repository history and object database
- each worktree still gets its own `HEAD`, index, and working directory

In practice, it feels like “multiple checkouts from one repo”.

## The basic commands

### Create a new worktree from an existing branch

```bash
git worktree add ../docs-fix docs-fix
```

This creates a sibling directory `../docs-fix` and checks out branch `docs-fix` there.

### Create a new worktree and new branch in one step

```bash
git worktree add -b feature/browser-harness ../browser-harness
```

This is the most common pattern for new work.

### List all worktrees

```bash
git worktree list
```

### Remove a worktree

```bash
git worktree remove ../browser-harness
```

### Clean stale metadata

```bash
git worktree prune
```

Use `prune` when a worktree directory was deleted manually and Git still remembers it.

## A practical workflow

Imagine your main repository is in `~/code/project`:

```bash
cd ~/code/project
git switch main
git pull

git worktree add -b feature/a ../project-feature-a
git worktree add -b fix/login-bug ../project-login-fix
```

Now you can:

- keep normal work in `project`
- do feature work in `project-feature-a`
- isolate a production fix in `project-login-fix`

This is a much cleaner workflow than repeatedly stashing, rebasing, and switching branches in one directory.

## Why it is useful for AI agents

For multi-agent coding, `git worktree` is often the simplest safe default.

Each agent can get:

- its own directory
- its own checked-out branch
- its own build artifacts and temp files
- much lower risk of stomping on another agent’s uncommitted changes

That makes worktree-based coordination much easier than sharing one checkout.

### A simple pattern

```bash
git worktree add -b agent/docs ../project-agent-docs
git worktree add -b agent/tests ../project-agent-tests
git worktree add -b agent/refactor ../project-agent-refactor
```

Then assign one worktree per task or per agent.

## Important rules

### 1. Do not check out the same branch in two worktrees

Git prevents most of this automatically, but the principle matters:

- one branch
- one active worktree

If two places both try to advance the same branch, you lose the isolation benefit.

### 2. Remove worktrees with Git when possible

Prefer:

```bash
git worktree remove ../project-agent-docs
```

instead of deleting the folder directly.  
If you do delete it manually, follow up with:

```bash
git worktree prune
```

### 3. Use worktree-specific config when needed

By default, the main `.git/config` is shared across worktrees.  
If you need config that should exist only in one worktree, enable:

```bash
git config extensions.worktreeConfig true
```

Then set per-worktree values with:

```bash
git config --worktree core.sparseCheckout true
```

This is useful when different worktrees need different sparse-checkout or local behavior.

## What is shared and what is separate

### Shared

- repository objects
- most refs
- normal repository history
- main config by default

### Separate per worktree

- `HEAD`
- index
- working directory contents
- some per-worktree refs and pseudorefs
- optional `config.worktree`

That split is the reason worktrees are both lightweight and practical.

## Good use cases

- parallel feature development
- hotfix branch alongside a bigger refactor
- multi-agent implementation lanes
- trying risky changes without disturbing the current checkout
- large repos where full reclones are wasteful

## When a full clone is still better

Use a separate clone instead if you need:

- a fully separate Git config and credential context
- different remotes or fork wiring
- total isolation for experiments
- to work across very different repository states independently

Worktrees are excellent for **same-repo parallelism**, not for every kind of isolation.

## Small but relevant Git 2.54 note

Today’s Git ecosystem update also included **Git 2.54**, which added a new experimental `git history` command for simpler history edits and made geometric repacking the default manual maintenance strategy.

That is useful context, but for day-to-day parallel work, `git worktree` is still the more immediately practical feature to master.

## References

- [Git documentation: git-worktree](https://git-scm.com/docs/git-worktree)
- [GitHub Blog: Highlights from Git 2.54](https://github.blog/open-source/git/highlights-from-git-2-54/)
