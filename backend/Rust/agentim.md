---
title: "Rust IM Bridge (AgentIM)"
description: "Multi-channel IM bridge built in Rust — connecting Telegram, Discord, Feishu, Slack, DingTalk, LINE, QQ, and WeChat Work to AI agent backends."
icon: "rust"
---

# AgentIM — Rust Multi-Channel IM Bridge

AgentIM is a Rust bridge that connects chat platforms to a local AI agent backend (Codex). It supports 8+ platforms through webhooks and long polling, with session persistence, context limits, and routing rules.

<Card title="AgentIM" icon="terminal" href="https://github.com/markbang/agentim">
Rust IM bridge — 8+ platforms, session persistence, health endpoints.
</Card>

## Supported Platforms

| Platform | Delivery | Verification |
|----------|----------|-------------|
| Telegram | Long polling (`getUpdates`) | Bot token |
| Discord | `POST /discord` | Ed25519 |
| Feishu/Lark | `POST /feishu` | Verification token + URL challenge |
| Slack | `POST /slack` | HMAC-SHA256 |
| DingTalk | `POST /dingtalk` | HMAC-SHA256 |
| LINE | `POST /line` | HMAC-SHA256 |
| QQ | `POST /qq` | — |
| WeChat Work | `POST /wechatwork` | — |

## Tech Stack

| Component | Technology | Purpose |
|-----------|-----------|---------|
| HTTP server | Axum 0.7 | Routing, middleware, webhooks |
| Async runtime | Tokio (full features) | Async I/O, timers, channels |
| HTTP client | Reqwest | Outbound API calls |
| Concurrency | DashMap | Lock-free concurrent state |
| CLI | Clap 4 | Command-line argument parsing |
| Logging | Tracing + Tracing-subscriber | Structured logging |
| Serialization | Serde + Serde_json | JSON codec |
| Error handling | Anyhow + Thiserror | Ergonomic error types |
| Auth | HMAC | Webhook signature verification |

## Architecture

```text
┌─────────┐  ┌─────────┐  ┌─────────┐
│Telegram  │  │Discord  │  │Feishu   │  ...more platforms
└───┬─────┘  └───┬─────┘  └───┬─────┘
    │            │            │
    ▼            ▼            ▼
┌───────────────────────────────────┐
│         AgentIM (Axum)            │
│  ┌──────────┐ ┌────────────────┐  │
│  │Ingress   │ │Session Store   │  │
│  │(webhooks │ │(DashMap)       │  │
│  │+polling) │ │                │  │
│  └──────────┘ └────────────────┘  │
│  ┌──────────┐ ┌────────────────┐  │
│  │Router    │ │Context Trimmer │  │
│  │(rules)   │ │                │  │
│  └──────────┘ └────────────────┘  │
└───────────┬───────────────────────┘
            │
            ▼
┌───────────────────┐
│   Codex Backend   │
│   (app-server)    │
└───────────────────┘
```

## Key Design Patterns

### Platform Abstraction

Each platform handler implements a common trait:

```rust
#[async_trait]
pub trait PlatformHandler: Send + Sync {
    async fn handle_inbound(&self, msg: InboundMessage) -> Result<()>;
    async fn send_response(&self, target: ReplyTarget, text: &str) -> Result<()>;
}
```

This lets you add new platforms without touching the core routing logic.

### Session Persistence

User sessions are stored in `DashMap` — a lock-free concurrent hashmap:

```rust
use dashmap::DashMap;

pub struct SessionStore {
    sessions: DashMap<String, Session>,
}

pub struct Session {
    pub user_id: String,
    pub platform: Platform,
    pub history: Vec<Message>,
    pub created_at: DateTime<Utc>,
}
```

<Note>
DashMap provides sharded locks internally, so concurrent reads/writes from multiple Tokio tasks don't block each other. Much faster than `Mutex<HashMap>` for IM workloads.
</Note>

### Context Trimming

Chat history grows over time. AgentIM trims context to stay within token limits:

```rust
pub fn trim_context(history: &mut Vec<Message>, max_tokens: usize) {
    // Keep the most recent messages that fit within max_tokens
    let mut token_count = 0;
    let cutoff = history.iter().rev().position(|msg| {
        token_count += estimate_tokens(&msg.text);
        token_count > max_tokens
    }).unwrap_or(history.len());

    history.drain(0..cutoff);
}
```

### Webhook Signature Verification

Each platform has its own signature scheme. AgentIM validates before processing:

```rust
// Discord: Ed25519
pub fn verify_discord_signature(body: &[u8], signature: &str, timestamp: &str, public_key: &str) -> bool {
    let message = format!("{}{}", timestamp, body);
    ed25519_verify(message.as_bytes(), signature, public_key)
}

// Slack / DingTalk: HMAC-SHA256
pub fn verify_hmac_signature(body: &[u8], signature: &str, secret: &str) -> bool {
    let expected = hmac_sha256(body, secret);
    signature == expected
}
```

### Routing Rules

Channel-based routing lets you direct messages to different behaviors:

```rust
pub struct RoutingRule {
    pub channel_pattern: String, // Regex
    pub user_pattern: Option<String>,
    pub target: ReplyTarget,
}

// Example: route all #help channel messages to a FAQ bot
// Example: route DMs from specific users to a custom agent
```

## Docker Deployment

```yaml
# docker-compose.yml
services:
  agentim:
    build: .
    ports:
      - "8080:8080"
    environment:
      - TELEGRAM_BOT_TOKEN=${TELEGRAM_BOT_TOKEN}
      - DISCORD_PUBLIC_KEY=${DISCORD_PUBLIC_KEY}
      - CODEX_API_URL=http://codex:3002
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8080/health"]
      interval: 30s
```

## Health Endpoints

```rust
// /health — service status
// /ready   — can process requests
// /review  — pending human-review items (optional)
```

## Best Practices

1. **Platform trait abstraction** — Common interface per platform, easy to add new ones
2. **DashMap for concurrent state** — Lock-free, fast for multi-platform message handling
3. **Context trimming** — Keep history within token limits to avoid runaway memory
4. **Webhook signature verification** — Always validate before trusting inbound messages
5. **Health + readiness endpoints** — Let orchestrators (Docker, K8s) monitor service state
6. **Shared-secret auth** — Simple but effective for internal service communication
7. **Tokio full features** — IM bridges need timers, I/O, and sync — don't trim the runtime

## References

- [AgentIM repo](https://github.com/markbang/agentim) — Full source code
- [Axum Docs](https://docs.rs/axum)
- [DashMap](https://docs.rs/dashmap)
- [Codex app-server transport](https://github.com/markbang/agentim/blob/main/docs/codex-app-server-transport-review.md)