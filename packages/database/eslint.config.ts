import type { Linter } from 'eslint';
import { config as backendConfig } from '@workspace/eslint-config/backend';

export default [
  ...backendConfig,
  {
    files: ['scripts/**/*.ts'],
    rules: {
      // CLI scripts need process.exit for exit codes
      'no-process-exit': 'off',
    },
  },
] satisfies Linter.Config[];
