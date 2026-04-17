---
title: "Tauri"
description: "Tauri is a Rust-based cross-platform desktop framework smaller than Electron, covering project setup, Rust-JS communication, and app packaging."
icon: "laptop-code"
---
<Note icon="language" title="Original Chinese Content">
Parts of this page are still in their original Chinese. Key technical terms and concepts may be more intuitive in Chinese. [View the Chinese version →](/zh/software/tauri.md)
</Note>


# Tauri

Rust cross-platform app，although a relatively new framework，但is已经有较为成熟's 产品，for example：[ChatWise](https://chatwise.app)、[HuLa](https://hulaspark.com/)，学习这种跨端Framework当然is要跨端才好，
write once, built apps for multiple platforms

## use GitHub Actions to auto-publish releases

> .github/workflows/auto-push.yml

```yml
name: 'publish'

on:
  push:
    tags:
      - 'v*'

jobs:
  publish-tauri:
    permissions:
      contents: write
    strategy:
      fail-fast: false
      matrix:
        include:
          - platform: 'macos-latest' # for Arm based macs (M1 and above).
            args: '--target aarch64-apple-darwin'
          - platform: 'macos-latest' # for Intel based macs.
            args: '--target x86_64-apple-darwin --bundles app'
          - platform: 'ubuntu-22.04' # for Tauri v1 you could replace this with ubuntu-20.04.
            args: ''
          - platform: 'windows-latest'
            args: ''

    runs-on: ${{ matrix.platform }}
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0
      - name: Install pnpm
        uses: pnpm/action-setup@v4
        with:
          version: 10
      - name: setup node
        uses: actions/setup-node@v4
        with:
          node-version: lts/*
          cache: 'pnpm'
      - name: install Rust stable
        uses: dtolnay/rust-toolchain@stable
        with:
          # Those targets are only used on macos runners so it's in an `if` to slightly speed up windows and linux builts.
          targets: ${{ matrix.platform == 'macos-latest' && 'aarch64-apple-darwin,x86_64-apple-darwin' || '' }}

      - name: install dependencies (ubuntu only)
        if: matrix.platform == 'ubuntu-22.04' # This must match the platform value defined above.
        run: |
          sudo apt-get update
          sudo apt-get install -y libwebkit2gtk-4.0-dev libwebkit2gtk-4.1-dev libappindicator3-dev librsvg2-dev patchelf
        # webkitgtk 4.0 is for Tauri v1 - webkitgtk 4.1 is for Tauri v2.
        # You can remove the one that doesn't apply to your app to speed up the workflow a bit.

      - name: install frontend dependencies
        run: pnpm install # change this to npm, pnpm or bun depending on which one you use.

      - uses: tauri-apps/tauri-action@v0
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        with:
          tagName: v__VERSION__ # the action automatically replaces \_\_VERSION\_\_ with the app version.
          releaseName: 'OnlyWrite v__VERSION__'
          releaseBody: 'See the assets to download this version and install.'
          releaseDraft: false
          prerelease: false
          args: ${{ matrix.args }}
          updaterJsonPreferNsis: true
          updaterJsonKeepUniversal: true
      - run: npx changelogithub
        env:
          GITHUB_TOKEN: ${{secrets.GITHUB_TOKEN}}
```

> .github/workflows/test-build.yml

```yml
name: 'test-build'

on:
  pull_request:
    branches:
      - main
  push:
    branches:
      - main
      - dev
  workflow_dispatch:

jobs:
  test-tauri:
    strategy:
      fail-fast: false
      matrix:
        include:
          - platform: 'macos-latest' # for Arm based macs (M1 and above).
            args: '--target aarch64-apple-darwin'
          - platform: 'macos-latest' # for Intel based macs.
            args: '--target x86_64-apple-darwin'
          - platform: 'ubuntu-22.04' # for Tauri v1 you could replace this with ubuntu-20.04.
            args: ''
          - platform: 'windows-latest'
            args: ''

    runs-on: ${{ matrix.platform }}
    steps:
      - uses: actions/checkout@v4
      - name: Install pnpm
        uses: pnpm/action-setup@v4
        with:
          version: 10
      - name: setup node
        uses: actions/setup-node@v4
        with:
          node-version: lts/*
          cache: 'pnpm'
      - name: install Rust stable
        uses: dtolnay/rust-toolchain@stable
        with:
          # Those targets are only used on macos runners so it's in an `if` to slightly speed up windows and linux builts.
          targets: ${{ matrix.platform == 'macos-latest' && 'aarch64-apple-darwin,x86_64-apple-darwin' || '' }}

      - name: install dependencies (ubuntu only)
        if: matrix.platform == 'ubuntu-22.04' # This must match the platform value defined above.
        run: |
          sudo apt-get update
          sudo apt-get install -y libwebkit2gtk-4.0-dev libwebkit2gtk-4.1-dev libappindicator3-dev librsvg2-dev patchelf
        # webkitgtk 4.0 is for Tauri v1 - webkitgtk 4.1 is for Tauri v2.
        # You can remove the one that doesn't apply to your app to speed up the workflow a bit.

      - name: install frontend dependencies
        run: pnpm install # change this to npm, pnpm or bun depending on which one you use.

      # If tagName and releaseId are omitted tauri-action will only built the app and won't try to upload any assets.
      - uses: tauri-apps/tauri-action@v0
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        with:
          args: ${{ matrix.args }}
```

if unfamiliar with[Github Action](https://github.com/features/actions)'s 可以去看我written by[intro guide](../env/github-workflow)

使用上面's Workflow可以in push tag v\*'s 时候自动build并发布 Release 和generates changelog

changelog generates使用's is[Antfu changelogithub](https://github.com/antfu/changelogithub)采用's is[Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/#summary)syntax，可以使用这种syntax来Commit`git message`generates好看's 、easy-to-understand changelog

![changelog_example](https://cdn.bangwu.top/img/o85kd-yqbangwu20250405111742.webp)

### [Tauri-action](https://github.com/tauri-apps/tauri-action)

app signing

如何Configuration latest.json

how to built mobile app

how to auto-publish to platforms

### Github Action Release 仓Libraryallow read/write permissions

otherwise there'll be errors publishing Release`Error permisson`

## Fix: Next.js SSR window is not defined

## 解决 Error: Cannot read properties of undefined (reading 'xxxxxx')

这个报错很有可能is使用Plugin未加载导致's ，initialize plugin in main.rs
