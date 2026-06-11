import type { Linter } from 'eslint';
import { config as baseConfig } from './base.ts';
import reactPlugin from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import tanstackQuery from '@tanstack/eslint-plugin-query';

/**
 * ESLint configuration for React applications.
 */
export const reactConfig: Linter.Config[] = [
  ...baseConfig,
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
      ...(reactPlugin.configs.recommended?.rules ?? {}),
      'react/react-in-jsx-scope': 'off',
      ...(reactHooks.configs.recommended?.rules ?? {}),
      ...(jsxA11y.configs.recommended?.rules ?? {}),
      ...(tanstackQuery.configs?.['flat/recommended']?.rules ?? {}),
      '@tanstack/query/no-rest-destructuring': 'warn',
      '@tanstack/query/exhaustive-deps': 'warn',
    },
  },
];
