import { UseMutationOptions, useMutation } from '@tanstack/react-query';
import axios from '@/axiosInstance';
import { ResetData, ResetResponse } from './types';
import { APIError, APIResponse } from '@/types/axios';

export async function reset(data: ResetData) {
  try {
    const response: APIResponse<ResetResponse> = await axios.post(
      'auth/forget',
      {
        ...data,
      }
    );
    return response.data;
  } catch (err) {
    throw err as APIError;
  }
}

export function useResetPassword(
  options?:
    | Omit<
        UseMutationOptions<
          ResetResponse | undefined,
          APIError,
          ResetData,
          unknown
        >,
        'mutationFn'
      >
    | undefined
) {
  return useMutation({
    mutationFn: reset,
    ...options,
  });
}
