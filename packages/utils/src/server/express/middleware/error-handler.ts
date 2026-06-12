import { type Request, type Response, type NextFunction } from 'express';
import { type Logger } from 'pino';
import { sendErrorResponse } from '../../error-utils.js';

export const createErrorHandler = (logger: Logger) => {
  return (err: Error, _req: Request, res: Response, _next: NextFunction) => {
    sendErrorResponse(res, err, logger, 500);
  };
};
