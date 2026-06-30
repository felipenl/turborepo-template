import { createLogger } from '@workspace/observability';

/**
 * Database package logger
 */
export const databaseLogger: ReturnType<typeof createLogger> = createLogger({
  name: 'database',
});
