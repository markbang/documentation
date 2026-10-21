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

## Check the path, conversation, and final state

LangChain's agent-evals guide distinguishes several evaluation scopes. Pick the scope that can actually reveal the failure:

| Scope | Example check | Evidence needed |
| --- | --- | --- |
| Single step | Did the tool receive the requested date? | Tool arguments and current request |
| Final response | Does the confirmation match the booking result? | Final message and tool result |
| Full conversation | Did the final booking reflect a date change made several turns earlier? | Ordered turns grouped by conversation/thread ID |
| Environment state | Does exactly the intended test booking exist? | Records in an isolated test system after the run |

A sequence of individually reasonable turns can still fail the overall task. Conversely, different tool sequences can achieve the same valid result. Assert necessary constraints—such as approval before a write or no duplicate booking—rather than requiring one exact trajectory unless that sequence is itself a requirement.

For state-changing tasks, start every evaluation from a clean, known fixture and inspect the state afterward. A coding task can be scored with the repository's tests and the resulting diff instead of the agent's “done” message. Keep the trusted grading checks outside the agent's editable work products, and do not let success depend only on tests the agent wrote or changed itself.

Containers are one way to isolate such tasks, not the definition of every benchmark and not a complete security boundary by themselves. Limit credentials, network access, mounts, and run time to what the test needs. Record the fixture version, tool configuration, grading result, and trace. Repeat stochastic cases when needed and report passes over attempts; record infrastructure errors and timeouts separately rather than silently excluding them or counting them as success.

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

## Do not inherit a decision model's default threshold

Decision models — TypeSafe's Jev, Perplexity's Decider, Liquid's d1, Cloudflare's Clef, OpenAI's Decisions API — are an appealing cheap alternative to an LLM judge. They return a **probability** that a trace contains a failure, and their APIs turn that into a verdict using a default threshold of `0.5`. Hamel Husain's experiment with 98 human-labeled production traces shows why that default deserves skepticism.

Consider a model that scores every failing trace `0.40` and every passing trace `0.10`. It is a perfect classifier at a `0.30` threshold — and at `0.50` it catches nothing. Real score distributions overlap, so threshold choice is a precision/recall trade-off, and the right point follows from consequences: an alerting system that must avoid false alarms is not a cancer screening.

A working procedure, which costs nothing extra once scores are saved:

1. **Set minimums first.** Require floor precision and recall for the task (Hamel's example: both ≥ 80%). Any model that cannot meet them is out, regardless of its average score.
2. **Tune on training folds, measure on held-out folds.** Use stratified cross-validation with identical splits across models, and pick the threshold on the training portion only. Select an objective that matches the business — F-beta if precision and recall are not equally costly.
3. **Compare cost and performance.** On this small sample the cheapest candidate ran about 0.82 cents per 100 evaluations at F1 0.79; the strongest ran 3.72 cents at F1 0.87. Three points is an illustration, not a benchmark.
4. **Check calibration before treating a score as confidence.** A `0.8` should mean roughly 80% of similar traces fail. Some models were badly miscalibrated — one batch averaged 8% predicted probability while 60% actually failed. Platt scaling fixed several models; for one it made the Brier score slightly worse (0.159 → 0.164), and fitting directly on probabilities instead gave 0.154. Method choice matters, so measure after calibrating.
5. **Re-tune after any prompt change.** Threshold and calibration are properties of the prompt–model pair, not the model alone.

Two scope notes. The experiment deliberately used a broad “any substantive issue” task to separate models; for production, keep **one judge per failure mode**, which usually compresses the gaps between models. And a cheap prompt improvement — replacing a vague instruction with an explicit list of failure types — moved F1 from 0.78 to 0.80, which is worth trying before reaching for calibration machinery.

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

- [meng shao: using decision models for evals](https://x.com/shao__meng/status/2112720094287786298) — Folo intake, October 21, 2026
- [Hamel Husain: How To Use Decision Models For Evals](https://hamel.dev/blog/posts/decision-model-evals/) — threshold tuning, cost/performance, calibration, prompt scope

- [meng shao: Common agent-eval questions](https://x.com/shao__meng/status/2110585984564039900) — Folo intake, October 15, 2026
- [LangChain: The Most Common Questions About Agent Evals, Answered](https://www.langchain.com/blog/common-questions-about-agent-evals) — step, conversation, trajectory, and environment-state evaluation

- [meng shao: Pocket Guide to AI Evals](https://x.com/shao__meng/status/2109445747133579381) — Folo intake, October 12, 2026; points to Hamel's original cards
- [Hamel Husain: Evals flashcards](https://hamel.dev/notes/llm/evals/flashcards/) — especially error analysis, judge validation, trace-based cases, and deployment
- [Hamel Husain: AI Evals FAQ](https://hamel.dev/blog/posts/evals-faq/) — sampling, evaluator selection, calibration, and multi-turn debugging
- [Hamel Husain: Your AI Product Needs Evals](https://hamel.dev/blog/posts/evals/) — scoped tests and human review as the foundation
- [OpenAI: Evaluation best practices](https://platform.openai.com/docs/guides/evaluation-best-practices) — task-specific evals, human calibration, edge cases, and continuous evaluation
