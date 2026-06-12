import type { Linter } from 'eslint';
import { config as backendConfig } from '@repo/eslint-config/backend';

export default backendConfig satisfies Linter.Config[];
