---
title: "编辑器扩展供应链安全"
description: "把 VS Code、Cursor 和 Agent 工具的扩展当作以你的用户权限运行的代码：控制自动更新、锁定可信来源、加固本机，并在恶意版本出现后正确清理。"
icon: "puzzle-piece"
---

# 编辑器扩展供应链安全

编辑器扩展不是主题，也不是配置文件。在 VS Code 及 Cursor 等分支里，扩展运行在 **extension host** 中，权限和编辑器本身完全一样：能读写文件、发网络请求、启动进程、修改工作区设置。所以一次扩展更新，本质上就是在你的电脑上运行一段新代码，它能碰到源码、SSH 密钥、云凭据和 Agent token。

本页用 2026 年 10 月的一起真实事件说明信任边界在哪里，再把它落成配置项和检查清单。

JavaScript 依赖的安装期脚本见 [npm 供应链安全](/zh/env/npm-supply-chain)。两者信任模型相同，只是投递渠道不同。

## 案例：Cursor 扩展市场上被篡改的 Claude Code 扩展

<Note>
本节事实截至 2026 年 10 月 31 日。后续更新以文末参考资料中的厂商通告为准。
</Note>

**发生了什么。** 2026 年 10 月 29 日太平洋时间约 2:27 至 13:35，Cursor 的 VS Code 扩展市场分发了被篡改的 `Anthropic.claude-code` `2.1.312` 和 `2.1.313`（macOS、Windows 版）。这两个包不是 Anthropic 构建的。Microsoft 和 Anthropic 表示 Visual Studio Marketplace、Open VSX 和 npm 包均未受影响，Cursor 也表示没有证据显示官方分发渠道受影响。报道估计受影响用户最多约 5,000 名。为避免混淆，Anthropic 把下一个正式版本直接发成 `2.1.314`。

**载荷做了什么。** 恶意代码被插在 `extension.js` 开头，extension host 一加载模块就执行，早于扩展正常的 `activate` 函数，用户不需要任何操作。它会：

1. 收集主机名、用户名、操作系统、主目录与工作目录、全局 Git 邮箱、公网 IP，以及最多 40 个匹配 `KEY|TOKEN|SECRET|PASS|AWS|GCP` 的环境变量**名称**（不含值）。
2. 往 `~/.ssh/authorized_keys` 追加攻击者的 SSH 公钥，并尝试开启本机 SSH 服务。
3. 建立一条出站反向隧道（`ssh -N -R '*:0:localhost:22'`），让攻击者无需本机开放任何入站端口就能连到 22 端口。
4. 在扩展目录之外留下持久化：macOS 上名为 `com.apple.sysmond` 的 LaunchAgent，Linux 上的 `@reboot` cron，Windows 上名为 `SysMon` 的计划任务，失败时退回到启动文件夹脚本。
5. 把收集到的信息回传给攻击者服务器。

由于载荷本身有 bug，加上大多数机器没有管理员权限，SSH 服务通常没能开启，隧道往往连不到任何东西。但 SSH 公钥、持久化和主机信息上报仍可能成功。不要把攻击者的 bug 当成防线。

## 可以长期沿用的教训

### 扩展更新就是在本机运行代码

扩展装上以后，扩展市场和编辑器的权限模型都不会限制它能做什么。VS Code 的 `extensions.allowed` 管的是*哪些*扩展能安装和启用，Microsoft 文档明确说明它不限制扩展的运行时权限。按"每个已启用扩展都能做你这个用户能做的任何事"来规划。

### 发布者标签不等于来源证明

被篡改的包挂在知名发布者名下，很多人以为这代表 Anthropic 签过名。镜像或代理市场本身就是信任链上的一个独立节点。Cursor 在自家代理（`marketplace.cursorapi.com`）背后使用 Open VSX，并提醒同一个 `publisher.extension` ID 在 Open VSX 和 Microsoft Marketplace 上可能对应不同的发布者或不同的代码。像对待包名一样对待扩展 ID：先确认编辑器实际从哪个注册表下载。

### 自动更新是投递路径，冷却期能削弱它

这次恶意版本在线约 11 小时，很多受影响的机器是通过自动更新拿到的，而不是用户主动安装。只要安装或更新冷却期长于下架所需时间，大概率就不会被装上。冷却期挡不住在线时间超过延迟的恶意版本，但能堵住成本最低的攻击方式：短时上传的恶意包。

### 卸载不等于清理

载荷把密钥、脚本和启动项写到了扩展目录之外。卸载或升级扩展都不会撤销这些改动，攻击者服务器被关停也不会把它们从你的电脑上删掉。

### 反向隧道能绕过入站检查

是你的机器主动*向外*连接攻击者。只检查是否开放入站端口的防火墙审计发现不了它。经隧道成功登录时，SSH 日志里的来源会显示为 `localhost`。

### 环境变量名本身就是目标地图

只收集变量名，也足以告诉攻击者哪些机器上有 AWS、GCP 或 API token，值得重点下手。不要把长期有效的密钥放进全局 shell 环境。

### Agent 插件适用同一模型

Claude Code 文档对插件的说法完全一致：hooks、monitors、MCP server 和 LSP server 以你的完整用户权限运行，且在沙箱之外；自动更新会改动你审查过的文件；市场名称只说明谁发布了这个目录，不说明每个插件做什么。Agent 的 skill、插件和 MCP server 都按同样规则对待。

## 加固个人环境

1. **控制扩展数量。** 删掉一周都用不上一次的扩展。每个已启用扩展都是一条通往你机器的独立更新通道。
2. **推迟自动更新。** VS Code 的 `extensions.autoUpdateDelay` 设置版本发布后等待多少小时才自动安装，只在自动更新开启时生效。截至 2026 年 10 月，VS Code 文档写的默认值是 12 小时，以你的版本为准。对权限面大的扩展，设得更长一些：

   ```jsonc
   // VS Code settings.json
   {
     "extensions.autoUpdateDelay": 72
   }
   ```

   在 Cursor 里，如果团队没有强制冷却期，可以在用户设置中配置 `extensions.installCooldownHours`：

   ```jsonc
   // Cursor settings.json
   {
     "extensions.installCooldownHours": 72
   }
   ```

   在 VS Code 里手动点击 **Update** 会跳过延迟，没有明确理由时不要这样做。
3. **对高风险扩展手动锁版本。** 右键扩展，关闭 **Auto Update**，等新版本发布一段时间后再主动升级。通过 `.vsix` 文件安装的扩展默认不自动更新。
4. **从发布者的主注册表安装。** 核对发布者 ID 和认证标记，发布者提供官方安装链接时优先使用。
5. **不要以管理员或 root 身份运行编辑器。** 这次事件里，SSH 服务通常没能开启，缺少管理员权限是原因之一。
6. **密钥不要放在全局环境变量里。** 优先使用凭据助手、系统钥匙串，以及按项目限定范围的短期 token。
7. **隔离 Agent 和陌生仓库。** 在 VM 或 dev container 里运行 Agent 和不可信代码。容器只有在不挂载主目录、不暴露 Docker socket 时才算真正的边界。

## 加固团队环境

- **为扩展设置白名单。** VS Code 可以用 `extensions.allowed`（1.96+）或 `AllowedExtensions` 策略，按发布者、扩展 ID、精确版本或平台放行。`"stable"` 会拦截预发布版本。一旦添加了放行规则，不匹配任何规则的扩展都会被拦截。

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

  对本地 `.vsix` 文件，这些规则只检查包内声明的标识符，不验证包从哪里来。

- **集中管理更新时机。** VS Code 把 `extensions.autoUpdate` 和 `extensions.autoUpdateDelay` 开放为企业策略。Cursor 团队管理员可以在 **Team settings** → **Security & automation** 中设置 **Marketplace Install Cooldown (hours)**，默认为 `0`（关闭），设置后会覆盖每个用户的 `extensions.installCooldownHours`。
- **编辑器支持时要求签名。** Cursor Enterprise 可以要求 Open VSX 签名有效（**Require Extension Signature Verification**）。Visual Studio Marketplace 会为每个扩展签名，VS Code 安装时校验签名。
- **需要一套审核过、可重新托管的扩展时，自建私有市场**，也适用于离线网络。
- **按行为告警，不只按哈希。** 这次事件可以提炼出几个信号：
  - 编辑器辅助进程（`Code Helper`、`Cursor Helper` 等）写入 `~/.ssh/authorized_keys`
  - 非 Apple 进程创建 `com.apple.*` 标签的 LaunchAgent，或 LaunchAgent 用 `/bin/sh` 执行隐藏脚本
  - 用户会话里启动带 `-R` 参数的 `ssh` 或 `autossh`
  - 来自 `127.0.0.1` 或 `::1` 的本地 SSH 登录

## 你用的扩展被曝恶意时

1. **确认渠道、版本和平台。** 先查清你的副本来自哪个市场，再看已安装版本：

   ```bash
   code --list-extensions --show-versions
   ls ~/.vscode/extensions ~/.cursor/extensions 2>/dev/null
   ```

2. **删除任何东西之前先对照厂商公布的 IOC。** 保留证据；发现载荷执行迹象时先隔离机器。
3. **检查扩展目录之外的 SSH 密钥、启动项和进程：**

   ```bash
   cat ~/.ssh/authorized_keys          # 找不是你添加的公钥
   ls ~/Library/LaunchAgents           # macOS
   crontab -l                          # Linux
   ps aux | grep -E 'ssh .*-R|autossh' # 活跃的反向隧道
   ```

   Windows 上检查 `%USERPROFILE%\.ssh\authorized_keys`、`C:\ProgramData\ssh\administrators_authorized_keys`、计划任务和启动文件夹。
4. **清除持久化、未授权公钥和隧道进程**，再判断是否需要重装机器。运行厂商提供的清理脚本前先读一遍。
5. **从另一台可信设备轮换凭据、吊销会话。** 范围是受影响用户账号能访问到的一切。
6. **不要把扩展升级或服务器关停当成清理完成。** 重新登录和重启后，确认这些痕迹没有回来。

## 参考资料

- [Folo 来源：2026-10-31 Hacker News Top Stories（SuperTechFans）](https://supertechfans.com/cn/post/2026-10-31-HackerNews/)
- [Folo 来源：Solidot，Claude Code for VS Code 官方扩展被植入后门](https://www.solidot.org/story?sid=85756)
- [Cursor：Anthropic.claude-code 2.1.312 与 2.1.313 安全通告](https://cursor.com/blog/claude-code-extension-security-notice)
- [Phorion：Claude Code 官方扩展被篡改的安全分析](https://phorion.io/blog/offical-claude-code-vsx-compromise/)
- [Microsoft Security：恶意 Claude Code 品牌扩展与持久化 SSH 后门分析](https://www.microsoft.com/en-us/security/blog/2026/10/30/inside-malicious-claude-code-branded-cursor-extension-persistent-ssh-backdoor/)
- [Socket：Claude Code 2.1.313 的注册表记录核查](https://www.socket.dev/blog/claude-code-extension-compromise)
- [Hacker News：Anthropic 对受影响渠道的澄清](https://news.ycombinator.com/item?id=50304129)
- [VS Code 文档：Extension runtime security](https://code.visualstudio.com/docs/configure/extensions/extension-runtime-security)
- [VS Code 文档：扩展自动更新](https://code.visualstudio.com/docs/configure/extensions/extension-marketplace#_extension-auto-update)
- [VS Code 文档：企业环境中的扩展管理](https://code.visualstudio.com/docs/enterprise/extensions)
- [microsoft/vscode #321039：可配置的 `extensions.autoUpdateDelay`](https://github.com/microsoft/vscode/pull/321039)
- [Cursor 文档：扩展、安装冷却期与签名校验](https://cursor.com/help/customization/extensions)
- [Claude Code 文档：Plugin security and trust](https://code.claude.com/docs/en/plugins/security)
