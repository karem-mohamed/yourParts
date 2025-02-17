import { UseMutationOptions, useMutation } from '@tanstack/react-query';
import axios from '@/axiosInstance';
import { APIError, APIResponse } from '@/types/axios';
import { Post, EditPostData } from './types';

export async function EditPost({ id, content }: EditPostData) {
  try {
    const response: APIResponse<Post> = await axios.patch(
      `posts/update/${id}`,
      {
        content,
      }
    );
    return response.data;
  } catch (err) {
    throw err as APIError;
  }
}

export function useEditPost(
  options?:
    | Omit<UseMutationOptions<Post, APIError, EditPostData>, 'mutationFn'>
    | undefined
) {
  return useMutation({
    mutationFn: EditPost,
    ...options,
  });
}
