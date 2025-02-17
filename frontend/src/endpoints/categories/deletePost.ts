import { UseMutationOptions, useMutation } from '@tanstack/react-query';
import axios from '@/axiosInstance';
import { APIError, APIResponse } from '@/types/axios';
import { Category } from './types';

export async function DeleteCategory(id: string | number) {
  try {
    const response: APIResponse<Category> = await axios.delete(
      `categories/delete/${id}`
    );
    return response.data;
  } catch (err) {
    throw err as APIError;
  }
}

export function useDeleteCategory(
  options?:
    | Omit<
        UseMutationOptions<Category, APIError, string | number>,
        'mutationFn'
      >
    | undefined
) {
  return useMutation({
    mutationFn: DeleteCategory,
    ...options,
  });
}
