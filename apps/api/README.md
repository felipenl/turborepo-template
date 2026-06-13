# API Server

Modern API built with Fastify, TypeScript, and Drizzle ORM.

## Stack

- **Fastify**: Fast and low overhead web framework
- **Drizzle ORM**: Type-safe database queries (@workspace/database)
- **Pino**: High-performance logging (@workspace/observability)
- **PostgreSQL**: Primary database
- **Zod**: Schema validation
- **TypeScript**: Type safety throughout

## Setup

1. Copy environment variables:

```bash
cp .env.example .env
```

2. Configure your database URL in `.env`:

```env
DATABASE_URL=postgresql://localhost:5432/mydb
```

3. Install dependencies:

```bash
pnpm install
```

## Development

```bash
# Start development server
pnpm dev

# Type check
pnpm check-types

# Lint
pnpm lint

# Run tests
pnpm test
```

## Project Structure

```
src/
├── config/
│   └── environment.ts    # Env validation with Zod
├── plugins/
│   ├── database.ts       # Database connection plugin
│   └── error-handler.ts  # Global error handling
├── routes/
│   └── health.ts         # Health check endpoints
└── index.ts              # Server bootstrap
```

## Endpoints

### Health Checks

```bash
# Basic health check
GET /health

# Readiness check (includes DB connectivity)
GET /health/ready
```

## Database

This API uses `@workspace/database` package with Drizzle ORM.

### Add Tables

1. Create schema file:

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

2. Export in schema index:

```typescript
// packages/database/src/schemas/main/index.ts
export * from './users.js';
import * as users from './users.js';

export const mainSchema = {
  ...users,
};
```

3. Generate and run migrations:

```bash
cd packages/database
pnpm db:generate
pnpm db:migrate
```

### Use in Routes

```typescript
import { mainSchema } from '@workspace/database/schemas/main';

// Query
const users = await fastify.db.select().from(mainSchema.users);

// Insert
const [user] = await fastify.db.insert(mainSchema.users).values({ email, name }).returning();
```

## Error Handling

Uses `@workspace/errors` custom error classes:

```typescript
import { ResponseError, AuthError } from '@workspace/errors';

// HTTP error
throw new ResponseError('Not found', 404);

// Auth error
throw new AuthError('Invalid token', 401);

// With data
throw new ResponseError('Validation failed', 400, { field: 'email' });
```

## Logging

Fastify uses Pino logger (from `@workspace/observability`):

```typescript
fastify.log.info('Info message');
fastify.log.error(error, 'Error occurred');
fastify.log.debug({ user: userId }, 'Debug with context');
```

Logs are written to:

- Console (pretty-printed in dev)
- File: `logs/api.log` (rotated daily)

## Production

```bash
# Build
pnpm build

# Start production server
pnpm start
```

## Environment Variables

| Variable       | Description           | Default       |
| -------------- | --------------------- | ------------- |
| `NODE_ENV`     | Environment           | `development` |
| `PORT`         | Server port           | `4000`        |
| `LOG_LEVEL`    | Logging level         | `info`        |
| `DATABASE_URL` | PostgreSQL connection | Required      |
