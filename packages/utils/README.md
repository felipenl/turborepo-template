# @repo/utils

Shared utilities for the monorepo. Tree-shakeable with subpath exports.

## Packages

### Server (`@repo/utils/server`)

Express middleware and backend utilities.

**Middleware:**

```typescript
import { createHttpLogger, createErrorHandler, createResponseEnhancer } from '@repo/utils/server';

const logger = createLogger({ name: 'API' });
app.use(createHttpLogger(logger));
app.use(createResponseEnhancer(logger));
app.use(createErrorHandler(logger));
```

**JWT:**

```typescript
import { generateToken, decodeToken } from '@repo/utils/server';

const token = generateToken({ userId: 123 }, { secret: 'xxx', expiresIn: '7d' });
const payload = decodeToken('Bearer xxx', 'secret');
```

**Auth:**

```typescript
import { createAuthMiddleware } from '@repo/utils/server';

const auth = createAuthMiddleware({ secret: process.env.JWT_SECRET });
app.get('/protected', auth, handler);
```

### Environment (`@repo/utils/environment`)

```typescript
import { isProduction, isDevelopment, getEnvironment } from '@repo/utils/environment';

if (isProduction) {
  // ...
}
```

### String (`@repo/utils/string`)

```typescript
import { slugify, truncate, capitalize, camelCase, snakeCase } from '@repo/utils/string';

slugify('Hello World!'); // 'hello-world'
truncate('Long text...', 10); // 'Long te...'
capitalize('hello'); // 'Hello'
camelCase('hello-world'); // 'helloWorld'
snakeCase('helloWorld'); // 'hello_world'
```

### Date (`@repo/utils/date`)

```typescript
import { formatDate, addDays, diffInDays, isValidDate } from '@repo/utils/date';

formatDate(new Date(), 'YYYY-MM-DD HH:mm:ss');
addDays(new Date(), 7);
diffInDays(date1, date2);
```

## Usage

```typescript
// Default export (non-server utils)
import { slugify, isProduction } from '@repo/utils';

// Server-specific (Express/Node only)
import { createHttpLogger } from '@repo/utils/server';

// Subpath imports
import { truncate } from '@repo/utils/string';
import { formatDate } from '@repo/utils/date';
import { isDevelopment } from '@repo/utils/environment';
```

## Tree Shaking

Only imported functions are bundled. Server utilities require peer dependencies (`express`, `pino`) and won't be included in frontend builds.
