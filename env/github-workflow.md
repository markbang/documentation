---
title: "GitHub Actions"
description: "GitHub Actions CI/CD automation using YAML workflow files, covering structure, event triggers like push and pull_request, and deployment setups."
icon: "code-branch"
---
# GitHub Actions

GitHub Actions is GitHub’s CI/CD automation tool. It can automatically run workflows for building, testing, deployment, and more.

Public repositories are free to use, while private repositories come with a monthly free quota.

## Basic Concepts

- **Workflow**: an automated process made up of one or more jobs
- **Job（Task）**：a set of steps executed on the same runner
- **Step**: a single task, which can be either an action or a shell command
- **Action（Action）**：reusable smallest unit
- **Runner**: the server that executes the workflow

## Basic Syntax

Workflow configuration files use YAML and live in the `.github/workflows/` directory.

### Simplest workflow

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

### Complete example

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

## Trigger events

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

### Scheduled tasks

```yaml
on:
  schedule:
    - cron: '30 5 * * 1-5'  # 工作日早上5:30
```

### Manual trigger

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

## Common actions

### Checkout code

```yaml
- uses: actions/checkout@v4
  with:
    fetch-depth: 0  # 获取完整History
```

### Set up Node.js

```yaml
- uses: actions/setup-node@v4
  with:
    node-version: '18'
    cache: 'npm'
```

### Set up Python

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

### Upload build artifacts

```yaml
- uses: actions/upload-artifact@v3
  with:
    name: built-files
    path: dist/
```

### Download build artifacts

```yaml
- uses: actions/download-artifact@v3
  with:
    name: built-files
    path: dist/
```

## Automatically publish a release

### Create a release

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

Self-hosted runners let you run workflows on your own servers.

### Add a runner

1. Go to **Repository Settings → Actions → Runners → New self-hosted runner**.
2. Follow the prompts to install and configure it on your server.
3. Start the runner.

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

### Use a self-hosted runner

```yaml
jobs:
  built:
    runs-on: self-hosted
    steps:
      - uses: actions/checkout@v4
      - run: ./build.sh
```

### Label selection

```yaml
jobs:
  built:
    runs-on: [self-hosted, linux, x64]
```

## Secrets management

### Add a secret

Settings → Secrets and variables → Actions → New repository secret

### Use a secret

```yaml
steps:
  - name: Deploy
    env:
      API_KEY: ${{ secrets.API_KEY }}
    run: ./deploy.sh
```

## Matrix builds

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

## Conditional execution

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

## Practical examples

### Automatically deploy to a server

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

### Build and push Docker images

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

### Code checks

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

## Speed up CI without dropping checks

Coding agents write code faster than CI can verify it, so CI wait time becomes the bottleneck. The goal is to cut wait time without removing any check that protects a release. Work through these steps in order, and measure after each one.

The list also works as a prompt for a coding agent: have it measure first, apply the steps, and report before-and-after numbers.

### 1. Measure where the time goes

Split each job into three parts: **queued** (waiting for a runner), **setup** (checkout, toolchains, dependencies), and **work** (build and tests). Slow CI is often slow setup, not slow tests.

```bash
# Last 50 runs of one workflow: job, created, started, completed
gh run list --workflow ci.yml --limit 50 --json databaseId --jq '.[].databaseId' |
while read -r id; do
  gh api "repos/{owner}/{repo}/actions/runs/$id/jobs" \
    --jq '.jobs[] | [.name, .created_at, .started_at, .completed_at] | @tsv'
done
```

`started_at` minus `created_at` is queue time. Each job's `steps` array has its own timestamps, so you can split setup from work the same way.

### 2. Cancel superseded PR runs, but never `main`

```yaml
concurrency:
  group: ${{ github.workflow }}-${{ github.head_ref || github.run_id }}
  cancel-in-progress: true
```

`github.head_ref` is only set for pull request events, so new pushes to the same PR share a group and cancel the older run. Pushes to `main` fall back to the unique `run_id`, so every commit on `main` still gets a full run. A group such as `${{ github.ref }}` would also cancel or replace queued `main` runs.

### 3. Skip docs-only changes without blocking merges

If a workflow is skipped by `paths`, `paths-ignore`, or branch filters, its required checks stay **Pending** and the PR cannot merge. A job skipped by an `if:` condition reports success. For required checks, let the workflow start and skip jobs instead:

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

### 4. Use the cache built into setup actions

- `actions/setup-node` caches when you set `cache: npm` (or `yarn`, `pnpm`).
- `actions/setup-go` caches by default.
- For Rust, use `Swatinem/rust-cache`.

Cache storage is 10 GB per repository by default. Entries not used for 7 days are deleted, and when the repository is full, the least recently used entries are evicted, which can cause thrashing. Don't cache what you won't restore.

Caches created by a `pull_request` run are scoped to that PR's merge ref, so other PRs can't reuse them. Run CI on `push` to `main` so PRs can restore a warm cache from the default branch.

### 5. Make a second build nearly free

Build twice locally. The second build should take almost no time. If it doesn't, something is defeating the cache. Common causes are a Dockerfile that copies the whole repository before installing dependencies, or a build script that watches a file that doesn't exist, so the target always looks stale.

```dockerfile
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
```

### 6. Download tools instead of compiling them

`go install` and `cargo install` compile from source on every run. Download release binaries instead, or use an installer that fetches prebuilt binaries, such as `cargo binstall` or `taiki-e/install-action` for Rust tools.

### 7. Run independent jobs in parallel

Remove `needs:` entries that don't pass outputs or artifacts. Split the longest test suite across several machines with a matrix.

### 8. Save macOS runners for work that needs macOS

On the Free, Pro, and Team plans, standard GitHub-hosted runners allow at most 5 concurrent macOS jobs, shared by all your workflows. Move formatting, lint, and dependency audits that don't depend on the OS to `ubuntu-latest`.

### 9. Don't do the same work twice

Don't rerun a check that another job already ran. A frontend-only job doesn't need to restore the Rust cache.

### 10. Compare before and after

Push the changes, rerun the measurement from step 1, and compare the same jobs. Look for the next slowest phase and repeat.

## Best Practices

1. **Use caching** to speed up dependency installation.
2. **Use matrix builds** for multi-environment testing.
3. **Run jobs in parallel** when they are independent.
4. **Use `if` wisely** to save resources with conditional execution.
5. **Protect secrets** and never print them in logs.
6. **Prefer official actions** because they are more reliable and better maintained.
7. **Limit permissions** and grant only what each workflow needs.
8. **Have a CI fallback plan** — GitHub Actions outages happen regularly; consider self-hosted runners or a secondary CI platform.

## Platform Reliability Risk

GitHub Actions has experienced frequent outages in 2025–2026. Mitchell Hashimoto (creator of Vagrant and Terraform, GitHub user #1299 since 2008) announced in April 2026 that his open-source project **Ghostty** is leaving GitHub, primarily because of persistent CI/CD reliability issues:

> "I started marking each day with an X if GitHub outages affected my work. Nearly every day had an X."

<Note title="Durable lesson">
When your CI/CD platform has regular outages that block you for hours, it becomes a productivity risk — not just an inconvenience. For serious projects, consider:

- **Self-hosted runners** as a fallback (see the Self-hosted Runner section above)
- **Alternative CI platforms** (CircleCI, Buildkite, Gitea Actions)
- **Mirror your repo** to another platform so you can switch CI quickly
- **Don't couple your entire workflow** to one platform's availability
</Note>

### Mitigation Strategies

1. **Self-hosted runners** — Run workflows on your own infrastructure; unaffected by GitHub outages
2. **Multi-platform CI** — Mirror critical workflows to an alternative (CircleCI, Buildkite)
3. **Local testing first** — Run lint/typecheck/test locally before pushing; CI should be a gate, not a bottleneck
4. **Cache aggressively** — Reduce job duration so outages cause less blocked time
5. **Read-only GitHub mirror** — Keep your source on GitHub for discoverability, but host CI elsewhere

## References

- [GitHub Actions Official Docs](https://docs.github.com/actions)
- [Folo source: Tw93 on speeding up GitHub Actions CI](https://x.com/HiTw93/status/2116797957454401746)
- [GitHub Docs: Control the concurrency of workflows and jobs](https://docs.github.com/en/actions/writing-workflows/choosing-what-your-workflow-does/control-the-concurrency-of-workflows-and-jobs)
- [GitHub Docs: Troubleshooting required status checks](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/collaborating-on-repositories-with-code-quality-features/troubleshooting-required-status-checks)
- [GitHub Docs: Dependency caching reference](https://docs.github.com/en/actions/reference/workflows-and-actions/dependency-caching)
- [GitHub Docs: Actions limits](https://docs.github.com/en/actions/reference/limits)
- [actions/setup-go: caching](https://github.com/actions/setup-go#caching-dependency-files-and-build-outputs)
- [Actions Marketplace](https://github.com/marketplace?type=actions)
- [Workflowsyntax](https://docs.github.com/actions/reference/workflow-syntax-for-github-actions)