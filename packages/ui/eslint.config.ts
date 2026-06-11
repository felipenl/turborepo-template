import type { Linter } from 'eslint';
import { config as reactInternalConfig } from '@repo/eslint-config/react-internal';

export default reactInternalConfig satisfies Linter.Config[];
