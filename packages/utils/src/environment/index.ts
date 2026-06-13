import { config } from 'dotenv';
import { resolve } from 'path';

/**
 * Load environment variables from .env.[NODE_ENV] file
 *
 * @param options - Configuration options
 * @param options.path - Directory to search for .env file (defaults to process.cwd())
 *
 * @example
 * ```ts
 * import { loadEnv } from '@workspace/utils/environment';
 *
 * loadEnv(); // Loads .env.local, .env.development, .env.production, or .env.test
 * ```
 */
export function loadEnv(options: { path?: string } = {}) {
  const rootPath = options.path || process.cwd();
  const nodeEnv = process.env.NODE_ENV || 'local';
  const envFile = `.env.${nodeEnv}`;
  const filePath = resolve(rootPath, envFile);

  const result = config({ path: filePath });

  return {
    loaded: !result.error,
    file: envFile,
    environment: nodeEnv,
    error: result.error,
  };
}

const NODE_ENV = (process.env.NODE_ENV || 'local').toLowerCase();

export const isLocal = NODE_ENV === 'local';
export const isDevelopment = NODE_ENV === 'development';
export const isProduction = NODE_ENV === 'production';
export const isTest = NODE_ENV === 'test';

export const getEnvironment = (): string => {
  return NODE_ENV;
};
