import type { Level } from 'pino';

export interface LoggerOptions {
  name: string;
  level?: Level;
  path?: string;
  fileName?: string;
}

export interface LoggerConfig {
  level: Level;
  path: string;
  daysToKeep: number;
}
