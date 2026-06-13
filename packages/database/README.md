# @workspace/database

Framework-agnostic database package with Drizzle ORM. Extensible architecture for multiple database support.

## Features

- **Extensible architecture**: Abstract `DatabaseClient` base class for plug-and-play database adapters
- **PostgreSQL ready**: Production-ready Postgres client included
- **Type-safe queries**: Full TypeScript inference with Drizzle ORM
- **Schema organization**: Main schema folder for your database tables
- **Framework-agnostic**: Works with Express, NestJS, Fastify, Hono, Deno, Bun
- **Built-in migrations**: Use Drizzle Kit for schema migrations

## Installation

```bash
pnpm add @workspace/database
```

Install PostgreSQL driver:

```bash
pnpm add postgres
```

## Usage

### PostgreSQL

```typescript
import { PostgresClient } from '@workspace/database';
import { mainSchema } from '@workspace/database/schemas/main';

const client = new PostgresClient(
  {
    connectionString: process.env.DATABASE_URL,
    max: 10,
    ssl: true,
  },
  mainSchema
);

client.connect();
const db = client.getClient();

// Type-safe queries
const users = await db.select().from(mainSchema.users);

// Cleanup
await client.disconnect();
```

### Creating Custom Database Clients

Extend the `DatabaseClient` base class to add support for other databases:

```typescript
// packages/database/src/clients/mysql.ts
import { DatabaseClient } from '@workspace/database/clients/base';
import { drizzle, type MySql2Database } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';

export interface MySQLConfig {
  host: string;
  database: string;
  user: string;
  password: string;
}

export class MySQLClient<
  TSchema extends Record<string, unknown> = Record<string, never>,
> extends DatabaseClient<TSchema> {
  private config: MySQLConfig;
  private pool?: mysql.Pool;
  private db?: MySql2Database<TSchema>;

  constructor(config: MySQLConfig, schema?: TSchema) {
    super(schema);
    this.config = config;
  }

  async connect(): Promise<void> {
    this.pool = mysql.createPool(this.config);
    this.db = drizzle(this.pool, { schema: this.schema as TSchema });
  }

  async disconnect(): Promise<void> {
    if (this.pool) {
      await this.pool.end();
    }
  }

  getClient(): MySql2Database<TSchema> {
    if (!this.db) {
      throw new Error('Database not connected. Call connect() first.');
    }
    return this.db;
  }
}
```

Then export in `src/index.ts`:

```typescript
export { MySQLClient, type MySQLConfig } from './clients/mysql.js';
```

## Custom Schemas

Create your schema files in `packages/database/src/schemas/main/`:

```typescript
// packages/database/src/schemas/main/users.ts
import { pgTable, uuid, varchar, timestamp } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  name: varchar('name', { length: 255 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
```

Then export in the schema index:

```typescript
// packages/database/src/schemas/main/index.ts
export * from './users.js';

import * as users from './users.js';

export const mainSchema = {
  ...users,
};
```

## Migrations

Use Drizzle Kit for migrations:

```bash
# Generate migration files
pnpm db:generate

# Apply migrations
pnpm db:migrate

# Push schema changes (dev only)
pnpm db:push

# Open Drizzle Studio
pnpm db:studio
```

Configure in `drizzle.config.ts`:

```typescript
import type { Config } from 'drizzle-kit';

export default {
  schema: './src/schemas/main/index.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL || 'postgresql://localhost:5432/mydb',
  },
} satisfies Config;
```

## Subpath Exports

```typescript
// Main package
import { PostgresClient, sql, eq } from '@workspace/database';

// Base class for custom clients
import { DatabaseClient } from '@workspace/database/clients/base';

// Specific client
import { PostgresClient } from '@workspace/database/clients/postgres';

// Schema
import { mainSchema } from '@workspace/database/schemas/main';
```

## Framework Examples

### Express

```typescript
import express from 'express';
import { PostgresClient } from '@workspace/database';
import { mainSchema } from '@workspace/database/schemas/main';

const app = express();

const dbClient = new PostgresClient({ connectionString: process.env.DATABASE_URL }, mainSchema);
dbClient.connect();
const db = dbClient.getClient();

app.get('/users', async (req, res) => {
  const users = await db.select().from(mainSchema.users);
  res.json(users);
});

process.on('SIGTERM', async () => {
  await dbClient.disconnect();
});
```

### Hono (Edge)

```typescript
import { Hono } from 'hono';
import { PostgresClient } from '@workspace/database';
import { mainSchema } from '@workspace/database/schemas/main';

const app = new Hono();

const dbClient = new PostgresClient({ connectionString: process.env.DATABASE_URL }, mainSchema);
dbClient.connect();
const db = dbClient.getClient();

app.get('/users', async c => {
  const users = await db.select().from(mainSchema.users);
  return c.json(users);
});
```

### NestJS

```typescript
import { Injectable, Module, OnModuleDestroy } from '@nestjs/common';
import { PostgresClient } from '@workspace/database';
import { mainSchema } from '@workspace/database/schemas/main';
import type { PostgresJsDatabase } from 'drizzle-orm/postgres-js';

@Injectable()
export class DatabaseService implements OnModuleDestroy {
  private client: PostgresClient<typeof mainSchema>;
  public readonly db: PostgresJsDatabase<typeof mainSchema>;

  constructor() {
    this.client = new PostgresClient({ connectionString: process.env.DATABASE_URL }, mainSchema);
    this.client.connect();
    this.db = this.client.getClient();
  }

  async onModuleDestroy() {
    await this.client.disconnect();
  }
}

@Module({
  providers: [DatabaseService],
  exports: [DatabaseService],
})
export class DatabaseModule {}
```

## Adding New Database Support

To add support for a new database:

1. Create a new client file in `src/clients/` extending `DatabaseClient`
2. Implement `connect()`, `disconnect()`, and `getClient()` methods
3. Add the database driver as a peer dependency in `package.json`
4. Export the new client in `src/index.ts`
5. Update this README with usage examples

Example databases to add:

- MySQL/MariaDB (mysql2)
- SQLite/Turso (@libsql/client)
- ClickHouse (@clickhouse/client)
- MongoDB (mongodb)
- CockroachDB (postgres driver)
