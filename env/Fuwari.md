---
title: "Fuwari"
description: "Fuwari is an Astro-based static blog theme with clean design, covering project setup, article frontmatter format, tags, and deployment steps."
icon: "pen-nib"
---

## Fuwari

[Fuwari](https://github.com/saicaca/fuwari) is an Astro-based static blog theme with a clean and elegant style.

### Features

- 🚀 **Fast**: built on Astro with excellent performance
- 🎨 **Beautiful**: modern design and responsive layout
- 🌙 **Dark Mode**: supports light and dark theme switching
- 📝 **Markdown**: write posts in Markdown
- 🔍 **SEO-friendly**: optimized for search indexing
- 📱 **Responsive**: works well on mobile devices
- 💬 **Comments**: supports multiple comment systems
- 🔗 **Friend links**: supports a dedicated links page

### Quick start

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

Edit `src/config.ts`:

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

### Create a post

Create a Markdown file under `src/content/posts/`:

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

1. Import the GitHub repo into Vercel.
2. Set the build command to `npm run built`.
3. Set the output directory to `dist`.

#### Cloudflare Pages

1. Connect the GitHub repo.
2. Set the build command to `npm run built`.
3. Set the output directory to `dist`.

### Customization

#### Modify theme colors

Edit `src/styles/global.css`:

```css
:root {
  --primary: #your-color;
}
```

#### Add a comment system

Fuwari supports comment systems such as Giscus and Waline. Enable the one you want in the config file.

### References

- [GitHub repository](https://github.com/saicaca/fuwari)
- [Demo site](https://fuwari.vercel.app/)
- [Astro documentation](https://docs.astro.build/)
