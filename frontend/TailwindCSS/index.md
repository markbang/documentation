---
title: "Tailwind CSS"
description: "Tailwind CSS is a utility-first CSS framework for building interfaces with predefined classes, covering installation, responsive design, and theming."
icon: "palette"
---
![Tailwindcss6](https://cdn.bangwu.top/img/Tailwindcss6.png)

# Tailwind CSS

Tailwind CSS is a utility-first CSS framework for building interfaces by combining atomic utility classes.

## Core Philosophy

Unlike traditional semantic CSS frameworks, Tailwind provides low-level utility classes so you can style directly in HTML.

```html
<!-- traditional approach -->
<div class="card">
  <h2 class="card-title">Title</h2>
</div>

<!-- Tailwind 方式 -->
<div class="bg-white rounded-lg shadow-md p-6">
  <h2 class="text-2xl font-bold mb-2">Title</h2>
</div>
```

## Installation

### Via npm

```bash
npm install -D tailwindcss
npx tailwindcss init
```

### Configuration File

```javascript
// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

### CSS File

```css
/* src/styles.css */
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### Vite Project

```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

## Common Utility Classes

### Layout

```html
<!-- Flexbox -->
<div class="flex items-center justify-between">
  <div>Item 1</div>
  <div>Item 2</div>
</div>

<!-- Grid -->
<div class="grid grid-cols-3 gap-4">
  <div>1</div>
  <div>2</div>
  <div>3</div>
</div>

<!-- 容器 -->
<div class="container mx-auto px-4">
  Content
</div>
```

### Space

```html
<!-- Padding -->
<div class="p-4">所有方向 padding: 1rem</div>
<div class="px-4 py-2">水平 1rem，垂直 0.5rem</div>
<div class="pt-4">顶部 padding</div>

<!-- Margin -->
<div class="m-4">所有方向 margin</div>
<div class="mx-auto">水平居中</div>
<div class="-mt-4">负 margin</div>

<!-- Space Between -->
<div class="flex space-x-4">
  <div>1</div>
  <div>2</div>
</div>
```

### Sizing

```html
<!-- Width -->
<div class="w-full">100% 宽度</div>
<div class="w-1/2">50% 宽度</div>
<div class="w-64">16rem 宽度</div>
<div class="max-w-md">最大宽度</div>

<!-- Height -->
<div class="h-screen">100vh 高度</div>
<div class="h-64">16rem 高度</div>
<div class="min-h-screen">最小 100vh</div>
```

### Colors

```html
<!-- 文字颜色 -->
<p class="text-blue-500">蓝色文字</p>
<p class="text-gray-700">深灰色文字</p>

<!-- 背景色 -->
<div class="bg-red-500">红色背景</div>
<div class="bg-gradient-to-r from-blue-500 to-purple-500">渐变背景</div>

<!-- 边框色 -->
<div class="border border-gray-300">灰色边框</div>
```

### Typography

```html
<!-- 字体大小 -->
<h1 class="text-4xl">超大title</h1>
<p class="text-base">正常文字</p>
<small class="text-sm">小文字</small>

<!-- 字重 -->
<p class="font-light">细体</p>
<p class="font-normal">正常</p>
<p class="font-bold">粗体</p>

<!-- yes齐 -->
<p class="text-left">左yes齐</p>
<p class="text-center">居中</p>
<p class="text-right">右yes齐</p>

<!-- 行高 -->
<p class="leading-tight">紧凑行高</p>
<p class="leading-loose">宽松行高</p>
```

### Borders and border radius

```html
<!-- 边框 -->
<div class="border">默认边框</div>
<div class="border-2">2px 边框</div>
<div class="border-t">顶部边框</div>

<!-- 圆角 -->
<div class="rounded">小圆角</div>
<div class="rounded-lg">大圆角</div>
<div class="rounded-full">全圆角</div>
```

### Shadows

```html
<div class="shadow">默认阴影</div>
<div class="shadow-md">中等阴影</div>
<div class="shadow-lg">大阴影</div>
<div class="shadow-xl">超大阴影</div>
<div class="shadow-none">无阴影</div>
```

### Opacity

```html
<div class="opacity-0">完全透明</div>
<div class="opacity-50">半透明</div>
<div class="opacity-100">不透明</div>
```

## Responsive Design

Tailwind uses a mobile-first breakpoint system.

```html
<!-- 默认移动端，md 及以上为桌面端 -->
<div class="text-sm md:text-base lg:text-lg">
  响应式文字大小
</div>

<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
  响应式grid
</div>
```

### Breakpoints

- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px
- `2xl`: 1536px

## Pseudo-classes & States

```html
<!-- Hover -->
<button class="bg-blue-500 hover:bg-blue-700">
  Hover me
</button>

<!-- Focus -->
<input class="border focus:border-blue-500 focus:ring-2" />

<!-- Active -->
<button class="active:bg-blue-800">Click</button>

<!-- Disabled -->
<button class="disabled:opacity-50" disabled>
  Disabled
</button>

<!-- 组合使用 -->
<button class="bg-blue-500 hover:bg-blue-700 active:bg-blue-800 disabled:opacity-50">
  Button
</button>
```

## Dark Mode

```html
<!-- built on class 's Dark Mode -->
<div class="bg-white dark:bg-gray-800 text-black dark:text-white">
  自适应Dark Mode
</div>
```

```javascript
// tailwind.config.js
module.exports = {
  darkMode: 'class', // 'media' 或 'class'
}
```

```javascript
// 切换Dark Mode
document.documentElement.classList.toggle('dark')
```

## Custom Configuration

### Extend Theme

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: '#3490dc',
        secondary: '#ffed4e',
      },
      spacing: {
        '128': '32rem',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
}
```

### Custom Utilities

```css
@layer utilities {
  .text-shadow {
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
  }
}
```

### Custom Components

```css
@layer components {
  .btn-primary {
    @apply bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700;
  }
}
```

## Common Plugins

### Official Plugins

```bash
npm install -D @tailwindcss/forms
npm install -D @tailwindcss/typography
npm install -D @tailwindcss/aspect-ratio
```

```javascript
// tailwind.config.js
module.exports = {
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio'),
  ],
}
```

### Typography（Typography）

```html
<article class="prose lg:prose-xl">
  <h1>Markdown title</h1>
  <p>自动美化's Typography</p>
</article>
```

## Practical Tips

### Extract Components

Use `@apply` to extract repeated utility classes:

```css
.card {
  @apply bg-white rounded-lg shadow-md p-6;
}
```

### Conditional Classes

Use the `clsx` or `classnames` library:

```tsx
import clsx from 'clsx'

function Button({ primary, children }) {
  return (
    <button className={clsx(
      'px-4 py-2 rounded',
      primary ? 'bg-blue-500 text-white' : 'bg-gray-200'
    )}>
      {children}
    </button>
  )
}
```

### Group & Children

```html
<div class="group">
  <img class="group-hover:scale-110 transition" />
  <p class="group-hover:text-blue-500">Text</p>
</div>
```

### Arbitrary Values

```html
<div class="w-[137px] top-[117px]">
  自Definition值
</div>
```

## Performance Optimization

### Production Optimization

Tailwind automatically removes unused styles.

```javascript
// tailwind.config.js
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
  ],
}
```

### JIT Mode

Just-In-Time mode is enabled by default and generates styles on demand.

## Editor Support

### VS Code Extensions

- **Tailwind CSS IntelliSense**: autocomplete and previews
- **Headwind**: automatically sorts class names

## FAQ

### Style Priority

Use the `!` prefix to force a style to apply:

```html
<div class="!text-red-500">
  强制红色文字
</div>
```

### Custom Colors

```html
<div class="bg-[#1da1f2]">
  自Definition十六进制颜色
</div>
```

## Best Practices

1. **Stay consistent** and follow the design system.
2. **Avoid over-abstraction** and do not extract components too early.
3. **Use responsive design** with a mobile-first mindset.
4. **Use configuration well** for custom theme colors and spacing.
5. **Use editor support** by installing the IntelliSense extension.
6. **Componentize complex UI** by extracting it into separate files.

## References

- [Tailwind CSS website](https://tailwindcss.com/)
- [Tailwind UI](https://tailwindui.com/) - official component library
- [Headless UI](https://headlessui.com/) - unstyled components
- [Tailwind Play](https://play.tailwindcss.com/) - online editor
- [Awesome Tailwind](https://github.com/aniftyco/awesome-tailwindcss)