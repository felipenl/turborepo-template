import type { Config } from 'drizzle-kit';
import type { DatabaseName } from './index.js';

/**
 * Validate database credentials are present
 */
export function validateCredentials(config: Config, name: DatabaseName): void {
  // Check if credentials exist (structure varies by Drizzle Kit version)
  const hasCredentials = 'dbCredentials' in config && config.dbCredentials;

  if (!hasCredentials) {
    throw new Error(`Missing database credentials for database "${name}"`);
  }
}
