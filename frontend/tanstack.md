---
title: "TanStack Start + Hono"
description: "Full-stack monorepo architecture combining TanStack Start SSR with Hono API server, covering file-based routing, tRPC contracts, Drizzle ORM, and auth setup."
icon: "code"
---

# TanStack Start + Hono Full-Stack Architecture

TanStack Start is a full-stack React framework with SSR, file-based routing, and server functions. Hono is an ultrafast, lightweight web framework that runs on any JavaScript runtime. Combining them in a monorepo gives you a modern, type-safe full-stack stack.

<CardGroup cols={2}>
<Card title="badmin" icon="server" href="https://github.com/markbang/badmin">
Admin panel — TanStack Start + Hono + Drizzle + SQLite.
</Card>
<Card title="cyop" icon="cubes" href="https://github.com/markbang/cyop">
AI captioning platform — TanStack Router + Hono + tRPC + Drizzle + Postgres.
</Card>
</CardGroup>

## Architecture Overview

```text
monorepo/
├── apps/
│   ├── web/        # TanStack Start (React + SSR)
│   ├── server/     # Hono API server
│   └── docs/       # Fumadocs documentation site
├── packages/
│   ├── contracts/  # Shared Zod schemas + tRPC routers
│   ├── ui/         # Shared UI components (shadcn/ui)
│   ├── db/         # Drizzle schema + migrations
│   └── auth/       # Better Auth configuration
```

## Frontend: TanStack Start

TanStack Start provides file-based routing with `@tanstack/react-router`, SSR via Vinxi, and full-stack server functions.

### Key Setup

```json
// apps/web/package.json
{
  "dependencies": {
    "@tanstack/react-start": "latest",
    "@tanstack/react-router": "latest",
    "@tanstack/router-plugin": "latest"
  }
}
```

### Route Configuration

```tsx
// apps/web/app/routes/__root.tsx
import { createRootRoute, Outlet } from "@tanstack/react-router"

export const Route = createRootRoute({
  component: RootLayout,
})

function RootLayout() {
  return (
    <div>
      <Navbar />
      <Outlet />
    </div>
  )
}
```

### Server Functions

TanStack Start supports server-side functions that run only on the server:

```tsx
// apps/web/app/routes/dashboard.tsx
import { createServerFn } from "@tanstack/react-start"
import { authMiddleware } from "../middleware"

export const getDashboardData = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async () => {
    return await db.query.dashboardStats()
  })
```

<Tip>
Use server functions for data fetching and mutations that need server-side execution. They automatically handle serialization and avoid leaking secrets to the client.
</Tip>

## Backend: Hono

Hono is the API layer — fast, type-safe, and runtime-agnostic. It handles auth, CRUD, and business logic.

### Basic Server Setup

```ts
// apps/server/src/app.ts
import { Hono } from "hono"
import { cors } from "hono/cors"
import { logger } from "hono/logger"
import { sessionMiddleware } from "./middleware/session"
import { authRoutes } from "./modules/auth/auth.routes"
import { userRoutes } from "./modules/users/users.routes"

const app = new Hono()

app.use("*", logger())
app.use("*", cors({ origin: ["http://localhost:3000"], credentials: true }))
app.use("/api/*", sessionMiddleware(authService))

app.route("/api/auth", authRoutes)
app.route("/api/users", userRoutes)

export default app
```

### Service Pattern

Use factory functions for dependency injection:

```ts
// apps/server/src/modules/auth/auth.service.ts
interface AuthServiceOptions {
  userRepository: AuthUserRepository
  hashPassword: (password: string) => Promise<string>
  verifyPassword: (password: string, hash: string) => Promise<boolean>
}

export function createAuthService(options: AuthServiceOptions) {
  return {
    async login(input: LoginInput) {
      const user = await options.userRepository.findForAuthByEmail(input.email)
      if (!user) throw new HTTPException(401, { message: "Invalid credentials" })

      const valid = await options.verifyPassword(input.password, user.passwordHash)
      if (!valid) throw new HTTPException(401, { message: "Invalid credentials" })

      await options.userRepository.touchLastLogin(user.id)
      return toAuthSession(user)
    },
  }
}
```

<Note title="Why factory functions over classes?">
Factory functions (`createXxxService`) give you explicit dependency injection without class boilerplate. Each service receives its dependencies as parameters, making testing trivial — just pass mock implementations.
</Note>

### Session Cookie Auth

Instead of JWT tokens, use signed session cookies for simplicity and security:

```ts
// apps/server/src/middleware/session.ts
import { getSignedCookie, setSignedCookie, deleteCookie } from "hono/cookie"

const SESSION_COOKIE = "app_session"
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7 // 7 days

export async function setSessionCookie(ctx: Context, userId: string, version: number) {
  await setSignedCookie(ctx, SESSION_COOKIE, `${userId}:${version}`, secret, {
    httpOnly: true,
    maxAge: COOKIE_MAX_AGE,
    sameSite: "Lax",
    secure: isProduction,
  })
}

export function requireSession(authService: AuthService) {
  return createMiddleware(async (c, next) => {
    const value = await getSignedCookie(c, secret, SESSION_COOKIE)
    if (!value) throw new HTTPException(401, { message: "Login required" })

    const payload = parseSessionCookie(value)
    const session = await authService.getSession(payload)
    if (!session) {
      deleteCookie(c, SESSION_COOKIE)
      throw new HTTPException(401, { message: "Session expired" })
    }

    c.set("sessionUser", session.user)
    await next()
  })
}

export function requirePermission(permission: string) {
  return createMiddleware(async (c, next) => {
    const user = c.get("sessionUser")
    if (!user.permissions.includes(permission)) {
      throw new HTTPException(403, { message: "Permission denied" })
    }
    await next()
  })
}
```

<Tip>
Session versioning lets you force logout users when their password changes or account is disabled. Increment `sessionVersion` on the user record — stale cookies will be rejected.
</Tip>

## Localized Error Responses

For bilingual apps, return locale-aware error messages from the API:

```ts
// apps/server/src/lib/i18n.ts
import { HTTPException } from "hono/http-exception"

const messages = {
  en: { "auth.invalidCredentials": "Invalid email or password" },
  zh: { "auth.invalidCredentials": "邮箱或密码错误" },
}

export class LocalizedHTTPException extends HTTPException {
  constructor(status: number, key: string) {
    super(status, { message: key }) // key is resolved by frontend
  }
}

// Frontend sends X-Locale header
// Server resolves the key to the appropriate language
```

## Styling: UnoCSS

For TanStack Start projects, UnoCSS is lighter and faster than Tailwind for utility classes:

```ts
// vite.config.ts
import UnoCSS from "unocss/vite"
import presetWind4 from "@unocss/preset-wind4"
import presetIcons from "@unocss/preset-icons"

export default defineConfig({
  plugins: [
    UnoCSS({
      presets: [presetWind4(), presetIcons()],
    }),
  ],
})
```

<Note>
Use `presetWind4` for Tailwind CSS 4-compatible utilities. Use `presetIcons` for FontAwesome/Material icon classes without importing SVGs.
</Note>

## Best Practices

1. **Monorepo with shared contracts** — Put Zod schemas and tRPC routers in a shared package so frontend and backend stay type-synced
2. **Factory-function services** — Prefer `createAuthService(opts)` over `class AuthService` for explicit DI
3. **Signed cookie sessions** — Simpler than JWT, revocable by bumping `sessionVersion`
4. **Server functions for secrets** — Never expose API keys or DB queries in client code
5. **Locale-aware errors** — Frontend sends `X-Locale`, server returns localized keys
6. **UnoCSS over Tailwind** — Faster build, icon presets, and Tailwind-compatible utilities

## References

- [TanStack Start Docs](https://tanstack.com/start/latest)
- [Hono Docs](https://hono.dev)
- [badmin repo](https://github.com/markbang/badmin) — working admin panel with this stack
- [cyop repo](https://github.com/markbang/cyop) — AI captioning platform