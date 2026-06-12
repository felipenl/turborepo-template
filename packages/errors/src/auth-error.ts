import { CustomError } from './custom-error.js';

export class AuthError extends CustomError {
  constructor(message: string = 'Unauthorized', status: number = 401, data?: unknown) {
    super('AuthError', message, status, data);
    Object.setPrototypeOf(this, AuthError.prototype);
  }
}
