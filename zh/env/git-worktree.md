---
title: "Git worktree"
description: "Git worktree 让同一个仓库同时检出多个独立工作目录，无需重复 clone 即可并行开发不同分支，适用于功能并行开发、多 agent 同时编码、紧急 hotfix 隔离与跨分支代码评审等场景，附 worktree add、list、remove 常用命令速查。"
icon: "code-branch"
---

# Git worktree

`git worktree` 可以让一个仓库同时暴露出**多个工作目录**。  
你不需要为了并行开发反复重新 clone 仓库，而是可以在同一个仓库对象库之上，同时检出多个分支。

它特别适合这些场景：

- 一个功能还没做完，但你要立刻修线上 bug
- 想单独开一个干净目录做 review 或实验，不想来回 stash
- 多个 AI agent 需要各自独立的工作目录
- 想把两个分支并排打开比较

## 为什么不用多 clone

相对重复 clone，同一个仓库下用 worktree 的好处是：

- 通常更快
- 更省磁盘空间
- 共用一套仓库历史和对象库
- 每个 worktree 仍然有自己的 `HEAD`、index 和工作目录

可以把它理解成：

> 一个仓库，多个 checkout。

## 常用命令

### 从已有分支创建一个 worktree

```bash
git worktree add ../docs-fix docs-fix
```

这会在兄弟目录 `../docs-fix` 创建一个新工作目录，并检出 `docs-fix` 分支。

### 创建 worktree 时顺便新建分支

```bash
git worktree add -b feature/browser-harness ../browser-harness
```

这是最常见的用法。

### 查看当前所有 worktree

```bash
git worktree list
```

### 删除一个 worktree

```bash
git worktree remove ../browser-harness
```

### 清理失效元数据

```bash
git worktree prune
```

如果你手动把目录删掉了，但 Git 还记得它，就需要 `prune`。

## 一个实际工作流

假设你的主仓库在：

```bash
~/code/project
```

那么你可以这样开并行目录：

```bash
cd ~/code/project
git switch main
git pull

git worktree add -b feature/a ../project-feature-a
git worktree add -b fix/login-bug ../project-login-fix
```

这时你就有了三个互不干扰的目录：

- `project`：正常主线开发
- `project-feature-a`：新功能
- `project-login-fix`：线上修复

这比在同一个目录里来回 `stash`、`switch`、`rebase` 要干净得多。

## 为什么它特别适合 AI agent

对多 agent 编码来说，`git worktree` 几乎是最简单也最稳的默认方案之一。

因为每个 agent 都可以拥有：

- 自己独立的目录
- 自己独立检出的分支
- 自己的构建产物和临时文件
- 更低的未提交改动互相踩踏风险

这通常比让多个 agent 共用一个 checkout 安全得多。

### 一个简单模式

```bash
git worktree add -b agent/docs ../project-agent-docs
git worktree add -b agent/tests ../project-agent-tests
git worktree add -b agent/refactor ../project-agent-refactor
```

然后一人（或一个 agent）一个目录。

## 几条重要规则

### 1）不要在两个 worktree 里同时检出同一个分支

Git 通常会帮你拦住大多数这种情况，但原则上要记住：

- 一个分支
- 一个活跃 worktree

否则你就失去了隔离的意义。

### 2）尽量用 Git 删除 worktree

优先这样删：

```bash
git worktree remove ../project-agent-docs
```

而不是直接 `rm -rf` 目录。  
如果你确实手工删了目录，记得补一条：

```bash
git worktree prune
```

### 3）有需要时启用 worktree 专属配置

默认情况下，大部分配置还是共享主仓库的 `.git/config`。  
如果你想让某些配置只存在于某一个 worktree，可以启用：

```bash
git config extensions.worktreeConfig true
```

然后用：

```bash
git config --worktree core.sparseCheckout true
```

这种方式写入当前 worktree 专属配置。

这在不同 worktree 需要不同 sparse-checkout 或本地行为时很有用。

## 哪些是共享的，哪些是独立的

### 共享

- 仓库对象库
- 大部分 refs
- 正常仓库历史
- 默认主配置

### 每个 worktree 独立

- `HEAD`
- index
- 工作目录内容
- 部分 per-worktree refs / pseudorefs
- 可选的 `config.worktree`

也正因为这个划分，worktree 才同时兼顾了“轻量”和“实用”。

## 适合的场景

- 并行开发多个功能
- 大重构进行中，突然插入 hotfix
- 多 agent 各自负责一条 implementation lane
- 想开一个独立目录做实验，不打扰当前工作
- 仓库很大，不想重复完整 clone

## 什么情况下还是 full clone 更合适

如果你需要的是：

- 完全独立的 Git 配置和凭证环境
- 不同 remote / fork 关系
- 彻底隔离的实验空间
- 在非常不同的仓库状态上长期独立演进

那单独 clone 往往还是更合适。

worktree 很适合同仓库内的**并行工作**，但不是所有隔离需求的万能替代。

## 顺手一提：Git 2.54

今天的 Git 生态里还有一个相关更新：**Git 2.54**。  
它新增了实验性的 `git history` 命令，让一些简单历史改写更直接，也把 geometric repacking 变成了默认的手动维护策略。

不过对于日常并行开发来说，真正最值得先掌握的仍然是 `git worktree`。

## 参考资料

- [Git 官方文档：git-worktree](https://git-scm.com/docs/git-worktree)
- [GitHub Blog：Highlights from Git 2.54](https://github.blog/open-source/git/highlights-from-git-2-54/)
