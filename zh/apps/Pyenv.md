---
title: "Pyenv"
description: "Pyenv 是 Python 版本管理工具，允许在同一系统安装和切换多个 Python 版本并通过 pyenv-virtualenv 管理虚拟环境。本文介绍 pyenv-win 与 Linux/macOS 的安装配置流程，涵盖全局与项目级版本切换、虚拟环境创建激活及常见编译依赖缺失的排查方法。"
icon: "python"
---

# [Pyenv](https://github.com/pyenv/pyenv?tab=readme-ov-file#windows)

Pyenv 是一个 Python 版本管理工具，允许你在同一系统上轻松安装和切换多个 Python 版本。

## 特性

- 📦 管理多个 Python 版本
- 🔄 快速切换 Python 版本
- 🎯 为项目设置特定版本
- 🌐 支持虚拟环境
- 🪟 跨平台支持（Windows/Linux/Mac）

## 安装

### Windows

使用 [pyenv-win](https://github.com/pyenv-win/pyenv-win)：

```powershell
# 使用 pip 安装
pip install pyenv-win --target $HOME/.pyenv

# 或使用 Git
git clone https://github.com/pyenv-win/pyenv-win.git $HOME/.pyenv
```

添加环境变量：
```powershell
[System.Environment]::SetEnvironmentVariable('PYENV',$env:USERPROFILE + "\.pyenv\pyenv-win\","User")
[System.Environment]::SetEnvironmentVariable('PYENV_ROOT',$env:USERPROFILE + "\.pyenv\pyenv-win\","User")
[System.Environment]::SetEnvironmentVariable('PYENV_HOME',$env:USERPROFILE + "\.pyenv\pyenv-win\","User")
```

### Linux/Mac

```bash
# 使用官方安装脚本
curl https://pyenv.run | bash

# 或使用 Homebrew (Mac)
brew install pyenv
```

配置 Shell（添加到 `~/.bashrc` 或 `~/.zshrc`）：

```bash
export PYENV_ROOT="$HOME/.pyenv"
export PATH="$PYENV_ROOT/bin:$PATH"
eval "$(pyenv init --path)"
eval "$(pyenv init -)"
```

## 基本使用

### 查看可安装的版本

```bash
# 列出所有可用版本
pyenv install --list

# 搜索特定版本
pyenv install --list | grep 3.11
```

### 安装 Python 版本

```bash
# 安装特定版本
pyenv install 3.11.5

# 安装最新版本
pyenv install 3.11

# 查看安装进度
pyenv install -v 3.11.5
```

### 查看已安装版本

```bash
# 列出所有已安装版本
pyenv versions

# 查看当前版本
pyenv version
```

### 切换 Python 版本

```bash
# 全局切换（所有 shell）
pyenv global 3.11.5

# 本地切换（当前目录）
pyenv local 3.10.12

# 临时切换（当前 shell）
pyenv shell 3.9.18
```

### 卸载版本

```bash
pyenv uninstall 3.9.18
```

## 高级用法

### 为项目设置版本

```bash
# 在项目目录下
cd my_project
pyenv local 3.11.5

# 会创建 .python-version 文件
cat .python-version
# 3.11.5
```

### 虚拟环境

结合 pyenv-virtualenv 使用：

```bash
# 安装 pyenv-virtualenv
git clone https://github.com/pyenv/pyenv-virtualenv.git $(pyenv root)/plugins/pyenv-virtualenv

# 创建虚拟环境
pyenv virtualenv 3.11.5 my-project-env

# 激活虚拟环境
pyenv activate my-project-env

# 停用虚拟环境
pyenv deactivate

# 删除虚拟环境
pyenv virtualenv-delete my-project-env

# 为项目自动激活虚拟环境
cd my_project
pyenv local my-project-env
```

### 查看版本来源

```bash
# 查看当前版本及来源
pyenv version
# 3.11.5 (set by /home/user/project/.python-version)
```

### 刷新 shims

```bash
# 重新生成 shims（安装新包后）
pyenv rehash
```

## 配置文件

### 全局配置

```bash
# 设置全局版本
pyenv global 3.11.5

# 配置文件位置
~/.pyenv/version
```

### 项目配置

```bash
# 项目目录下的 .python-version 文件
echo "3.11.5" > .python-version
```

### Shell 配置

```bash
# 临时设置
export PYENV_VERSION=3.11.5
```

## 常见问题

### 安装失败

**Linux 依赖缺失：**

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

### 版本切换不生效

```bash
# 确保 pyenv 在 PATH 中
which pyenv

# 重新加载配置
source ~/.bashrc  # 或 ~/.zshrc

# 重新生成 shims
pyenv rehash
```

### Windows 路径问题

确保环境变量配置正确，并重启终端。

## 与其他工具对比

| 工具 | 特点 | 适用场景 |
|------|------|---------|
| **pyenv** | 多版本管理 | 需要频繁切换 Python 版本 |
| **venv** | 内置虚拟环境 | 简单项目隔离 |
| **conda** | 科学计算环境 | 数据科学、机器学习 |
| **poetry** | 依赖管理 + 打包 | 现代 Python 项目 |
| **pipenv** | Pipfile 管理 | 依赖锁定 |

## 最佳实践

1. **为每个项目设置 local 版本**：避免全局版本冲突
2. **使用虚拟环境**：结合 pyenv-virtualenv
3. **提交 .python-version**：团队协作时统一版本
4. **定期更新 pyenv**：获取新版本支持
5. **记录依赖**：使用 requirements.txt 或 Pipfile

## 实用命令总结

```bash
# 常用命令速查
pyenv install --list          # 查看可安装版本
pyenv install 3.11.5          # 安装版本
pyenv versions                # 查看已安装版本
pyenv global 3.11.5           # 全局切换
pyenv local 3.11.5            # 项目切换
pyenv uninstall 3.11.5        # 卸载版本
pyenv rehash                  # 刷新 shims
pyenv which python            # 查看 python 路径
```

## 参考资源

- [Pyenv GitHub](https://github.com/pyenv/pyenv)
- [Pyenv-win GitHub](https://github.com/pyenv-win/pyenv-win)
- [官方文档](https://github.com/pyenv/pyenv/wiki)
- [常见问题](https://github.com/pyenv/pyenv/wiki/Common-build-problems)