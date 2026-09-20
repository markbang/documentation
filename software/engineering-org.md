---
title: "Engineering team organization"
description: "Lessons from ByteDance and Meituan on organizational design, hiring philosophy, and team building — contrasting Google-style elite throughput with Amazon-style operational precision."
icon: "users"
---

# Engineering team organization

In a 2026 podcast (42章经 × 魏小康), a former hiring leader who worked at both ByteDance (2017–2020, through Douyin's explosive growth) and Meituan (2020–2024, as hiring lead and AI product manager) shared hard-won lessons on how two of China's most successful tech companies build and run engineering organizations.

## Two organizational philosophies

ByteDance and Meituan represent fundamentally different models:

| | ByteDance | Meituan |
| --- | --- | --- |
| **Model** | Google-style: elite talent, high autonomy, "move fast" | Amazon-style:精密协作, operational excellence, "do the hard work" |
| **Strength** | Innovation speed, individual impact | System reliability, scalable execution |
| **Weakness** | Coordination overhead at scale | Slower to pivot |

The key insight: neither model is universally better. The right choice depends on what you are building. AI application-layer products that require heavy delivery and integration follow the Meituan pattern: "You have to make it hard, tiring, and heavy."

## Hiring principles

### 721: battlefield as training ground

Meituan's philosophy on talent development:

- **70%** — learning by fighting real battles (giving people meaningful ownership)
- **20%** — learning from skilled practitioners (apprenticeship)
- **10%** — formal training

> "The most important thing is to give people a battlefield. Good people will fight their way out on their own."

This is not "we don't train people." It is "the battlefield *is* the training."

### Hire elite, pay premium

ByteDance's salary strategy: market rate 100, typical job-hop offer 120–130. ByteDance offered 140–150 plus overtime. Pinduoduo went further at 170–180 plus six-day weeks.

The logic: "Hiring one top person to solve a business problem costs less than hiring a bunch of people." From an hourly-rate perspective, the premium is justified.

### Expand supply through networks, not headhunters

Startups lack brand influence. The primary hiring channel is warm referrals from trusted people. Treat your best people as a CRM pipeline — the podcast host spent two and a half years meeting a target executive every three months, starting from the day the person joined a competitor, before finally hiring them.

> "If there's a competent person around you, go get all the competent people around *them*."

Reverse-network hiring: don't just recruit one person. Recruit their entire circle.

### Today is the cheapest day to hire

> "Every day after today will be harder to hire. Whatever you pay today is a bargain. It's not 'too expensive now' — it's 'more expensive later.'"

Talent supply-demand tension is structural and worsening. Early investment in hiring compounds.

## Communication overhead

> "Ten people will get at least 10% of the information wrong."

Three people working on the same thing already understand it differently. Ten people, and everyone gives a different answer about what the company is doing. ByteDance spent significant time clarifying OKRs — not as bureaucracy, but as loss prevention.

## Culture = founder behavior

> "Startups don't need to 'build culture.' All top companies have essentially the same culture. The founder's way of working *is* the company's way of working. Just shape a good atmosphere."

Culture is not a document or a workshop. It is what the founder does every day, observed and replicated.

## AI-era organizational shifts

The podcast noted early signals of change:

- AI application layers demand operational depth over pure model intelligence
- Delivery and integration work cannot be fully automated away
- Teams that combine domain expertise with AI tooling will have an edge over pure AI-native startups without industry knowledge

A complementary view (August 2026): coding execution is being industrialized, but programmer value does not automatically disappear or move up the stack. The new dividing line is about:

1. **Who can define problems worth solving**
2. **Who can turn organizational knowledge into machine-usable context**
3. **Who can constrain high-speed execution with independent verification**
4. **Who takes responsibility for the results that enter the real world**

Execution speed is becoming commoditized. What stays scarce is problem definition, context engineering, verification discipline, and accountability.

OpenAI's September 2026 internal view on research acceleration adds a concrete data point. They model AI research as six stages — **Decide → Design → Build → Run → Analyze → Communicate** — and found that coding-agent usage grew across all six, but grew *least* in **Decide** (research direction) and **Design** (decisions). Daily median usage hit $600 and P90 hit $7,000.

The interpretation: agents are excellent at execution, debugging, and experiments, but research direction and key decisions still need human input. This matches the "research intern" analogy — AI is increasingly the executor, while humans own direction and accountability. The org implication is the same as above: invest in the people who define problems, not just those who execute them.

Databricks CEO Ali Ghodsi gave the enterprise version of the same judgment in a September 2026 podcast: most companies use AI as a glorified search plus code writing, and the bottleneck is not model intelligence but missing **organizational context** — the model has never sat in a meeting, does not know how decisions got made, and lacks what veteran employees carry in their heads. His answer is an Ontology: digitize the organization's concepts, goals, departments, people, and projects into one graph.

The analogy is sharp: agents calling MCP servers one at a time is like Google indexing nothing and crawling ten pages live per query — expensive, slow, low quality. An Ontology is the enterprise equivalent of offline-computed PageRank, only much harder, because of permissions, access control, and heterogeneous objects. Thorsten Ball's parallel take is more radical: once model output exceeds human review capacity, code review, unit tests, and terminals lose their foundation, and most bugs will no longer be coding bugs but "asked for the wrong thing" bugs. The two converge: **the bottleneck is moving from writing code to defining problems and structuring organizational knowledge.**

## References

- [42章经 × 魏小康 播客笔记](https://x.com/dotey/status/2072149043757637916) — 宝玉的详细笔记（原始推文 by [yan5xu](https://x.com/yan5xu/status/2072146139999264940)）
- [Databricks CEO on AI risk and enterprise ontology](https://x.com/shao__meng/status/2101493948917456960) — 组织上下文是企业 AI 落地的真正瓶颈，Ontology 是离线计算的 PageRank
- [Thorsten Ball: predictions](https://x.com/shao__meng/status/2101476906629841156) — 瓶颈从写代码转移到定义问题
