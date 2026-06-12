import path from 'path';
import type { Level } from 'pino';
import type { LoggerOptions } from './types.js';

export const PINO_LEVELS = ['fatal', 'error', 'warn', 'info', 'debug', 'trace', 'silent'] as const;

export const getLogCaller = (stackIndex: number = 4): string => {
  const trace = Error.prepareStackTrace?.bind(this);
  Error.prepareStackTrace = (_, stack) => stack;

  const err = new Error();
  // @ts-expect-error - V8 stack trace API
  const stack = err.stack as NodeJS.CallSite[];

  Error.prepareStackTrace = trace;

  if (stack.length > stackIndex) {
    const callee = stack.at(stackIndex);
    if (!callee) return 'unknown';

    const fileName = callee.getFileName();

    if (fileName) {
      const relativeFileName = path.relative(process.cwd(), fileName);
      const lineNumber = callee.getLineNumber();
      return `${relativeFileName}:${String(lineNumber)}`;
    }
  }
  return 'unknown';
};

export const getFormattedDate = () => {
  const date = new Date();

  const pad = (num: number) => num.toString().padStart(2, '0');

  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  const seconds = pad(date.getSeconds());

  return `${String(year)}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

export const getFileName = (options: LoggerOptions) =>
  options.fileName ?? `${options.name.replace(/\s/g, '.')}.log`;

export const getLogLevel = (level?: Level, defaultLevel: Level = 'info') => level ?? defaultLevel;

export const getLogPath = (folder: string = 'logs') => {
  if (path.isAbsolute(folder)) return folder;
  return path.join(process.cwd(), folder);
};

export const resolveLogParams = (options: LoggerOptions, defaultLevel: Level = 'info') => {
  const fileName = getFileName(options);
  const level = getLogLevel(options.level, defaultLevel);
  const logPath = path.join(getLogPath(options.path), fileName);

  return {
    name: options.name,
    level,
    fileName,
    path: logPath,
  };
};
