import pino from 'pino';
import type { Level } from 'pino';
import type { LoggerOptions } from './types.js';
import { getFormattedDate, getLogCaller, getLogLevel, resolveLogParams } from './utils.js';

const isProduction = process.env.NODE_ENV === 'production';

interface TransportOptions {
  name: string;
  level: Level;
  target: string;
  options: Record<string, unknown>;
}

export const getConsoleTransport = (
  options: LoggerOptions,
  defaultLevel: Level = 'info'
): TransportOptions => {
  return {
    name: 'consoleTransport',
    level: getLogLevel(options.level, defaultLevel),
    target: isProduction ? 'pino/file' : 'pino-pretty',
    options: {
      dateFormat: 'yyyy-mm-dd',
      translateTime: 'SYS:yyyy-mm-dd HH:MM:ss',
      ignore:
        'ts,host,pid,node,type,hostname,method,url,status,duration,durationString,userAgent,ip,event,caller',
      messageFormat: `\x1b[90m${options.name.toUpperCase()}: \x1b[0m \x1b[37m{msg}\x1b[0m \x1b[90m{durationString}\x1b[0m`,
      destination: 1,
    },
  };
};

export const getFileTransport = (
  options: { path: string; level: Level },
  daysToKeep: number = 7
): TransportOptions => {
  return {
    name: 'fileTransport',
    level: options.level,
    target: 'pino-roll',
    options: {
      file: options.path,
      frequency: 'daily',
      mkdir: true,
      size: 10,
      dateFormat: 'yyyy-MM-dd',
      translateTime: 'SYS:yyyy-mm-dd HH:MM:ss',
      ignore: 'time,duration,level,caller',
      limit: {
        count: daysToKeep,
      },
    },
  };
};

export interface CreateLoggerConfig {
  daysToKeep?: number;
  defaultLevel?: Level;
  redactPaths?: string[];
}

export const createLogger = (options: LoggerOptions, config: CreateLoggerConfig = {}) => {
  const { daysToKeep = 7, defaultLevel = 'info', redactPaths = [] } = config;
  const params = resolveLogParams(options, defaultLevel);

  return pino({
    level: params.level,
    base: { module: params.name },
    transport: {
      targets: [getFileTransport(params, daysToKeep), getConsoleTransport(options, defaultLevel)],
    },

    mixin: (_context, level) => {
      return { type: pino.levels.labels[level]?.toUpperCase(), caller: getLogCaller(4) };
    },

    redact: {
      paths: [
        'req.headers.authorization',
        'req.body.password',
        'req.body.token',
        'req.body.client_secret',
        'req.body.clientId',
        'req.body.tenantId',
        ...redactPaths,
      ],
      remove: true,
    },

    serializers: {
      err: pino.stdSerializers.err,
      req: pino.stdSerializers.req,
      res: pino.stdSerializers.res,
    },

    formatters: {
      bindings: bindings => {
        return {
          pid: String(bindings.pid || ''),
          host: String(bindings.hostname || 'Unknown'),
          node: process.version,
        };
      },
    },
    timestamp: () => {
      return `,"time":"${getFormattedDate()}"`;
    },
  });
};
