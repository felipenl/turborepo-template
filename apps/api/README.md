# API App

Example backend API application using Node.js and TypeScript.

## Setup

1. Copy environment variables:

   ```bash
   cp .env.example .env.local
   ```

2. Install dependencies (from monorepo root):

   ```bash
   pnpm install
   ```

3. Start development server:
   ```bash
   pnpm dev
   ```

## Environment Variables

This app loads environment variables in this order:

1. **Root `.env`** - Shared variables (database, external APIs)
2. **App `.env.local`** - App-specific overrides (port, JWT secret)

See `.env.example` for required variables.

## Scripts

```bash
# Development
pnpm dev              # Start with hot reload

# Build
pnpm build            # Compile TypeScript to dist/
pnpm start            # Run compiled code

# Code Quality
pnpm lint             # Check linting
pnpm lint:fix         # Fix linting issues
pnpm format           # Format code
pnpm check-types      # Type check

# Testing
pnpm test             # Run tests
pnpm test:watch       # Run tests in watch mode
pnpm test:coverage    # Run tests with coverage
```

## Structure

```
src/
├── config/
│   └── environment.ts    # Env var validation with Zod
├── index.ts              # Entry point
└── ...
```

## Adding a Framework

Replace `src/index.ts` with your framework of choice:

- **Express**: `pnpm add express @types/express`
- **Fastify**: `pnpm add fastify`
- **Hono**: `pnpm add hono`
- **NestJS**: Use NestJS CLI
