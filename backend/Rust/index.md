---
title: "Rust"
description: "Rust backend development hub covering Axum IM bridges with Tokio async runtime, Tauri desktop shells, and a learning path from ownership to web services."
icon: "rust"
---

# Rust

Rust combines memory safety, zero-cost abstractions, and fearless concurrency. In my projects, Rust serves two roles: high-performance backend services (Axum) and native desktop shells (Tauri).

<CardGroup cols={2}>
<Card title="AgentIM" icon="terminal" href="/backend/Rust/agentim">
Multi-channel IM bridge — Axum, Tokio, 8+ platforms.
</Card>
<Card title="Tauri Desktop" icon="laptop-code" href="/software/tauri">
Cross-platform desktop shell — Rust + web frontend.
</Card>
</CardGroup>

## Learning Path

1. **Basics** — Ownership, borrowing, lifetimes, traits
2. **Async** — Tokio runtime, futures, channels
3. **Web** — Axum routing, middleware, extractors
4. **Systems** — FFI, unsafe, embedded patterns

## Why Rust for IM Bridges?

- **Zero garbage-collection pauses** — IM messages need predictable latency
- **Fearless concurrency** — Tokio + DashMap handle thousands of simultaneous connections
- **Small binary** — AgentIM compiles to ~5MB, vs 50MB+ for Node.js equivalents
- **Memory safety** — No segfaults in production