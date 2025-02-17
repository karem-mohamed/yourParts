import { UseMutationOptions, useMutation } from '@tanstack/react-query';
import axios from '@/axiosInstance';
import { APIError, APIResponse } from '@/types/axios';
import { Post } from './types';

export async function DeletePost(id: string) {
  try {
    const response: APIResponse<Post[]> = await axios.delete(
      `posts/delete/${id}`
    );
    return response.data;
  } catch (err) {
    throw err as APIError;
  }
}

export function useDeletePost(
  options?:
    | Omit<UseMutationOptions<Post[], APIError, string>, 'mutationFn'>
    | undefined
) {
  return useMutation({
    mutationFn: DeletePost,
    ...options,
  });
}
