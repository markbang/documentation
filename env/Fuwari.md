---
title: "Fuwari"
description: "Fuwari 是一款基于 Astro 静态站点框架的博客主题，设计简洁、性能优秀，本文介绍项目初始化与目录结构、文章 frontmatter 格式（title/published/description/tags/category/draft）、分类与标签配置以及自定义样式与博客搭建部署的基本流程。"
icon: "pen-nib"
---

## Fuwari

[Fuwari](https://github.com/saicaca/fuwari) 是一个基于 Astro 的静态博客主题，风格优雅简洁。

### 特性

- 🚀 **快速**：基于 Astro 构建，性能优异
- 🎨 **美观**：现代化设计，响应式布局
- 🌙 **暗色模式**：支持深色/浅色主题切换
- 📝 **Markdown**：使用 Markdown 编写文章
- 🔍 **SEO 友好**：优化搜索引擎收录
- 📱 **响应式**：完美适配移动端
- 💬 **评论系统**：支持多种评论系统
- 🔗 **友链**：支持友情链接页面

### 快速开始

```bash
# 克隆项目
git clone https://github.com/saicaca/fuwari.git
cd fuwari

# 安装依赖
npm install

# 本地开发
npm run dev

# 构建
npm run build
```

### 配置

编辑 `src/config.ts` 文件：

```typescript
export const siteConfig = {
  title: '你的博客标题',
  subtitle: '副标题',
  lang: 'zh-CN',
  description: '博客描述',
  author: '作者名',
  avatar: '/avatar.jpg',
  
  // 社交链接
  socialLinks: [
    { name: 'github', url: 'https://github.com/username' },
    { name: 'twitter', url: 'https://twitter.com/username' },
  ],
}
```

### 创建文章

在 `src/content/posts/` 目录下创建 Markdown 文件：

```markdown
---
title: 文章标题
published: 2024-01-01
description: 文章描述
tags: [标签1, 标签2]
category: 分类
draft: false
---

文章内容...
```

### 部署

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
      - run: npm run build
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

#### Vercel

1. 导入 GitHub 仓库到 Vercel
2. 构建命令：`npm run build`
3. 输出目录：`dist`

#### Cloudflare Pages

1. 连接 GitHub 仓库
2. 构建命令：`npm run build`
3. 输出目录：`dist`

### 自定义

#### 修改主题色

编辑 `src/styles/global.css`：

```css
:root {
  --primary: #your-color;
}
```

#### 添加评论系统

支持 Giscus、Waline 等评论系统，在配置文件中启用。

### 参考资源

- [GitHub 仓库](https://github.com/saicaca/fuwari)
- [演示网站](https://fuwari.vercel.app/)
- [Astro 文档](https://docs.astro.build/)