---
title: "Scoop"
description: "Scoop is a Windows command-line package manager like Homebrew, covering installation, aria2 acceleration, bucket management, and proxy setup."
icon: "bucket"
---

# Scoop-Windows brew

## Installation

## Configuration

using aria2

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

Backup

```bash
scoop export > app.json
scoop import > app.json
# backs up buckets and apps，excluding config
```

## Common Apps

## Apps Not Found via Scoop

[雷神加速器](https://www.leigod.com/)

[滴答清单](https://dida365.com/)

[Cisco Anyconnect](https://www.cisco.com/c/zh_cn/support/security/anyconnect-secure-mobility-client-v4-x/model.html#~tab-downloads)

[纯粹直播](https://github.com/liuchuancong/pure_live)

[火绒](https://huorong.cn)

[微信输入法](https://z.weixin.qq.com)

[坚果云](https://www.jianguoyun.com)
