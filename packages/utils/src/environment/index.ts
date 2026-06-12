export enum Environment {
  PRODUCTION = 'PRODUCTION',
  DEVELOPMENT = 'DEVELOPMENT',
  TEST = 'TEST',
  LOCAL = 'LOCAL',
}

const NODE_ENV = (process.env.NODE_ENV || 'development').toUpperCase();

export const isProduction = NODE_ENV === Environment.PRODUCTION;
export const isDevelopment = NODE_ENV === Environment.DEVELOPMENT;
export const isTest = NODE_ENV === Environment.TEST;
export const isLocal = NODE_ENV === Environment.LOCAL;

export const getEnvironment = (): Environment => {
  return (NODE_ENV as Environment) || Environment.DEVELOPMENT;
};
