import { UseMutationOptions, useMutation } from '@tanstack/react-query';
import axios from '@/axiosInstance';
import { APIError, APIResponse } from '@/types/axios';
import { CreateCategoryData, Category } from './types';

export async function CreateCategory({
  name,
  description,
}: CreateCategoryData) {
  try {
    const response: APIResponse<Category> = await axios.post(
      `categories/create`,
      {
        name,
        description,
      }
    );
    return response.data;
  } catch (err) {
    throw err as APIError;
  }
}

export function useCreateCategory(
  options?:
    | Omit<
        UseMutationOptions<Category, APIError, CreateCategoryData>,
        'mutationFn'
      >
    | undefined
) {
  return useMutation({
    mutationFn: CreateCategory,
    ...options,
  });
}
