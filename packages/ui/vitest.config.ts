import { defineConfig, mergeConfig } from 'vitest/config';
import baseConfig from '@repo/test-config/vitest';

export default mergeConfig(
  baseConfig,
  defineConfig({
    test: {
      environment: 'jsdom',
    },
  })
);
