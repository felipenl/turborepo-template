# @workspace/utils

Shared utilities for the monorepo. Tree-shakeable with subpath exports.

## Packages

### Environment (`@workspace/utils/environment`)

Environment detection and .env file loading.

**Load environment variables:**

```typescript
import { loadEnv } from '@workspace/utils/environment';

// Automatically loads .env.{NODE_ENV}
loadEnv(); // local → .env.local, development → .env.development, production → .env.production
```

**Environment detection:**

```typescript
import { isLocal, isDevelopment, isProduction, isTest } from '@workspace/utils/environment';

if (isLocal) {
  // Local development
}

if (isProduction) {
  // Production code
}
```

### Server (`@workspace/utils/server`)

Express middleware and backend utilities.

**Middleware:**

```typescript
import {
  createHttpLogger,
  createErrorHandler,
  createResponseEnhancer,
} from '@workspace/utils/server';

const logger = createLogger({ name: 'API' });
app.use(createHttpLogger(logger));
app.use(createResponseEnhancer(logger));
app.use(createErrorHandler(logger));
```

**JWT:**

```typescript
import { generateToken, decodeToken } from '@workspace/utils/server';

const token = generateToken({ userId: 123 }, { secret: 'xxx', expiresIn: '7d' });
const payload = decodeToken('Bearer xxx', 'secret');
```

**Auth:**

```typescript
import { createAuthMiddleware } from '@workspace/utils/server';

const auth = createAuthMiddleware({ secret: process.env.JWT_SECRET });
app.get('/protected', auth, handler);
```

### Environment (`@workspace/utils/environment`)

```typescript
import { isProduction, isDevelopment, getEnvironment } from '@workspace/utils/environment';

if (isProduction) {
  // ...
}
```

### String (`@workspace/utils/string`)

```typescript
import { slugify, truncate, capitalize, camelCase, snakeCase } from '@workspace/utils/string';

slugify('Hello World!'); // 'hello-world'
truncate('Long text...', 10); // 'Long te...'
capitalize('hello'); // 'Hello'
camelCase('hello-world'); // 'helloWorld'
snakeCase('helloWorld'); // 'hello_world'
```

### Date (`@workspace/utils/date`)

```typescript
import { formatDate, addDays, diffInDays, isValidDate } from '@workspace/utils/date';

formatDate(new Date(), 'YYYY-MM-DD HH:mm:ss');
addDays(new Date(), 7);
diffInDays(date1, date2);
```

## Usage

```typescript
// Default export (non-server utils)
import { slugify, isProduction } from '@workspace/utils';

// Server-specific (Express/Node only)
import { createHttpLogger } from '@workspace/utils/server';

// Subpath imports
import { truncate } from '@workspace/utils/string';
import { formatDate } from '@workspace/utils/date';
import { isDevelopment } from '@workspace/utils/environment';
```

## Tree Shaking

Only imported functions are bundled. Server utilities require peer dependencies (`express`, `pino`) and won't be included in frontend builds.
