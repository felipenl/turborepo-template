# `@repo/eslint-config`

This package contains shared ESLint configurations for the turborepo template monorepo.

## Available Configurations

### Base Configuration (`./base`)

A comprehensive ESLint configuration that includes:

- JavaScript and TypeScript support
- Prettier integration
- Turbo plugin for monorepo-specific rules
- Modern ECMAScript features
- Global variables for browser and Node.js environments

**Usage in apps/packages:**

```javascript
// eslint.config.js
import { config } from '@repo/eslint-config/base';

export default config;
```

### React Configuration (`./react`)

Extends the base configuration with React-specific rules:

- React plugin with recommended rules
- React Hooks rules
- JSX A11y accessibility rules
- TanStack Query rules (if using React Query/TanStack Query)

**Usage in React apps:**

```javascript
// eslint.config.js
import { reactConfig } from '@repo/eslint-config/react';

export default reactConfig;
```

### Next.js Configuration (`./next-js`)

For Next.js applications (existing configuration).

### Prettier Configuration

Shared Prettier configuration is also available:

```javascript
// prettier.config.js
import prettierConfig from '@repo/eslint-config/prettier.config';

export default prettierConfig;
```

## Features

- **Monorepo-aware**: Includes Turbo plugin for detecting undeclared environment variables
- **TypeScript support**: Full TypeScript linting with type-aware rules
- **Prettier integration**: Automatic code formatting with ESLint
- **Accessibility**: A11y rules for React components
- **Modern standards**: Support for latest ECMAScript features
- **Flexible**: Base config for non-React packages, React config for frontend apps
