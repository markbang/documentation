# Documentation project instructions

## About this project

- This is the Mintlify deployment repository for 棒无の知识库
- Configuration lives in `docs.json` at the repository root
- Content lives as `.md` / `.mdx` pages in the repository root and nested folders
- Run `npm run dev` to preview locally
- Run `npm run validate` and `npm run lint` before finishing changes

## Style preferences

- Primary audience is Chinese readers learning software, development, and CS topics
- Keep headings concise and practical
- Prefer active voice and direct instructions
- Use sentence case for headings
- Bold UI labels when referencing interface text
- Use code formatting for commands, file names, paths, and identifiers

## Content boundaries

- Preserve existing technical meaning when cleaning up older notes
- Prefer small, mechanical compatibility fixes over broad rewrites
- Keep links working and favor local links for internal references
- This repository is for knowledge collection and curation, not only maintenance of existing pages.
- When research surfaces durable knowledge that does not fit an existing page well, create a new document in the most appropriate section instead of forcing it into an unrelated page.
- Prefer adding a new page only when the topic has lasting reference value, not just short-lived news value.

## Project-local skills and research

- Repo-local skills live under `.agents/skills/`.
- Use `.agents/skills/folo/SKILL.md` when research can benefit from the maintainer's Folo/RSS subscriptions. Treat it as a preferred knowledge intake channel for subscribed sources.
- When the user asks what is worth reading, exploring, or tracking, check Folo first before broader web research unless a stronger primary source is clearly needed.
- For documentation research, default to read-only Folo workflows such as `timeline`, `entry get`, `entry read`, `search`, `unread count`, and `unread list` unless the user explicitly asks to modify subscriptions, collections, or read state.
- Promote only durable, reusable insights into docs. Do not turn short-lived news, pricing chatter, or hype posts into standalone documentation unless they reveal a stable workflow, pattern, or tool capability that will still matter later.
- When Folo surfaces material used in docs, cite or link the original article or feed when possible. Fall back to official docs or live web search when the needed source is not available through RSS or when higher-confidence verification is required.
