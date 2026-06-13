import { loadEnv } from '@workspace/utils/environment';
import { envSchema } from '../schemas/env.schema.js';

// Load environment-specific file: .env.local (default), .env.development, .env.production, or .env.test
loadEnv();

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('❌ Invalid environment variables:', parsed.error.format());
  // eslint-disable-next-line no-process-exit -- Required for startup validation failure
  process.exit(1);
}

export const env = parsed.data;
