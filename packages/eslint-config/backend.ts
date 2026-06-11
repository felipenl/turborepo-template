import type { Linter } from 'eslint';
import { config as baseConfig } from './base.ts';

/**
 * ESLint configuration for backend Node.js applications.
 * Extends base config with Node.js-specific rules.
 */
export const config: Linter.Config[] = [
  ...baseConfig,
  {
    rules: {
      // Node.js best practices
      'no-console': 'off', // Backend apps use console for logging
      'no-process-exit': 'error',
      'no-sync': 'warn', // Prefer async fs operations

      // Error handling
      'no-throw-literal': 'error',
      'prefer-promise-reject-errors': 'error',

      // Async patterns
      'no-async-promise-executor': 'error',
      'require-atomic-updates': 'error',

      // TypeScript backend patterns
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/explicit-function-return-type': 'off', // Too strict for backends
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
    },
  },
];

export default config;
