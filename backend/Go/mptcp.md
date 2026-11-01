---
title: "Go listeners and MPTCP"
description: "Since Go 1.24, net.Listen on Linux opens Multipath TCP listeners by default. Check which services expose MPTCP, turn it off per program or system-wide, and why the kernel patch is still the real fix."
icon: "network-wired"
---

# Go listeners and MPTCP

Since Go 1.24, `net.ListenConfig` uses **Multipath TCP (MPTCP)** by default on Linux whenever the kernel supports it. `net.Listen("tcp", ...)` goes through `ListenConfig`, so ordinary servers such as `http.ListenAndServe` accept MPTCP connections without any code change. Clients still connect over plain TCP unless you opt in.

The default also follows the `go` line in the main module's `go.mod`. A module that declares `go 1.23` or earlier keeps the old behavior (no MPTCP unless requested), even when built with a newer toolchain.

MPTCP lets one connection use several network paths, for example Wi-Fi and cellular together. Most clients never use it, so you won't notice it in normal operation. It still adds attack surface: the listening socket goes through a different kernel code path, and a kernel bug in that path is reachable from the network.

## Case study: CVE-2026-98432

<Note>
The facts in this section were current as of November 1, 2026. Follow your distribution's advisory for fixed kernel versions.
</Note>

- **The bug.** A race-condition use-after-free in the Linux kernel's IPv4 TCP connection-request handling (`ipv4: free inet_opt and ireq_opt after an RCU grace period`). Red Hat rates it Critical: a remote, unauthenticated attacker can trigger it, it affects any vulnerable kernel with IPv4 TCP enabled, and systems that accept inbound TCP connections are the most directly exposed.
- **The exploit.** Anthropic's proof of concept got a root shell on a server with an **MPTCP listener**, with no credentials and no user interaction. A lost race only fails that one handshake and doesn't crash the machine, so the attacker can keep retrying. The PoC needed about 48 minutes to leak a kernel address and another 5 minutes to run a command as root.
- **Why Go servers were in the spotlight.** Xray-core's maintainers pointed out that for most of their users, the only programs serving MPTCP on the host are Go proxy servers built with Go 1.24 or later. Xray-core shipped an emergency release that turns MPTCP off by default. Caddy and other Go servers were named in the same discussion.
- **The Go team's position.** Upgrade the kernel. The underlying bug is not specific to MPTCP, so systems without MPTCP listeners may be vulnerable to similar attacks. Turning MPTCP off program by program is fragile: one forgotten listener leaves the host exposed. The team decided not to change Go's default for now.

## Durable lessons

- **Runtime defaults change your kernel attack surface.** A toolchain upgrade can change which kernel code paths your server exposes, even if you never touch your code. Read the networking and GODEBUG sections of release notes as security notes.
- **List listeners by protocol, not just by port.** `ss -lnt` shows a port as listening. It doesn't show whether that port also accepts MPTCP.
- **App-level switches reduce exposure; patching fixes the bug.** Turn MPTCP off where you don't need it, but treat that as temporary mitigation until the patched kernel is running.

## Check what you expose

List MPTCP listening sockets and the processes behind them:

```bash
sudo ss -Mlnp
```

Check whether the kernel allows MPTCP sockets in the current network namespace (`1` means enabled):

```bash
sysctl net.mptcp.enabled
```

Check which Go version built a binary and the GODEBUG defaults built into a main package:

```bash
go version -m ./server
go list -f '{{.DefaultGODEBUG}}' ./cmd/server
```

`go list` only prints settings that differ from the toolchain's defaults. With a Go 1.24 or later toolchain, an empty result means listeners use MPTCP; `multipathtcp=0` in the output means they don't.

## Turn MPTCP off

Pick the narrowest layer that covers every listener you run.

| Scope | How | When it applies |
| --- | --- | --- |
| One process | `GODEBUG=multipathtcp=0` in the service environment | At process start; restart the service |
| One build | `godebug multipathtcp=0` in the main module's `go.mod`, or `//go:debug multipathtcp=0` above `package main` | Next build |
| One socket | `lc.SetMultipathTCP(false)` on a `net.ListenConfig` | Overrides GODEBUG for that listener |
| Whole host or namespace | `sysctl -w net.mptcp.enabled=0` | New sockets only; restart services so existing listeners are recreated |

Per-socket example:

```go
lc := net.ListenConfig{}
lc.SetMultipathTCP(false) // plain TCP, regardless of GODEBUG
ln, err := lc.Listen(ctx, "tcp", ":8080")
```

For a systemd service, set the environment variable in a drop-in file:

```ini
# /etc/systemd/system/myapp.service.d/no-mptcp.conf
[Service]
Environment=GODEBUG=multipathtcp=0
```

`GODEBUG` takes a comma-separated list. If the service already sets `GODEBUG`, add `multipathtcp=0` to the existing value instead of replacing it.

The `multipathtcp` values are `0` (off), `1` (dialers and listeners), `2` (listeners only, the Go 1.24 default), and `3` (dialers only).

The host-wide sysctl is safe for Go programs. When creating the MPTCP socket fails, Go falls back to plain TCP. Persist it in `/etc/sysctl.d/` if you want it to survive a reboot, and confirm that nothing on the host actually needs MPTCP.

After any change, run `sudo ss -Mlnp` again and confirm the listener is gone from the list.

## Fix the kernel

1. Install your distribution's patched kernel and reboot into it. Check that `uname -r` reports the new version.
2. If you can't patch right away, follow your vendor's interim mitigation. Red Hat published an nftables rule that drops inbound IPv4 TCP packets carrying IP options. Red Hat expects ordinary application traffic to be unaffected, but test the rule first, and remove it after patching. It reduces exposure; it does not fully prevent exploitation.
3. Remember that containers share the host kernel. Patching an image does nothing; patch the node.

## References

- [Folo source: Geek on the Xray-core emergency update](https://x.com/geekbb/status/2116526532881744310)
- [Go 1.24 release notes: `net.ListenConfig` uses MPTCP by default](https://go.dev/doc/go1.24)
- [Go docs: GODEBUG history and `multipathtcp` values](https://go.dev/doc/godebug)
- [Go Security Team: Protecting against CVE-2026-98432 (via oss-security)](https://www.openwall.com/lists/oss-security/2026/10/30/1)
- [Go source: MPTCP listener fallback to TCP](https://go.dev/src/net/mptcpsock_linux.go)
- [NVD: CVE-2026-98432](https://nvd.nist.gov/vuln/detail/cve-2026-98432)
- [Red Hat: RHSB-2026-016 and nftables mitigation](https://access.redhat.com/security/vulnerabilities/RHSB-2026-016)
- [Anthropic: Discovering and exploiting vulnerabilities with Claude](https://www.anthropic.com/research/discovering-vulnerabilities-with-claude)
- [XTLS/Xray-core #7291: disable MPTCP by default](https://github.com/XTLS/Xray-core/pull/7291)
- [Linux kernel docs: MPTCP sysctl `enabled`](https://docs.kernel.org/networking/mptcp-sysctl.html)
- [ss(8): `-M, --mptcp`](https://man7.org/linux/man-pages/man8/ss.8.html)
