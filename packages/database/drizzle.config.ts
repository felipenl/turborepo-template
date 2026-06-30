/**
 * Drizzle Kit configuration
 *
 * Exports default config for backwards compatibility.
 * For multi-database support, use: pnpm drizzle-kit <command> --config=src/config/databases/<name>.config.ts
 *
 * Or use the wrapper (if implemented): pnpm db:generate <database-name>
 */
export { default } from './src/config/index.js';
