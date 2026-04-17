---
title: "Pyenv"
description: "Pyenv is a Python version manager for installing and switching between multiple Python versions on the same system with per-project settings."
icon: "python"
---

# [Pyenv](https://github.com/pyenv/pyenv?tab=readme-ov-file#windows)

Pyenv is a Python version manager that makes it easy to install and switch between multiple Python versions on the same machine.

## Features

- 📦 Manage multiple Python versions
- 🔄 Switch versions quickly
- 🎯 Pin a specific version for each project
- 🌐 Support virtual environments
- 🪟 Cross-platform support for Windows, Linux, and macOS

## Installation

### Windows

Use [pyenv-win](https://github.com/pyenv-win/pyenv-win):

```powershell
# 使用 pip Installation
pip install pyenv-win --target $HOME/.pyenv

# 或使用 Git
git clone https://github.com/pyenv-win/pyenv-win.git $HOME/.pyenv
```

Add environment variables:
```powershell
[System.Environment]::SetEnvironmentVariable('PYENV',$env:USERPROFILE + "\.pyenv\pyenv-win\","User")
[System.Environment]::SetEnvironmentVariable('PYENV_ROOT',$env:USERPROFILE + "\.pyenv\pyenv-win\","User")
[System.Environment]::SetEnvironmentVariable('PYENV_HOME',$env:USERPROFILE + "\.pyenv\pyenv-win\","User")
```

### Linux/macOS

```bash
# 使用官方Installationscripts
curl https://pyenv.run | bash

# 或使用 Homebrew (Mac)
brew install pyenv
```

Configure your shell by adding the following to `~/.bashrc` or `~/.zshrc`:

```bash
export PYENV_ROOT="$HOME/.pyenv"
export PATH="$PYENV_ROOT/bin:$PATH"
eval "$(pyenv init --path)"
eval "$(pyenv init -)"
```

## Basic usage

### Show installable versions

```bash
# 列出所有可用versions
pyenv install --list

# search for特定versions
pyenv install --list | grep 3.11
```

### Install Python versions

```bash
# Installation特定versions
pyenv install 3.11.5

# Installation最新versions
pyenv install 3.11

# ViewInstallation进度
pyenv install -v 3.11.5
```

### Show installed versions

```bash
# 列出所有已Installationversions
pyenv versions

# View当前versions
pyenv version
```

### Switch Python versions

```bash
# 全局切换（所有 shell）
pyenv global 3.11.5

# 本地切换（当前目录）
pyenv local 3.10.12

# 临时切换（当前 shell）
pyenv shell 3.9.18
```

### Uninstall a version

```bash
pyenv uninstall 3.9.18
```

## Advanced usage

### Set a version for a project

```bash
# in项目目录下
cd my_project
pyenv local 3.11.5

# 会创建 .python-version file
cat .python-version
# 3.11.5
```

### Virtual environments

Use it together with `pyenv-virtualenv`:

```bash
# Installation pyenv-virtualenv
git clone https://github.com/pyenv/pyenv-virtualenv.git $(pyenv root)/plugins/pyenv-virtualenv

# 创建虚拟环境
pyenv virtualenv 3.11.5 my-project-env

# 激活虚拟环境
pyenv activate my-project-env

# 停用虚拟环境
pyenv deactivate

# Removed虚拟环境
pyenv virtualenv-delete my-project-env

# 为项目自动激活虚拟环境
cd my_project
pyenv local my-project-env
```

### Show where the current version comes from

```bash
# View当前versions及来源
pyenv version
# 3.11.5 (set by /home/user/project/.python-version)
```

### Refresh shims

```bash
# 重新generates shims（Installation新Package后）
pyenv rehash
```

## Configuration files

### Global configuration

```bash
# 设置全局versions
pyenv global 3.11.5

# Configuration File位置
~/.pyenv/version
```

### Project configuration

```bash
# 项目目录下's  .python-version file
echo "3.11.5" > .python-version
```

### Shell configuration

```bash
# 临时设置
export PYENV_VERSION=3.11.5
```

## FAQ

### Installation failed

**Missing Linux dependencies:**

```bash
# Ubuntu/Debian
sudo apt update
sudo apt install -y make built-essential libssl-dev zlib1g-dev \
  libbz2-dev libreadline-dev libsqlite3-dev wget curl llvm \
  libncursesw5-dev xz-utils tk-dev libxml2-dev libxmlsec1-dev \
  libffi-dev liblzma-dev

# CentOS/RHEL
sudo yum install gcc zlib-devel bzip2 bzip2-devel readline-devel \
  sqlite sqlite-devel openssl-devel tk-devel libffi-devel xz-devel
```

### Version switching does not take effect

```bash
# 确保 pyenv in PATH 中
which pyenv

# 重新加载Configuration
source ~/.bashrc  # 或 ~/.zshrc

# 重新generates shims
pyenv rehash
```

### Windows path issues

Make sure the environment variables are configured correctly, then restart the terminal.

## Comparison with other tools

| Tool | Characteristics | Suitable scenarios |
|------|------|---------|
| **pyenv** | Multi-version management | Frequent switching between Python versions |
| **venv** | Built-in virtual environments | Simple project isolation |
| **conda** | Scientific computing environment | Data science and machine learning |
| **poetry** | Dependency management + packaging | Modern Python projects |
| **pipenv** | Pipfile-based management | Dependency locking |

## Best practices

1. **Set a local version for every project** to avoid global version conflicts.
2. **Use virtual environments** together with `pyenv-virtualenv`.
3. **Commit `.python-version`** when the team should use the same version.
4. **Update pyenv regularly** to get support for new versions.
5. **Record dependencies** with `requirements.txt` or `Pipfile`.

## Quick reference

```bash
# Common Commands速查
pyenv install --list          # View可Installationversions
pyenv install 3.11.5          # Installationversions
pyenv versions                # View已Installationversions
pyenv global 3.11.5           # 全局切换
pyenv local 3.11.5            # 项目切换
pyenv uninstall 3.11.5        # 卸载versions
pyenv rehash                  # 刷新 shims
pyenv which python            # View python 路径
```

## References

- [Pyenv GitHub](https://github.com/pyenv/pyenv)
- [Pyenv-win GitHub](https://github.com/pyenv-win/pyenv-win)
- [Official Docs](https://github.com/pyenv/pyenv/wiki)
- [FAQ](https://github.com/pyenv/pyenv/wiki/Common-build-problems)
