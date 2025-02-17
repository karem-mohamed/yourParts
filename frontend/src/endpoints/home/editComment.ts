import { UseMutationOptions, useMutation } from '@tanstack/react-query';
import axios from '@/axiosInstance';
import { APIError, APIResponse } from '@/types/axios';
import { Comment, EditCommentData } from './types';

export async function EditComment({ id, content }: EditCommentData) {
  try {
    const response: APIResponse<Comment> = await axios.patch(
      `comments/update/${id}`,
      {
        content,
      }
    );
    return response.data;
  } catch (err) {
    throw err as APIError;
  }
}

export function useEditComment(
  options?:
    | Omit<UseMutationOptions<Comment, APIError, EditCommentData>, 'mutationFn'>
    | undefined
) {
  return useMutation({
    mutationFn: EditComment,
    ...options,
  });
}
