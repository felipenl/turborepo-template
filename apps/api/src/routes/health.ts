import type { FastifyInstance } from 'fastify';
import { isProduction } from '@workspace/utils/environment';

export async function healthRoutes(fastify: FastifyInstance) {
  fastify.get('/', async (_request, reply) => {
    return reply.send({
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: isProduction ? 'production' : 'development',
    });
  });

  fastify.get('/ready', async (_request, reply) => {
    try {
      // Check database connection
      await fastify.db.execute('SELECT 1');
      return reply.send({ status: 'ready' });
    } catch (error) {
      fastify.log.error(error, 'Readiness check failed');
      return reply.status(503).send({ status: 'not ready' });
    }
  });
}
