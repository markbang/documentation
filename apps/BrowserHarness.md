---
title: "Browser Harness"
description: "Browser Harness is a thin, self-healing browser control layer built on CDP for coding agents like Codex and Claude Code that need real browser access."
icon: "globe"
---

# Browser Harness

[Browser Harness](https://github.com/browser-use/browser-harness) is an open-source browser control layer from the Browser Use team. Its core idea is simple:

- connect directly to Chrome through **CDP**
- keep the harness **thin**
- let the agent **write missing helper code during the task**

It is not trying to be another large test framework. It is closer to a minimal bridge that gives an LLM more freedom inside a real browser session.

## Why it is interesting

Compared with rigid browser automation flows, Browser Harness is designed for **agentic use**:

- works with tools like **Codex** and **Claude Code**
- can connect to your **real browser**
- allows the agent to add helper functions while it is working
- supports free remote browsers for cloud or sub-agent scenarios

The official README describes it as a **self-healing browser harness**: if the current helper set is missing a capability, the agent can edit the harness and continue instead of stopping immediately.

## How it works

The project stays intentionally small:

- `install.md` handles first-time setup
- `SKILL.md` explains normal usage
- `helpers.py` contains the callable browser helper functions
- `daemon.py` and `admin.py` handle the CDP websocket and local bridge

The interesting part is that `helpers.py` is not treated as fixed forever. The agent is expected to inspect it and extend it when needed.

In practice, the flow looks like this:

1. Connect the harness to Chrome through CDP
2. Ask the coding agent to complete a browser task
3. If a helper is missing, the agent edits the harness
4. Continue the task with the new helper available

That is the main difference from a traditional test script that fails as soon as the missing operation is encountered.

## When to use it

Browser Harness makes sense when you want:

- a coding agent to operate a real browser for you
- interactive browser tasks rather than only deterministic regression tests
- a thinner layer than a large end-to-end testing stack
- browser work that can improve over time as helpers and skills accumulate

Typical examples:

- logging into websites with your existing browser profile
- navigating complex dashboards
- submitting forms or uploading files
- doing repetitive browser workflows that are annoying to script upfront

## When not to use it

If you need:

- strict, reproducible end-to-end tests
- stable CI assertions
- browser automation with carefully fixed selectors and snapshots

then a conventional framework such as Playwright is often a better default.

Browser Harness is more about **agent flexibility** than strict test determinism.

## Real browser vs remote browser

The project supports both:

### Real browser

Best for:

- personal workflows
- sites where you are already logged in
- tasks that benefit from your existing cookies, sessions, and local browser state

### Remote browser

Best for:

- cloud execution
- sub-agents
- isolated sessions
- tasks that should not depend on your local machine

Browser Use also documents a remote-browser/CDP workflow and an MCP server, which makes the surrounding ecosystem broader than this repo alone.

## Practical setup notes

The README recommends a very direct setup pattern:

1. let the agent clone or open the repo
2. read `install.md` first
3. read `SKILL.md` for day-to-day usage
4. always inspect `helpers.py`

That setup pattern matters because the harness is intentionally editable during execution.

## How it fits into the current agent tooling landscape

There are now roughly three common layers for browser automation:

1. **classic automation frameworks**  
   Playwright, Puppeteer, Selenium
2. **MCP/browser tools for assistants**  
   tool-call-oriented browser control
3. **agent-native browser harnesses**  
   browser control designed for LLMs that reason, adapt, and patch their own workflow

Browser Harness clearly sits in the third category.

## My take

The interesting part is not just "LLMs can click a browser". A lot of tools can already do that.

The more durable idea is this:

> treat browser automation as an editable runtime surface for agents, not only as a fixed script written in advance.

That is a useful mental model if you are building agent workflows around real websites.

## References

- [browser-use/browser-harness](https://github.com/browser-use/browser-harness)
- [Browser Use documentation](https://docs.browser-use.com/)
- [Remote Browser via CDP](https://docs.browser-use.com/customize/browser/remote)
- [Browser Use MCP Server](https://docs.browser-use.com/customize/mcp-server)
