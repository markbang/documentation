---
title: "Monorepo Architecture"
description: "Bun/Turborepo monorepo patterns for full-stack apps — project structure, shared packages, workspace tooling, and CI/CD from real project experience."
icon: "cubes"
---

# Monorepo Architecture — Bun + Turborepo

A monorepo keeps all your apps and shared code in one repository. With Bun workspaces and Turborepo task orchestration, you get fast installs, parallel builds, and type-safe package sharing.

<CardGroup cols={3}>
<Card title="badmin" icon="server" href="https://github.com/markbang/badmin">
Admin panel monorepo — web + server + docs + shared packages.
</Card>
<Card title="cyop" icon="cubes" href="https://github.com/markbang/cyop">
AI captioning monorepo — web + server + tRPC + auth + db packages.
</Card>
<Card title="fullstack" icon="laptop-code" href="https://github.com/markbang/fullstack">
Template monorepo — web + docs + desktop + API + shared packages.
</Card>
</CardGroup>

## Standard Structure

All three projects follow the same pattern:

```text
monorepo/
├── apps/
│   ├── web/          # Frontend app (TanStack Start / React)
│   ├── server/       # API server (Hono)
│   ├── docs/         # Documentation site (Fumadocs)
│   └── desktop/      # Desktop app (Tauri + SolidJS) [optional]
├── packages/
│   ├── contracts/    # Shared Zod schemas + tRPC routers
│   ├── ui/           # Shared UI components (shadcn/ui)
│   ├── db/           # Drizzle schema + migrations + client
│   ├── auth/         # Better Auth configuration
│   └ config/         # Shared TypeScript/ESLint configs
├── package.json      # Root workspace config
├── turbo.json        # Task orchestration
├── biome.json        # Linting + formatting
```

## Workspace Configuration

### Bun Workspaces (package.json)

```json
{
  "workspaces": ["apps/*", "packages/*"],
  "scripts": {
    "dev": "turbo dev",
    "build": "turbo build",
    "lint": "turbo lint",
    "typecheck": "turbo typecheck",
    "test": "turbo test",
    "db:generate": "turbo db:generate",
    "db:migrate": "turbo db:migrate"
  },
  "devDependencies": {
    "turbo": "latest",
    "@biomejs/biome": "latest"
  }
}
```

### Turborepo Pipeline (turbo.json)

```json
{
  "tasks": {
    "dev": { "cache": false, "persistent": true },
    "build": { "dependsOn": ["^build"], "outputs": ["dist/**", ".next/**"] },
    "lint": { "dependsOn": ["^build"] },
    "typecheck": { "dependsOn": ["^build"] },
    "test": { "dependsOn": ["^build"] },
    "db:generate": { "cache": false },
    "db:migrate": { "cache": false }
  }
}
```

<Tip>
The `^build` syntax means "build all dependencies first." Turborepo automatically parallelizes tasks that have no dependency between them — e.g., building `packages/ui` and `packages/db` can run simultaneously.
</Tip>

### Biome (Lint + Format)

Biome replaces ESLint + Prettier with a single, faster tool:

```json
{
  "formatter": { "indentStyle": "tab", "lineWidth": 120 },
  "linter": { "enabled": true },
  "javascript": { "formatter": { "quoteStyle": "double" } }
}
```

```bash
bun run lint      # Check only
bun run format    # Auto-fix
bun run check     # Lint + format check
```

## Shared Packages

### contracts — Zod + tRPC

Shared schemas keep frontend and backend type-synced:

```ts
// packages/contracts/src/auth.ts
import { z } from "zod"

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
})

export type LoginInput = z.infer<typeof loginSchema>

export const sessionUserSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  permissions: z.array(z.string()),
  roles: z.array(z.object({ slug: z.string(), name: z.string() })),
})

export type SessionUser = z.infer<typeof sessionUserSchema>
```

The frontend imports `LoginInput` for form validation. The backend imports the same schema for request validation. One source of truth.

### db — Drizzle Package

Isolate database logic in its own package:

```ts
// packages/db/src/schema.ts
export * from "./schema/users"
export * from "./schema/roles"

// packages/db/src/client.ts
import { drizzle } from "drizzle-orm/better-sqlite3"
import Database from "better-sqlite3"
import * as schema from "./schema"

const sqlite = new Database("./dev.db")
export const db = drizzle(sqlite, { schema })
```

Both `apps/server` and `apps/web` (for server functions) import from `@repo/db`.

### ui — shadcn/ui Package

Shared components built on shadcn/ui:

```ts
// packages/ui/src/button.tsx
import { buttonVariants } from "./variants"
import { Slot } from "@radix-ui/react-slot"

export function Button({ variant, size, ...props }) {
  return <button class={buttonVariants({ variant, size })} {...props} />
}
```

<Note>
Create a `components.json` in both `apps/web` and `packages/ui` so `shadcn add` places components in the right location.
</Note>

## Cross-App Type Safety

The key benefit of monorepo: **runtime-free type sharing**.

```ts
// apps/server/src/routes/users.ts
import { z } from "zod"
import type { SessionUser } from "@repo/contracts"

app.get("/api/users", requireSession(authService), requirePermission("users.read"), async (c) => {
  const user: SessionUser = c.get("sessionUser")
  return c.json(await userService.listUsers(user))
})
```

```tsx
// apps/web/app/routes/users.tsx
import type { SessionUser } from "@repo/contracts"

function UsersPage() {
  const [users, setUsers] = createSignal<SessionUser[]>([])
  // Same type — no API client generation needed
}
```

## Environment Variables

Each app reads its own env vars. Service URLs can be overridden:

```bash
# .env (root)
VITE_WEB_ORIGIN=http://localhost:3000
VITE_API_ORIGIN=http://localhost:3002
API_ORIGIN=http://localhost:3002
```

Default ports:
- Web: `3000`
- Docs: `3001`
- API: `3002`
- Desktop: `1420`

## CI/CD with GitHub Actions

Turborepo caches build outputs, making CI fast:

```yaml
# .github/workflows/ci.yml
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: oven-sh/setup-bun@v2
      - run: bun install
      - run: bun run lint
      - run: bun run typecheck
      - run: bun run test
      - run: bun run build

      # Turbo remote cache (optional)
      - uses: actions/cache@v4
        with:
          path: .turbo
          key: turbo-${{ github.sha }}
```

## Database Workflow

```bash
# Generate SQL migration from schema changes
bun run db:generate

# Apply migrations to dev database
bun run db:migrate

# Open Drizzle Studio (visual schema browser)
bun run db:studio
```

<Tip>
Run `db:generate` after every schema change. Drizzle Kit diffs the current schema against the previous migration and generates only the incremental SQL.
</Tip>

## Best Practices

1. **`apps/` + `packages/` split** — Apps are deployable units; packages are shared libraries
2. **Contracts package** — Zod schemas + tRPC routers = type safety without code generation
3. **Biome over ESLint+Prettier** — One tool, 30× faster, fewer config files
4. **Turbo caching** — `^build` dependency graph + remote cache = fast CI
5. **DB as a package** — Schema, client, and migrations in one sharable package
6. **Environment overrides** — Service URLs via `.env`, not hardcoded
7. **shadcn/ui in packages/ui** — Share components across web and docs apps
8. **Tab indentation** — Biome defaults to tabs — consistent, smaller diffs

## References

- [Turborepo Docs](https://turbo.build/repo/docs)
- [Bun Workspaces](https://bun.sh/docs/install/workspaces)
- [Biome](https://biomejs.dev/)
- [badmin repo](https://github.com/markbang/badmin) — Production monorepo example
- [fullstack repo](https://github.com/markbang/fullstack) — Template monorepo