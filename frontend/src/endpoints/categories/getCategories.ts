import { UseMutationOptions, useMutation } from '@tanstack/react-query';
import axios from '@/axiosInstance';
import { APIError, APIResponse } from '@/types/axios';
import { Category } from './types';
export async function fetchCategories() {
  try {
    const response: APIResponse<Category[]> = await axios.get('categories');
    return response.data;
  } catch (err) {
    throw err as APIError;
  }
}

export function useFetchCategories(
  options?:
    | Omit<UseMutationOptions<Category[], APIError>, 'mutationFn'>
    | undefined
) {
  return useMutation({
    mutationFn: fetchCategories,
    ...options,
  });
}
