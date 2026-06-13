import Fastify from 'fastify';
import { createFastifyLogger } from '@workspace/observability';
import { env } from './config/environment.js';
import { databasePlugin } from './plugins/database.js';
import { errorHandlerPlugin } from './plugins/error-handler.js';
import { healthRoutes } from './routes/health.js';

const logger = createFastifyLogger({
  name: 'API',
  level: env.LOG_LEVEL,
});

const app = Fastify({
  logger,
  requestIdLogLabel: 'reqId',
  disableRequestLogging: false,
});

// Plugins
await app.register(databasePlugin);
await app.register(errorHandlerPlugin);

// Routes
await app.register(healthRoutes, { prefix: '/health' });

// Start server
try {
  await app.listen({
    port: env.PORT,
    host: '0.0.0.0',
  });
  app.log.info({ port: env.PORT, env: env.NODE_ENV }, '🚀 API Server running');
} catch (err) {
  app.log.error(err, 'Failed to start server');
  // eslint-disable-next-line no-process-exit -- Required for fatal startup failure
  process.exit(1);
}

// Graceful shutdown
const signals = ['SIGINT', 'SIGTERM'];
signals.forEach(signal => {
  process.on(signal, async () => {
    app.log.info(`Received ${signal}, closing server gracefully`);
    await app.close();
    // eslint-disable-next-line no-process-exit -- Required for graceful shutdown
    process.exit(0);
  });
});
