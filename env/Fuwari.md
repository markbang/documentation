---
title: "Fuwari"
description: "Fuwari is an Astro-based static blog theme with clean design, covering project setup, article frontmatter format, tags, and deployment steps."
icon: "pen-nib"
---
<Note icon="language" title="Original Chinese Content">
Parts of this page are still in their original Chinese. Key technical terms and concepts may be more intuitive in Chinese. [View the Chinese version →](/zh/env/Fuwari.md)
</Note>


## Fuwari

[Fuwari](https://github.com/saicaca/fuwari) is abuilt on Astro 's 静态blogs主题，with elegant and minimalist style。

### Features

- 🚀 **快速**：built on Astro, excellent performance
- 🎨 **美观**：modern design, responsive layout
- 🌙 **Dark Mode**：supports深色/浅色Theme Switching
- 📝 **Markdown**：write articles using Markdown
- 🔍 **SEO 友好**：优化search for引擎收录
- 📱 **响应式**：完美mobile-friendly
- 💬 **评论系统**：supports多种评论系统
- 🔗 **友链**：supports友情Link页面

### Quick Start

```bash
# clone the project
git clone https://github.com/saicaca/fuwari.git
cd fuwari

# InstallationDependency
npm install

# local development
npm run dev

# built
npm run built
```

### Configuration

edit `src/config.ts` file：

```typescript
export const siteConfig = {
  title: '你's blogstitle',
  subtitle: 'Subtitle',
  lang: 'zh-CN',
  description: 'blogsDescription',
  author: 'Author Name',
  avatar: '/avatar.jpg',
  
  // Social Links
  socialLinks: [
    { name: 'github', url: 'https://github.com/username' },
    { name: 'twitter', url: 'https://twitter.com/username' },
  ],
}
```

### 创建文章

in `src/content/posts/` create under directory Markdown file：

```markdown
---
title: Article Title
published: 2024-01-01
description: Article Description
tags: [Tag1, Tag2]
category: Category
draft: false
---

Article Content...
```

### Deployment

#### GitHub Pages

```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 18
      - run: npm install
      - run: npm run built
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

#### Vercel

1. import GitHub repo to Vercel
2. builtCommand：`npm run built`
3. output directory：`dist`

#### Cloudflare Pages

1. connect GitHub repo
2. builtCommand：`npm run built`
3. output directory：`dist`

### 自Definition

#### modify theme colors

edit `src/styles/global.css`：

```css
:root {
  --primary: #your-color;
}
```

#### add comment system

supports Giscus、Waline 等评论系统，inConfiguration File中启用。

### References

- [GitHub 仓Library](https://github.com/saicaca/fuwari)
- [demo site](https://fuwari.vercel.app/)
- [Astro documentation](https://docs.astro.build/)