---
title: "Starship"
description: "Starship is a cross-shell terminal prompt tool supporting PowerShell, Bash, and Zsh, with Scoop installation and profile configuration guide."
icon: "terminal"
---

# Command line prompt tools

## oh my zsh

## oh my posh

PowerShell completion is the only part that still feels awkward to use.

## [starship](https://starship.rs/guide/)

![starship-demo](https://raw.gitmirror.com/starship/starship/master/media/demo.gif)

```bash
scoop install starship
starship config command_timeout 3600 //解决超时Issue https://github.com/starship/starship/issues/5985
```

### Configure PowerShell

Run `$PROFILE` in PowerShell to find the config file path, usually `C:\Users\<username>\Documents\WindowsPowerShell\Microsoft.PowerShell_profile.ps1`, and add the following line:

```bash
Invoke-Expression (&starship init powershell)
```

I use the [Bracketed Segments](https://starship.rs/zh-CN/presets/bracketed-segments) preset. You can browse other themes on the [Starship presets](https://starship.rs/presets/) page. Some presets require a [Nerd Font](https://www.nerdfonts.com/).

### Configure `cmd`

Starship uses [clink](https://chrisant996.github.io/clink/) to configure `cmd`.

> [!note]
> If you install clink with Scoop, command highlighting may not work. The likely reason is that the Scoop package does not include the `Enhanced default settings` feature, which is what enables syntax highlighting. If you need it, downloading clink directly from the [GitHub Releases](https://github.com/chrisant996/clink/releases) page is the safer choice.

```bash
code %LocalAppData%\clink\starship.lua

写入
load(io.popen('starship init cmd'):read("*a"))()
```

```bash
clink autorun install
clink set prompt.transient always
```
