import { UseMutationOptions, useMutation } from '@tanstack/react-query';
import axios from '@/axiosInstance';
import { LoginResponse } from './types';
import { APIError, APIResponse } from '@/types/axios';

export async function refetchUser(token: string) {
  try {
    axios;
    const response: APIResponse<LoginResponse> = await axios.get(
      'auth/profile',
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (err) {
    throw err as APIError;
  }
}

export function useRefetchUser(
  options?:
    | Omit<
        UseMutationOptions<LoginResponse | undefined, APIError, string>,
        'mutationFn'
      >
    | undefined
) {
  return useMutation({
    mutationFn: refetchUser,
    ...options,
  });
}
