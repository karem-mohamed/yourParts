import { UseMutationOptions, useMutation } from '@tanstack/react-query';
import axios from '@/axiosInstance';
import { APIError, APIResponse } from '@/types/axios';
import { Tag } from './types';

export async function DeleteTag(id: string | number) {
  try {
    const response: APIResponse<Tag> = await axios.delete(`tags/delete/${id}`);
    return response.data;
  } catch (err) {
    throw err as APIError;
  }
}

export function useDeleteTag(
  options?:
    | Omit<UseMutationOptions<Tag, APIError, string | number>, 'mutationFn'>
    | undefined
) {
  return useMutation({
    mutationFn: DeleteTag,
    ...options,
  });
}
