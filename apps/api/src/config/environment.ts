import { config } from 'dotenv';
import { z } from 'zod';

// Load root .env (shared variables)
config({ path: '../../.env' });

// Load app-specific .env.local (overrides)
config({ path: '.env.local' });

/**
 * Environment variable schema with validation
 */
const envSchema = z.object({
  // Server
  PORT: z.coerce.number().default(4000),
  HOST: z.string().default('0.0.0.0'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),

  // Database (from root .env)
  DATABASE_URL: z.string().url(),

  // JWT
  JWT_SECRET: z.string().min(32),
  JWT_EXPIRES_IN: z.string().default('7d'),

  // Logging
  LOG_LEVEL: z.enum(['debug', 'info', 'warn', 'error']).default('info'),
});

/**
 * Validated environment variables
 * Crashes on startup if required vars are missing or invalid
 */
export const env = envSchema.parse(process.env);
