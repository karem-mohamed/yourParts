import { Context } from 'hono';
import {
  createCategory,
  deleteCategory,
  getAllCategories,
  getAllUserCategories,
  getDetails,
  updateCategory,
} from '../services/categoryService';
import { errorResponse } from '../utils/sendErrorResponse';
import getLocaleValue from '../utils/getLocaleValue';
import { createCategorySchema, updateCategorySchema } from '../shemas';

export const create = async (c: Context) => {
  const userId = c.get('userId');
  const { name, description } = await c.req.json();

  const result = createCategorySchema.safeParse({ name, description });
  if (!result.success) {
    return errorResponse(
      c,
      400,
      'Validation_Error',
      getLocaleValue(c, 'validation_error'),
      result.error.flatten().fieldErrors
    );
  }
  const newCategory = await createCategory(userId, { name, description });
  return c.json(newCategory, 201);
};

export const updateUserCategory = async (c: Context) => {
  const userId = c.get('userId');
  const categoryId = parseInt(c.req.param('id'));
  const { name, description } = await c.req.json();
  if (!name && !description) {
    return errorResponse(
      c,
      400,
      'WrongPayload',
      getLocaleValue(c, 'wrong_payload')
    );
  }
  const result = updateCategorySchema.safeParse({ name, description });
  if (!result.success) {
    return errorResponse(
      c,
      400,
      'Validation_Error',
      getLocaleValue(c, 'validation_error'),
      result.error.flatten().fieldErrors
    );
  }
  const updatedCategory = await updateCategory(userId, categoryId, {
    name,
    description,
  });

  if (updatedCategory.length === 0) {
    return errorResponse(
      c,
      400,
      'CannotUpdateCategory',
      getLocaleValue(c, 'cannot-update-category')
    );
  }

  return c.json(updatedCategory[0]);
};

export const getAllPublicCategories = async (c: Context) => {
  const { search, limit } = await c.req.query();
  const allCategories = await getAllCategories(search, parseInt(limit));
  return c.json(allCategories);
};

export const getAllOwnerCategories = async (c: Context) => {
  const userId = c.get('userId');
  const allCategories = await getAllUserCategories(userId);
  return c.json(allCategories);
};

export const getCategoryDetails = async (c: Context) => {
  const categoryId = parseInt(c.req.param('id'));
  const details = await getDetails(categoryId);
  return c.json(details);
};

export const deleteUserCategory = async (c: Context) => {
  const userId = c.get('userId');
  const categoryId = parseInt(c.req.param('id'));

  const deletedCategory = await deleteCategory(userId, categoryId);

  if (deletedCategory.length === 0) {
    return errorResponse(
      c,
      400,
      'CannotDeleteCategory',
      getLocaleValue(c, 'cannot-delete-category')
    );
  }
  return c.json({
    message: getLocaleValue(c, 'category-deleted-successfully'),
  });
};
