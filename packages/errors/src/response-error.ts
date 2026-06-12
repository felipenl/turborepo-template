import { CustomError } from './custom-error.js';

export class ResponseError extends CustomError {
  constructor(message: string = 'Internal Server Error', status: number = 500, data?: unknown) {
    super('ResponseError', message, status, data);
    Object.setPrototypeOf(this, ResponseError.prototype);
  }
}
