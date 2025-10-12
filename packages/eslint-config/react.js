import { config as baseConfig } from './base.js';
import reactPlugin from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import tanstackQuery from '@tanstack/eslint-plugin-query';

/**
 * ESLint configuration for React applications.
 * Extends the base configuration with React-specific rules.
 *
 * @type {import("eslint").Linter.Config[]}
 */
export const reactConfig = [
  ...baseConfig,

  // React + Hooks + A11y + TanStack Query
  {
    files: ['**/*.jsx', '**/*.tsx'],
    plugins: {
      react: reactPlugin,
      'react-hooks': reactHooks,
      'jsx-a11y': jsxA11y,
      '@tanstack/query': tanstackQuery,
    },
    settings: {
      react: { version: 'detect' },
    },
    rules: {
      // React
      ...(reactPlugin.configs.recommended?.rules ?? {}),
      'react/react-in-jsx-scope': 'off',

      // Hooks
      ...(reactHooks.configs.recommended?.rules ?? {}),

      // A11y
      ...(jsxA11y.configs.recommended?.rules ?? {}),

      // TanStack Query
      ...(tanstackQuery.configs?.['flat/recommended']?.rules ?? {}),
      '@tanstack/query/no-rest-destructuring': 'warn',
      '@tanstack/query/exhaustive-deps': 'warn',
    },
  },
];
