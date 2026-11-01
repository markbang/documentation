---
title: "GitHub Actions"
description: "GitHub Actions 是 GitHub 内置的 CI/CD 自动化工具，通过 .github/workflows 目录下的 YAML 文件定义工作流，本文介绍 workflow 基本结构与语法、on 事件触发条件（push/pull_request/schedule）以及自动构建与部署实践。"
icon: "code-branch"
---

# GitHub Actions

GitHub Actions 是 GitHub 提供的 CI/CD 自动化工具，可以自动执行构建、测试、部署等工作流程。

对公开仓库是免费不限额度的，私有仓库每月有免费额度。

## 基本概念

- **Workflow（工作流）**：自动化流程，由一个或多个 job 组成
- **Job（任务）**：一组在同一 runner 上执行的 steps
- **Step（步骤）**：单个任务，可以是 action 或 shell 命令
- **Action（动作）**：可复用的最小单元
- **Runner（运行器）**：执行工作流的服务器

## 基本语法

工作流配置文件使用 YAML 格式，存放在 `.github/workflows/` 目录。

### 最简单的工作流

```yaml
name: Hello World

on: [push]

jobs:
  build:
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

# 环境变量
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

## 触发事件

### Push 事件

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

### Pull Request 事件

```yaml
on:
  pull_request:
    types: [opened, synchronize, reopened]
    branches: [ main ]
```

### 定时任务

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
    fetch-depth: 0  # 获取完整历史
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

### 缓存依赖

```yaml
- uses: actions/cache@v3
  with:
    path: ~/.npm
    key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}
    restore-keys: |
      ${{ runner.os }}-node-
```

### 上传构建产物

```yaml
- uses: actions/upload-artifact@v3
  with:
    name: build-files
    path: dist/
```

### 下载构建产物

```yaml
- uses: actions/download-artifact@v3
  with:
    name: build-files
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
          npm run build

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

### 自动生成 Release Notes

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

自托管运行器允许在自己的服务器上运行工作流。

### 添加 Runner

1. 进入仓库 Settings → Actions → Runners → New self-hosted runner
2. 根据提示在服务器上安装和配置
3. 启动 runner

### 安装（Linux）

```bash
# 创建目录
mkdir actions-runner && cd actions-runner

# 下载
curl -o actions-runner-linux-x64-2.311.0.tar.gz -L \
  https://github.com/actions/runner/releases/download/v2.311.0/actions-runner-linux-x64-2.311.0.tar.gz

# 解压
tar xzf ./actions-runner-linux-x64-2.311.0.tar.gz

# 配置
./config.sh --url https://github.com/user/repo --token YOUR_TOKEN

# 运行
./run.sh

# 作为服务运行
sudo ./svc.sh install
sudo ./svc.sh start
```

### 使用 Self-hosted Runner

```yaml
jobs:
  build:
    runs-on: self-hosted
    steps:
      - uses: actions/checkout@v4
      - run: ./build.sh
```

### 标签选择

```yaml
jobs:
  build:
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

## 矩阵构建

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

### 自动部署到服务器

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

### Docker 构建和推送

```yaml
name: Docker Build

on:
  push:
    branches: [ main ]

jobs:
  build:
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

## CI 提速：不减校验，只减等待

有了 AI 以后写代码快了很多，校验却没有跟着变快，CI 的等待时间成了新的瓶颈。目标是在不减少任何必要测试和功能校验的前提下，把等待时间压到最低。按顺序做，每改一步就量一次。

这份清单也可以直接交给编码 Agent：让它先测量，再逐条优化，最后给出优化前后的对比。

### 1. 先测量时间花在哪

把每个 job 拆成三段：**排队**（等 runner）、**准备**（checkout、工具链、依赖）和**干活**（构建与测试）。CI 慢，很多时候慢在准备阶段，而不是测试本身。

```bash
# 某个 workflow 最近 50 次运行：job、创建、开始、结束时间
gh run list --workflow ci.yml --limit 50 --json databaseId --jq '.[].databaseId' |
while read -r id; do
  gh api "repos/{owner}/{repo}/actions/runs/$id/jobs" \
    --jq '.jobs[] | [.name, .created_at, .started_at, .completed_at] | @tsv'
done
```

`started_at` 减 `created_at` 就是排队时间。每个 job 的 `steps` 数组也有各自的时间戳，用同样的办法就能把准备和干活分开。

### 2. 同一个 PR 只跑最新一次，`main` 不取消

```yaml
concurrency:
  group: ${{ github.workflow }}-${{ github.head_ref || github.run_id }}
  cancel-in-progress: true
```

`github.head_ref` 只在 pull request 事件里有值，所以同一个 PR 连续推送时会落在同一组，旧的运行被取消。推到 `main` 时退回到唯一的 `run_id`，保证 `main` 上每个提交都完整跑一遍。如果分组写成 `${{ github.ref }}`，`main` 上排队中的运行也会被取消或替换。

### 3. 只改文档不跑 CI，但别卡住合并

如果整个 workflow 因 `paths`、`paths-ignore` 或分支过滤被跳过，它对应的必需检查会一直停在 **Pending**，PR 合不进去。而被 `if:` 条件跳过的 job 会报告成功。所以必需检查要让 workflow 照常启动，在 job 层面跳过：

```yaml
jobs:
  changes:
    runs-on: ubuntu-latest
    outputs:
      code: ${{ steps.filter.outputs.code }}
    steps:
      - uses: actions/checkout@v4
      - uses: dorny/paths-filter@v3
        id: filter
        with:
          filters: |
            code:
              - 'src/**'
              - 'tests/**'
              - 'package*.json'
              - '.github/workflows/**'

  test:
    needs: changes
    if: needs.changes.outputs.code == 'true'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm ci && npm test
```

### 4. 优先用 setup 类 action 自带的缓存

- `actions/setup-node` 设置 `cache: npm`（或 `yarn`、`pnpm`）后才会缓存。
- `actions/setup-go` 默认开启缓存。
- Rust 用 `Swatinem/rust-cache`。

每个仓库的缓存默认只有 10 GB。7 天没被访问的条目会被删除；空间满了以后按最近访问时间淘汰，可能导致缓存反复创建又被删。用不上的东西不要往里放。

`pull_request` 触发的运行创建的缓存只属于该 PR 的 merge ref，其他 PR 用不上。给 `main` 的 `push` 也跑 CI，PR 才能从默认分支恢复热缓存。

### 5. 第二次构建应该几乎不花时间

在本地连续构建两次。第二次应该几乎不耗时；如果还很慢，就是有什么在破坏缓存。常见原因是 Dockerfile 在安装依赖前就 COPY 了整个仓库，或者构建脚本盯着一个不存在的文件，导致目标永远被当成过期。

```dockerfile
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
```

### 6. 工具直接下载预编译版本

`go install` 和 `cargo install` 每次都从源码现场编译。改为下载 release 二进制，或用会拉预编译产物的安装工具，Rust 工具可以用 `cargo binstall` 或 `taiki-e/install-action`。

### 7. 互不依赖的 job 并行跑

删掉不传 outputs 或 artifacts 的 `needs:`。最长的那套测试用 matrix 拆到多台机器上跑。

### 8. macOS runner 只留给必须用 macOS 的活

Free、Pro、Team 套餐下，标准 GitHub 托管 runner 最多同时跑 5 个 macOS job，且所有 workflow 共用这个额度。格式化、lint、依赖审计这些不挑系统的活，都挪到 `ubuntu-latest`。

### 9. 做过的事不重复做

别的 job 已经跑过的检查不要再跑一遍。只构建前端的 job 不需要恢复 Rust 缓存。

### 10. 对比优化前后

推送改动，用第 1 步的方法重新测量，对比同一批 job 的耗时。找出下一个最慢的阶段，再来一轮。

## 最佳实践

1. **使用缓存**：加速依赖安装
2. **矩阵构建**：多环境测试
3. **并行执行**：多个独立 job
4. **合理使用 if**：条件执行节省资源
5. **保护 secrets**：不要在日志中输出
6. **使用官方 actions**：更可靠和维护良好
7. **限制权限**：按需设置 permissions
8. **准备 CI 降级方案** — GitHub Actions 经常宕机；考虑自托管 Runner 或备用 CI 平台

## 平台可靠性风险

GitHub Actions 在 2025–2026 年经历了多次频繁宕机。Mitchell Hashimoto（Vagrant 和 Terraform 创造者，2008年注册的 GitHub 第 1299 号用户）于 2026年4月宣布他的开源项目 **Ghostty** 离开 GitHub，主要原因就是 CI/CD 可持续性问题：

> "我开始给每天打 X，标记 GitHub 宕机影响工作的日子。几乎每天都有 X。"

<Note title="持久教训">
当你的 CI/CD 平台经常宕机数小时，它就成了生产力风险，不只是不便。对严肃项目，考虑：

- **自托管 Runner** 作为降级方案（见上方自托管 Runner 章节）
- **备选 CI 平台**（CircleCI、Buildkite、Gitea Actions）
- **镜像仓库到其他平台**，以便快速切换 CI
- **不要把整个工作流绑在一个平台的可用性上**
</Note>

### 降级策略

1. **自托管 Runner** — 在自己的基础设施上跑工作流，不受 GitHub 宕机影响
2. **多平台 CI** — 把关键工作流镜像到备选平台（CircleCI、Buildkite）
3. **先本地测试** — 推送前本地跑 lint/typecheck/test；CI 应是门槛，不是瓶颈
4. **缓存用足** — 减少任务时长，宕机造成的阻塞时间更短
5. **只读 GitHub 镜像** — 保留 GitHub 作为发现渠道，但 CI 放别处

## 参考资源

- [GitHub Actions 官方文档](https://docs.github.com/actions)
- [Folo 来源：Tw93 关于 GitHub Actions CI 提速](https://x.com/HiTw93/status/2116797957454401746)
- [GitHub 文档：控制 workflow 与 job 的并发](https://docs.github.com/en/actions/writing-workflows/choosing-what-your-workflow-does/control-the-concurrency-of-workflows-and-jobs)
- [GitHub 文档：必需状态检查排障](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/collaborating-on-repositories-with-code-quality-features/troubleshooting-required-status-checks)
- [GitHub 文档：依赖缓存参考](https://docs.github.com/en/actions/reference/workflows-and-actions/dependency-caching)
- [GitHub 文档：Actions 限制](https://docs.github.com/en/actions/reference/limits)
- [actions/setup-go：缓存说明](https://github.com/actions/setup-go#caching-dependency-files-and-build-outputs)
- [Actions Marketplace](https://github.com/marketplace?type=actions)
- [工作流语法](https://docs.github.com/actions/reference/workflow-syntax-for-github-actions)