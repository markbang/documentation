---
title: "Scoop"
description: "Scoop 是 Windows 平台上的命令行包管理器，类似 macOS 上的 Homebrew，通过 scoop install 一条命令即可安装软件，本文介绍完整安装流程与初始配置、aria2 多线程下载加速设置、第三方 bucket 源添加管理、HTTP 代理配置以及全局安装路径自定义等操作。"
icon: "bucket"
---

# Scoop-Windows 中的 brew

## 安装

## 配置

使用 aria2

```bash
scoop install aria2
scoop config aria2-warning-enabled false
```

bucket

proxy

```bash
❯ scoop config

last_update           : 2025-03-26T10:11:34.7723777+08:00
gh_token              : *****
global_path           : C:\GlobalScoopApps
root_path             : C:\Scoop
proxy                 : 127.0.0.1:10808
scoop_repo            : https://github.com/ScoopInstaller/Scoop
scoop_branch          : master
aria2-warning-enabled : False
```

备份

```bash
scoop export > app.json
scoop import > app.json
# 会备份bucket和app，不包括config
```

## 常用应用

## 未找到的应用

[雷神加速器](https://www.leigod.com/)

[滴答清单](https://dida365.com/)

[Cisco Anyconnect](https://www.cisco.com/c/zh_cn/support/security/anyconnect-secure-mobility-client-v4-x/model.html#~tab-downloads)

[纯粹直播](https://github.com/liuchuancong/pure_live)

[火绒](https://huorong.cn)

[微信输入法](https://z.weixin.qq.com)

[坚果云](https://www.jianguoyun.com)
