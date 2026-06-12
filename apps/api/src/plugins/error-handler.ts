import type { FastifyInstance, FastifyPluginOptions, FastifyError, FastifyReply } from 'fastify';
import fp from 'fastify-plugin';
import { ResponseError, AuthError } from '@repo/errors';

async function errorHandlerPlugin(fastify: FastifyInstance, _options: FastifyPluginOptions) {
  fastify.setErrorHandler((error: FastifyError, _request, reply: FastifyReply) => {
    const { statusCode = 500 } = error;

    // Custom errors
    if (error instanceof ResponseError) {
      return reply.status(error.status).send({
        status: 'error',
        code: error.status,
        message: error.message,
        data: error.data,
      });
    }

    if (error instanceof AuthError) {
      return reply.status(error.status).send({
        status: 'error',
        code: error.status,
        message: error.message,
      });
    }

    // Validation errors (Fastify schema)
    if (error.validation) {
      return reply.status(400).send({
        status: 'error',
        code: 400,
        message: 'Validation failed',
        errors: error.validation,
      });
    }

    // Generic errors
    fastify.log.error(error, error.message);
    return reply.status(statusCode).send({
      status: 'error',
      code: statusCode,
      message: statusCode >= 500 ? 'Internal server error' : error.message,
    });
  });

  fastify.log.info('Error handler plugin registered');
}

export default fp(errorHandlerPlugin);
export { errorHandlerPlugin };
