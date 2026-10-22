---
title: "Code review when agents write the code"
description: "Layer automated review, verification, risk-tiered approvals, convergence limits, and reviewer evals so AI-written changes stay reviewable — and how to keep approval authority real."
icon: "code-pull-request"
---

# Code review when agents write the code

When agents produce most of the diff, "did a human read every line?" stops being a useful question. The better question is: **what could go wrong with this change, and which check — automated or human — is the right one to catch it?**

Anthropic's Claude Code team documents one answer in the open: roughly 90% of that codebase's code is Claude-written, merged pull requests more than doubled between June and September, and the share needing revert fell by more than 40% over the same period. Treat those as team-reported results from one organization, not a guarantee that applying the same process will reproduce them.

## Replace one gate with layers

A single review gate fails in one direction: everything depends on the reviewer's attention. Layers tolerate individual misses because each covers a different failure class.

| Layer | What it should catch | Typical mechanism |
| --- | --- | --- |
| Pre-PR verification | "It works" claims with no evidence | Tests, builds, screenshots, a fresh-context subagent review |
| Automated review on every PR | Logic and integration bugs a skim misses | Parallel finders plus a verification pass |
| Security review | Exploitable changes | Separate review whose findings must be resolved |
| Blocking CI | Mechanical breakage | Lint, types, cross-platform tests, build |
| Risk-tiered approval | Judgment calls and blast radius | Tier chosen by the change, not the author |
| Merge queue, flags, staged release | Two good PRs combining badly | Re-run checks on `main`; reversible rollout |
| Fast detection | Mistakes that still land | Dashboards, on-call, one-step rollback |

That last layer is not optional. If a process adds automation but cannot detect and undo a bad change quickly, it has not reduced risk — it has moved the discovery cost downstream.

## Verify findings before posting them

An agent reviewer that reports everything is worse than no reviewer, because noise costs a round trip each time — and more when the author is also an agent, since it will fix the nit instead of waving it off.

Claude Code's Code Review runs four stages on Anthropic infrastructure:

1. **Find** — several agents examine the diff and surrounding code in parallel.
2. **Verify** — a verification step checks candidate findings against the code and drops false positives.
3. **Rank** — survivors are deduplicated and sorted by severity.
4. **Post** — inline comments, a summary, and a check run on the pull request.

Findings carry one of three severities: **Important** (fix before merge), **Nit** (minor), and **Pre-existing** (a real bug the PR did not introduce). That third category matters: without it, unrelated legacy bugs read as the author's fault and erode trust in the reviewer.

Two product behaviors are easy to misread:

- **A review never approves or blocks a pull request.** Merge authority stays with your team; the check run never concludes as a failure.
- **A clean review is not proof of safety.** The documentation says a review with no findings does not mean the code is correct or secure.

If you want CI to gate on review results, parse the machine-readable verdict line deliberately. The docs note that a missing verdict line means *no verdict* — a review that failed, timed out, or was superseded — not zero findings. Treating absence as success turns your gate into a no-op.

## Make approval authority real

Risk tiering only helps if it cannot be gamed. The Claude Code team's rules are a useful reference set:

- **The change sets the tier, not the author.** A classifier reads the change; a second classifier asks whether this specific change still needs a person.
- **Lighter paths are restricted to trusted authors.** Everyone else needs a second approver.
- **A bot's approval never fills a human slot.** Automated review can clear a low-risk change; it cannot substitute for a required person.
- **Whoever prompted the agent is a required reviewer**, as if they had typed the code.
- **An approval covers one commit.** New commits the system cannot vouch for — an agent push, a hand-resolved merge — require re-approval.
- **Some paths always need people.** Sensitive paths and CI workflow files are good examples; enforce them with `CODEOWNERS` and branch protection rather than convention.

These controls live in the repository and CI configuration, not in the prompt. Telling an agent "do not merge high-risk changes" is not a permission boundary. See [Agent harness](/env/agent-harness#separate-discovery-from-purchase-approval) for the same principle applied to paid actions.

## Make review converge

An agent author and an agent reviewer can keep each other busy indefinitely. In one documented CLI pull request, review and fixes ran for more than fifty rounds overnight before the author stopped it. Investigating where the reviewer kept pointing, about 59% of the flagged code had already been present at the reviewer's first pass — it was surfacing more old bugs each round, not new ones.

Fixes that make review converge:

- **Cap rounds.** After about three rounds, stop and reconsider the approach instead of requesting another pass.
- **Re-review only the new diff** after the first few passes.
- **Flag the class of bug**, so every instance is fixed rather than one line.
- **Do not repeat** findings already posted.
- **Dedup across runs** by comparing against open threads.

Track rounds-to-pass alongside recall. A reviewer that finds slightly more while requiring twice the rounds is usually a net loss.

## Measure human time with a safety guardrail

Optimizing only for reviewer minutes invites the obvious failure: the time reappears as incident response. The guardrail makes that trade visible.

The Claude Code team tracks human approvals per PR (median and 95th percentile), human comments, and time a PR waits on a person, with **revert and incident rates as the ceiling**. If reverts rise, saved review time was not saved time.

They also measure reviewer **noise** by observing what authors do with each comment: fixed it, said it was wrong, said the behavior was intentional, or ignored it. They additionally run the reviewer against known-clean PRs to count harmful false alarms. Recall alone is easy to inflate; the response distribution is the honest signal.

## Watch what the reviewer costs, and why

Cloudflare's AI reviewer is a useful cost postmortem: from March to August the average review went from $1.22 to $2.32 with no architectural change, then fell to **$0.77 (−68%)** with a median time of 1m 32s instead of 4m 09s. Roughly 40% of the savings came from code changes and the rest from model and effort choices. The diagnostic half is more transferable than the numbers.

**Spend followed context, not output.** Just before optimizing, the bill split roughly 43% cache writes, 34% cache reads, and 23% output: most money went to context the model had already seen or was about to re-see. A single code-quality session made 16.6 model calls, writing 72k tokens to cache and reading back 1.08M, because every call resends the conversation. A high cache hit rate is not the same as a small bill — the hit rate rose to 97% while tokens per review tripled to 2.99M.

The largest single fix was the least obvious. Every session opens with 11k–21k tokens of tool definitions and agent prompt that are identical across repositories, yet the first request hit cache only 14–26% of the time. The prompt had been assembled as one block with a single cache breakpoint at the end, so the shared prefix was never stored on its own. Splitting the block at a marker, removing repository-specific content ahead of it, and keeping tool descriptions stable lifted first-request hits to 91–99.5%. Prepending the standards reviewer's reference index instead of spending three turns reading it cut its calls from 15.9 to 9.6.

Smaller fixes were each worth cents and compound:

- Remove tools a sub-reviewer cannot use — 57–76% of sessions tried to call the one that posts the final comment, then spent a call recovering.
- Read files in parallel instead of one tool call per turn.
- On re-reviews, skip reviewers with nothing new to look at.
- Stop after posting instead of running a turn to write an unread summary.
- Distinguish "slow" from "broken": a reviewer hitting its time limit was restarted with the same limit.
- Honor cancellation — in a sample of 446 cancelled jobs, 358 ran to completion.

**Then check quality per role, not in aggregate.** Fewer critical findings can mean less noise or more misses, so Cloudflare checked both directions: the share of serious findings authors acted on rose from 34% to 59% (baseline coincidence ~15%), important findings per review stayed flat at 0.28 → 0.30, and inflated severities fell 70% (0.46 → 0.14). But their performance reviewer lost about 64% of important findings at medium effort, so code quality moved to high effort while the others are still being tested. Medium effort genuinely lost real findings for that role.

Two habits to copy: instrument the **first request of every session** for cache hits, and verify that each reviewer still finds real problems at the effort level you pay for. The authors also note their before/after hour-based comparison is not a controlled experiment.

## Turn incidents into a reviewer eval set

This is the most reusable idea in the process: past PRs that caused incidents, with their fix-forwards and reverts, become the reviewer's regression suite. Engineers who know that code confirm each bug and where it lived, and the reviewer runs against the set daily. Any change to the reviewer's prompt, tools, or model gets rescored against all of it.

It is the same discipline as [calibrating an LLM judge](/env/ai-evals#calibrate-the-judge-against-people), applied to a reviewer: keep labeled real failures, include clean cases, and revalidate after every configuration change.

## Keep determinism for the parts that must not drift

Uber's AutoClean is the clearest published example of an agent doing **deletion** work at scale: over 16,000 stale feature flags and more than a million lines of code removed, with diffs routed to humans only after automated correctness checks pass. The split it uses is more instructive than the numbers.

**Deterministic tools do the rewrites; agents do the propagation decisions.** Inlining a rolled-out flag value is mechanical, but then someone must decide whether a parameter can be deleted (requires checking every call site), whether the old branch is now unreachable, and whether a config field is still read elsewhere. AutoClean gives the agent code search and editing, and routes boolean simplification through Uber's PolyglotPiranha engine via MCP. The rationale is blunt: a small error in simplifying a condition silently changes which branch runs in production.

Two more patterns generalize beyond flag cleanup:

- **Scope each fixer to its file class.** CI failures go first to cheap deterministic fixers, then to agentic ones. The test fixer may only edit test files — without that limit, an agent will sometimes make a failing test pass by changing the production code underneath it.
- **Separate validation from the loop that produced the change.** Long tasks with many instructions lose constraints; the agent optimizes for the most immediate signal, which is usually “CI is green”. Uber's **CodeCourt** takes the failure modes observed in practice and turns each into an explicit property checked by its own reviewer agent, in parallel:

  | Property | What it blocks |
  | --- | --- |
  | No additions | Cleanup that introduces new code |
  | Preserves semantics | Behavior that changes observably |
  | No intent drift | Removing unrelated flags “while here” |
  | No agent artifacts | Reasoning comments left in the diff |

  All properties pass → the diff goes to a human for the business decision. Any property fails → the diff is abandoned before a reviewer sees it. Notably, a single end-to-end reviewer agent performed worse than several focused ones.

That last point is the direct link to this page's earlier advice: **verification is cheaper and sharper when each check has one job.** It also explains why the human stays in the loop for the judgment call — whether the flag should be removed at all — rather than for mechanical correctness.

## Tune review instructions in the right file

Two files shape what gets flagged, and they are not interchangeable:

- **`CLAUDE.md`** carries project context — stack, conventions, non-goals. Every review loads it; a change that violates it can become a finding.
- **`REVIEW.md`** carries review-only rules: what severity means in this repository, nit caps, paths to skip, and evidence requirements.

Good instructions are short and behavioral. Useful patterns:

- Redefine **Important** for this repository — a docs repo's "Important" differs from a billing service's.
- **Cap nits** per review so the summary stays actionable.
- Skip generated code, lockfiles, and anything CI already enforces.
- Require **`file:line` evidence** for behavior claims instead of inference from a name.

There is a security property worth understanding: `REVIEW.md` is read from the pull request's **base branch or default branch, never from the PR's own diff**. Otherwise a PR could weaken the rules that judge it. Some instructions — lowering severity, excluding paths, capping nits — only take effect from a root file on a protected default branch, and when protection cannot be confirmed the service may read no `REVIEW.md` at all. Protect the branch before relying on the tuning.

## Adoption checklist

Before the pull request:

- Give the agent checks it can run, listed in a short `CLAUDE.md`, plus hooks for formatters and linters.
- Run `/code-review`, `/security-review`, or a fresh-context subagent review locally.
- Move repeated review comments into `REVIEW.md`.

On every pull request:

- Require CI, and add **Testing**, **Risk**, and **How to revert** to the pull request template.
- Enable an AI reviewer on one repository, tune instructions for a few weeks, then widen.
- Require every review thread resolved before merge.
- Match effort to risk; cap rounds and re-review only new diffs after the first few.

Approval and after:

- Write down risk tiers and start strict; loosen only with evidence.
- Use `CODEOWNERS` and branch protection so sensitive paths always need a person.
- Never let a bot approval replace a required human, and dismiss approvals on new commits.
- Turn incidents and reverts into the reviewer's eval set; measure human time with reverts as the guardrail.

## References

- [meng shao: Cloudflare AI code review cost optimization](https://x.com/shao__meng/status/2113098764324159608) — Folo intake, October 22, 2026
- [Cloudflare: Cutting our inference bill by 68%](https://blog.cloudflare.com/obsessive-inference-optimization/) — token accounting, shared cache prefixes, per-role quality checks

- [meng shao: Uber AutoClean agentic cleanup](https://x.com/shao__meng/status/2112723092468605242) — Folo intake, October 21, 2026
- [Uber: Using AI to Delete Code](https://www.uber.com/us/en/blog/ai-code-cleanup/) — deterministic rewrites via MCP, scoped fixers, CodeCourt properties

- [宝玉: Claude Code team's code review practice](https://x.com/dotey/status/2111384189656252712) — Folo intake, October 17, 2026; points to the team's write-up
- [How the Claude Code team does code review](https://claude.dev/blog/solving-code-review-at-anthropic/) — layers, risk tiers, convergence fixes, reviewer evals, adoption steps
- [Claude Code: Code Review](https://code.claude.com/docs/en/code-review) — four-stage pipeline, review levels, explicit limits
- [Read and request reviews on a pull request](https://code.claude.com/docs/en/code-review-pull-requests) — severity levels, check-run behavior, machine-readable verdict
- [Customize Code Review](https://code.claude.com/docs/en/code-review-customize) — `REVIEW.md` vs `CLAUDE.md`, and which branch the rules are read from
- [Bringing Code Review to Claude Code](https://claude.com/resources/articles/code-review) — vendor-reported preview metrics (16% → 54%, large-PR findings, under 1% judged incorrect)
- [Code Review is now generally available](https://claude.com/resources/articles/code-review-is-now-generally-available) — Quick/Standard/Deep levels and faster reviews
