import { UseMutationOptions, useMutation } from '@tanstack/react-query';
import axios from '@/axiosInstance';
import { APIError, APIResponse } from '@/types/axios';
import { CreateTagData, Tag } from './types';

export async function CreateTag({ name }: CreateTagData) {
  try {
    const response: APIResponse<Tag> = await axios.post(`tags/create`, {
      name,
    });
    return response.data;
  } catch (err) {
    throw err as APIError;
  }
}

export function useCreateTag(
  options?:
    | Omit<UseMutationOptions<Tag, APIError, CreateTagData>, 'mutationFn'>
    | undefined
) {
  return useMutation({
    mutationFn: CreateTag,
    ...options,
  });
}
