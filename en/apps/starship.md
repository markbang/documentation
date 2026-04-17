---
title: "Starship"
description: "Starship is a cross-shell terminal prompt tool supporting PowerShell, Bash, and Zsh, with Scoop installation and profile configuration guide."
icon: "terminal"
---
<Note icon="language" title="Original Chinese Content">
Parts of this page are still in their original Chinese. Key technical terms and concepts may be more intuitive in Chinese. [View the Chinese version →](/zh/apps/starship.md)
</Note>


# Comand Line

## oh my zsh

## oh my posh

只有 powershell 自动补全难用

## [starship](https://starship.rs/guide/)

![starship-demo](https://raw.gitmirror.com/starship/starship/master/media/demo.gif)

```bash
scoop install starship
starship config command_timeout 3600 //解决超时Issue https://github.com/starship/starship/issues/5985
```

### Configuration power shell

需要in power shell 执行`$PROFILE`查看Configuration路径`C:\Users\用户名\Documents\WindowsPowerShell\Microsoft.PowerShell_profile.ps1`然后写入

```bash
Invoke-Expression (&starship init powershell)
```

使用[Bracketed-segments](https://starship.rs/zh-CN/presets/bracketed-segments)主题，也可以前往[Staship 预设](https://starship.rs/presets/)查看其他喜欢的主题，需要注意的is有的需要Configuration[Nerd Font](https://www.nerdfonts.com/)

### Configuration cmd

starship 使用[clink](https://chrisant996.github.io/clink/)来Configuration cmd

> [!note]
> 使用 scoop InstallationCommand行不会Command高亮显示，原因is scoop Installation的可能不带有`Enhanced default settings`这个功能，syntax高亮is靠这个功能Implementation的，所以需要这个功能的还is从[Github Realease](https://github.com/chrisant996/clink/releases)Download吧【梦想is scoop 管理所有应用，破碎第一步 😭】

```bash
code %LocalAppData%\clink\starship.lua

写入
load(io.popen('starship init cmd'):read("*a"))()
```

```bash
clink autorun install
clink set prompt.transient always
```
