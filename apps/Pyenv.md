---
title: "Pyenv"
description: "Pyenv is a Python version manager for installing and switching between multiple Python versions on the same system with per-project settings."
icon: "python"
---
<Note icon="language" title="Original Chinese Content">
Parts of this page are still in their original Chinese. Key technical terms and concepts may be more intuitive in Chinese. [View the Chinese version →](/zh/apps/Pyenv.md)
</Note>


# [Pyenv](https://github.com/pyenv/pyenv?tab=readme-ov-file#windows)

Pyenv isa Python Version Manager，允许你in同一系统上轻松Installation和切换多个 Python versions。

## Features

- 📦 管理多个 Python versions
- 🔄 快速切换 Python versions
- 🎯 为项目设置特定versions
- 🌐 supports虚拟环境
- 🪟 cross-platformsupports（Windows/Linux/Mac）

## Installation

### Windows

使用 [pyenv-win](https://github.com/pyenv-win/pyenv-win)：

```powershell
# 使用 pip Installation
pip install pyenv-win --target $HOME/.pyenv

# 或使用 Git
git clone https://github.com/pyenv-win/pyenv-win.git $HOME/.pyenv
```

添加Environment Variables：
```powershell
[System.Environment]::SetEnvironmentVariable('PYENV',$env:USERPROFILE + "\.pyenv\pyenv-win\","User")
[System.Environment]::SetEnvironmentVariable('PYENV_ROOT',$env:USERPROFILE + "\.pyenv\pyenv-win\","User")
[System.Environment]::SetEnvironmentVariable('PYENV_HOME',$env:USERPROFILE + "\.pyenv\pyenv-win\","User")
```

### Linux/Mac

```bash
# 使用官方Installation脚本
curl https://pyenv.run | bash

# 或使用 Homebrew (Mac)
brew install pyenv
```

Configuration Shell（添加到 `~/.bashrc` 或 `~/.zshrc`）：

```bash
export PYENV_ROOT="$HOME/.pyenv"
export PATH="$PYENV_ROOT/bin:$PATH"
eval "$(pyenv init --path)"
eval "$(pyenv init -)"
```

## 基本使用

### 查看可Installation的versions

```bash
# 列出所有可用versions
pyenv install --list

# search for特定versions
pyenv install --list | grep 3.11
```

### Installation Python versions

```bash
# Installation特定versions
pyenv install 3.11.5

# Installation最新versions
pyenv install 3.11

# 查看Installation进度
pyenv install -v 3.11.5
```

### 查看已Installationversions

```bash
# 列出所有已Installationversions
pyenv versions

# 查看当前versions
pyenv version
```

### 切换 Python versions

```bash
# 全局切换（所有 shell）
pyenv global 3.11.5

# 本地切换（当前目录）
pyenv local 3.10.12

# 临时切换（当前 shell）
pyenv shell 3.9.18
```

### 卸载versions

```bash
pyenv uninstall 3.9.18
```

## Advanced Usage

### 为项目设置versions

```bash
# in项目目录下
cd my_project
pyenv local 3.11.5

# 会创建 .python-version file
cat .python-version
# 3.11.5
```

### 虚拟环境

结合 pyenv-virtualenv 使用：

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

### 查看versions来源

```bash
# 查看当前versions及来源
pyenv version
# 3.11.5 (set by /home/user/project/.python-version)
```

### 刷新 shims

```bash
# 重新generates shims（Installation新Package后）
pyenv rehash
```

## Configuration File

### 全局Configuration

```bash
# 设置全局versions
pyenv global 3.11.5

# Configuration File位置
~/.pyenv/version
```

### 项目Configuration

```bash
# 项目目录下的 .python-version file
echo "3.11.5" > .python-version
```

### Shell Configuration

```bash
# 临时设置
export PYENV_VERSION=3.11.5
```

## FAQ

### Installation失败

**Linux Dependency缺失：**

```bash
# Ubuntu/Debian
sudo apt update
sudo apt install -y make build-essential libssl-dev zlib1g-dev \
  libbz2-dev libreadline-dev libsqlite3-dev wget curl llvm \
  libncursesw5-dev xz-utils tk-dev libxml2-dev libxmlsec1-dev \
  libffi-dev liblzma-dev

# CentOS/RHEL
sudo yum install gcc zlib-devel bzip2 bzip2-devel readline-devel \
  sqlite sqlite-devel openssl-devel tk-devel libffi-devel xz-devel
```

### versions切换不生效

```bash
# 确保 pyenv in PATH 中
which pyenv

# 重新加载Configuration
source ~/.bashrc  # 或 ~/.zshrc

# 重新generates shims
pyenv rehash
```

### Windows 路径Issue

确保Environment VariablesConfiguration正确，并重启终端。

## 与其他ToolComparison

| Tool | 特点 | Applicable Scenarios |
|------|------|---------|
| **pyenv** | 多versions管理 | 需要频繁切换 Python versions |
| **venv** | 内置虚拟环境 | 简单项目隔离 |
| **conda** | 科学Calculation环境 | 数据科学、机器学习 |
| **poetry** | Dependency管理 + 打Package | 现代 Python 项目 |
| **pipenv** | Pipfile 管理 | Dependency锁定 |

## Best Practices

1. **为每个项目设置 local versions**：避免全局versionsConflict
2. **使用虚拟环境**：结合 pyenv-virtualenv
3. **Commit .python-version**：团队协作时统一versions
4. **定期更新 pyenv**：获取新versionssupports
5. **记录Dependency**：使用 requirements.txt 或 Pipfile

## 实用Command总结

```bash
# Common Commands速查
pyenv install --list          # 查看可Installationversions
pyenv install 3.11.5          # Installationversions
pyenv versions                # 查看已Installationversions
pyenv global 3.11.5           # 全局切换
pyenv local 3.11.5            # 项目切换
pyenv uninstall 3.11.5        # 卸载versions
pyenv rehash                  # 刷新 shims
pyenv which python            # 查看 python 路径
```

## References

- [Pyenv GitHub](https://github.com/pyenv/pyenv)
- [Pyenv-win GitHub](https://github.com/pyenv-win/pyenv-win)
- [Official Docs](https://github.com/pyenv/pyenv/wiki)
- [FAQ](https://github.com/pyenv/pyenv/wiki/Common-build-problems)