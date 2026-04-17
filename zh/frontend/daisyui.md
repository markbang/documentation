---
title: "DaisyUI"
description: "DaisyUI 是基于 Tailwind CSS 的高层组件库，提供按钮（btn）、卡片（card）、模态框（modal）、导航栏（navbar）等数十种预设计 UI 组件，无需手写大量工具类即可快速搭建界面，本文介绍 npm 安装配置方法、主题切换机制与常用组件代码示例。"
icon: "palette"
---

# DaisyUI

DaisyUI 是一个基于 Tailwind CSS 的组件库，提供了丰富的预设计组件。

## 特性

- 🎨 **纯 CSS 组件**：无 JavaScript 依赖
- 🎭 **30+ 主题**：内置多种主题，支持深色模式
- 🧩 **语义化类名**：易于理解和使用
- 🎯 **Tailwind 兼容**：完美集成 Tailwind CSS
- 📦 **轻量级**：按需加载，体积小

## 安装

```bash
npm install -D daisyui@latest
```

配置 `tailwind.config.js`：

```javascript
module.exports = {
  plugins: [require('daisyui')],
  daisyui: {
    themes: ['light', 'dark', 'cupcake'],
  },
}
```

## 常用组件

### Button

```html
<button class="btn">Button</button>
<button class="btn btn-primary">Primary</button>
<button class="btn btn-secondary">Secondary</button>
<button class="btn btn-accent">Accent</button>
<button class="btn btn-ghost">Ghost</button>
<button class="btn btn-link">Link</button>

<!-- 大小 -->
<button class="btn btn-xs">Tiny</button>
<button class="btn btn-sm">Small</button>
<button class="btn btn-md">Normal</button>
<button class="btn btn-lg">Large</button>

<!-- 状态 -->
<button class="btn btn-disabled">Disabled</button>
<button class="btn loading">Loading</button>
```

### Card

```html
<div class="card w-96 bg-base-100 shadow-xl">
  <figure>
    <img src="image.jpg" alt="Image" />
  </figure>
  <div class="card-body">
    <h2 class="card-title">Card Title</h2>
    <p>Card description text</p>
    <div class="card-actions justify-end">
      <button class="btn btn-primary">Buy Now</button>
    </div>
  </div>
</div>
```

### Modal

```html
<!-- 触发按钮 -->
<label for="my-modal" class="btn">Open Modal</label>

<!-- Modal -->
<input type="checkbox" id="my-modal" class="modal-toggle" />
<div class="modal">
  <div class="modal-box">
    <h3 class="font-bold text-lg">Modal Title</h3>
    <p class="py-4">Modal content here</p>
    <div class="modal-action">
      <label for="my-modal" class="btn">Close</label>
    </div>
  </div>
</div>
```

### Navbar

```html
<div class="navbar bg-base-100">
  <div class="flex-1">
    <a class="btn btn-ghost text-xl">daisyUI</a>
  </div>
  <div class="flex-none">
    <ul class="menu menu-horizontal px-1">
      <li><a>Link</a></li>
      <li>
        <details>
          <summary>Parent</summary>
          <ul class="bg-base-100 rounded-t-none p-2">
            <li><a>Link 1</a></li>
            <li><a>Link 2</a></li>
          </ul>
        </details>
      </li>
    </ul>
  </div>
</div>
```

### Form

```html
<!-- Input -->
<input type="text" placeholder="Type here" class="input input-bordered w-full" />

<!-- Textarea -->
<textarea class="textarea textarea-bordered" placeholder="Bio"></textarea>

<!-- Checkbox -->
<input type="checkbox" class="checkbox" />

<!-- Radio -->
<input type="radio" name="radio-1" class="radio" />

<!-- Select -->
<select class="select select-bordered w-full">
  <option disabled selected>Pick one</option>
  <option>Option 1</option>
  <option>Option 2</option>
</select>

<!-- Toggle -->
<input type="checkbox" class="toggle" />
```

### Alert

```html
<div class="alert alert-info">
  <svg>...</svg>
  <span>Info message</span>
</div>

<div class="alert alert-success">Success</div>
<div class="alert alert-warning">Warning</div>
<div class="alert alert-error">Error</div>
```

### Badge

```html
<div class="badge">Default</div>
<div class="badge badge-primary">Primary</div>
<div class="badge badge-secondary">Secondary</div>
<div class="badge badge-accent">Accent</div>
<div class="badge badge-ghost">Ghost</div>
```

## 主题切换

### HTML 属性方式

```html
<html data-theme="dark">
```

### JavaScript 切换

```javascript
// 切换主题
document.documentElement.setAttribute('data-theme', 'dark');

// 保存到 localStorage
localStorage.setItem('theme', 'dark');

// 读取主题
const theme = localStorage.getItem('theme') || 'light';
document.documentElement.setAttribute('data-theme', theme);
```

### 主题切换组件

```html
<div class="dropdown">
  <label tabindex="0" class="btn m-1">Theme</label>
  <ul tabindex="0" class="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">
    <li><a data-set-theme="light">Light</a></li>
    <li><a data-set-theme="dark">Dark</a></li>
    <li><a data-set-theme="cupcake">Cupcake</a></li>
  </ul>
</div>
```

## 自定义主题

```javascript
// tailwind.config.js
module.exports = {
  daisyui: {
    themes: [
      {
        mytheme: {
          "primary": "#a991f7",
          "secondary": "#f6d860",
          "accent": "#37cdbe",
          "neutral": "#3d4451",
          "base-100": "#ffffff",
        },
      },
    ],
  },
}
```

## 实用工具类

```html
<!-- 间距 -->
<div class="divider">OR</div>

<!-- 加载 -->
<span class="loading loading-spinner loading-lg"></span>

<!-- 头像 -->
<div class="avatar">
  <div class="w-24 rounded-full">
    <img src="avatar.jpg" />
  </div>
</div>

<!-- 面包屑 -->
<div class="breadcrumbs text-sm">
  <ul>
    <li><a>Home</a></li>
    <li><a>Documents</a></li>
    <li>Add Document</li>
  </ul>
</div>
```

## 布局组件

### Drawer

```html
<div class="drawer">
  <input id="my-drawer" type="checkbox" class="drawer-toggle" />
  <div class="drawer-content">
    <label for="my-drawer" class="btn btn-primary drawer-button">Open</label>
  </div>
  <div class="drawer-side">
    <label for="my-drawer" class="drawer-overlay"></label>
    <ul class="menu p-4 w-80 min-h-full bg-base-200">
      <li><a>Menu 1</a></li>
      <li><a>Menu 2</a></li>
    </ul>
  </div>
</div>
```

## 最佳实践

1. **结合 Tailwind**：DaisyUI 组件可与 Tailwind 工具类混用
2. **主题一致性**：为整个项目选择合适的主题
3. **响应式设计**：使用 Tailwind 的响应式前缀
4. **减少定制**：尽量使用预设样式
5. **按需加载**：配置 PurgeCSS 移除未使用的样式

## 参考资源

- [DaisyUI 官网](https://daisyui.com/)
- [组件文档](https://daisyui.com/components/)
- [主题列表](https://daisyui.com/docs/themes/)
- [GitHub 仓库](https://github.com/saadeghi/daisyui)
