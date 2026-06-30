#!/usr/bin/env tsx
import { spawn, type ChildProcess } from 'child_process';
import { writeFileSync, unlinkSync, existsSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { databaseLogger as logger } from '../src/logger.js';
import { DATABASE_NAMES } from '../src/config/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

// Valid commands
const VALID_COMMANDS = ['generate', 'push', 'studio', 'drop', 'check', 'up', 'migrate'] as const;

type Command = (typeof VALID_COMMANDS)[number];
type DatabaseName = (typeof DATABASE_NAMES)[number];

// Parse arguments
const [cmdArg, dbArg] = process.argv.slice(2);

if (!cmdArg || !dbArg) {
  logger.error('❌ Usage: pnpm db:<command> <dbName>');
  logger.error(`   Example: pnpm db:generate main`);
  logger.error(`   Commands: ${VALID_COMMANDS.join(', ')}`);
  logger.error(`   Databases: ${DATABASE_NAMES.join(', ')}`);
  process.exit(1);
}

// Validate inputs
if (!VALID_COMMANDS.includes(cmdArg as Command)) {
  logger.error(`❌ Invalid command: ${cmdArg}`);
  logger.error(`   Valid commands: ${VALID_COMMANDS.join(', ')}`);
  process.exit(1);
}

if (!DATABASE_NAMES.includes(dbArg as DatabaseName)) {
  logger.error(`❌ Invalid database: ${dbArg}`);
  logger.error(`   Valid databases: ${DATABASE_NAMES.join(', ')}`);
  process.exit(1);
}

const command = cmdArg as Command;
const dbName = dbArg as DatabaseName;

let tempConfigPath: string | undefined;

function cleanup(): void {
  if (tempConfigPath && existsSync(tempConfigPath)) {
    try {
      unlinkSync(tempConfigPath);
    } catch {
      // Ignore cleanup errors
    }
  }
}

async function main(): Promise<void> {
  try {
    // Dynamic import to avoid circular dependencies
    const { getConfig } = await import('../src/config/index');
    const dbConfig = getConfig(dbName);

    // Create temporary config file for drizzle-kit
    tempConfigPath = join(rootDir, `drizzle.config.${dbName}.tmp.ts`);
    const configContent = `export default ${JSON.stringify(dbConfig, null, 2)};`;
    writeFileSync(tempConfigPath, configContent, 'utf-8');

    logger.info(`Running drizzle-kit ${command} for database: ${dbName}`);

    // Spawn drizzle-kit with temp config
    const child: ChildProcess = spawn('drizzle-kit', [command, '--config', tempConfigPath], {
      stdio: 'inherit',
      cwd: rootDir,
    });

    child.on('error', error => {
      logger.error(error, 'Failed to start drizzle-kit:');
      cleanup();
      process.exit(1);
    });

    child.on('close', code => {
      cleanup();
      if (code !== 0) {
        logger.error(`drizzle-kit ${command} failed with code ${code}`);
        process.exit(code ?? 1);
      }
      logger.info(`✅ drizzle-kit ${command} completed for ${dbName}`);
    });
  } catch (error) {
    logger.error(error, 'Error in drizzle-wrapper:');
    cleanup();
    process.exit(1);
  }
}

// Handle cleanup on exit
process.on('exit', cleanup);
process.on('SIGINT', () => {
  cleanup();
  process.exit(130);
});
process.on('SIGTERM', () => {
  cleanup();
  process.exit(143);
});

main();
