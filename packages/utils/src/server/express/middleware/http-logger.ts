import { type Request, type Response, type NextFunction } from 'express';
import { type Level, type Logger } from 'pino';

type EventType = 'finish' | 'close' | 'aborted';

export const formatDuration = (ts: number): string => {
  if (ts < 0) ts = 0;

  const h = Math.floor(ts / 3_600_000);
  ts = ts % 3_600_000;

  const m = Math.floor(ts / 60_000);
  ts = ts % 60_000;

  const s = Math.floor(ts / 1_000);
  const ms = ts % 1_000;

  const pad = (n: number, z = 2) => n.toString().padStart(z, '0');

  let base = `${pad(m)}:${pad(s)}.${pad(ms, 3)}`;

  if (h) base = `${pad(h)}:${base}`;

  return base;
};

const getLevel = (status: number): Level => {
  if (status >= 500) return 'error';
  if (status >= 400) return 'warn';
  return 'info';
};

export const createHttpLogger = (logger: Logger) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const start = Date.now();

    const logRequest = (event: EventType, level?: Level) => {
      const time = Date.now() - start;
      const duration = formatDuration(time);
      const message = `[${req.protocol}] ${req.method} ${req.originalUrl} (${String(res.statusCode)}) ${res.statusMessage || ''}`;

      logger[level ?? getLevel(res.statusCode)](
        {
          method: req.method,
          url: req.originalUrl || req.url,
          status: res.statusCode,
          duration: time,
          durationString: duration,
          userAgent: req.get('user-agent') || '-',
          ip: req.ip,
          event,
        },
        message,
      );
    };

    res.on('finish', () => {
      logRequest('finish');
    });

    res.on('close', () => {
      if (!res.writableEnded) {
        res.status(499);
        res.statusMessage = 'Client Closed Request';
        logRequest('aborted');
      }
    });

    next();
  };
};
