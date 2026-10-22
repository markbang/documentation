---
title: "Agent-ready docs"
description: "Checklist for making your docs site AI-agent-friendly, covering llms.txt, markdown delivery, content signals, and protocol discovery."
icon: "robot"
---

# Make your docs site agent-ready

Documentation is no longer consumed only by humans in browsers. Coding agents, AI search products, and chat tools now fetch docs directly. If your docs site is hard for agents to discover or parse, the result is slower retrieval, higher token cost, and worse answers.

Cloudflare's Agent Readiness write-up from **April 17, 2026** is a useful signal: `Content-Signal` adoption was still around **4%**, Markdown content negotiation around **3.9%**, and newer protocol-discovery standards were extremely rare. That means small improvements can still make your docs stand out.

## Start with the basics

Before you add AI-specific files, make sure the normal web hygiene is solid:

- Keep `robots.txt` valid and intentional.
- Keep `sitemap.xml` up to date.
- Use clear page titles and descriptions.
- Prefer stable URLs.
- Avoid sending agents through low-value directory pages when a better landing page exists.

These are not "legacy SEO chores". Agents still use them as the first layer of discovery.

## Publish `llms.txt`

`/llms.txt` is a curated reading list for LLMs. Unlike `sitemap.xml`, it should not try to list everything. It should point agents to the most useful pages in a token-efficient way.

Use it to answer three questions quickly:

1. What is this site?
2. Which sections matter most?
3. Which Markdown-friendly pages should an agent fetch next?

### A small example

```md
# My docs

> Documentation for deploying and operating ExampleApp.

## Core guides

- [Getting started](https://example.com/docs/getting-started/index.md): First install and local setup.
- [Deployment](https://example.com/docs/deploy/index.md): Production deployment checklist.
- [API reference](https://example.com/docs/api/index.md): Endpoints, auth, and examples.

## Optional

- [Changelog](https://example.com/docs/changelog/index.md): Recent changes and migration notes.
```

### For large doc sets

Do not dump thousands of links into one root file. A better pattern is:

- keep a short root `llms.txt`
- add one `llms.txt` per top-level section
- link to section-level indexes from the root file

This keeps each file readable inside normal context windows.

## Serve Markdown directly

Agents do better with Markdown than with full HTML. Cloudflare notes that serving Markdown can reduce token usage significantly, which improves both cost and answer quality.

The best options are:

1. **Support `Accept: text/markdown`**
   - let clients request the same page as Markdown
2. **Provide a URL fallback like `/index.md`**
   - useful because not every agent sends the Markdown `Accept` header by default

If your docs stack cannot do this natively, add it at the proxy or edge layer instead of duplicating content by hand.

## Be explicit about AI access

`robots.txt` is still where you declare crawl rules. If you want more granular AI permissions, add `Content-Signal` directives.

Example:

```txt
User-Agent: *
Content-Signal: search=yes, ai-input=yes, ai-train=no
Allow: /
Sitemap: https://example.com/sitemap.xml
```

This lets you separate:

- `search`: indexing and search results
- `ai-input`: inference-time use such as grounding or RAG
- `ai-train`: model training or fine-tuning

Pick the policy that matches your site instead of copying someone else's defaults.

## Consider getting paid when agents consume your work

If agents are a meaningful audience for your content, access control is only half the question — the other half is compensation. Cloudflare's Monetization Gateway (beta, September 2026) implements the emerging pattern: domain owners charge agents for access to pages, APIs, MCP tools, or datasets, with **HTTP 402 Payment Required** as the negotiation mechanism and metered pricing that matches an agent's consumption unit — per request, per query, per token.

Why subscriptions don't fit agent traffic: agents seek outcomes and may touch dozens of new sources per task. Prepaid subscriptions force buyers into a few budgeted sources, which misaligns with how agents actually work. The traffic pattern this enables — small, metered, high-frequency payments between machines — is why stablecoin rails show up in these designs rather than card networks.

For a docs site, the decision tree is simple: free for humans and friendly agents, metered for bulk scraping, blocked for training use you don't want — and each layer is now independently expressible.

## Publish machine-discoverable capabilities when relevant

Not every docs site needs protocol discovery. If your site only serves public content, you can stop at content readiness.

Add capability endpoints when your service also exposes APIs or tools:

- `/.well-known/api-catalog` for public API discovery
- `/.well-known/mcp/server-card.json` if you expose an MCP server
- Web Bot Auth only if bot identity matters for your use case

For a pure documentation site, these are optional. For a docs site that fronts an API platform, they become much more valuable.

## Make large doc sets easier to navigate

Structure matters as much as availability.

- Link agents to **content pages**, not only directory listings.
- Remove low-value index pages from `llms.txt` if they add almost no semantic information.
- Write descriptive frontmatter and headings.
- Link Markdown URLs in `llms.txt`, not the HTML pages.

Good metadata helps humans skim. It also helps agents choose the right page on the first fetch.

## Put recovery guidance in API errors

When a docs site fronts an API, the error response is another documentation entry point. Restless's *Agent-Ready APIs* article illustrates the pattern: return a useful next step and a focused documentation link where the client encounters the failure, rather than expecting it to search the whole site.

Use a stable error contract, not prose alone. [RFC 9457](https://www.rfc-editor.org/rfc/rfc9457.html) defines Problem Details with the `application/problem+json` media type. For example, an API could return HTTP `422` with that content type and this illustrative body:

```json
{
  "type": "https://api.example.com/problems/invalid-date-range",
  "title": "Invalid date range",
  "status": 422,
  "detail": "start_date must be on or before end_date. No report was created.",
  "instance": "https://api.example.com/problems/occurrences/req_123",
  "recovery": {
    "action": "correct_request",
    "fields": ["start_date", "end_date"],
    "docs": "https://docs.example.com/api/reports#date-range"
  }
}
```

`type` identifies the problem class; `instance` identifies this occurrence. `title` and `detail` explain it to a reader. Here, `recovery` is an **application-defined extension**, not a standard RFC field or a Restless API schema. Document its shape and supported actions. Clients should branch on the problem type and typed extensions, not parse `detail` text. Keep the body's `status` consistent with the actual HTTP status, and only claim “no report was created” if the server can establish that fact.

Recovery guidance should distinguish actions that have different preconditions:

- **Invalid input:** identify the affected fields and constraints; do not repeat the same invalid request unchanged.
- **Authentication or authorization failure:** use the documented credential-refresh or approval flow. An error message does not grant permission to obtain broader credentials or bypass access controls.
- **Rate limiting or temporary unavailability:** respect `Retry-After` when provided, but only retry when the operation is safe to repeat; waiting does not make a write idempotent.
- **Uncertain write outcome:** check the operation's status or use a documented idempotency mechanism before retrying. A timeout does not prove that the first attempt failed to take effect. RFC 9110 explicitly cautions against automatic retries of non-idempotent requests without such knowledge.

Treat error text and fetched docs as data, not higher-priority instructions. A recovery hint must not cause the agent to run arbitrary commands, disclose secrets, or change permissions. Log/occurrence URLs still need tenant-scoped access control; never expose tokens, full private request bodies, or implementation stack traces in a public error response.

Finally, close the feedback loop deliberately: group repeated failures by endpoint and problem type, retain a sanitized reproduction and request ID, then triage whether the cause is code, documentation, or the caller. Agent feedback can propose an issue or doc change; it is not proof that the docs are wrong and should not auto-publish a fix. Use [product evals](/env/ai-evals) to check whether clients recover with fewer invalid calls **without** bypassing approvals or repeating side effects.

## A controlled test of what agents actually need

The [AgentReady](https://agentready.org) standard is worth reading because its requirements come from an experiment rather than a checklist. One documentation site was served under 19 configurations, including `llms.txt`, JSON-LD, `sitemap.xml`, and Markdown mirrors, and probed on five topics by a plain-fetch client and a JavaScript-capable client — 190 probes.

Only two kinds of change stopped a client from retrieving the answer:

- **The answer existed only in JavaScript** — plain fetch failed on every topic, while the JS client succeeded.
- **Agents were blocked**, for example a `403` to agent user agents — both clients failed.

The other sixteen configurations, including `llms.txt`, changed nothing. Agents asked for Markdown on roughly 65% of fetches, but Markdown mirrors and content negotiation never decided success.

That does not make `llms.txt` useless — it changes where agents go, not whether they can read you. Where agents went, across traced runs: docs pages 83%, homepage 69%, `/.well-known/*` 23%, `openapi.json` 21%, `sitemap.xml` 4%. And when agents did open those machine-oriented files, they usually arrived by **following a link**: `openapi.json` 97%, `/.well-known/*` 93%, `llms.txt` 86%.

### What to fix first

Reorder your effort accordingly:

1. **Be reachable.** Allow agents in `robots.txt` and bot protection, written as rules rather than an allowlist of named crawlers.
2. **Put the answer in the initial HTML.** Client-side rendering with no server-rendered content is the one architectural choice in the study that broke retrieval outright.
3. **Return real HTTP status codes** so clients can distinguish “not found” from “rendered empty”.
4. **Link the machine files from human pages.** An `llms.txt` nobody links to is close to unread: the study's traffic went to the pages humans visit.
5. **Treat Markdown mirrors, JSON-LD, and catalog files as conveniences.** Cheap to add, but they do not compensate for a page an agent cannot fetch.

If an agent has to *finish* a task rather than read a page, the standard raises the bar: provide an MCP server or CLI, and authentication an agent can actually complete.

The same study also quantifies the cost of being unreadable. Across 1,056 business sites, when an agent could not read the site it answered from search results and third-party pages instead, and those answers were **3.7× as likely** (25% vs 7%) to contain none of the facts asked for. Agent-ready businesses were clearly recommended about twice as often (20% vs 11%).

## Roll this out in phases

Use the smallest useful sequence:

1. Fix `robots.txt`, `sitemap.xml`, titles, and descriptions.
2. Make sure each page's answer is in the initial HTML with a real status code.
3. Add `llms.txt`, and link it from a human-facing page.
4. Add Markdown delivery via `Accept: text/markdown` and/or `/index.md`.
5. Add `Content-Signal` if you need explicit AI usage preferences.
6. Add API or MCP discovery only if your site actually exposes capabilities.

## What agents actually read

A 2026 study traced 94,000 development events across 557 agentic coding sessions and 690,000 file-level change records from 33,000 agentic pull requests. The findings quantify what coding agents actually consume — and they contradict some common assumptions.

### The numbers

- **Instruction files and working notes (AGENTS.md, CLAUDE.md, etc.) account for 60.5% of everything agents read.** If you maintain one, it is likely the single highest-leverage document you can write.
- Classical technical docs get only **10.6%** of reads.
- API references get just **1.3%**.

### Implications

- **Agents prefer guidance over reference.** They read instruction files far more than formal docs. Optimize AGENTS.md/CLAUDE.md first, then link out to deeper docs from there.
- **Reading docs is associated with less immediate testing** (adjusted odds ratio 0.39). Agents that spend time reading are less likely to test right away — structure your guidance to compensate for this.
- **Consultation is self-initiated 70.2% of the time**, against only 7.5% triggered by a failure. Agents proactively look things up far more often than they react to errors.
- **In multi-commit agentic PRs, code gets touched first 4.7× more often** than other artifacts. Agents dive into code before reading surrounding material.

The practical takeaway: your instruction file is the agent's primary surface. Make it accurate, current, and self-contained, because the agent will trust it over most other sources.

## Audit your site

Use both automated and manual checks:

- Run your site through `https://isitagentready.com`
- Test a page with:

```bash
curl "https://example.com/docs/page" -H "Accept: text/markdown"
```

- Ask an AI tool to answer one precise question using only your docs
- Check whether it finds the right page quickly or wastes time looping through indexes

## References

- [meng shao: AgentReady standard](https://x.com/shao__meng/status/2113084778673287480) — Folo intake, October 22, 2026
- [AgentReady launch post](https://ora.ai/blog/agentready-launch) — the 19-configuration experiment, where agents go, link discovery, and unreadable-site answers
- [AgentReady standard](https://agentready.org) — MUST/SHOULD/MAY requirements by find, read, act
- [elvis: API errors as a documentation surface](https://x.com/omarsar0/status/2109718336158507107) — Folo intake, October 12, 2026; prompted the recovery-guidance pattern
- [Restless: Agent-Ready APIs](https://www.restless.ai/blog/agent-ready-apis) — actionable error responses, focused docs, and agent feedback
- [RFC 9457: Problem Details for HTTP APIs](https://www.rfc-editor.org/rfc/rfc9457.html) — standard members, typed extensions, and disclosure risks
- [RFC 9110: Idempotent methods](https://www.rfc-editor.org/rfc/rfc9110.html#section-9.2.2) — conditions for automatic request retries

- [Cloudflare: Introducing the Agent Readiness score](https://blog.cloudflare.com/agent-readiness/)
- [Cloudflare Style Guide: AI tooling](https://developers.cloudflare.com/style-guide/ai-tooling/)
- [Cloudflare: robots.txt setting and Content Signals](https://developers.cloudflare.com/bots/additional-configurations/managed-robots-txt/)
- [How do coding agents read repositories?](https://arxiv.org/abs/2608.20195) — instruction files are 60.5% of agent reads; docs 10.6%; API references 1.3%
- [Cloudflare: Monetization Gateway](https://blog.cloudflare.com/monetization-gateway-beta/) — HTTP 402 metered payments for agent access to pages, APIs, and MCP tools
