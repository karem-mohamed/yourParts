import { UseMutationOptions, useMutation } from '@tanstack/react-query';
import axios from '@/axiosInstance';
import { APIError, APIResponse } from '@/types/axios';
import { Post } from '../home/types';
export async function fetchMyPosts() {
  try {
    const response: APIResponse<Post[]> = await axios.get('posts/me');
    return response.data;
  } catch (err) {
    throw err as APIError;
  }
}

export function useFetchMyPosts(
  options?: Omit<UseMutationOptions<Post[], APIError>, 'mutationFn'> | undefined
) {
  return useMutation({
    mutationFn: fetchMyPosts,
    ...options,
  });
}
