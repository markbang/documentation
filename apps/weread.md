---
title: "WeChat Reading"
description: "WeChat Reading's official AI Skill turns your reading history into data you can query, analyze, and export — connecting your bookshelf to AI coding agents and personal knowledge management."
icon: "book"
---

# WeChat Reading

WeChat Reading (微信读书) is Tencent's e-reading platform, popular among Chinese readers. In 2026, it launched an official **Skill** that lets AI coding agents access your reading data: bookshelf, notes, highlights, reading time, and preference analysis.

## What the Skill unlocks

Instead of waiting for an annual reading report, you can ask an AI agent to analyze your reading history on demand:

- **Reading reports**: Generate personalized analysis of reading time distribution, genre preferences, author patterns, and weekly/monthly rhythms.
- **Book reviews**: Pull all your highlights and notes from a finished book, and generate a structured review.
- **Knowledge cards**: Extract key ideas from your highlights and format them as shareable cards with original quotes.
- **Obsidian export**: Convert a book's highlights and thoughts into an Obsidian-formatted note with frontmatter, tags, and chapter organization.
- **Bookshelf Q&A**: Ask questions like "What should I read next based on my history?" or "What themes have I been exploring recently?"

## The pipeline

The Skill bridges three tools into a reading-to-knowledge pipeline:

```
微信读书 (data source) → AI agent (data pull + processing) → Obsidian (local knowledge base)
```

What this enables:

- Auto-generate one note file per book
- AI auto-tagging and bidirectional links
- Topic-based MOC (Map of Content) index pages
- Incremental merge of new highlights into existing notes

## Supported agents

The Skill works with:

- **Qwen Code** (recommended by most users)
- **Claude Code**
- **Cursor**
- Any agent that supports Skill installation

Qwen Code is preferred because it runs in the terminal, can write files and run scripts directly — one command generates an Obsidian note or visualization report.

## Setup

1. Install a supported coding agent (e.g. [Qwen Code](https://qwenlm.github.io/qwen-code-docs/zh/users/overview/))
2. Get your WeChat Reading API key from [weread.qq.com](https://weread.qq.com/r/weread-skills)

Then tell your agent:

```
下载 https://cdn.weread.qq.com/skills/weread-skills.zip 安装 skill，我的 API 是 wrk-xxxx
```

Optionally add: `帮我配置好环境，记住 API，让我之后不需要再配置` to persist the API key.

Once installed, verify with:

```
/skills weread-skills 我最近在读什么？
```

## Example use cases

**Explore reading patterns:**

```
/skills weread-skills 根据我的阅读偏好，推荐接下来读哪些书
```

**Review highlights from a specific book:**

```
/skills weread-skills 看看我在《空洞的心》里的笔记，随机选 3 条
```

**Generate a book review:**

```
/skills weread-skills 我刚读完《绿灯》，结合我在这本书里的 35 条笔记，帮我写一篇 500 字的短书评
```

**Export to Obsidian:**

```
/skills weread-skills 把我在《纷乱的心灵》里的划线和想法，整理成一篇 Obsidian 格式的读书笔记，保存到当前目录
```

**Find material for writing:**

```
/skills weread-skills 我想写一篇关于「成瘾与自我认知」的文章，从我的笔记里找出所有相关的划线和想法
```

## Community Skills

Beyond the official Skill, community members have built additional tools. For example, [Yao's Weread Skill](https://github.com/yaojingang/yao-open-skills/tree/main/skills/yao-weread-skill) generates detailed visual reading reports with charts and analytics.

Install it with:

```
帮我安装这个技能：https://github.com/yaojingang/yao-open-skills/tree/main/skills/yao-weread-skill
```

Then run:

```
/skills yao-weread-skill 帮我生成我的阅读报告
```

## References

- [年度报告不够看？微信读书 Skill 上手体验](https://sspai.com/post/109932) — 少数派 detailed walkthrough
- [微信读书 Skill 官方页面](https://weread.qq.com/r/weread-skills)
- [Yao's Weread Skill](https://github.com/yaojingang/yao-open-skills/tree/main/skills/yao-weread-skill) — community reading report generator
