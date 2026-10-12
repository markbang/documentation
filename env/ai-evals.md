---
title: "AI product evals"
description: "Build task-specific AI evaluations from real traces: discover failures, create minimal regression cases, calibrate LLM judges, and separate CI, monitoring, and guardrails."
icon: "clipboard-check"
---

# AI product evals

A model benchmark helps you choose a starting model. A **product eval** checks whether your actual application meets a user's goal, including its prompts, retrieval, tools, permissions, and application code. A fluent answer is not evidence that the requested action succeeded.

This workflow synthesizes Hamel Husain's evals flashcards and FAQ with OpenAI's evaluation guidance. It complements [Agent harness](/env/agent-harness): the harness controls execution; evals provide evidence about its behavior.

## Start with failures, not a dashboard

A **trace** records the path from a user request to its outcome: messages, retrieved context, tool arguments and results, and relevant state changes. For multi-agent work, preserve a shared trace ID and the source and ordering of events.

1. **Collect diverse traces.** Mix random samples with different workflows, negative feedback, retries, and unusually slow runs. Keep some random sampling even after you know which failures to search for.
2. **Write open-ended notes first.** Have someone who understands the product inspect examples before an automated reviewer suggests labels. Record what went wrong for the user, including ordinary code or design bugs, not just model errors.
3. **Group recurring failures.** Turn notes into specific categories such as “booked an unavailable slot” or “claimed success after a tool failed.” Then label pass/fail for each relevant criterion and retain the evidence.
4. **Prioritize and repeat.** Consider frequency, impact, and remediation cost. Continue until new reviews stop revealing or changing failure categories; revisit after meaningful product changes.

Hamel suggests a pool of roughly 100 diverse traces, with an initial manual pass. Treat this as a starting heuristic, not a statistical guarantee or a reason to delay starting with a smaller batch.

**Discovery and measurement need different samples.** A batch selected for retries helps find problems, but its failure rate is not the production failure rate. Keep the sampling method with the results; use representative sampling or an explicit weighting scheme for prevalence estimates. Redact secrets and unnecessary personal data before sharing traces or sending them to an external judge.

## Turn an observed failure into a regression case

For a long conversation, locate the first upstream failure before counting its downstream consequences as separate problems. Preserve the full trace for investigation, then minimize the reproduction.

Consider an illustrative scheduling agent:

```text
User: Book the 10:00 slot.
Tool result: 10:00 is unavailable.
Agent: Calls the booking tool for 10:00 anyway.  <-- first failure
Agent: Says the appointment is confirmed.
```

The smallest useful test may only need the request and the availability result. In **N-1 testing**, replay the valid conversation prefix before the failing step and evaluate what the system does next. Keep the expected behavior outside the input; do not feed the original failed answer or its label back to the system under test.

A practical test record can include:

| Field | Purpose |
| --- | --- |
| `case_id`, `source_trace_id` | Link the regression to its original evidence |
| `input_prefix`, `tool_fixtures` | Reproduce the relevant conversation and tool state |
| `criterion`, `expected_behavior` | Define one behavior, not a vague quality score |
| `app_version`, `prompt_version`, `model` | Identify what was evaluated |
| `rubric_version`, `judge_version` | Identify how it was graded |
| `result`, `evidence` | Preserve the outcome and supporting tool event or text |

Run replay tests in a sandbox with mocked tools or isolated test accounts, never against live booking, payment, or deletion endpoints. If the workflow or tool schema changes substantially, rebuild stale fixtures. Keep end-to-end tests too: passing an isolated next-step test does not prove the whole session succeeds.

## Use the cheapest trustworthy check

| Failure to detect | Start with | What to verify |
| --- | --- | --- |
| Invalid output schema or missing field | Code assertion | Parse and validate the actual output |
| Wrong tool argument or unauthorized action | Code assertion and runtime permission check | Inspect the arguments, identity, and state at the action boundary |
| Success claim unsupported by tool results | Human review, then a calibrated LLM judge when needed | Compare the final message with the relevant execution evidence |
| Poor overall user experience | Human review and product experiments | Identify the specific failure before automating it |

Fix obvious prompt omissions and ordinary bugs first. Add cheap regression tests where useful; invest in an LLM judge when an important semantic failure needs repeated measurement. **Do not wait for a real incident to test known safety requirements**, such as authorization or irreversible actions.

Prefer a narrow pass/fail criterion over an undefined “quality: 4/5.” For the scheduling example, separate “did not book an unavailable slot” from “did not claim an unconfirmed booking succeeded.” Each needs different evidence. Numeric scores or pairwise comparisons can still be useful when their meaning is explicit and validated; binary labels are a practical default, not a universal law.

A semantic grader can return a small structured result such as:

```json
{
  "criterion": "no_false_confirmation",
  "verdict": "fail",
  "evidence": "The booking tool returned a conflict, but the final message said confirmed."
}
```

This is an illustrative format, not a vendor API. Make it possible for a human to check the cited event. Missing evidence or a grader timeout is an evaluation error requiring review, not an automatic pass.

## Calibrate the judge against people

A second model's opinion is not ground truth. Build a human-labeled set containing both passes and failures for the same criterion, and resolve unclear definitions before tuning the judge.

Separate examples by purpose:

- **Train/examples:** choose few-shot examples for the judge prompt.
- **Development:** revise the rubric and inspect disagreements.
- **Held-out test:** check generalization without tuning on these labels. Keep related traces and paraphrases together so they do not leak across splits.

There is no universal split ratio or acceptable score. Hamel's card shows an example split, while the FAQ emphasizes choosing targets from the costs of missed failures and false alarms.

Define the positive class explicitly. Here, **positive means an actual failure**:

- **TPR / failure recall** = `TP / (TP + FN)`: how many human-labeled failures the judge catches.
- **TNR / specificity** = `TN / (TN + FP)`: how many human-labeled passes the judge correctly leaves unflagged.

If 95 of 100 cases pass, a judge that always says “pass” has 95% accuracy but **0% failure recall**. Report both rates and their sample counts; if a class has no examples, its rate is undefined, not 100%. Small samples leave substantial uncertainty.

Recheck agreement after changing the judge model, rubric, or application distribution. Review false alarms and missed failures rather than merely optimizing the aggregate score. Keep the application model/prompt and the grader configuration versioned so score changes remain interpretable.

## Separate regression tests, monitoring, and guardrails

| Placement | Data and timing | Purpose | Response to failure |
| --- | --- | --- | --- |
| CI / pre-release | Curated regression cases before merge or release | Catch known regressions | Block changes according to explicit acceptance criteria |
| Production monitoring | Sampled real traces, usually asynchronous | Discover new failures and track drift | Alert, investigate, and add cases |
| Runtime guardrails | Checks on each protected request or action, synchronously | Prevent a specified harmful action or response | Block, request approval, or use a safe fallback |

A check after the response can discover a bad purchase; it cannot prevent that purchase. Enforce permissions **before the side effect**, outside the model. Guardrails also need latency and false-alarm budgets. Do not retry payments or other writes blindly when a check fails; see [purchase approval boundaries](/env/agent-harness#separate-discovery-from-purchase-approval).

CI pass rates are not estimates of user satisfaction: regression suites deliberately overrepresent known failures. Likewise, a green suite proves only what it covers. Keep adding independently reviewed production failures and deliberate edge cases, and rerun relevant evals when code, prompts, models, retrieval, or tools change.

## A minimal starting checklist

- Review a small, diverse batch with a product/domain expert.
- Name one important failure and retain its trace evidence.
- Reproduce it with a minimal safe fixture and a clear assertion or rubric.
- Validate any automated judge against both human-labeled passes and failures.
- Compare the current and candidate systems on the same versioned cases.
- Assign an owner for failures and feed new production cases back into the suite.

## References

- [meng shao: Pocket Guide to AI Evals](https://x.com/shao__meng/status/2109445747133579381) — Folo intake, October 12, 2026; points to Hamel's original cards
- [Hamel Husain: Evals flashcards](https://hamel.dev/notes/llm/evals/flashcards/) — especially error analysis, judge validation, trace-based cases, and deployment
- [Hamel Husain: AI Evals FAQ](https://hamel.dev/blog/posts/evals-faq/) — sampling, evaluator selection, calibration, and multi-turn debugging
- [Hamel Husain: Your AI Product Needs Evals](https://hamel.dev/blog/posts/evals/) — scoped tests and human review as the foundation
- [OpenAI: Evaluation best practices](https://platform.openai.com/docs/guides/evaluation-best-practices) — task-specific evals, human calibration, edge cases, and continuous evaluation
