---
title: "Scoop"
description: "Scoop is a Windows command-line package manager like Homebrew, covering installation, aria2 acceleration, bucket management, and proxy setup."
icon: "bucket"
---

# Scoop - Windows Homebrew

## Installation

## Configuration

Enable `aria2`:

```bash
scoop install aria2
scoop config aria2-warning-enabled false
```

Useful things to configure include buckets and proxy settings.

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

### Backup

```bash
scoop export > app.json
scoop import > app.json
# backs up buckets and apps，excluding config
```

## Common apps

## Apps not found via Scoop

- [Leigod Accelerator](https://www.leigod.com/)
- [Dida365](https://dida365.com/)
- [Cisco Anyconnect](https://www.cisco.com/c/zh_cn/support/security/anyconnect-secure-mobility-client-v4-x/model.html#~tab-downloads)
- [Pure Live](https://github.com/liuchuancong/pure_live)
- [Huorong](https://huorong.cn)
- [WeChat Input Method](https://z.weixin.qq.com)
- [Jianguoyun](https://www.jianguoyun.com)
