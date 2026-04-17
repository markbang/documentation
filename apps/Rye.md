---
title: "Rye"
description: "Rye is a next-gen Python package manager and virtual environment tool, compared with pyenv, pipenv, uv, and pdm for dependency management."
icon: "gear"
---
<Note icon="language" title="Original Chinese Content">
This page contains content originally written in Chinese. Some technical terms and explanations are best understood in their original language. [View Chinese version →](/zh/apps/Rye.md)
</Note>


[Python package managers and virtual environments——V2EX](https://www.v2ex.com/t/1032069)

Python's 环境管理Tool可谓is多之又多

![python-tools](https://cdn.bangwu.top/img/202503131258281.webp)

> 图片来源[https://alpopkes.com/posts/python/packaging_tools/](https://alpopkes.com/posts/python/packaging_tools/)



## Python versions管理

pyenv pipenv

## PythonPackage管理

pip uv pdm

## RyeConfiguration

vscode 识别不到解释器路径Issue

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

### 我's Configuration

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

## 开a项目

```bash
rye pin 3.x
rye init // 或者 rye init -p cpython@3.x [project name]
rye sync
rye add [package]
```

