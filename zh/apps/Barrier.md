---
title: "Barrier"
description: "Barrier 是开源的跨平台键鼠共享工具，作为 Synergy 的免费替代可让一套键鼠通过局域网操作 Windows、macOS 和 Linux 多台电脑。本文介绍 Scoop 命令行安装与 GitHub Releases 手动安装两种方式，并记录 Scoop 版本可能出现的协议兼容与连接失败排查经验。"
icon: "arrows-left-right"
---

# 设备共享

Barrier 可以让一套键盘鼠标跨多台设备使用，类似 Synergy 的开源替代品。

## 安装

<Tabs>
<Tab title="Scoop">
```bash
scoop install barrier
```

<Warning icon="triangle-exclamation" title="Scoop 版本的兼容问题">
Scoop 安装的 Barrier 可能出现无法连接局域网的问题，可能是协议未同意的原因。如果遇到此问题，建议使用下面的正常安装方式。
</Warning>
</Tab>
<Tab title="手动安装">
从 [GitHub Releases](https://github.com/debauchee/barrier/releases/tag/v2.4.0) 下载安装包。
</Tab>
</Tabs>