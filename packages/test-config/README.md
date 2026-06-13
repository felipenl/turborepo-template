# @workspace/test-config

Shared Vitest configuration for the monorepo.

## Usage

In your package's `vitest.config.ts`:

```typescript
import { mergeConfig } from 'vitest/config';
import baseConfig from '@workspace/test-config/vitest';

export default mergeConfig(baseConfig, {
  // Your package-specific overrides
  test: {
    // ...
  },
});
```

Or use directly:

```typescript
import vitestConfig from '@workspace/test-config/vitest';
export default vitestConfig;
```

## Running Tests

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with coverage
pnpm test:coverage
```

## Optional: Vitest UI

To use Vitest's browser UI (not included by default):

```bash
# Install in your package
pnpm add -D @vitest/ui

# Add script to package.json
"test:ui": "vitest --ui"

# Run
pnpm test:ui
```
