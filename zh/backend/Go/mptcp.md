---
title: "Go 监听端口与 MPTCP"
description: "从 Go 1.24 起，Linux 上的 net.Listen 默认开启 Multipath TCP 监听。如何查出哪些服务暴露了 MPTCP、按程序或整机关闭它，以及为什么真正的修复仍是升级内核。"
icon: "network-wired"
---

# Go 监听端口与 MPTCP

从 Go 1.24 开始，只要内核支持，`net.ListenConfig` 在 Linux 上默认使用 **Multipath TCP（MPTCP）**。`net.Listen("tcp", ...)` 内部走的就是 `ListenConfig`，所以 `http.ListenAndServe` 这类普通服务端不改一行代码就会接受 MPTCP 连接。客户端拨号默认仍是普通 TCP，除非你主动开启。

这个默认值还跟主模块 `go.mod` 里的 `go` 行有关。声明 `go 1.23` 或更早版本的模块，即使用新工具链构建，也保持旧行为（不主动请求就不用 MPTCP）。

MPTCP 让一条连接同时走多条网络路径，比如 Wi-Fi 加蜂窝网络。大多数客户端根本不用它，平时你察觉不到。但它增加了攻击面：监听 socket 走的是另一条内核代码路径，这条路径上的内核漏洞可以从网络上直接触达。

## 案例：CVE-2026-98432

<Note>
本节事实截至 2026 年 11 月 1 日。已修复的内核版本以你所用发行版的安全公告为准。
</Note>

- **漏洞本身。** Linux 内核 IPv4 TCP 连接请求处理中的竞态 use-after-free（`ipv4: free inet_opt and ireq_opt after an RCU grace period`）。Red Hat 评为 Critical：远程、无需认证即可触发，所有启用 IPv4 TCP 的受影响内核都在范围内，接受入站 TCP 连接的系统暴露最直接。
- **利用方式。** Anthropic 的 PoC 针对带 **MPTCP 监听**的服务器，无需凭据、无需用户交互即可拿到 root shell。竞争失败只会让这一次握手失败，不会让机器崩溃，所以攻击者可以无限重试。PoC 泄露内核地址用了约 48 分钟，之后再用约 5 分钟以 root 执行命令。
- **为什么 Go 服务端首当其冲。** Xray-core 维护者指出，对他们的大多数用户来说，主机上唯一提供 MPTCP 服务的程序就是用 Go 1.24 及以上版本构建的代理服务端。Xray-core 为此发布紧急版本，默认关闭 MPTCP。同一讨论里也点名了 Caddy 等其他 Go 服务端。
- **Go 团队的立场。** 升级内核。底层漏洞并不只限于 MPTCP，没有 MPTCP 监听的系统也可能被类似手法攻击。逐个程序关闭 MPTCP 很脆弱：漏掉一个监听，整台主机仍然暴露。Go 团队目前决定不修改默认值。

## 可以长期沿用的教训

- **运行时默认值会改变内核攻击面。** 即使代码一行没动，升级工具链也可能改变服务端暴露的内核代码路径。把发布说明里网络和 GODEBUG 相关的部分当安全公告来读。
- **按协议盘点监听，而不只是按端口。** `ss -lnt` 只告诉你某个端口在监听，不告诉你它是否同时接受 MPTCP。
- **应用层开关只能缩小暴露面，修补内核才是修复。** 用不到 MPTCP 的地方就关掉，但只把它当作内核升级到位之前的临时缓解。

## 查清暴露了什么

列出 MPTCP 监听 socket 及对应进程：

```bash
sudo ss -Mlnp
```

查看当前网络命名空间是否允许创建 MPTCP socket（`1` 表示允许）：

```bash
sysctl net.mptcp.enabled
```

查看某个二进制由哪个 Go 版本构建，以及 main 包内置的 GODEBUG 默认值：

```bash
go version -m ./server
go list -f '{{.DefaultGODEBUG}}' ./cmd/server
```

`go list` 只输出与工具链默认值不同的设置。使用 Go 1.24 及以上工具链时，输出为空表示监听会用 MPTCP；输出里有 `multipathtcp=0` 则表示不会。

## 关闭 MPTCP

选一个能覆盖你所有监听、又尽量窄的层级。

| 范围 | 做法 | 何时生效 |
| --- | --- | --- |
| 单个进程 | 在服务环境变量里设置 `GODEBUG=multipathtcp=0` | 进程启动时，需重启服务 |
| 单次构建 | 在主模块 `go.mod` 中写 `godebug multipathtcp=0`，或在 `package main` 上方写 `//go:debug multipathtcp=0` | 下次构建 |
| 单个 socket | 在 `net.ListenConfig` 上调用 `lc.SetMultipathTCP(false)` | 对该监听覆盖 GODEBUG |
| 整机或整个网络命名空间 | `sysctl -w net.mptcp.enabled=0` | 只影响新建 socket，需重启服务让监听重建 |

单个 socket 的写法：

```go
lc := net.ListenConfig{}
lc.SetMultipathTCP(false) // 无论 GODEBUG 如何都用普通 TCP
ln, err := lc.Listen(ctx, "tcp", ":8080")
```

systemd 服务可以用 drop-in 文件设置环境变量：

```ini
# /etc/systemd/system/myapp.service.d/no-mptcp.conf
[Service]
Environment=GODEBUG=multipathtcp=0
```

`GODEBUG` 是逗号分隔的列表。如果服务已经设置了 `GODEBUG`，把 `multipathtcp=0` 加到原有值里，不要直接覆盖。

`multipathtcp` 的取值：`0`（全部关闭）、`1`（拨号和监听都开）、`2`（只开监听，Go 1.24 默认）、`3`（只开拨号）。

整机 sysctl 对 Go 程序是安全的：MPTCP socket 创建失败时，Go 会退回普通 TCP。想在重启后保留设置，就写进 `/etc/sysctl.d/`，并确认主机上没有确实依赖 MPTCP 的服务。

改完之后再跑一次 `sudo ss -Mlnp`，确认对应的监听已经不在列表里。

## 修复内核

1. 安装发行版提供的已修复内核并重启进入新内核，用 `uname -r` 确认版本。
2. 暂时无法升级时，按厂商的临时缓解措施处理。Red Hat 给出了一条 nftables 规则，丢弃携带 IP options 的入站 IPv4 TCP 包。Red Hat 预计普通应用流量不受影响，但上线前先测试，升级内核后删除。它能缩小暴露面，但不能完全阻止利用。
3. 容器共享宿主机内核。更新镜像没有用，要修补的是节点本身。

## 参考资料

- [Folo 来源：Geek 关于 Xray-core 紧急安全更新](https://x.com/geekbb/status/2116526532881744310)
- [Go 1.24 发布说明：`net.ListenConfig` 默认使用 MPTCP](https://go.dev/doc/go1.24)
- [Go 文档：GODEBUG 历史与 `multipathtcp` 取值](https://go.dev/doc/godebug)
- [Go 安全团队：Protecting against CVE-2026-98432（oss-security 转发）](https://www.openwall.com/lists/oss-security/2026/10/30/1)
- [Go 源码：MPTCP 监听失败时退回 TCP](https://go.dev/src/net/mptcpsock_linux.go)
- [NVD：CVE-2026-98432](https://nvd.nist.gov/vuln/detail/cve-2026-98432)
- [Red Hat：RHSB-2026-016 与 nftables 缓解规则](https://access.redhat.com/security/vulnerabilities/RHSB-2026-016)
- [Anthropic：Discovering and exploiting vulnerabilities with Claude](https://www.anthropic.com/research/discovering-vulnerabilities-with-claude)
- [XTLS/Xray-core #7291：默认关闭 MPTCP](https://github.com/XTLS/Xray-core/pull/7291)
- [Linux 内核文档：MPTCP sysctl `enabled`](https://docs.kernel.org/networking/mptcp-sysctl.html)
- [ss(8)：`-M, --mptcp`](https://man7.org/linux/man-pages/man8/ss.8.html)
