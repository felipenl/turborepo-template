import { type Response } from 'express';
import { type Logger } from 'pino';
import { ResponseError } from '@repo/errors';
import { ResponseStatus } from './types.js';

export interface ErrorDetails {
  statusCode: number;
  data?: unknown;
}

export const extractErrorDetails = (err: Error, defaultStatus: number = 500): ErrorDetails => {
  if (err instanceof ResponseError) {
    return {
      statusCode: err.status,
      data: err.data,
    };
  }
  return {
    statusCode: defaultStatus,
    data: undefined,
  };
};

export const sendErrorResponse = (
  res: Response,
  err: Error,
  logger: Logger,
  defaultStatus: number = 500,
): void => {
  const { statusCode, data } = extractErrorDetails(err, defaultStatus);

  logger.error(err, err.message);

  res.status(statusCode).json({
    status: ResponseStatus.ERROR,
    code: statusCode,
    message: err.message,
    data,
  });
};
