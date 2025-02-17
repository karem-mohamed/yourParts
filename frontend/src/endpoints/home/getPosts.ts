import { UseMutationOptions, useMutation } from '@tanstack/react-query';
import axios from '@/axiosInstance';
import { APIError, APIResponse } from '@/types/axios';
import { Post, PostPayload } from './types';
interface PostsResponse {
  posts: Post[];
  count: number;
}
export async function fetchPosts({ limit, page }: PostPayload) {
  try {
    const response: APIResponse<PostsResponse> = await axios.get(
      `posts?page=${page ?? 1}${limit ? `&limit=${limit}` : ''}`
    );
    return response.data;
  } catch (err) {
    throw err as APIError;
  }
}

export function useFetchPosts(
  options?:
    | Omit<
        UseMutationOptions<PostsResponse, APIError, PostPayload>,
        'mutationFn'
      >
    | undefined
) {
  return useMutation({
    mutationFn: fetchPosts,
    ...options,
  });
}
