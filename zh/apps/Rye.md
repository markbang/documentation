---
title: "Rye"
description: "Rye 是新一代 Python 包管理与虚拟环境一体化工具，内置 uv 后端加速依赖解析与安装。本文对比 pyenv、pip、uv、pdm 等方案的定位差异，并整理 Rye 安装、代理与 PyPI 镜像源配置、VSCode 解释器路径修复、全局 shims 启用及项目初始化的完整流程。"
icon: "gear"
---

[Python 上的包管理器和虚拟环境——V2EX](https://www.v2ex.com/t/1032069)

Python的环境管理工具可谓是多之又多

![python-tools](https://cdn.bangwu.top/img/202503131258281.webp)

> 图片来源[https://alpopkes.com/posts/python/packaging_tools/](https://alpopkes.com/posts/python/packaging_tools/)



## Python 版本管理

pyenv pipenv

## Python包管理

pip uv pdm

## Rye配置

vscode 识别不到解释器路径问题

```json
{
    "python.defaultInterpreterPath": ".\\.venv\\Scripts\\python.exe"
}
```

```cmd
rye config --set proxy.http=http://127.0.0.1:7890
rye config --set proxy.https=http://127.0.0.1:7890
```

设置shims全局

```cmd
rye config --set-bool behavior.global-python=true
```

设置pypi镜像 [config.toml](https://rye.astral.sh/guide/config/#config-file)

```toml
# Rye config.toml
[[sources]]
name = "default"
url = "https://pypi.org/simple/"
```

设置jupyter

```bash
rye add ipykernel
```

### 我的配置

```toml
[default]
toolchain = "cpython@3.13.2"
license = "MIT"
author = "bangwu <i@bangwu.top>"

[proxy]
https = "http://127.0.0.1:10808"
http = "http://127.0.0.1:10808"

[behavior]
global-python = true
autosync = true
use-uv = true

[[sources]]
name = "default"
url = "https://pypi.tuna.tsinghua.edu.cn/simple/"
```

## 开一个项目

```bash
rye pin 3.x
rye init // 或者 rye init -p cpython@3.x [project name]
rye sync
rye add [package]
```

