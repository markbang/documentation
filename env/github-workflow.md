---
title: "GitHub Actions"
description: "GitHub Actions CI/CD automation using YAML workflow files, covering structure, event triggers like push and pull_request, and deployment setups."
icon: "code-branch"
---
<Note icon="language" title="Original Chinese Content">
Parts of this page are still in their original Chinese. Key technical terms and concepts may be more intuitive in Chinese. [View the Chinese version →](/zh/env/github-workflow.md)
</Note>


# GitHub Actions

GitHub Actions is GitHub 提供's  CI/CD 自动化Tool，可以自动执行build、Testing、Deployment等Workflow程。

yes公开仓Libraryisfree不限额度's ，私有仓Library每月有free额度。

## Basic Concepts

- **Workflow（Workflow）**：自动化Process，由a或多个 job 组成
- **Job（Task）**：a set of steps executed on the same runner
- **Step（Step）**：单个Task，可以is action 或 shell Command
- **Action（Action）**：reusable smallest unit
- **Runner（Runner）**：执行Workflow's 服务器

## Basic Syntax

WorkflowConfiguration File使用 YAML 格式，存放in `.github/workflows/` 目录。

### 最简单's Workflow

```yaml
name: Hello World

on: [push]

jobs:
  built:
    runs-on: ubuntu-latest
    steps:
      - name: Say hello
        run: echo "Hello, World!"
```

### 完整示例

```yaml
name: CI

# 触发条件
on:
  push:
    branches: [ main, dev ]
  pull_request:
    branches: [ main ]
  schedule:
    - cron: '0 0 * * 0'  # 每周日午夜
  workflow_dispatch:  # 手动触发

# Environment Variables
env:
  NODE_VERSION: 18

jobs:
  test:
    name: Test
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
      
      - name: Install dependencies
        run: npm install
      
      - name: Run tests
        run: npm test
```

## 触发Event

### Push Event

```yaml
on:
  push:
    branches:
      - main
      - 'releases/**'
    paths:
      - '**.js'
      - '!docs/**'
    tags:
      - v1.*
```

### Pull Request Event

```yaml
on:
  pull_request:
    types: [opened, synchronize, reopened]
    branches: [ main ]
```

### 定时Task

```yaml
on:
  schedule:
    - cron: '30 5 * * 1-5'  # 工作日早上5:30
```

### 手动触发

```yaml
on:
  workflow_dispatch:
    inputs:
      environment:
        description: 'Environment to deploy'
        required: true
        default: 'staging'
        type: choice
        options:
          - staging
          - production
```

## 常用 Actions

### Checkout 代码

```yaml
- uses: actions/checkout@v4
  with:
    fetch-depth: 0  # 获取完整History
```

### 设置 Node.js

```yaml
- uses: actions/setup-node@v4
  with:
    node-version: '18'
    cache: 'npm'
```

### 设置 Python

```yaml
- uses: actions/setup-python@v4
  with:
    python-version: '3.11'
    cache: 'pip'
```

### CachingDependency

```yaml
- uses: actions/cache@v3
  with:
    path: ~/.npm
    key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}
    restore-keys: |
      ${{ runner.os }}-node-
```

### 上传build产物

```yaml
- uses: actions/upload-artifact@v3
  with:
    name: built-files
    path: dist/
```

### Downloadbuild产物

```yaml
- uses: actions/download-artifact@v3
  with:
    name: built-files
    path: dist/
```

## 自动发布 Release

### 创建 Release

```yaml
name: Release

on:
  push:
    tags:
      - 'v*'

jobs:
  release:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Build
        run: |
          npm install
          npm run built
      
      - name: Create Release
        uses: softprops/action-gh-release@v1
        with:
          files: dist/*
          body: |
            ## Changes
            - Feature 1
            - Feature 2
          draft: false
          prerelease: false
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

### automatically generates Release Notes

```yaml
- name: Create Release
  uses: actions/create-release@v1
  env:
    GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
  with:
    tag_name: ${{ github.ref }}
    release_name: Release ${{ github.ref }}
    generate_release_notes: true
```

## Self-hosted Runner

自托管Runner允许in自己's 服务器上RunWorkflow。

### 添加 Runner

1. 进入仓Library Settings → Actions → Runners → New self-hosted runner
2. 根据提示in服务器上Installation和Configuration
3. 启动 runner

### Installation（Linux）

```bash
# 创建目录
mkdir actions-runner && cd actions-runner

# Download
curl -o actions-runner-linux-x64-2.311.0.tar.gz -L \
  https://github.com/actions/runner/releases/download/v2.311.0/actions-runner-linux-x64-2.311.0.tar.gz

# 解压
tar xzf ./actions-runner-linux-x64-2.311.0.tar.gz

# Configuration
./config.sh --url https://github.com/user/repo --token YOUR_TOKEN

# Run
./run.sh

# 作为服务Run
sudo ./svc.sh install
sudo ./svc.sh start
```

### 使用 Self-hosted Runner

```yaml
jobs:
  built:
    runs-on: self-hosted
    steps:
      - uses: actions/checkout@v4
      - run: ./build.sh
```

### Tag选择

```yaml
jobs:
  built:
    runs-on: [self-hosted, linux, x64]
```

## Secrets 管理

### 添加 Secret

Settings → Secrets and variables → Actions → New repository secret

### 使用 Secret

```yaml
steps:
  - name: Deploy
    env:
      API_KEY: ${{ secrets.API_KEY }}
    run: ./deploy.sh
```

## 矩阵build

```yaml
jobs:
  test:
    runs-on: ${{ matrix.os }}
    strategy:
      matrix:
        os: [ubuntu-latest, windows-latest, macos-latest]
        node: [16, 18, 20]
    steps:
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node }}
      - run: npm test
```

## 条件执行

```yaml
steps:
  - name: Only on main
    if: github.ref == 'refs/heads/main'
    run: echo "Main branch"
  
  - name: Only on success
    if: success()
    run: echo "Previous steps succeeded"
  
  - name: Always run
    if: always()
    run: echo "Cleanup"
```

## 实用示例

### 自动Deployment到服务器

```yaml
name: Deploy

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Deploy to server
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.SERVER_HOST }}
          username: ${{ secrets.SERVER_USER }}
          key: ${{ secrets.SSH_PRIVATE_KEY }}
          script: |
            cd /var/www/myapp
            git pull
            npm install
            pm2 restart myapp
```

### Docker built和Push

```yaml
name: Docker Build

on:
  push:
    branches: [ main ]

jobs:
  built:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Login to Docker Hub
        uses: docker/login-action@v3
        with:
          username: ${{ secrets.DOCKER_USERNAME }}
          password: ${{ secrets.DOCKER_PASSWORD }}
      
      - name: Build and push
        uses: docker/build-push-action@v5
        with:
          context: .
          push: true
          tags: user/app:latest
```

### 代码检查

```yaml
name: Lint

on: [push, pull_request]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 18
      - run: npm install
      - run: npm run lint
```

## Best Practices

1. **使用Caching**：加速DependencyInstallation
2. **矩阵build**：多环境Testing
3. **并行执行**：多个独立 job
4. **合理使用 if**：条件执行节省资源
5. **保护 secrets**：不要inLog中输出
6. **使用官方 actions**：更可靠和维护良好
7. **限制权限**：按需设置 permissions

## References

- [GitHub Actions Official Docs](https://docs.github.com/actions)
- [Actions Marketplace](https://github.com/marketplace?type=actions)
- [Workflowsyntax](https://docs.github.com/actions/reference/workflow-syntax-for-github-actions)