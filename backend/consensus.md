---
title: "Consensus under network jitter"
description: "Separate safety from liveness, tune failure detection, and evaluate optional leaders and hedging through Cloudflare's QuePaxa case study."
icon: "network-wired"
---

# Consensus under network jitter

A replicated log can preserve every committed entry while becoming unusable for writes. When choosing a consensus system, evaluate **safety** (replicas never decide conflicting values) separately from **liveness** (requests eventually make progress under the protocol's assumptions).

Cloudflare's experimental Meerkat control-plane service provides a useful case study: its replicas span continents, so latency spikes and partial connectivity are central design constraints. Cloudflare chose QuePaxa, a randomized consensus protocol, to reduce dependence on a healthy leader and accurate failure detection. This is a design comparison, not a recommendation to replace a mature Raft deployment.

## A timeout is a suspicion

A replica observes missing messages, not the remote process itself. A delayed heartbeat can mean a crashed process, network congestion, a broken path, a process pause, or slow storage. In an asynchronous network, waiting for a fixed interval cannot establish which occurred.

Raft uses randomized election timeouts to reduce split votes. Its safety does not depend on precise timing; availability depends on timing being good enough for a stable leader to communicate. If timeouts are too short, transient delays can trigger unnecessary elections. Increasing them reduces false suspicions but increases the wait after a real leader failure.

For etcd, the official tuning guide recommends setting the heartbeat interval around the average member round-trip time and the election timeout at least ten times that RTT. These are etcd tuning guidelines, not universal constants for consensus protocols. Disk latency also matters: slow log persistence can delay heartbeats and contribute to leader loss.

## Make leadership an optimization

Cloudflare describes three differences in QuePaxa:

| Mechanism | Purpose | Cost or boundary |
| --- | --- | --- |
| Optional leader | A favored proposer can decide in one round trip on the fast path; other proposers can progress without it | Losing the fast path requires more communication |
| Random priorities and proposal adoption | Concurrent proposers help propagate higher-priority proposals rather than repeatedly preempting one another | Randomization changes termination reasoning; it does not provide a fixed completion deadline |
| Hedged proposals | Start additional proposers after a local delay without first declaring the leader dead | More messages, contention, and potentially more rounds |

The important distinction is **failure-detection timeout versus hedge delay**. An election timeout triggers a leadership transition. A hedge delay starts additional work. A premature hedge can waste bandwidth, but does not require the system to agree that the leader has failed before another proposer starts.

Cloudflare moved the hedge delay to clients in its implementation to reduce messages; this differs from the paper's placement. Keep protocol properties separate from implementation choices.

## Keep the quorum boundary

An optional leader does not eliminate the need for communication. In Cloudflare's explanation, proposers advance through phases after replies from a majority of recorders. Majority intersection helps preserve agreement: two majorities share at least one recorder. This is one ingredient of the protocol's safety argument, not a sufficient recipe for implementing consensus.

A partitioned minority cannot independently commit an alternative log. Randomization also does not make a permanently unreachable majority reachable. Describe progress together with the assumed failure model and message delivery conditions; avoid promises that the system “never stalls.”

## Evaluate the deployment you will run

Use these as an evaluation plan derived from the case study and etcd's operational guidance:

1. **Measure the paths between members.** Include tail latency, asymmetric reachability, loss, storage stalls, and process pauses. Client-to-service latency alone does not describe quorum communication.
2. **Test both failure and recovery.** Crash the leader, delay it without crashing it, interrupt one direction of a link, then restore connectivity. Measure how long useful progress takes to recover after the original fault ends.
3. **Measure degraded service.** Record successful decisions per second, p99 commit latency, election or round counts, and bandwidth. A protocol can remain live while missing the application's latency target.
4. **Verify restart semantics.** Cloudflare says its work extends the original crash-stop design to crash recovery. Check durable state, replay, and restart behavior rather than treating a crash-stop proof as proof for recovering processes.
5. **Weigh implementation maturity.** Meerkat is experimental. Cloudflare describes formal verification, simulation, and fault injection as part of its validation work; the article is not a completed correctness proof or an independent benchmark.

Start with the supported topology and tuning guidance of a mature system. Consider a different protocol when measured network conditions and failure-recovery behavior justify the additional implementation and verification work.

## References

- [Cloudflare: Choosing QuePaxa, an unusual consensus algorithm](https://blog.cloudflare.com/choosing-quepaxa/) — Folo intake, November 11, 2026; entry `1373447159742984192`; source for the QuePaxa mechanisms and implementation boundaries above.
- [Cloudflare: Meerkat introduction](https://blog.cloudflare.com/meerkat-introduction/) — experimental global control-plane context.
- [In Search of an Understandable Consensus Algorithm](https://raft.github.io/raft.pdf) — Raft safety, randomized elections, and timing requirements for availability.
- [etcd v3.6: Tuning](https://etcd.io/docs/v3.6/tuning/) — RTT-based timeout guidance and storage-related latency.
- [QuePaxa paper, SOSP 2023](https://dl.acm.org/doi/10.1145/3600006.3613150) — paper linked by Cloudflare. The publisher returned HTTP 403 during this review; its full text was not independently inspected.
