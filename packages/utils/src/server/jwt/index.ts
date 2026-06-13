import jwt, { type JwtPayload, type SignOptions } from 'jsonwebtoken';
import { AuthError } from '@repo/errors';

export interface JwtConfig {
  secret: string;
  expiresIn?: string | number;
}

export const generateToken = (payload: object, config: JwtConfig, options: SignOptions = {}) => {
  const { secret, expiresIn: defaultExpiresIn } = config;

  if (!secret) throw new Error("Missing 'secret' in JWT config");

  const expiresIn = options.expiresIn ?? defaultExpiresIn;

  if (expiresIn) {
    options.expiresIn = expiresIn as SignOptions['expiresIn'];
  }

  return jwt.sign(payload, secret, options);
};

export const decodeToken = (header: string, secret: string): JwtPayload => {
  if (!secret) {
    throw new Error('Critical: Missing JWT secret');
  }

  const token = header.replace(/^Bearer\s+/i, '');

  if (!token) {
    throw new Error('Token format is invalid. Expected: Bearer <token>');
  }

  try {
    return jwt.verify(token, secret) as JwtPayload;
  } catch (e) {
    if ((e as Error).name === 'TokenExpiredError') {
      throw new AuthError('Token expired');
    }

    throw new AuthError('Invalid token signature');
  }
};
