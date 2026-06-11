import { env } from './config/environment.js';

console.log(`🚀 API Server starting...`);
console.log(`📦 Environment: ${env.NODE_ENV}`);
console.log(`🔌 Port: ${env.PORT}`);
console.log(`📊 Log Level: ${env.LOG_LEVEL}`);

// TODO: Start your server here
// Example: Express, Fastify, Hono, etc.

console.log(`✅ API Server ready at http://${env.HOST}:${env.PORT}`);
