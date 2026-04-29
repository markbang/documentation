---
title: "Browser Automation Observability"
description: "Debugging browser automation with read-only CDP tracing — attach a second CDP client to capture DevTools events, screenshots, and DOM snapshots without disrupting the main automation flow."
icon: "magnifying-glass-chart"
---

# Browser Automation Observability

When browser automation (Playwright, Stagehand, browser-use, etc.) fails, gets stuck, or can't find an element, you need to see **what actually happened** — network requests, console errors, DOM changes, and screenshots aligned by timestamp. The `browser-trace` skill makes this possible without disrupting your main automation.

## Core Idea: Read-Only CDP Sidecar

Chrome DevTools Protocol (CDP) allows **multiple clients** to connect to the same browser target simultaneously. Your main automation sends commands through one CDP client. The trace skill connects a **second, read-only CDP client** that only subscribes to observation domains (Network, Console, Runtime, Log, Page) — never sending actions that change the page.

```text
┌─────────────────┐     ┌─────────────────┐
│  Main Automation │     │  browser-trace  │
│  (Playwright /   │     │  (read-only     │
│   Stagehand /    │     │   CDP client)   │
│   browser-use)   │     │                 │
│  sends commands  │     │  only observes  │
└─────────┬────────┘     └─────────┬────────┘
          │                         │
          └─── CDP ──► Chrome ◄─────┘
                      (same target)
```

<Note title="Why this works without conflict">
CDP is designed for multiple clients. The main automation owns the "action" domains (DOM manipulation, input events). The trace client only subscribes to "observation" domains (Network events, Console messages, Page lifecycle). They coexist without interfering.
</Note>

## Three Mechanisms

### 1. Firehose — Raw CDP Event Stream

Captures all CDP events into NDJSON for post-hoc analysis:

```bash
browse cdp  # Writes CDP full stream to cdp/raw.ndjson per line
```

### 2. Sampler — Periodic Screenshots + DOM Snapshots

Periodically grabs screenshots and full-page HTML alongside the event stream:

```bash
browse --ws screenshot       # Screenshot via one-shot WS connection
browse --ws get html body    # Full page HTML via one-shot WS connection
```

### 3. Bisector — Post-Run Segmentation

After the automation completes, `bisect-cdp.mjs` segments the raw event stream into structured, searchable chunks:

```bash
bisect-cdp.mjs  # Scans raw.ndjson, splits by:
                #   - CDP method buckets (multiple JSONL files)
                #   - Page navigation segments (pages/000/... tree)
```

This makes it easy to find events by navigation phase (e.g., "what happened after the login page loaded").

## When to Use

- **Automation fails / gets stuck** — Find the exact moment it broke: which request failed, which JS error fired, which DOM element was missing
- **Mid-session debugging** — Attach trace to an already-running session without restarting
- **Causal analysis** — Align network, console, DOM, and screenshots by timestamp to trace root causes

## Practical Constraints

1. **Sampling interval** — Don't sample faster than ~1s (default 2s). Each sample adds CDP/ screenshot overhead.
2. **DOM domain is noisy** — Fine-grained DOM tree changes require adding `DOM` to `O11Y_DOMAINS`, but it generates very verbose output.
3. **Always run stop-capture** — Even if your code crashes, run `stop-capture.mjs` to avoid zombie processes and missing `stopped_at` timestamps.
4. **Bisect is idempotent** — You can re-run it on the same data; it overwrites previous segmentations.
5. **Don't re-open sessions** — For remote automation with `browse --connect`, don't call `browse env remote` to open a new session for the same browser target.

## Quick Start

```bash
# 1. Start capture before your automation runs
start-capture.mjs

# 2. Run your automation (Playwright, etc.) as normal

# 3. Stop capture after completion
stop-capture.mjs

# 4. Segment the captured data
bisect-cdp.mjs

# 5. Inspect results
jq '. | select(.method == "Network.requestWillBeSent")' cdp/raw.ndjson
rg "console.error" pages/
```

## References

- [browser-trace skill on skills.sh](https://skills.sh/browserbase/skills/browser-trace)
- [Browserbase team](https://www.browserbase.com/)
- [CDP Protocol docs](https://chromedevtools.github.io/devtools-protocol/)