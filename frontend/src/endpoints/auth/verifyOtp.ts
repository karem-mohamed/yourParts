import { UseMutationOptions, useMutation } from '@tanstack/react-query';
import axios from '@/axiosInstance';
import { OtpData, ResetResponse } from './types';
import { APIError, APIResponse } from '@/types/axios';

export async function verify(data: OtpData) {
  try {
    const response: APIResponse<ResetResponse> = await axios.post(
      'auth/verify-otp',
      {
        ...data,
      }
    );
    return response.data;
  } catch (err) {
    throw err as APIError;
  }
}

export function useVerifyOtp(
  options?:
    | Omit<
        UseMutationOptions<
          ResetResponse | undefined,
          APIError,
          OtpData,
          unknown
        >,
        'mutationFn'
      >
    | undefined
) {
  return useMutation({
    mutationFn: verify,
    ...options,
  });
}
