import { UseMutationOptions, useMutation } from '@tanstack/react-query';
import axios from '@/axiosInstance';
import { APIError, APIResponse } from '@/types/axios';
import { Tag } from './types';
export async function fetchTags() {
  try {
    const response: APIResponse<Tag[]> = await axios.get('tags');
    return response.data;
  } catch (err) {
    throw err as APIError;
  }
}

export function useFetchTags(
  options?: Omit<UseMutationOptions<Tag[], APIError>, 'mutationFn'> | undefined
) {
  return useMutation({
    mutationFn: fetchTags,
    ...options,
  });
}
