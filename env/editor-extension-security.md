---
title: "Editor extension supply chain"
description: "Treat VS Code, Cursor, and agent-tool extensions as code that runs with your user privileges: control auto-update, pin trusted sources, harden the machine, and clean up after a malicious release."
icon: "puzzle-piece"
---

# Editor extension supply chain

An editor extension is not a theme or a settings file. In VS Code and its forks, such as Cursor, an extension runs in the **extension host** with the same permissions as the editor. It can read and write your files, make network requests, start processes, and change workspace settings. An extension update is effectively new code running on your machine, and it can reach your source code, SSH keys, cloud credentials, and agent tokens.

This page uses a real October 2026 incident to show where the trust boundaries are, then turns it into settings and a checklist.

For install-time scripts in JavaScript dependencies, see [npm supply chain](/env/npm-supply-chain). The trust model is the same; the delivery channel is different.

## Case study: a tampered Claude Code extension on Cursor's marketplace

<Note>
The facts in this section were current as of October 31, 2026. Check the vendor notices under References at the end of this page for later updates.
</Note>

**What happened.** On October 29, 2026, between about 2:27 AM and 1:35 PM PT, Cursor's VS Code Extension Marketplace served tampered builds of `Anthropic.claude-code` versions `2.1.312` and `2.1.313` for macOS and Windows. Anthropic did not build them. Microsoft and Anthropic said the Visual Studio Marketplace, Open VSX, and the npm package were not affected, and Cursor said it had no evidence that the official distribution was affected. Reports estimated up to about 5,000 affected users. Anthropic published its next legitimate release as `2.1.314` so the versions would not be confused.

**What the payload did.** Code prepended to `extension.js` ran as soon as the extension host loaded the module, before the extension's normal `activate` function. The user did not have to do anything. The payload:

1. Collected the hostname, username, OS, home and working directories, global Git email, public IP, and up to 40 environment variable **names** (not values) matching `KEY|TOKEN|SECRET|PASS|AWS|GCP`.
2. Appended an attacker SSH public key to `~/.ssh/authorized_keys`, then tried to enable the local SSH server.
3. Opened an outbound reverse tunnel (`ssh -N -R '*:0:localhost:22'`) so the attacker could reach the machine's port 22 without any inbound port being open.
4. Installed persistence outside the extension directory: a macOS LaunchAgent named `com.apple.sysmond`, a Linux `@reboot` cron entry, or a Windows scheduled task named `SysMon` with a Startup-folder fallback.
5. Sent the collected details to the attacker's server.

Bugs in the payload, plus the lack of admin rights on most machines, meant the SSH server usually did not start, so the tunnel often led nowhere. The SSH key, persistence, and host report could still land. Do not count on attacker bugs as a defense.

## Durable lessons

### An extension update runs code on your machine

Neither the marketplace nor the editor's permission model limits what an extension can do once it is installed. VS Code's `extensions.allowed` setting controls *which* extensions can be installed and enabled. Microsoft's documentation states that it does not limit an extension's runtime permissions. Plan as if every enabled extension can do anything your user account can do.

### A publisher label is not provenance

The tampered build appeared under a well-known publisher name, and many people assumed that meant Anthropic had signed it. A mirror or proxy marketplace is its own link in the trust chain. Cursor uses Open VSX behind its own proxy (`marketplace.cursorapi.com`) and notes that the same `publisher.extension` ID can point to a different publisher or different code on Open VSX than on the Microsoft Marketplace. Treat extension IDs the way you treat package names: confirm which registry your editor actually downloads from.

### Auto-update is the delivery path; a cooldown blunts it

The malicious versions were available for about 11 hours. Many affected machines received them through automatic updates, not deliberate installs. An install or update cooldown longer than the takedown window would probably have kept them out. A cooldown cannot stop a malicious release that stays up longer than the delay, but it removes the cheapest attack: a short-lived malicious upload.

### Uninstalling is not cleaning up

The payload wrote keys, scripts, and startup entries outside the extension folder. Removing or updating the extension does not undo them. Taking the attacker's server offline does not remove them from your machine either.

### Reverse tunnels avoid inbound checks

The machine connects *out* to the attacker. A firewall audit that only looks for open inbound ports will not find this. Successful logins through the tunnel show up in SSH logs as coming from `localhost`.

### Environment variable names are a target map

Collecting only variable names still tells an attacker which machines hold AWS, GCP, or API tokens and are worth a closer look. Keep long-lived secrets out of your global shell environment.

### The same model applies to agent plugins

Claude Code's documentation says the same about its plugins: hooks, monitors, MCP servers, and LSP servers run with your full user permissions and outside the sandbox. Auto-update can change the files you reviewed. The marketplace name tells you who publishes the catalog, not what each plugin does. Use the same rules for agent skills, plugins, and MCP servers.

## Harden a personal setup

1. **Keep the extension list short.** Remove extensions you do not use every week. Each enabled extension is a separate update channel into your machine.
2. **Delay automatic updates.** In VS Code, `extensions.autoUpdateDelay` sets how many hours to wait after a version is published before installing it automatically. It only applies when auto-update is on. VS Code's documentation lists a 12-hour default as of October 2026, but check your version. Pick a longer delay for extensions with broad access:

   ```jsonc
   // VS Code settings.json
   {
     "extensions.autoUpdateDelay": 72
   }
   ```

   In Cursor, set `extensions.installCooldownHours` in user settings when your team has not enforced a cooldown:

   ```jsonc
   // Cursor settings.json
   {
     "extensions.installCooldownHours": 72
   }
   ```

   Clicking **Update** yourself skips the VS Code delay. Only do this when you have a reason.
3. **Pin high-risk extensions manually.** Right-click an extension and turn off **Auto Update**. Update it on purpose after the release has been out for a while. Extensions installed from a `.vsix` file have auto-update off by default.
4. **Install from the publisher's primary registry.** Check the publisher ID and verification badge, and use the publisher's own install link when one exists.
5. **Do not run the editor as administrator or root.** In this incident, the lack of admin rights was one reason the SSH server usually failed to start.
6. **Keep secrets out of global environment variables.** Prefer credential helpers, OS keychains, and short-lived tokens scoped to a project.
7. **Isolate agents and unfamiliar repositories.** Use a VM or dev container for agent runs and untrusted code. A container is only a boundary if it does not mount your home directory or the Docker socket.

## Harden a team setup

- **Allowlist extensions.** In VS Code, use `extensions.allowed` (1.96+) or the `AllowedExtensions` policy to allow by publisher, extension ID, exact version, or platform. `"stable"` blocks pre-release versions. Once you add allow rules, extensions that do not match any of them are blocked.

  ```jsonc
  {
    "extensions.allowed": {
      "microsoft": true,
      "esbenp.prettier-vscode": true,
      "rust-lang.rust-analyzer": "stable",
      "dbaeumer.vscode-eslint": ["3.0.0"]
    }
  }
  ```

  For local `.vsix` files, these rules check identifiers declared inside the package. They do not verify where the package came from.

- **Manage update timing centrally.** VS Code exposes `extensions.autoUpdate` and `extensions.autoUpdateDelay` as enterprise policies. In Cursor, team admins can set **Marketplace Install Cooldown (hours)** under **Team settings** → **Security & automation**. It defaults to `0` (disabled) and, when set, overrides each user's `extensions.installCooldownHours`.
- **Require signatures where the editor supports it.** Cursor Enterprise can require valid Open VSX signatures (**Require Extension Signature Verification**). The Visual Studio Marketplace signs every extension, and VS Code checks the signature at install time.
- **Host a private marketplace** when you need an approved, rehosted set of extensions, including for air-gapped networks.
- **Alert on behavior, not just hashes.** Useful signals from this incident:
  - an editor helper process (`Code Helper`, `Cursor Helper`, and similar) writing `~/.ssh/authorized_keys`
  - a non-Apple process creating a `com.apple.*` LaunchAgent, or a LaunchAgent that runs `/bin/sh` on a hidden script
  - `ssh` or `autossh` started with `-R` from a user session
  - local SSH logins from `127.0.0.1` or `::1`

## When an extension you use is reported malicious

1. **Confirm channel, version, and platform.** Find out which marketplace delivered your copy. Check the installed versions:

   ```bash
   code --list-extensions --show-versions
   ls ~/.vscode/extensions ~/.cursor/extensions 2>/dev/null
   ```

2. **Check the vendor's indicators** before deleting anything. Preserve evidence, and isolate the machine if you find signs that the payload ran.
3. **Look outside the extension folder** for SSH keys, startup entries, and running processes:

   ```bash
   cat ~/.ssh/authorized_keys          # look for keys you did not add
   ls ~/Library/LaunchAgents           # macOS
   crontab -l                          # Linux
   ps aux | grep -E 'ssh .*-R|autossh' # active reverse tunnels
   ```

   On Windows, check `%USERPROFILE%\.ssh\authorized_keys`, `C:\ProgramData\ssh\administrators_authorized_keys`, scheduled tasks, and the Startup folder.
4. **Remove persistence, unauthorized keys, and tunnel processes.** Then decide whether to rebuild the machine. Review vendor remediation scripts before you run them.
5. **Rotate credentials and revoke sessions from a different, trusted device.** Do this for anything the affected user account could reach.
6. **Do not treat an extension update or a server takedown as cleanup.** Confirm that the artifacts do not return after you log in again or restart.

## References

- [Folo source: 2026-10-31 Hacker News Top Stories (SuperTechFans)](https://supertechfans.com/cn/post/2026-10-31-HackerNews/)
- [Folo source: Solidot, Claude Code for VS Code extension backdoor](https://www.solidot.org/story?sid=85756)
- [Cursor: Security notice for Anthropic.claude-code 2.1.312 and 2.1.313](https://cursor.com/blog/claude-code-extension-security-notice)
- [Phorion: Official Claude Code extension compromise advisory](https://phorion.io/blog/offical-claude-code-vsx-compromise/)
- [Microsoft Security: Inside a malicious Claude Code-branded extension](https://www.microsoft.com/en-us/security/blog/2026/10/30/inside-malicious-claude-code-branded-cursor-extension-persistent-ssh-backdoor/)
- [Socket: Registry records for Claude Code 2.1.313](https://www.socket.dev/blog/claude-code-extension-compromise)
- [Hacker News: Anthropic clarification on affected channels](https://news.ycombinator.com/item?id=50304129)
- [VS Code docs: Extension runtime security](https://code.visualstudio.com/docs/configure/extensions/extension-runtime-security)
- [VS Code docs: Extension auto-update](https://code.visualstudio.com/docs/configure/extensions/extension-marketplace#_extension-auto-update)
- [VS Code docs: Manage extensions in enterprise environments](https://code.visualstudio.com/docs/enterprise/extensions)
- [microsoft/vscode #321039: configurable `extensions.autoUpdateDelay`](https://github.com/microsoft/vscode/pull/321039)
- [Cursor docs: Extensions, install cooldown, and signature verification](https://cursor.com/help/customization/extensions)
- [Claude Code docs: Plugin security and trust](https://code.claude.com/docs/en/plugins/security)
