import { UseMutationOptions, useMutation } from '@tanstack/react-query';
import axios from '@/axiosInstance';
import { RegisterData, LoginResponse } from './types';
import { APIError, APIResponse } from '@/types/axios';

export async function register(data: RegisterData) {
  try {
    const response: APIResponse<LoginResponse> = await axios.post(
      'auth/register',
      {
        ...data,
      }
    );
    return response.data;
  } catch (err) {
    throw err as APIError;
  }
}

export function useRegister(
  options?:
    | Omit<
        UseMutationOptions<
          LoginResponse | undefined,
          APIError,
          RegisterData,
          unknown
        >,
        'mutationFn'
      >
    | undefined
) {
  return useMutation({
    mutationFn: register,
    ...options,
  });
}
