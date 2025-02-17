import { UseMutationOptions, useMutation } from '@tanstack/react-query';
import axios from '@/axiosInstance';
import { APIError, APIResponse } from '@/types/axios';
import { Comment, CommentData } from './types';

export async function SendComment(data: CommentData) {
  try {
    const response: APIResponse<Comment> = await axios.post('comments/create', {
      ...data,
    });
    return response.data;
  } catch (err) {
    throw err as APIError;
  }
}

export function useSendComment(
  options?:
    | Omit<UseMutationOptions<Comment, APIError, CommentData>, 'mutationFn'>
    | undefined
) {
  return useMutation({
    mutationFn: SendComment,
    ...options,
  });
}
