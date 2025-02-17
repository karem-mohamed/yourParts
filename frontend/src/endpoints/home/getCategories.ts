import { UseMutationOptions, useMutation } from '@tanstack/react-query';
import axios from '@/axiosInstance';
import { APIError, APIResponse } from '@/types/axios';
import { Category, CategoryFetchData } from './types';

export async function fetchCategories({ search, limit }: CategoryFetchData) {
  try {
    const response: APIResponse<Category[]> = await axios.get(
      `categories?${search ? `search=${search}` : ''}${limit ? `&limit=${limit}` : ''}`
    );
    return response.data;
  } catch (err) {
    throw err as APIError;
  }
}

export function useFetchCategories(
  options?:
    | Omit<
        UseMutationOptions<Category[], APIError, CategoryFetchData>,
        'mutationFn'
      >
    | undefined
) {
  return useMutation({
    mutationFn: fetchCategories,
    ...options,
  });
}
