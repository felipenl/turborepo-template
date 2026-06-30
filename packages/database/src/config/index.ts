import type { Config } from 'drizzle-kit';
import { validateCredentials } from './drizzle.helpers.js';
import { mainConfig } from './databases/main.config.js';

/**
 * Database configurations registry
 */
export const databases = {
  main: mainConfig,
} as const;

/**
 * Database name type (derived from databases keys)
 */
export type DatabaseName = keyof typeof databases;

/**
 * Available database names (derived from databases keys)
 */
export const DATABASE_NAMES = Object.keys(databases) as DatabaseName[];

/**
 * Get config by database name
 */
export function getConfig(name: DatabaseName): Config {
  const config = databases[name];
  if (!config) {
    throw new Error(`Database config "${name}" not found. Available: ${DATABASE_NAMES.join(', ')}`);
  }

  validateCredentials(config, name);

  return config;
}

/**
 * Default export for backwards compatibility
 */
export default databases.main;
