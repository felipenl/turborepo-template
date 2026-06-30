// Base class
export { DatabaseClient } from './clients/base.js';

// Postgres client
export { PostgresClient, type PostgresConfig } from './clients/postgres.js';

// Multi-database configuration
export { databases, getConfig, DATABASE_NAMES, type DatabaseName } from './config/index.js';

// Logger
export { databaseLogger } from './logger.js';

// Re-export Drizzle ORM utilities
export { sql, eq, and, or, not, isNull, isNotNull, inArray, notInArray } from 'drizzle-orm';
export type { InferSelectModel, InferInsertModel } from 'drizzle-orm';
