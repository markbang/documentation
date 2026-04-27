---
name: folo-knowledge-curator
description: Use in the documentation repository when Codex should autonomously review recent Folo/RSS items, choose durable knowledge worth preserving, create or update Markdown/MDX documentation, update Mintlify navigation when needed, run validation, commit, and push the result. Trigger for requests like "看看今天有什么值得落文档", "从 Folo 沉淀知识并 push", "自动从 Folo 获取信息源更新知识库", or recurring curation workflows that start from Folo and end in a pushed documentation change.
---

# Folo knowledge curator

Turn recent Folo items into durable documentation changes for this Mintlify knowledge base. Prefer small, high-confidence updates over broad rewrites.

## Required companion skill

Use the repo-local `folo` skill at `.agents/skills/folo/SKILL.md` for CLI commands and Folo error handling. Do not duplicate its full command reference in context; read it when Folo command details are needed.

## Workflow

1. Inspect repo state with `git status --short --branch`.
2. Pull candidate items from Folo:
   - start with `npx --yes folocli@latest timeline --limit 50 --format json`
   - use `unread count` and `unread list` only when unread prioritization is useful
   - summarize candidates with `jq` rather than reading large JSON blobs into the answer
3. Select durable topics using the criteria below.
4. Read full source content for shortlisted entries with `entry get` and `entry read`.
5. Verify with primary or official sources when the claim is recent, high-stakes, product-specific, legal, pricing-related, model-specific, or likely to change.
6. Decide whether to update an existing page or add a new page.
7. Edit Markdown/MDX and Mintlify navigation.
8. Run `npm run validate` and `npm run lint`; if default Node is unsupported, use an available LTS runtime such as `mise x node@22 -- npm run validate` and `mise x node@22 -- npm run lint`.
9. Commit only the relevant changes and push to the current branch unless the user asked for no push.

## Selection criteria

Promote an item into docs when it has lasting reference value for Chinese readers learning software, development, CS, tooling, or technical workflows.

Good candidates:

- stable workflows or checklists
- tool capabilities that change how a developer works
- protocol, API, architecture, or deployment patterns
- postmortems with reusable engineering lessons
- durable comparisons between approaches
- course-relevant or CS fundamentals material

Usually reject:

- short-lived launch hype
- pricing chatter without stable workflow impact
- social commentary without technical takeaway
- unverified model benchmark claims
- rumors or pre-announcement screenshots
- narrow personal updates

If nothing qualifies, report the strongest candidates and why they were not worth landing.

## Placement rules

Prefer updating existing pages when the topic naturally fits. Create a new page only when the topic has independent reference value and would be awkward inside an existing note.

Common destinations:

- `apps/` and `zh/apps/` for user-facing tools
- `env/` and `zh/env/` for development environment, deployment, agent workflows, and documentation operations
- `backend/`, `frontend/`, `software/`, or `algo/` for domain-specific technical material
- `about/courses/` and `zh/about/courses/` for course-style notes

For bilingual sections, usually add both English and Chinese pages when the surrounding section has both. For a Chinese-first source, make the Chinese page the more natural version and keep the English page concise but complete.

When adding a page:

- add frontmatter with `title`, `description`, and `icon`
- add it to `docs.json` in both language navigation trees when applicable
- add a card to the relevant section index if that index uses cards
- keep local links working and prefer local links for internal references

## Writing rules

- Preserve the original technical meaning.
- Write concise, practical headings in sentence case.
- Use active voice and direct instructions.
- Bold UI labels when referencing interface text.
- Use code formatting for commands, paths, file names, and identifiers.
- Cite original Folo article URLs or official sources in a `References` section.
- Separate durable lessons from time-sensitive facts.
- Avoid turning one source into a long paraphrase; synthesize across sources when possible.

## Source handling

Use Folo as the intake channel, not as the only authority.

For each landed topic, keep enough provenance to answer:

- Which Folo item triggered this?
- What original URL supports it?
- Did a primary/official source confirm the durable claim?

Do not cite RSS summaries as the sole source when the original article or official documentation is available.

## Git and push policy

Before editing, check for unrelated local changes and avoid touching them. After editing, inspect `git diff --stat` and `git diff` for the files you changed.

Commit message style:

- `Add <topic> notes`
- `Update <existing topic> guide`
- `Capture <workflow> pattern`

Push with `git push origin <current-branch>`. If rejected because the remote moved, run `git pull --rebase origin <current-branch>`, resolve conflicts carefully, rerun validation if content or config changed, then push again.

## Final response

Report:

- what Folo items were promoted or rejected
- files changed
- validation results
- commit SHA and push target, if pushed

Keep the response concise. Mention blockers such as Folo auth failure, missing primary-source verification, unsupported Node version, validation failure, or push rejection.
