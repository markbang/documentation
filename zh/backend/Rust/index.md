---
title: "Rust"
description: "Rust 后端开发技术学习入口与项目资源导航页面，涵盖使用 Axum Web 框架与 Tokio 异步运行时构建高性能 AgentIM 多平台即时通讯桥接服务的完整实战经验、Tauri 跨平台桌面应用开发实践，以及从所有权与借用机制到异步 Web 并发编程的系统进阶学习路径规划。"
icon: "rust"
---

# Rust

Rust 结合了内存安全、零成本抽象和无畏并发。在我的项目中，Rust 有两个角色：高性能后端服务（Axum）和原生桌面壳（Tauri）。

<CardGroup cols={2}>
<Card title="AgentIM" icon="terminal" href="/zh/backend/Rust/agentim">
多平台 IM 桥接 — Axum、Tokio、8+ 平台。
</Card>
<Card title="Tauri 桌面" icon="laptop-code" href="/zh/software/tauri">
跨平台桌面壳 — Rust + Web 前端。
</Card>
</CardGroup>

## 学习路径

1. **基础** — 所有权、借用、生命周期、trait
2. **异步** — Tokio 运行时、future、channel
3. **Web** — Axum 路由、中间件、提取器
4. **系统** — FFI、unsafe、嵌入式模式

## 为什么选 Rust 做 IM 桥接？

- **无 GC 停顿** — IM 消息需要可预测延迟
- **无畏并发** — Tokio + DashMap 处理数千并发连接
- **小二进制** — AgentIM 编译约 5MB，Node.js 50MB+
- **内存安全** — 生产环境无段错误