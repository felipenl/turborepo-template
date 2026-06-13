import { z } from 'zod';

export enum Environment {
  LOCAL = 'local',
  DEVELOPMENT = 'development',
  PRODUCTION = 'production',
  TEST = 'test',
}

export const envSchema = z.object({
  NODE_ENV: z.nativeEnum(Environment).default(Environment.LOCAL),
  PORT: z.coerce.number().int().positive().default(4000),
  LOG_LEVEL: z.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace']).default('info'),
  DATABASE_URL: z.string().url().optional(),
});

export type Env = z.infer<typeof envSchema>;
