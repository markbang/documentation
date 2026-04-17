---
title: "Drizzle ORM"
description: "Database schema design, migrations, and CRUD patterns using Drizzle ORM — drawn from badmin (SQLite), cruise-ship (PostgreSQL), and cyop (PostgreSQL)."
icon: "database"
---

# Drizzle ORM — Schema Design & Best Practices

Drizzle ORM is a TypeScript-first ORM with SQL-like syntax, zero runtime overhead, and full type safety. It supports SQLite, PostgreSQL, MySQL, and more — each with driver-specific column types.

<CardGroup cols={3}>
<Card title="badmin" icon="server" href="https://github.com/markbang/badmin">
SQLite admin panel — users, roles, RBAC permissions.
</Card>
<Card title="Cruise Ship" icon="ship" href="https://github.com/markbang/cruise-ship-system">
PostgreSQL business system — bookings, finance, cabin allocation.
</Card>
<Card title="cyop" icon="cubes" href="https://github.com/markbang/cyop">
PostgreSQL AI platform — requirements, tasks, captions.
</Card>
</CardGroup>

## SQLite Schema (badmin)

SQLite is great for admin panels and prototypes — zero infra cost, local file DB:

```ts
import { sqliteTable, text, integer, primaryKey } from "drizzle-orm/sqlite-core"
import { sql } from "drizzle-orm"

const USER_STATUS_VALUES = ["active", "disabled"] as const

export const users = sqliteTable("users", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  sessionVersion: integer("session_version").default(1).notNull(),
  status: text("status", { enum: USER_STATUS_VALUES }).default("active").notNull(),
  lastLoginAt: integer("last_login_at", { mode: "timestamp" }),
  createdAt: integer("created_at", { mode: "timestamp" }).default(sql`(unixepoch())`).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).default(sql`(unixepoch())`).notNull(),
})
```

<Note title="SQLite timestamp pattern">
SQLite stores timestamps as integers. Use `{ mode: "timestamp" }` so Drizzle auto-converts `Date` ↔ `unixepoch()`. The `sql`(unixepoch())` default gives you a server-side timestamp without app logic.
</Note>

## PostgreSQL Schema (Cruise Ship)

PostgreSQL gives you rich column types — `numeric` for money, `jsonb` for snapshots, `text[]` for arrays:

```ts
import { pgTable, bigserial, bigint, varchar, numeric, integer, timestamp, text, date, boolean, check, index, foreignKey, unique } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"

export const cruise = pgTable("cruise", {
  id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
  name: varchar({ length: 120 }).notNull(),
  tonnage: numeric({ precision: 12, scale: 2 }),
  imageUrls: text("image_urls").array(),
  status: varchar({ length: 20 }).default("normal").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "string" }).defaultNow().notNull(),
}, (table) => [
  index("idx_cruise_status").using("btree", table.status.asc().nullsLast().op("text_ops")),
  check("cruise_status_check", sql`(status)::text = ANY ((ARRAY['normal','disabled','closed'])::text[])`),
])
```

### Key PostgreSQL Patterns

1. **CHECK constraints for enums** — PostgreSQL doesn't have native enums in Drizzle, so use `check()` with `ANY (ARRAY[...])`:

```ts
check("status_check", sql`(status)::text = ANY ((ARRAY['active','disabled'])::text[])`)
```

2. **Composite indexes** — For multi-column queries, define indexes inline:

```ts
index("idx_booking_cabin_booking_id").using("btree", table.bookingApplicationId.asc().nullsLast().op("int8_ops"))
```

3. **Array columns** — `text("image_urls").array()` for storing multiple URLs without a separate table:

4. **JSONB for snapshots** — `jsonb("item_snapshot").default([]).notNull()` for revision history:

```ts
export const costRevision = pgTable("cost_revision", {
  id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
  beforeTotalCost: numeric({ precision: 14, scale: 2 }).default("0").notNull(),
  afterTotalCost: numeric({ precision: 14, scale: 2 }).default("0").notNull(),
  itemSnapshot: jsonb("item_snapshot").default([]).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
})
```

## Many-to-Many Relationships (RBAC)

RBAC needs user ↔ role ↔ permission many-to-many tables:

```ts
export const userRoles = sqliteTable(
  "user_roles",
  {
    userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    roleId: text("role_id").notNull().references(() => roles.id, { onDelete: "cascade" }),
    createdAt: integer("created_at", { mode: "timestamp" }).default(sql`(unixepoch())`).notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.userId, table.roleId] }),
  }),
)

export const rolePermissions = sqliteTable(
  "role_permissions",
  {
    roleId: text("role_id").notNull().references(() => roles.id, { onDelete: "cascade" }),
    permissionKey: text("permission_key").notNull().references(() => permissions.key, { onDelete: "cascade" }),
    createdAt: integer("created_at", { mode: "timestamp" }).default(sql`(unixepoch())`).notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.roleId, table.permissionKey] }),
  }),
)
```

<Tip>
Always add `onDelete: "cascade"` on many-to-many foreign keys. When a role or user is deleted, their associations should disappear automatically — no orphaned rows.
</Tip>

## Repository Pattern

Separate data access from business logic using repository interfaces:

```ts
// src/domain/repositories.ts
export interface AuthUserRepository {
  findForAuthByEmail(email: string): Promise<AuthUser | null>
  findSessionUserById(id: string): Promise<SessionUser | null>
  touchLastLogin(id: string): Promise<void>
  updatePassword(id: string, data: { passwordHash: string; nextPassword: string }): Promise<void>
  revokeSessions(id: string): Promise<void>
}
```

```ts
// src/repositories/user-repository.ts
export function createUserRepository(db: DrizzleDB): AuthUserRepository {
  return {
    async findForAuthByEmail(email: string) {
      return await db.query.users.findFirst({
        where: eq(users.email, email),
      })
    },

    async findSessionUserById(id: string) {
      return await db.query.users.findFirst({
        where: eq(users.id, id),
        columns: { passwordHash: false }, // Never load password into session
        with: {
          roles: { with: { role: { with: { permissions: true } } } },
        },
      })
    },

    async revokeSessions(id: string) {
      await db.update(users)
        .set({ sessionVersion: sql`session_version + 1` })
        .where(eq(users.id, id))
    },
  }
}
```

<Note title="Why `columns: { passwordHash: false }`?">
When loading a user for session checks, never include the password hash. Drizzle's `columns` filter lets you exclude sensitive fields at the query level, not just in the service layer.
</Note>

## Migrations

Drizzle Kit generates SQL migrations from your schema:

```bash
# Generate migration from schema changes
bun run db:generate

# Apply migrations
bun run db:migrate

# Visualize schema
bun run db:studio
```

```ts
// drizzle.config.ts
import { defineConfig } from "drizzle-kit"

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "sqlite", // or "postgresql"
  dbCredentials: {
    url: "./dev.db",
  },
})
```

## Seeding

Seed the database with initial roles, permissions, and an admin user:

```ts
// src/db/seed.ts
import { db } from "./client"
import { users, roles, permissions, userRoles, rolePermissions } from "./schema"

export async function seed() {
  // Create permissions
  await db.insert(permissions).values([
    { key: "users.read", label: "View Users", group: "users" },
    { key: "users.write", label: "Edit Users", group: "users" },
    { key: "roles.read", label: "View Roles", group: "roles" },
  ])

  // Create admin role
  const [adminRole] = await db.insert(roles).values({
    name: "Admin",
    slug: "admin",
    description: "System administrator",
    isSystem: true,
  }).returning()

  // Link all permissions to admin role
  await db.insert(rolePermissions).values(
    allPermissions.map(p => ({ roleId: adminRole.id, permissionKey: p.key }))
  )

  // Create admin user
  const [adminUser] = await db.insert(users).values({
    name: "Admin",
    email: "admin@example.com",
    passwordHash: await hashPassword("changeme"),
  }).returning()

  // Assign admin role
  await db.insert(userRoles).values({ userId: adminUser.id, roleId: adminRole.id })
}
```

## Best Practices

1. **SQLite for admin panels** — Zero infra, local dev, good for small-to-medium row counts
2. **PostgreSQL for business data** — Rich types (jsonb, arrays, CHECK constraints, numeric precision)
3. **CHECK constraints over app-level validation** — Enforce enum values at the DB level
4. **Cascade deletes on M2M** — `onDelete: "cascade"` prevents orphaned association rows
5. **Exclude sensitive columns** — `columns: { passwordHash: false }` in session queries
6. **Repository pattern** — Separate Drizzle queries from service/business logic
7. **Session versioning** — Increment `sessionVersion` to force logout
8. **Seed with system roles** — Always seed an admin role and initial permissions

## References

- [Drizzle ORM Docs](https://orm.drizzle.team/)
- [Drizzle Kit CLI](https://orm.drizzle.team/kit-docs/)
- [badmin schema](https://github.com/markbang/badmin) — SQLite RBAC
- [cruise-ship schema](https://github.com/markbang/cruise-ship-system) — PostgreSQL business