export type ServiceMessage = { message: string; id: string };

type ServiceResponseErrorType = 'BAD_REQUEST' |
'UNAUTHORIZED' | 'INTERNAL_ERROR' | 'NOT_FOUND' | 'CONFLICT';

export type ServiceResponseError = {
  status: ServiceResponseErrorType;
  data: ServiceMessage;
};

export type ServiceResponseSuccess<T> = {
  status: 'SUCCESSFUL';
  data: T;
};

export type ServiceResponse<T> = ServiceResponseSuccess<T> | ServiceResponseError;
