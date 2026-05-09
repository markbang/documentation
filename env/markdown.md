---
title: "Markdown Syntax"
description: "Markdown syntax reference covering headings, lists, links, images, code blocks, tables, blockquotes, and GFM extensions like task lists."
icon: "file-lines"
---
# Markdown syntax

Markdown is a lightweight markup language for formatting text. It is simple, easy to learn, and widely used for documents, blogs, and forums.

## Basic Syntax

### Headings

```markdown
# 一级title
## 二级title
### 三级title
#### 四级title
##### 五级title
###### 六级title
```

### Emphasis

```markdown
*斜体* 或 _斜体_
**粗体** 或 __粗体__
***粗斜体*** 或 ___粗斜体___
~~Removed线~~
```

Rendered output: *italic*, **bold**, ***bold italic***, ~~strikethrough~~

### list

#### Unordered lists

```markdown
- 项目1
- 项目2
  - 子项目2.1
  - 子项目2.2
- 项目3

* 也可以用星号
+ 或者加号
```

#### Ordered lists

```markdown
1. 第一项
2. 第二项
3. 第三项
   1. 子项3.1
   2. 子项3.2
```

### Link

```markdown
[Link文本](https://example.com)
[带title's Link](https://example.com "鼠标悬停显示")

# 自动Link
<https://example.com>
<email@example.com>

# Reference式Link
[Link文本][ref]
[ref]: https://example.com
```

### Images

```markdown
![替代文本](image.jpg)
![带title's 图片](image.jpg "图片title")

# 图片Link
[![图片](image.jpg)](https://example.com)
```

### Blockquotes

```markdown
> 这is一段Reference
> 可以有多行

> 多级Reference
>> 第二级
>>> 第三级
```

### Code

#### Inline code

```markdown
使用 `反引号` Package裹代码
```

#### Code blocks

````markdown
```python
def hello():
    print("Hello World")
```

```javascript
console.log("Hello World");
```
````

### Horizontal rules

```markdown
---
***
___
```

---

### Tables

```markdown
| Left aligned | Centered | Right aligned |
|:-------|:----:|-------:|
| Content 1 | Content 2 | Content 3 |
| 内容4  | 内容5 | 内容6 |
```

| Left aligned | Centered | Right aligned |
|:-------|:----:|-------:|
| Content 1 | Content 2 | Content 3 |

### Task lists

```markdown
- [x] FinishedTask
- [ ] Unfinished task
- [ ] 另aTask
```

- [x] FinishedTask
- [ ] Unfinished task

### Footnotes

```markdown
这is一段文字[^1]

[^1]: 这is脚注内容
```

## Github Flavored Markdown (GFM)

GitHub extends Markdown with several extra features.

### Syntax highlighting

````markdown
```python
def hello():
    print("Hello")
```
````

### Emoji

```markdown
:smile: :heart: :+1: :rocket:
```

:smile: :heart: :+1: :rocket:

[Emoji list](https://github.com/ikatyang/emoji-cheat-sheet)

### @mentions and issue references

```markdown
@username
#123
```

### Automatic links

GitHub automatically converts URLs into links:
```markdown
https://github.com
```

### Diff code blocks

````markdown
```diff
- Removed line
+ Added line
```
````

### Collapsible content

```markdown
<details>
<summary>点击展开</summary>

This is hidden content

</details>
```

### Alert boxes (newer GitHub feature)

```markdown
> [!NOTE]
> Useful information users should know.

> [!TIP]
> Suggestions that help users succeed.

> [!IMPORTANT]
> Critical information for successful use.

> [!WARNING]
> Urgent information that needs immediate attention.

> [!CAUTION]
> Potential negative consequences of an action.
```

### Mathematical formulas

Use LaTeX syntax:

```markdown
行内公式：$E = mc^2$

块级公式：
$$
\sum_{i=1}^{n} i = \frac{n(n+1)}{2}
$$
```

### Mermaid diagrams

````markdown
```mermaid
graph TD
    A[开始] --> B{判断}
    B -->|is| C[执行]
    B -->|否| D[结束]
    C --> D
```
````

## Advanced tips

### HTML embedding

Markdown also supports raw HTML directly:

```markdown
<div align="center">
  <img src="image.jpg" width="300">
</div>

<kbd>Ctrl</kbd> + <kbd>C</kbd>

<mark>高亮文本</mark>
```

### Escaping characters

Use backslashes to escape special characters:

```markdown
\* 不is斜体
\# 不istitle
\[ 不isLink
```

### Anchor links

```markdown
[跳转到title](#titlename)

# Chinese title会被转为拼音或其他形式
```

### Badges

```markdown
![GitHub stars](https://img.shields.io/github/stars/user/repo)
![License](https://img.shields.io/badge/license-MIT-blue)
```

### Table of contents

```markdown
[TOC]

# 某些Editor Supportautomatically generates目录
```

## Common tools

- **Editors**: Typora, VS Code, Obsidian
- **Online editors**: StackEdit, Dillinger
- **Formatting**: Prettier, markdownlint
- **Conversion**: Pandoc (Markdown to PDF/Word/HTML)

## Best Practices

1. **Keep it simple**: Markdown works best when it stays lightweight.
2. **Use headings well**: keep the hierarchy clear.
3. **Use code highlighting**: specify languages for better readability.
4. **Optimize images**: keep image sizes under control.
5. **Preview often**: check the rendered result after writing.
6. **Version control**: Markdown works very well with Git.
7. **Check links**: make sure all links work.
8. **Consider HTML for rich Agent output**: When AI agents generate long documents with tables, diagrams, and interactive elements, HTML may be more expressive than Markdown (see below).

## HTML vs Markdown for Agent Output

In the AI Agent era, the question of output format matters more than before. When agents write and modify documents, Markdown's core advantage — "easy to manually edit" — disappears. Should you switch to HTML?

### When Markdown is still the right choice

- **Short documents** (under ~100 lines) — Markdown remains the simplest format
- **Config files, READMEs, changelogs** — Git-friendly, easy to diff
- **Knowledge base pages** (like this site) — Mintlify/Jekyll render Markdown beautifully
- **Team wikis** — Where version control and collaborative editing are important

### When HTML has advantages

| Advantage | Example |
|-----------|--------|
| **Information density** | Tables, SVG, CSS, charts, and images in one file — no ASCII art approximations |
| **Readability** | Tabs, illustrations, and responsive layouts for long documents |
| **Shareability** | Upload HTML, share link — colleagues open it without special tools |
| **Interactivity** | Sliders, buttons, form controls that feed back into the agent |
| **Multi-source data** | Agent reads code, Slack, Git history → produces unified HTML report |
| **Pleasure** | More engaging authoring experience for the human reviewer |

### Five practical use cases for HTML

1. **Planning & exploration** — Generate an "HTML file network": 6 directions side-by-side, then mockups, then an implementation plan
2. **Code review** — Render diff, inline annotations, and flow charts in one page
3. **Design prototyping** — HTML as design intermediate language, then translate to React/Swift
4. **Reports & learning** — Cross-source synthesis with interactive explanations or slides
5. **Disposable editors** — A throwaway UI for one task (reorder 30 tickets, toggle feature flags, adjust system prompt) with an "Export as JSON/prompt" button

### Tradeoffs

- **Generation time** — HTML takes 2–4× longer to generate than Markdown
- **Token cost** — Higher, but less relevant with 1M+ context windows
- **Version control** — **HTML diff is noisy and hard to review** — this is Markdown's biggest remaining advantage
- **Style consistency** — Requires a "design system HTML file" as reference to constrain aesthetics

<Tip>
For knowledge bases and version-controlled docs, **Markdown is still the default**. Use HTML only when the output is a one-off report, a review artifact, or an interactive prototype — things that won't need Git diff review.
</Tip>

<Note title="Source">
Based on [Thariq's analysis: HTML replacing Markdown in the Agent era](https://x.com/trq212) — 6 advantages, 5 use cases, and tradeoffs. Original article at [x.com/i/article/2052796100608974848](https://x.com/i/article/2052796100608974848).
</Note>

## References

- [Markdown Guide](https://www.markdownguide.org/)
- [GitHub Markdown documentation](https://docs.github.com/zh/get-started/writing-on-github)
- [CommonMark Specification](https://commonmark.org/)
- [Markdown Cheatsheet](https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet)