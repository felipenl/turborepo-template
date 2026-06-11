# Environment Variables Guide

## Hierarchy

Environment variables are organized in a **three-tier hierarchy**:

```
┌─────────────────────────────────────────┐
│  Root .env                               │  ← Shared (DB, APIs)
│  (DATABASE_URL, OPENAI_API_KEY, etc.)   │
└─────────────────────────────────────────┘
           ↓ inherited by
┌─────────────────────────────────────────┐
│  App .env.local                          │  ← App-specific (PORT, JWT_SECRET)
│  (Overrides root vars if needed)        │
└─────────────────────────────────────────┘
           ↓ result
┌─────────────────────────────────────────┐
│  Final Environment                       │  ← Merged in app
└─────────────────────────────────────────┘
```

### What Goes Where

**Root `.env`** (shared across all apps):
- Database connections
- External API keys (OpenAI, AWS, Stripe, etc.)
- Monitoring/logging services
- Email/SMS providers

**App `.env.local`** (app-specific):
- Server port
- App-specific secrets (JWT_SECRET, session keys)
- Feature flags
- CORS origins
- Rate limiting config

## Setup

### Development

1. Copy root `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Copy each app's `.env.example` to `.env.local`:
   ```bash
   cp apps/web/.env.example apps/web/.env.local
   cp apps/api/.env.example apps/api/.env.local
   ```

3. Fill in actual values (`.env` can be committed for defaults, `.env.local` never committed)

### Production

Use your deployment platform's environment variable settings:
- Vercel: Project Settings → Environment Variables
- Docker: Pass via `docker-compose.yml` or secrets
- AWS/GCP: Use parameter store/secret manager

## Variable Loading

### Next.js Apps

Next.js automatically loads env files in this order (later overrides earlier):
1. `.env` (committed defaults)
2. `.env.local` (local overrides, gitignored)
3. `.env.production` / `.env.development` (environment-specific)
4. `.env.production.local` / `.env.development.local`

**Public vs Private:**
- `NEXT_PUBLIC_*` variables are exposed to the browser
- Other variables are server-side only

Example:
```typescript
// ✅ Safe - server-side only
const dbUrl = process.env.DATABASE_URL;

// ✅ Safe - exposed to browser (use for non-sensitive data only)
const apiUrl = process.env.NEXT_PUBLIC_API_URL;
```

### Node.js Backend Apps

Load root `.env` first, then app-specific `.env.local`:

```typescript
import { config } from 'dotenv';

// Load root env (shared)
config({ path: '../../.env' });

// Load app env (overrides)
config({ path: '.env.local' });
```

With validation (recommended - see `apps/api/src/config/environment.ts` for full example):

```typescript
import { config } from 'dotenv';
import { z } from 'zod';

// Load in order: root → app
config({ path: '../../.env' });
config({ path: '.env.local' });

const envSchema = z.object({
  // From root .env
  DATABASE_URL: z.string().url(),
  OPENAI_API_KEY: z.string(),
  
  // From app .env.local
  PORT: z.coerce.number().default(4000),
  JWT_SECRET: z.string().min(32),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
});

// Crashes on startup if validation fails
export const env = envSchema.parse(process.env);
```

## Best Practices

1. **Never commit `.env.local`** - it's in `.gitignore`
2. **Always commit `.env.example`** - with placeholder values
3. **Use validation** - crash early if env vars missing
4. **Prefix public vars** - `NEXT_PUBLIC_*` for browser exposure
5. **Document required vars** - in `.env.example` and this doc

## Security

- Never log sensitive env vars
- Use secrets managers in production (not plain env vars)
- Rotate secrets regularly
- Never expose server-side vars to browser
