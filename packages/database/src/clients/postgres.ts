import { drizzle, type PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import postgres, { type Sql } from 'postgres';
import { DatabaseClient } from './base.js';

export interface PostgresConfig {
  connectionString: string;
  max?: number;
  idleTimeout?: number;
  connectionTimeout?: number;
  ssl?: boolean;
}

export class PostgresClient<
  TSchema extends Record<string, unknown> = Record<string, never>,
> extends DatabaseClient<TSchema> {
  private config: PostgresConfig;
  private sql?: Sql;
  private db?: PostgresJsDatabase<TSchema>;

  constructor(config: PostgresConfig, schema?: TSchema) {
    super(schema);
    this.config = config;
  }

  connect(): void {
    const {
      connectionString,
      max = 10,
      idleTimeout = 30,
      connectionTimeout = 10,
      ssl,
    } = this.config;

    this.sql = postgres(connectionString, {
      max,
      idle_timeout: idleTimeout,
      connect_timeout: connectionTimeout,
      ssl: ssl ? 'require' : false,
    });

    this.db = drizzle(this.sql, { schema: this.schema as TSchema });
  }

  async disconnect(): Promise<void> {
    if (this.sql) {
      await this.sql.end();
    }
  }

  getClient(): PostgresJsDatabase<TSchema> {
    if (!this.db) {
      throw new Error('Database not connected. Call connect() first.');
    }
    return this.db;
  }
}
