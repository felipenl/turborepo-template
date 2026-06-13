import type { FastifyInstance, FastifyPluginOptions } from 'fastify';
import fp from 'fastify-plugin';
import { PostgresClient } from '@repo/database';
import { mainSchema } from '@repo/database/schemas/main';
import { env } from '../config/environment.js';

declare module 'fastify' {
  interface FastifyInstance {
    db: ReturnType<PostgresClient<typeof mainSchema>['getClient']>;
  }
}

async function databasePlugin(fastify: FastifyInstance, _options: FastifyPluginOptions) {
  if (!env.DATABASE_URL) {
    fastify.log.warn('DATABASE_URL not set, skipping database plugin');
    return;
  }

  try {
    const dbClient = new PostgresClient(
      {
        connectionString: env.DATABASE_URL,
        max: 10,
        ssl: env.NODE_ENV === 'production',
      },
      mainSchema
    );

    dbClient.connect();
    const db = dbClient.getClient();

    fastify.decorate('db', db);

    fastify.addHook('onClose', async () => {
      await dbClient.disconnect();
      fastify.log.info('Database connection closed');
    });

    fastify.log.info('Database plugin registered');
  } catch (error) {
    fastify.log.error(error, 'Failed to initialize database plugin');
    throw error;
  }
}

export default fp(databasePlugin);
export { databasePlugin };
