import { createLogger, type LoggerOptions } from '@repo/observability';
import type { Logger } from 'pino';
import { env } from './config/environment.js';

export const logger: Logger = createLogger(
  {
    name: 'API',
    fileName: 'api.log',
    level: env.LOG_LEVEL,
  },
  {
    defaultLevel: 'info',
    daysToKeep: 30,
  },
);

logger.info('🚀 API Server starting...');
logger.info({ environment: env.NODE_ENV, port: env.PORT }, 'Configuration loaded');

// TODO: Start your server here
// Example: Express, Fastify, Hono, etc.

logger.info(`✅ API Server ready at http://${env.HOST}:${env.PORT}`);
