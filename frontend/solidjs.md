---
title: "SolidJS + Tauri Desktop"
description: "Building local-first desktop apps with SolidJS for reactive UIs and Tauri v2 for the Rust shell, based on OnlyWrite project experience."
icon: "laptop-code"
---

# SolidJS + Tauri Desktop Development

SolidJS is a truly reactive UI framework — no virtual DOM, no diffing. Tauri v2 wraps your web frontend in a Rust shell for native desktop packaging. Together they create fast, lightweight desktop apps.

<Card title="OnlyWrite" icon="pen-nib" href="https://github.com/markbang/OnlyWrite">
A local-first writing app built with SolidJS + Tauri 2 + TypeScript.
</Card>

## Why SolidJS + Tauri?

| Concern | SolidJS | React/Vue |
|---------|---------|-----------|
| Rendering | True reactivity (no VDOM) | Virtual DOM diffing |
| Bundle size | ~7KB | ~40KB+ (React) |
| Update granularity | Fine-grained (per signal) | Component-level |
| Desktop shell | Tauri (Rust, ~3MB binary) | Electron (~150MB) |
| Memory footprint | Low | High |

## Project Structure

```text
onlywrite/
├── src/                    # SolidJS frontend
│   ├── components/         # UI components
│   │   ├── writing-area.tsx
│   │   ├── file-browser.tsx
│   │   ├── theme-toggle.tsx
│   │   ├── language-toggle.tsx
│   │   └── s3-config-dialog.tsx
│   ├── routes/             # File-based routing
│   │   ├── __root.tsx      # Root layout
│   │   ├── index.tsx       # Home page
│   │   ├── dashboard.tsx   # Main workspace
│   │   └ login.tsx         # Auth gate
│   ├── lib/
│   │   ├── i18n.ts         # Bilingual support
│   │   ├── markdown.ts     # Markdown parsing
│   ├── index.tsx           # App entry
├── src-tauri/              # Rust backend
│   ├── Cargo.toml
│   ├── capabilities/       # Tauri permissions
│   ├── tauri.conf.json     # App configuration
├── test/                   # Vitest + Playwright
├── package.json
└── tsconfig.json
```

## Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Frontend | SolidJS 1.9 | Reactive UI |
| Styling | Tailwind CSS 4 | Utility classes |
| Icons | Lucide Solid | Icon components |
| Markdown | marked + DOMPurify | Parsing + sanitization |
| Desktop | Tauri 2 | Rust shell, file system access |
| Testing | Vitest + Playwright | Unit + E2E tests |
| Build | Vite 7 | Dev server + bundling |

## SolidJS Reactivity Patterns

SolidJS uses signals and derived computations — no hooks, no re-renders:

```tsx
import { createSignal, createEffect, createMemo } from "solid-js"

function WritingArea() {
  const [content, setContent] = createSignal("")
  const [mode, setMode] = createSignal<"edit" | "render" | "split">("edit")

  // Derived value — recomputes only when content changes
  const renderedHtml = createMemo(() => parseMarkdown(content()))

  // Effect — runs when mode changes
  createEffect(() => {
    localStorage.setItem("last-mode", mode())
  })

  return (
    <div class="flex h-full">
      {mode() === "edit" && <textarea value={content()} onInput={(e) => setContent(e.currentTarget.value)} />}
      {mode() === "render" && <div innerHTML={renderedHtml()} />}
      {mode() === "split" && (
        <>
          <textarea value={content()} onInput={(e) => setContent(e.currentTarget.value)} />
          <div innerHTML={renderedHtml()} />
        </>
      )}
    </div>
  )
}
```

<Tip>
In SolidJS, signals update *exactly* the DOM nodes that read them — no component re-render, no VDOM diff. This makes real-time editors feel instant.
</Tip>

## File-Based Workspace

For a local-first writing app, files live on disk, not in a database:

```tsx
import { createSignal } from "solid-js"
// Tauri file system API
import { readTextFile, writeTextFile } from "@tauri-apps/api/fs"

const [currentFile, setCurrentFile] = createSignal<string | null>(null)
const [content, setContent] = createSignal("")

async function openFile(path: string) {
  const text = await readTextFile(path)
  setCurrentFile(path)
  setContent(text)
}

async function saveFile() {
  if (!currentFile()) return
  await writeTextFile(currentFile()!, content())
}
```

<Note>
Using Tauri's `fs` API gives direct file system access from JavaScript — no server needed. The Rust side handles permission gating through the `capabilities/` config.
</Note>

## Bilingual UI (i18n)

Simple signal-based i18n without heavy libraries:

```ts
// src/lib/i18n.ts
import { createSignal } from "solid-js"

type Locale = "en" | "zh"
const [locale, setLocale] = createSignal<Locale>(
  (localStorage.getItem("locale") as Locale) ?? "en"
)

const translations = {
  en: {
    "app.title": "OnlyWrite",
    "file.open": "Open File",
    "file.save": "Save",
    "mode.edit": "Edit",
    "mode.render": "Render",
    "mode.split": "Split View",
  },
  zh: {
    "app.title": "OnlyWrite",
    "file.open": "打开文件",
    "file.save": "保存",
    "mode.edit": "编辑",
    "mode.render": "渲染",
    "mode.split": "分屏",
  },
}

export function t(key: string) {
  return translations[locale()][key] ?? key
}

export { locale, setLocale }
```

```tsx
// src/components/language-toggle.tsx
import { locale, setLocale } from "../lib/i18n"

export function LanguageToggle() {
  return (
    <button onClick={() => setLocale(locale() === "en" ? "zh" : "en")}>
      {locale() === "en" ? "中文" : "EN"}
    </button>
  )
}
```

## S3 Image Upload

Optional S3 integration for image uploads — configured via dialog, not hardcoded:

```tsx
// src/components/s3-config-dialog.tsx
import { createSignal } from "solid-js"
import { invoke } from "@tauri-apps/api/core"

const [s3Config, setS3Config] = createSignal({
  endpoint: "",
  bucket: "",
  accessKey: "",
  secretKey: "",
})

async function uploadImage(file: File) {
  const result = await invoke("upload_to_s3", {
    config: s3Config(),
    filePath: file.path,
  })
  return result // Returns the URL
}
```

## Tauri Configuration

```json
// src-tauri/tauri.conf.json
{
  "productName": "OnlyWrite",
  "version": "0.2.0",
  "identifier": "com.onlywrite.app",
  "app": {
    "windows": [
      { "title": "OnlyWrite", "width": 900, "height": 640 }
    ]
  }
}
```

### Capabilities (Permission Gating)

```json
// src-tauri/capabilities/desktop.json
{
  "identifier": "desktop",
  "permissions": [
    "core:default",
    "fs:default",
    "fs:allow-read-text-file",
    "fs:allow-write-text-file",
    "dialog:allow-open",
    "dialog:allow-save"
  ]
}
```

<Note>
Tauri v2 uses a capability-based permission system. Each capability file explicitly lists which APIs the frontend can call. This prevents unauthorized file access or system calls.
</Note>

## Autosave Pattern

Combine SolidJS reactivity with debounced saves:

```tsx
const [content, setContent] = createSignal("")
let saveTimer: number | null = null

createEffect(() => {
  const text = content()
  if (saveTimer) clearTimeout(saveTimer)
  saveTimer = setTimeout(() => {
    if (currentFile()) writeTextFile(currentFile()!, text)
  }, 2000) // 2-second debounce
})
```

## Best Practices

1. **Signals over state** — SolidJS signals are fine-grained; avoid "lifting" state like React
2. **Local-first** — Read/write files directly via Tauri `fs` API, no backend server needed
3. **Capability gating** — Restrict Tauri API access through `capabilities/` config files
4. **Simple i18n** — Signal-based dictionary lookup is enough for bilingual apps
5. **Autosave with debounce** — Write to disk after a short idle period, not on every keystroke
6. **DOMPurify for HTML** — Always sanitize rendered markdown HTML

## References

- [SolidJS Docs](https://www.solidjs.com/)
- [Tauri v2 Docs](https://v2.tauri.app/)
- [OnlyWrite repo](https://github.com/markbang/OnlyWrite)