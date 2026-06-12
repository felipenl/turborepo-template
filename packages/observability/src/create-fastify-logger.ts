import type { Level, LoggerOptions as PinoLoggerOptions } from 'pino';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const isProduction = process.env.NODE_ENV === 'production';

interface FastifyLoggerOptions {
  name: string;
  level: Level;
  logDir?: string;
  fileName?: string;
}

/**
 * Find monorepo root by looking for pnpm-workspace.yaml
 */
const findMonorepoRoot = (startPath: string): string => {
  let currentPath = startPath;
  while (currentPath !== path.parse(currentPath).root) {
    if (fs.existsSync(path.join(currentPath, 'pnpm-workspace.yaml'))) {
      return currentPath;
    }
    currentPath = path.dirname(currentPath);
  }
  return startPath;
};

/**
 * Creates a Pino logger config compatible with Fastify.
 * Returns config object that Fastify can accept.
 * Logs are stored in monorepo root under logs/{name}/
 */
export const createFastifyLogger = (
  options: FastifyLoggerOptions,
): boolean | PinoLoggerOptions => {
  const { name, level, logDir, fileName = `${name.toLowerCase()}.log` } = options;

  // Find monorepo root
  const currentFile = fileURLToPath(import.meta.url);
  const monorepoRoot = findMonorepoRoot(path.dirname(currentFile));

  // Default: logs/{name}/ in monorepo root
  const finalLogDir = logDir || path.join(monorepoRoot, 'logs', name.toLowerCase());

  // Ensure log directory exists
  if (!fs.existsSync(finalLogDir)) {
    fs.mkdirSync(finalLogDir, { recursive: true });
  }

  const logFilePath = path.join(finalLogDir, fileName);

  // Fastify-compatible config with transport targets (multiple destinations)
  const config: PinoLoggerOptions = {
    name,
    level,
    transport: {
      targets: [
        // File target (JSON)
        {
          level,
          target: 'pino/file',
          options: {
            destination: logFilePath,
            mkdir: true,
          },
        },
        // Console target (pretty in dev, JSON in prod)
        {
          level,
          target: isProduction ? 'pino/file' : 'pino-pretty',
          options: isProduction
            ? { destination: 1 }
            : {
                destination: 1,
                translateTime: 'HH:MM:ss Z',
                ignore: 'pid,hostname',
                colorize: true,
              },
        },
      ],
    },
  };

  return config;
};
