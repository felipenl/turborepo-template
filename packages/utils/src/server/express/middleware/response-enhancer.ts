import { type Request, type Response, type NextFunction } from 'express';
import { type Logger } from 'pino';
import { sendErrorResponse } from '../../error-utils.js';
import { ResponseStatus } from '../../types.js';

declare global {
  namespace Express {
    interface Response {
      success: (data?: unknown, status?: number, message?: string) => void;
      error: (err: Error, status?: number) => void;
    }
  }
}

export const createResponseEnhancer = (logger: Logger) => {
  return (_req: Request, res: Response, next: NextFunction) => {
    res.success = (data?: unknown, status: number = 200, message: string = 'ok') => {
      res.status(status).json({
        status: ResponseStatus.SUCCESS,
        code: status,
        message,
        data,
      });
    };

    res.error = (err: Error, status: number = 500) => {
      sendErrorResponse(res, err, logger, status);
    };

    next();
  };
};
