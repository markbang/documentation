---
title: "Git at agent scale"
description: "How Git stores and transfers history with objects, refs, and packfiles, why many concurrent agents strain a Git server, the trade-offs behind OpenAI's Pando backend, and what you can do on the client side today."
icon: "code-merge"
---

# Git at agent scale

Coding agents multiply Git traffic. One engineer can have several changes in CI at once, every push can start several jobs that fetch the same commit, and every agent sandbox needs a checkout. In late 2025, OpenAI's monorepo servers started falling behind: fetches and pushes slowed down, merges failed, and reliability at times dropped below 90%.

OpenAI's answer was **Pando**, a new Git-compatible backend. This page uses that design to explain how Git moves data and where a Git server becomes the bottleneck. It ends with what you can do on the client side without building your own backend.

## How Git stores history

A repository keeps two things in sync: **objects** and **refs**.

- **Objects** are content-addressed and immutable. A **blob** holds one file's content, a **tree** maps names to blobs and other trees, a **commit** points to a root tree and its parent commits, and a **tag** names an object. Changing one file creates a new blob and new trees up to the root. Unchanged files and directories reuse existing objects.
- **Refs** are names that point to commits, such as `refs/heads/main`. A commit on a branch creates a new commit object and moves the ref.
- Objects are stored **loose** (one file each) or in a **packfile**, where similar objects can be stored as deltas of each other.

You can see each layer locally:

```bash
git cat-file -p HEAD              # commit: tree, parents, author
git cat-file -p 'HEAD^{tree}'     # tree: names -> blob/tree IDs
git count-objects -v              # loose vs packed objects
git ls-remote origin | wc -l      # how many refs the server advertises
```

## How fetch and push move data

- **Fetch.** The client says which commits it **wants** and which it already **has**. The server walks everything reachable from the wanted commits, removes what the client already has, and sends the rest as a packfile. A full clone has nothing, so it receives everything reachable.
- **Push.** The server advertises its refs. The client leaves out objects the server already has and sends a pack that **depends on** existing server objects, so the pack alone isn't enough to rebuild the history.
- **Ref updates race.** Two pushes may try to move the same branch from the same old commit to different new ones. The server must accept one and reject the other.

That gives a Git server two kinds of load: **many writers** pushing to different branches, and **many readers** fetching the same history. Agents increase both at once.

## Three ways to scale a Git server

| Design | How writes are ordered | Where it struggles |
| --- | --- | --- |
| **Replicas with three-phase commit** | Each push is copied to every replica, and a majority must agree on each ref update | Replica disks and network round trips sit on every push; writes slow down under load |
| **Shared write-ahead log in blob storage** | Packs upload in parallel, but every ref update appends to one manifest with compare-and-swap | All pushes compete for the same manifest; replicas must read and index new packs before they can serve them, so readers wait |
| **Pando: per-ref ordering** | Each branch is updated independently; packs are stored once and reused | Gives up a consistent point-in-time view of all refs |

Both conventional designs keep a **repository-wide order** of writes. That is what makes pushes to unrelated branches wait on each other.

## What Pando changed

Pando keeps the Git protocol and the Git client, so engineers and agents didn't change how they work. It relaxes two assumptions most Git servers make:

1. **No repository-wide snapshot.** Pando uses **causal consistency** per ref. A reader fetching a branch gets the history it needs for that revision, but a reader looking at several branches may see them at different moments. In practice, users and agents depend on the order of updates to one branch, not on a global order.
2. **No unique pack per client.** Generating a custom pack for every fetch costs CPU and disk. Pando serves stored packs again, even if a client downloads a few objects it already has.

How a push and a fetch work:

- **Push.** Pando streams the incoming pack to blob storage and validates it in one pass, without unpacking it into a local repository. A multi-key transaction then records a **ref version** (new tip, the pack that supplied it, earlier versions it depends on) and moves the ref pointer, so the pusher can immediately read its own write. This takes a constant number of metadata operations.
- **Fetch.** Pando picks the stored packs the client needs based on what it already has, with metadata reads that grow with the logarithm of the distance between the two versions. It returns pack URLs, and the client downloads them from regional caches.
- **Advertise only trunk.** On a push to a new branch, Pando advertises just the trunk branch instead of every ref. With millions of branches, a full ref advertisement alone can exceed 100 MiB. Advertising only trunk also makes the pushed pack reusable: any reader that has trunk can fetch the branch with that one pack. The cost is that repeated pushes to the same branch, or stacked branches, resend objects outside trunk. In OpenAI's monorepo, the median pack was still under 20 KiB and the 99th percentile under 3 MiB.

Because servers mostly negotiate and pick packs, they run on commodity hardware, and capacity grows by adding servers and scaling the metadata and blob stores. OpenAI reports that median push latency dropped by nearly 5× and that Pando serves close to a petabyte of Git data per day.

<Note>
Pando is internal to OpenAI. The public repository is OpenAI's build of the Git client, not the backend. The numbers come from OpenAI's post, with no published baseline or hardware details.
</Note>

## Durable lessons

- **Decide which consistency you really need.** A global snapshot of all refs is expensive, and most workflows only rely on ordering within one branch.
- **Measure push-to-fetch latency:** the time from one agent's push until another agent or a CI job can fetch that commit. That is the number agent collaboration waits on.
- **Make reads cacheable.** Serving the same bytes to many readers beats computing an optimal response for each one.
- **Keep the protocol, replace the backend.** Staying Git-compatible meant no migration for people, agents, or tools.

## What you can do today

Most teams will hit client-side limits long before they need a new server. Reduce what each agent and CI job downloads:

- **Blobless partial clone.** `git clone --filter=blob:none <url>` downloads commits and trees, and fetches file contents only when a checkout needs them.
- **Sparse checkout.** `git sparse-checkout set <dir>...` keeps only the directories an agent needs in its working tree.
- **Scalar.** `scalar clone <url>` sets up a large-repository profile in one step: it clones only commits and trees, enables sparse checkout, registers background maintenance, and applies recommended config. Run `scalar register` on an existing clone.
- **Shared object store for parallel agents.** Give each agent a [Git worktree](/env/git-worktree) instead of a separate clone, so objects are fetched once.
- **Shallow CI checkouts.** Keep `actions/checkout`'s default `fetch-depth: 1` unless a job needs history; see [GitHub Actions](/env/github-workflow).

## References

- [Folo source: OpenAI News, Scaling Git at OpenAI](https://openai.com/index/scaling-git-at-openai)
- [The New Stack: OpenAI built itself a new Git backend, too](https://thenewstack.io/openai-pando-git-backend/)
- [Git docs: partial clone](https://git-scm.com/docs/partial-clone)
- [Git docs: git-sparse-checkout](https://git-scm.com/docs/git-sparse-checkout)
- [Git docs: scalar](https://git-scm.com/docs/scalar)
- [Pro Git: Git internals, Git objects](https://git-scm.com/book/en/v2/Git-Internals-Git-Objects)
- [Pro Git: Transfer protocols](https://git-scm.com/book/en/v2/Git-Internals-Transfer-Protocols)
