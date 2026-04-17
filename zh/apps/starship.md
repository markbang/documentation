---
title: "Starship"
description: "Starship 是一款跨 Shell 的终端提示符美化工具，支持 PowerShell、Bash、Zsh 等多种终端环境，本文介绍通过 Scoop 安装方法、PowerShell 配置文件（$PROFILE）写入启动命令、command_timeout 超时问题的解决方案以及与 oh-my-zsh 等工具的对比。"
icon: "terminal"
---

# Comand Line

## oh my zsh

## oh my posh

只有 powershell 自动补全难用

## [starship](https://starship.rs/guide/)

![starship-demo](https://raw.gitmirror.com/starship/starship/master/media/demo.gif)

```bash
scoop install starship
starship config command_timeout 3600 //解决超时问题 https://github.com/starship/starship/issues/5985
```

### 配置 power shell

需要在 power shell 执行`$PROFILE`查看配置路径`C:\Users\用户名\Documents\WindowsPowerShell\Microsoft.PowerShell_profile.ps1`然后写入

```bash
Invoke-Expression (&starship init powershell)
```

使用[Bracketed-segments](https://starship.rs/zh-CN/presets/bracketed-segments)主题，也可以前往[Staship 预设](https://starship.rs/presets/)查看其他喜欢的主题，需要注意的是有的需要配置[Nerd Font](https://www.nerdfonts.com/)

### 配置 cmd

starship 使用[clink](https://chrisant996.github.io/clink/)来配置 cmd

> [!note]
> 使用 scoop 安装命令行不会命令高亮显示，原因是 scoop 安装的可能不带有`Enhanced default settings`这个功能，语法高亮是靠这个功能实现的，所以需要这个功能的还是从[Github Realease](https://github.com/chrisant996/clink/releases)下载吧【梦想是 scoop 管理所有应用，破碎第一步 😭】

```bash
code %LocalAppData%\clink\starship.lua

写入
load(io.popen('starship init cmd'):read("*a"))()
```

```bash
clink autorun install
clink set prompt.transient always
```
