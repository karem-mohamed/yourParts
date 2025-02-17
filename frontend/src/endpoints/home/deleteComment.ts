import { UseMutationOptions, useMutation } from '@tanstack/react-query';
import axios from '@/axiosInstance';
import { APIError, APIResponse } from '@/types/axios';
import { Comment } from './types';

export async function DeleteComment(id: string) {
  try {
    const response: APIResponse<Comment> = await axios.delete(
      `comments/delete/${id}`
    );
    return response.data;
  } catch (err) {
    throw err as APIError;
  }
}

export function useDeleteComment(
  options?:
    | Omit<UseMutationOptions<Comment, APIError, string>, 'mutationFn'>
    | undefined
) {
  return useMutation({
    mutationFn: DeleteComment,
    ...options,
  });
}
