---
title: "Tauri"
description: "Tauri is a Rust-based cross-platform desktop framework smaller than Electron, covering project setup, Rust-JS communication, and app packaging."
icon: "laptop-code"
---
# Tauri

Tauri is a Rust-based cross-platform app framework. Although it is relatively new, it already has mature products built with it, such as [ChatWise](https://chatwise.app) and [HuLa](https://hulaspark.com/). If you want to learn a cross-platform framework, it makes sense to pick one that truly ships across platforms.
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

If you are not familiar with [GitHub Actions](https://github.com/features/actions), you can read my [intro guide](../env/github-workflow).

With the workflow above, pushing a tag like `v*` can automatically build the app, publish a release, and generate a changelog.

The changelog is generated with [Antfu changelogithub](https://github.com/antfu/changelogithub), which follows the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/#summary) format. Using that commit style makes the generated changelog much cleaner and easier to read.

![changelog_example](https://cdn.bangwu.top/img/o85kd-yqbangwu20250405111742.webp)

### [Tauri-action](https://github.com/tauri-apps/tauri-action)

app signing

How to configure `latest.json`

how to built mobile app

how to auto-publish to platforms

### Allow GitHub Actions release permissions to read and write the repository

otherwise there'll be errors publishing Release`Error permisson`

## Fix: Next.js SSR window is not defined

## Fix: `Cannot read properties of undefined (reading 'xxxxxx')`

This error is often caused by a plugin not being loaded. Initialize the plugin in `main.rs`.
