import type { Config } from 'drizzle-kit';

/**
 * Main database configuration
 */
export const mainConfig = {
  schema: './src/schemas/main/index.ts',
  out: './drizzle/main',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL || 'postgresql://localhost:5432/mydb',
  },
} as const satisfies Config;
