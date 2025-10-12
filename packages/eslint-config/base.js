import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import prettierPlugin from 'eslint-plugin-prettier';
import eslintConfigPrettier from 'eslint-config-prettier';
import turboPlugin from 'eslint-plugin-turbo';
import onlyWarn from 'eslint-plugin-only-warn';
import globals from 'globals';
import prettierConfig from './prettier.config.mjs';

/**
 * Shared ESLint configuration for the monorepo.
 * @type {import("eslint").Linter.Config[]}
 */
export const config = [
  js.configs.recommended,
  ...tseslint.configs.recommended,
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
  {
    plugins: { turbo: turboPlugin },
    rules: { 'turbo/no-undeclared-env-vars': 'warn' },
  },
  {
    plugins: { prettier: prettierPlugin },
    rules: { 'prettier/prettier': ['error', prettierConfig] },
  },
  {
    plugins: { onlyWarn },
  },
  eslintConfigPrettier,
];
