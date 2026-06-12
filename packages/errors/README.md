# @repo/errors

Custom error classes for the monorepo.

## Errors

- `CustomError`: Base error class with status code and optional data
- `ResponseError`: HTTP response errors (400-599)
- `AuthError`: Authentication/authorization errors (401/403)

## Usage

```typescript
import { CustomError, ResponseError, AuthError } from '@repo/errors';

// Custom error
throw new CustomError('ValidationError', 'Invalid input', 400, { field: 'email' });

// Response error
throw new ResponseError('Resource not found', 404);

// Auth error
throw new AuthError('Invalid token', 401);
```
