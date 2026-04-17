---
title: "Next.js"
description: "Next.js is a React full-stack framework by Vercel with SSR, SSG, and API Routes, covering project setup, file-system routing, and data fetching."
icon: "nextjs"
---
## Next.js

Next.js is one of the most popular React frameworks in recent years, developed and maintained by Vercel.

### Core Features

- **Hybrid rendering**: supports SSR, SSG, and ISR
- **File-based routing**: automatic routing built on the file system
- **API Routes**: built-in API endpoints
- **Performance optimizations**: automatic code splitting and image optimization
- **TypeScript**: first-class TypeScript support
- **Zero config**: sensible defaults out of the box

### Quick Start

```bash
# 创建新项目
npx create-next-app@latest my-app
cd my-app

# 启动开发服务器
npm run dev

# Visit http://localhost:3000
```

### Project structure

```
my-app/
├── app/              # App Router（推荐）
│   ├── layout.tsx    # 根布局
│   ├── page.tsx      # Home
│   └── api/          # API 路由
├── public/           # 静态资源
├── components/       # Component
├── lib/              # Tool函数
└── next.config.js    # Next.js Configuration
```

### App Router（Next.js 13+）

#### Pages & Layouts

```tsx
// app/page.tsx - Home
export default function Home() {
  return <h1>Welcome to Next.js</h1>
}

// app/layout.tsx - 根布局
export default function RootLayout({ children }) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  )
}

// app/about/page.tsx - /about 路由
export default function About() {
  return <h1>About Page</h1>
}
```

#### Dynamic Routes

```tsx
// app/blog/[slug]/page.tsx
export default function BlogPost({ params }) {
  return <h1>Post: {params.slug}</h1>
}

// app/shop/[...slug]/page.tsx - 捕获所有路由
export default function Shop({ params }) {
  return <div>{params.slug.join('/')}</div>
}
```

#### Data Fetching

```tsx
// Server Components (Default)（默认）
async function getData() {
  const res = await fetch('https://api.example.com/data', {
    cache: 'force-cache', // Caching
    // next: { revalidate: 3600 } // ISR - 每小时重新Validation
  })
  return res.json()
}

export default async function Page() {
  const data = await getData()
  return <div>{data.title}</div>
}
```

#### Client Components

```tsx
'use client' // 必须in顶部Declaration

import { useState } from 'react'

export default function Counter() {
  const [count, setCount] = useState(0)
  return (
    <button onClick={() => setCount(count + 1)}>
      Count: {count}
    </button>
  )
}
```

#### Loading and error UI

```tsx
// app/loading.tsx - loading states
export default function Loading() {
  return <div>Loading...</div>
}

// app/error.tsx - error handling
'use client'
export default function Error({ error, reset }) {
  return (
    <div>
      <h2>Something went wrong!</h2>
      <button onClick={() => reset()}>Try again</button>
    </div>
  )
}
```

### API Routes

```typescript
// app/api/hello/route.ts
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  return NextResponse.json({ message: 'Hello World' })
}

export async function POST(request: Request) {
  const body = await request.json()
  return NextResponse.json({ data: body })
}
```

### Middleware

```typescript
// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // authentication检查
  const token = request.cookies.get('token')
  
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: '/dashboard/:path*',
}
```

### Image Optimization

```tsx
import Image from 'next/image'

export default function Avatar() {
  return (
    <Image
      src="/avatar.jpg"
      alt="Avatar"
      width={500}
      height={500}
      priority // 预加载
      placeholder="blur" // 模糊占位符
    />
  )
}
```

### Font Optimization

```tsx
import { Inter, Roboto_Mono } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })
const robotoMono = Roboto_Mono({ subsets: ['latin'] })

export default function Layout({ children }) {
  return (
    <html lang="zh-CN" className={inter.className}>
      <body>{children}</body>
    </html>
  )
}
```

### Metadata

```tsx
// app/layout.tsx
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'My App',
  description: 'App description',
  keywords: ['Next.js', 'React'],
}

// 动态Metadata
export async function generateMetadata({ params }) {
  const post = await getPost(params.id)
  return {
    title: post.title,
    description: post.excerpt,
  }
}
```

### Environment Variables

```bash
# .env.local
NEXT_PUBLIC_API_URL=https://api.example.com
DATABASE_URL=postgresql://...
```

```tsx
// client accessible（NEXT_PUBLIC_ prefix）
const apiUrl = process.env.NEXT_PUBLIC_API_URL

// server-only accessible
const dbUrl = process.env.DATABASE_URL
```

### Configuration File

```javascript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['example.com'],
  },
  env: {
    CUSTOM_KEY: 'value',
  },
  async redirects() {
    return [
      {
        source: '/old-path',
        destination: '/new-path',
        permanent: true,
      },
    ]
  },
}

module.exports = nextConfig
```

### Deployment

#### Vercel (recommended)
```bash
# Installation Vercel CLI
npm i -g vercel

# Deployment
vercel
```

#### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run built
EXPOSE 3000
CMD ["npm", "start"]
```

#### Static Export
```javascript
// next.config.js
module.exports = {
  output: 'export',
}
```

```bash
npm run built
# 输出到 out/ 目录
```

### Performance Optimization

- **code splitting**：auto split by route
- **lazy loading**：dynamic import components
- **Image optimization**: `next/image` handles optimization automatically
- **Font optimization**: `next/font` improves font loading
- **Prefetching**: the `Link` component prefetches automatically
- **Caching**：fine-grained cache control

### Library Integrations

#### Tailwind CSS
```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

#### Prisma ORM
```bash
npm install prisma @prisma/client
npx prisma init
```

#### NextAuth.js authentication
```bash
npm install next-auth
```

### Best Practices

1. **Prefer Server Components first** when possible.
2. **Use caching appropriately** and choose a sensible caching strategy.
3. **Optimize images** with `next/image`.
4. **Organize code by feature modules**.
5. **TypeScript**：use type safety
6. **error handling**：use error.tsx for error handling
7. **loading states**：use loading.tsx for better UX

### FAQ

#### Hydration Error（Hydration Error）
- Make sure server and client rendering stay consistent.
- Avoid using browser APIs on the server.

#### Performance Optimization
- Use dynamic imports to reduce the initial bundle size.
- Enable production optimizations.

### References

- [Next.js Official Docs](https://nextjs.org/docs)
- [Next.js GitHub](https://github.com/vercel/next.js)
- [Learn Next.js](https://nextjs.org/learn)
- [App Router documentation](https://nextjs.org/docs/app)