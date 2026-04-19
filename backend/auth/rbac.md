---
title: "RBAC & Session Auth"
description: "Role-Based Access Control and session cookie authentication patterns from real projects using Hono, SQLite, Next.js, and PostgreSQL."
icon: "shield-halved"
---

# RBAC & Session Cookie Authentication

Role-Based Access Control (RBAC) assigns permissions to roles, then roles to users. Combined with signed session cookies, you get a simple, secure auth system that works without JWT complexity.

<CardGroup cols={2}>
<Card title="badmin" icon="server" href="https://github.com/markbang/badmin">
Hono + SQLite — full RBAC admin panel with session cookies.
</Card>
<Card title="Cruise Ship" icon="ship" href="https://github.com/markbang/cruise-ship-system">
Next.js + PostgreSQL — role-based business system with token sessions.
</Card>
</CardGroup>

## RBAC Data Model

The classic RBAC model has four tables:

```text
users ──(user_roles)──► roles ──(role_permissions)──► permissions
```

### Schema Definition

```ts
// Core tables
export const users = sqliteTable("users", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  sessionVersion: integer("session_version").default(1).notNull(), // For forced logout
  status: text("status", { enum: ["active", "disabled"] }).default("active").notNull(),
})

export const roles = sqliteTable("roles", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(), // e.g. "admin", "editor"
  description: text("description").notNull(),
  isSystem: integer("is_system", { mode: "boolean" }).default(false).notNull(), // Prevent deletion
})

export const permissions = sqliteTable("permissions", {
  key: text("key").primaryKey(), // e.g. "users.read", "users.write"
  label: text("label").notNull(),
  group: text("group").notNull(), // e.g. "users", "roles", "dashboard"
})

// Junction tables (many-to-many)
export const userRoles = sqliteTable("user_roles", {
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  roleId: text("role_id").notNull().references(() => roles.id, { onDelete: "cascade" }),
}, (table) => ({ pk: primaryKey({ columns: [table.userId, table.roleId] }) }))

export const rolePermissions = sqliteTable("role_permissions", {
  roleId: text("role_id").notNull().references(() => roles.id, { onDelete: "cascade" }),
  permissionKey: text("permission_key").notNull().references(() => permissions.key, { onDelete: "cascade" }),
}, (table) => ({ pk: primaryKey({ columns: [table.roleId, table.permissionKey] }) }))
```

<Tip>
Permission keys use dot notation (`users.read`, `users.write`) for natural grouping. The `group` column lets you organize them in the UI.
</Tip>

## Session Cookie Auth

Instead of JWTs, use **signed session cookies** — simpler, more secure for same-origin apps:

### Why Cookies over JWT?

| Concern | Session Cookie | JWT |
|---------|---------------|-----|
| Revocation | Increment `sessionVersion` — instant | Must maintain blacklist or wait for expiry |
| Storage | Server-side DB check | Self-contained (can't revoke without blacklist) |
| Size | Small: `userId:version` | Large: encoded claims + signature |
| CSRF | Mitigated by `SameSite` | Not applicable (usually sent in header) |
| Implementation | `hono/cookie` signed cookies | Library + secret management |

### Implementation with Hono

```ts
import { getSignedCookie, setSignedCookie, deleteCookie } from "hono/cookie"
import { createMiddleware } from "hono/factory"

const SESSION_COOKIE = "app_session"
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7 // 7 days

// Set session after login
export async function setSessionCookie(ctx, userId: string, sessionVersion: number) {
  await setSignedCookie(ctx, SESSION_COOKIE, `${userId}:${sessionVersion}`, secret, {
    httpOnly: true,      // Not accessible from JS
    maxAge: COOKIE_MAX_AGE,
    sameSite: "Lax",     // CSRF protection
    secure: isProduction, // HTTPS only in prod
    path: "/",
  })
}

// Require session on API routes
export function requireSession(authService: AuthService) {
  return createMiddleware(async (c, next) => {
    const value = await getSignedCookie(c, secret, SESSION_COOKIE)
    if (!value) throw new HTTPException(401, { message: "Login required" })

    const payload = parseSessionCookie(value) // → { userId, sessionVersion }
    const session = await authService.getSession(payload)
    if (!session) {
      deleteCookie(c, SESSION_COOKIE)
      throw new HTTPException(401, { message: "Session expired" })
    }

    c.set("sessionUser", session.user) // Available in all downstream handlers
    await next()
  })
}

// Require specific permission
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

### Route Protection

Chain middleware to protect routes:

```ts
const app = new Hono()

// Public routes
app.post("/api/auth/login", async (c) => { /* ... */ })

// Protected routes — require session
app.use("/api/*", requireSession(authService))

// Require permission for specific routes
app.use("/api/users/*", requirePermission("users.write"))
app.use("/api/roles/*", requirePermission("roles.write"))

app.get("/api/users", async (c) => {
  const user = c.get("sessionUser") // Injected by middleware
  return c.json(await userService.listUsers(user))
})
```

## Session Versioning (Forced Logout)

When a user changes their password or gets disabled, bump their `sessionVersion`:

```ts
// In auth service — change password
async changePassword(userId: string, input: ChangePasswordInput) {
  await this.userRepository.updatePassword(userId, {
    passwordHash: await hashPassword(input.nextPassword),
  })
  // Increment session version → all existing cookies become invalid
  await this.userRepository.revokeSessions(userId)
}

// In repository — SQL increment
async revokeSessions(id: string) {
  await db.update(users)
    .set({ sessionVersion: sql`session_version + 1` })
    .where(eq(users.id, id))
}
```

When `requireSession` checks the cookie, it compares the cookie's version with the DB version. If they differ, the session is rejected.

<Note>
Session versioning is the simplest way to force logout. No blacklist, no waiting for JWT expiry — just increment a number in the DB.
</Note>

## Loading Permissions into Session

On login, load all the user's permissions into the session object:

```ts
async findSessionUserById(id: string) {
  return await db.query.users.findFirst({
    where: eq(users.id, id),
    columns: { passwordHash: false }, // Never include in session
    with: {
      roles: {
        with: {
          role: {
            with: {
              permissions: {
                columns: { permissionKey: true }, // Only need the key
              },
            },
          },
        },
      },
    },
  })
}

// Flatten permissions for quick checks
function flattenPermissions(sessionUser) {
  const permissions = sessionUser.roles.flatMap(ur => ur.role.permissions.map(rp => rp.permissionKey))
  return { ...sessionUser, permissions }
}
```

## Frontend Permission Checks

Don't rely only on backend — hide UI elements the user can't access:

```tsx
function UserManagementPage() {
  const { user } = useSession()

  return (
    <div>
      <h1>Users</h1>
      {user.permissions.includes("users.write") && (
        <button onClick={openCreateDialog}>Create User</button>
      )}
      <UserTable />
    </div>
  )
}
```

<Tip>
Frontend permission checks are for **UX** (hide buttons), not **security**. The backend middleware is the real gatekeeper — always validate permissions on the API side.
</Tip>

## Cruise Ship: Token-Based Sessions

For the cruise-ship system (Next.js + PostgreSQL), we used token-based sessions stored in the DB:

```ts
export const userSession = pgTable("user_session", {
  id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
  userId: bigint("user_id", { mode: "number" }).notNull(),
  token: varchar({ length: 128 }).notNull(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
}, (table) => [
  unique("user_session_token_key").on(table.token),
  index("idx_user_session_user_id").using("btree", table.userId),
])
```

This approach stores the full session in PostgreSQL — good for distributed apps where cookie-only sessions can't work.

## Best Practices

1. **Signed cookies over JWT** — Simpler, revocable, smaller payload
2. **Session versioning** — Increment to force logout on password change or account disable
3. **Flatten permissions** — Load all permission keys into the session object for O(1) checks
4. **Exclude sensitive columns** — Never query `passwordHash` into session data
5. **Cascade deletes on M2M** — Role/user deletions should auto-clean associations
6. **`isSystem` flag on roles** — Prevent deletion of essential roles (Admin, SuperAdmin)
7. **Frontend hides, backend validates** — Frontend checks are UX, backend middleware is security
8. **Token sessions for distributed systems** — When cookies can't work across services, store tokens in DB

## References

- [Hono Cookie API](https://hono.dev/helpers/cookie)
- [badmin auth module](https://github.com/markbang/badmin) — Full Hono + SQLite RBAC implementation
- [cruise-ship auth](https://github.com/markbang/cruise-ship-system) — Next.js + PostgreSQL token sessions