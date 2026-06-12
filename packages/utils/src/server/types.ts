export enum ResponseStatus {
  SUCCESS = 'success',
  ERROR = 'error',
}

export interface JsonResponse {
  status: ResponseStatus;
  code?: number;
  data?: unknown;
}

export interface ErrorResponse extends JsonResponse {
  message: string;
}

export interface ErrorDetails {
  statusCode: number;
  data?: unknown;
}
