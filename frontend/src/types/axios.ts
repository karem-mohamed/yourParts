import { AxiosError, AxiosResponse } from 'axios';

export type APIResponse<T = void> = Omit<AxiosResponse, 'data'> & {
  data: T;
};

export interface APIError extends AxiosError {
  response: AxiosResponse<{
    status: number;
    code: string;
    message: string;
    errors: unknown;
  }>;
}
