---
title: "Rye"
description: "Rye is a next-gen Python package manager and virtual environment tool, compared with pyenv, pipenv, uv, and pdm for dependency management."
icon: "gear"
---

[Python package managers and virtual environments——V2EX](https://www.v2ex.com/t/1032069)

There are far too many Python environment management tools.

![python-tools](https://cdn.bangwu.top/img/202503131258281.webp)

> Image source: [https://alpopkes.com/posts/python/packaging_tools/](https://alpopkes.com/posts/python/packaging_tools/)

## Python version management

`pyenv`, `pipenv`

## Python package management

`pip`, `uv`, `pdm`

## Rye configuration

### VS Code cannot detect the interpreter path

```json
{
    "python.defaultInterpreterPath": ".\\.venv\\Scripts\\python.exe"
}
```

```cmd
rye config --set proxy.http=http://127.0.0.1:7890
rye config --set proxy.https=http://127.0.0.1:7890
```

Enable global shims:

```cmd
rye config --set-bool behavior.global-python=true
```

Configure a PyPI mirror in [config.toml](https://rye.astral.sh/guide/config/#config-file):

```toml
# Rye config.toml
[[sources]]
name = "default"
url = "https://pypi.org/simple/"
```

Set up Jupyter:

```bash
rye add ipykernel
```

### My configuration

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

## Start a project

```bash
rye pin 3.x
rye init // 或者 rye init -p cpython@3.x [project name]
rye sync
rye add [package]
```
