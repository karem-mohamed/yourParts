import { z } from 'zod';

////////auth//////////////
export const registerSchema = z.object({
  username: z.string().min(3).nonempty(),
  email: z.string().email().nonempty(),
  password: z.string().min(8).nonempty(),
});

export const loginSchema = z.object({
  identifier: z.string().min(3).nonempty(),
  password: z.string().min(8).nonempty(),
});

export const forgetPasswordSchema = z.object({
  email: z.string().email().nonempty(),
});

/////////categories/////////

export const createCategorySchema = z.object({
  name: z.string().min(3).nonempty(),
  description: z.string().optional(),
});

export const updateCategorySchema = z.object({
  name: z.string().min(3).optional(),
  description: z.string().optional(),
});

/////////posts//////////////

export const createPostSchema = z.object({
  title: z.string().min(5).nonempty(),
  content: z.string().nonempty(),
  categoryId: z.number().min(1),
});

export const updatePostSchema = z.object({
  title: z.string().min(5).optional(),
  content: z.string().optional(),
});

/////////comments//////////////

export const createCommentSchema = z.object({
  content: z.string().nonempty(),
  postId: z.string().uuid().nonempty(),
});

export const updateCommentSchema = z.object({
  content: z.string().nonempty(),
});
