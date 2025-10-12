import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import prettierPlugin from 'eslint-plugin-prettier';
import eslintConfigPrettier from 'eslint-config-prettier';
import turboPlugin from 'eslint-plugin-turbo';
import onlyWarn from 'eslint-plugin-only-warn';
import globals from 'globals';
import prettierConfig from './prettier.config.mjs';

/**
 * A shared ESLint configuration for the repository.
 *
 * @type {import("eslint").Linter.Config[]}
 * */
export const config = [
  // Base JS configuration
  js.configs.recommended,
  
  // TypeScript configuration
  ...tseslint.configs.recommended,
  
  // Global configuration
  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    ignores: [
      'dist/**',
      'build/**',
      'node_modules/**',
      '.eslintcache',
      '.husky/**',
      '.turbo/**',
      '.next/**',
      '*.config.js',
      '*.config.mjs',
    ],
  },

  // Turbo configuration
  {
    plugins: {
      turbo: turboPlugin,
    },
    rules: {
      'turbo/no-undeclared-env-vars': 'warn',
    },
  },

  // Prettier configuration
  {
    plugins: { prettier: prettierPlugin },
    rules: { 'prettier/prettier': ['error', prettierConfig] },
  },

  // Only warn plugin
  {
    plugins: {
      onlyWarn,
    },
  },

  // Prettier config last to override conflicting rules
  eslintConfigPrettier,
];
