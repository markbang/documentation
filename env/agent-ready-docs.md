---
title: "Agent-ready docs"
description: "Practical checklist for making a documentation site easier for AI agents to discover, read, and use, covering llms.txt, markdown delivery, content signals, and protocol discovery."
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

## Roll this out in phases

Use the smallest useful sequence:

1. Fix `robots.txt`, `sitemap.xml`, titles, and descriptions.
2. Add `llms.txt`.
3. Add Markdown delivery via `Accept: text/markdown` and/or `/index.md`.
4. Add `Content-Signal` if you need explicit AI usage preferences.
5. Add API or MCP discovery only if your site actually exposes capabilities.

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

- [Cloudflare: Introducing the Agent Readiness score](https://blog.cloudflare.com/agent-readiness/)
- [Cloudflare Style Guide: AI tooling](https://developers.cloudflare.com/style-guide/ai-tooling/)
- [Cloudflare: robots.txt setting and Content Signals](https://developers.cloudflare.com/bots/additional-configurations/managed-robots-txt/)
- [llms.txt specification](https://llmstxt.org/)
