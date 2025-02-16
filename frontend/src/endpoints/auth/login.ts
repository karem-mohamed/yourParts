import { UseMutationOptions, useMutation } from '@tanstack/react-query';
import axios from '@/axiosInstance';
import { LoginData, LoginResponse } from './types';
import { APIError, APIResponse } from '@/types/axios';

export async function login(data: LoginData) {
  try {
    const response: APIResponse<LoginResponse> = await axios.post(
      'auth/login',
      {
        ...data,
      }
    );
    return response.data;
  } catch (err) {
    throw err as APIError;
  }
}

export function useLogin(
  options?:
    | Omit<
        UseMutationOptions<
          LoginResponse | undefined,
          APIError,
          LoginData,
          unknown
        >,
        'mutationFn'
      >
    | undefined
) {
  return useMutation({
    mutationFn: login,
    ...options,
  });
}
