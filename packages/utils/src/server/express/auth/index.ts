import { type Request, type Response, type NextFunction } from 'express';
import { AuthError } from '@workspace/errors';
import { decodeToken } from '../../jwt/index.js';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace -- Required for Express Request augmentation
  namespace Express {
    interface Request {
      token?: unknown;
    }
  }
}

export interface AuthConfig {
  secret: string;
  headerName?: string;
}

export const createAuthMiddleware = (config: AuthConfig) => {
  const { secret, headerName = 'Authorization' } = config;

  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      const authHeader = req.header(headerName);

      if (!authHeader) {
        throw new AuthError(`No '${headerName}' header provided`, 400);
      }

      req.token = decodeToken(authHeader, secret);

      next();
    } catch (err) {
      next(new AuthError((err as Error).message));
    }
  };
};
