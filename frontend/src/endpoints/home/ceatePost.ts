import { UseMutationOptions, useMutation } from '@tanstack/react-query';
import axios from '@/axiosInstance';
import { APIError, APIResponse } from '@/types/axios';
import { Post, CreatePostData } from './types';

export async function CreatePost({
  content,
  categoryId,
  title = 'test title',
}: CreatePostData) {
  try {
    const response: APIResponse<Post> = await axios.post(`posts/create`, {
      content,
      categoryId,
      title,
    });
    return response.data;
  } catch (err) {
    throw err as APIError;
  }
}

export function useCreatePost(
  options?:
    | Omit<UseMutationOptions<Post, APIError, CreatePostData>, 'mutationFn'>
    | undefined
) {
  return useMutation({
    mutationFn: CreatePost,
    ...options,
  });
}
