# @workspace/logger

Production-ready logger built on [Pino](https://getpino.io/) with file rotation, console pretty-printing, and sensitive data redaction.

## Features

- **Dual transports**: Console (pretty in dev) + file with daily rotation
- **Automatic redaction**: Passwords, tokens, secrets stripped from logs
- **Caller tracking**: Shows file:line for each log statement
- **Type-safe**: Full TypeScript support
- **Zero config**: Works out of the box with sensible defaults

## Usage

### Basic Logger

```typescript
import { createLogger } from '@workspace/logger';

const logger = createLogger({
  name: 'AppLogger',
  fileName: 'app.log',
});

logger.info('Server started');
logger.error({ err: new Error('Something broke') }, 'Failed to connect');
```

### Custom Configuration

```typescript
const logger = createLogger(
  {
    name: 'DBLogger',
    fileName: 'database.log',
    level: 'debug',
    path: '/var/log/myapp',
  },
  {
    daysToKeep: 30,
    defaultLevel: 'info',
    redactPaths: ['user.email', 'payment.cardNumber'],
  }
);
```

### Multiple Loggers

```typescript
export const appLogger = createLogger({ name: 'App', fileName: 'app.log' });
export const dbLogger = createLogger({ name: 'DB', fileName: 'db.log' });
export const authLogger = createLogger({ name: 'Auth', fileName: 'auth.log' });
```

## API

### `createLogger(options, config?)`

#### `options: LoggerOptions`

- `name` (required): Logger identifier shown in logs
- `fileName` (optional): Log file name, defaults to `{name}.log`
- `level` (optional): Minimum log level (`fatal` | `error` | `warn` | `info` | `debug` | `trace`)
- `path` (optional): Log directory, defaults to `./logs`

#### `config: CreateLoggerConfig`

- `daysToKeep` (optional): File retention days, default `7`
- `defaultLevel` (optional): Fallback log level, default `info`
- `redactPaths` (optional): Additional paths to redact (e.g., `['user.ssn']`)

## Environment Variables

Set `NODE_ENV=production` for JSON console output. Otherwise logs use pretty-print for development.

## Log Levels

From highest to lowest severity:

1. `fatal` - Application crash
2. `error` - Recoverable errors
3. `warn` - Warning conditions
4. `info` - Informational (default)
5. `debug` - Debug details
6. `trace` - Verbose trace

## Automatic Redaction

These paths are redacted by default:

- `req.headers.authorization`
- `req.body.password`
- `req.body.token`
- `req.body.client_secret`
- `req.body.clientId`
- `req.body.tenantId`

Add more via `redactPaths` config option.

## File Rotation

Logs rotate daily with configurable retention. Old logs are automatically deleted after `daysToKeep` days. Each file is limited to 10MB before forced rotation.
