import type { Linter } from 'eslint';
import { nextJsConfig } from '@workspace/eslint-config/next-js';

export default nextJsConfig satisfies Linter.Config[];
