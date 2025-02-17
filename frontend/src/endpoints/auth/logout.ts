import { UseMutationOptions, useMutation } from '@tanstack/react-query';
import axios from '@/axiosInstance';
import { APIError, APIResponse } from '@/types/axios';
import { LogoutResponse } from './types';
export async function Logout() {
  try {
    const response: APIResponse<LogoutResponse> =
      await axios.post('auth/logout');
    return response.data;
  } catch (err) {
    throw err as APIError;
  }
}

export function useLogout(
  options?:
    | Omit<UseMutationOptions<LogoutResponse, APIError>, 'mutationFn'>
    | undefined
) {
  return useMutation({
    mutationFn: Logout,
    ...options,
  });
}
