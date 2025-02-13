import { eq, and } from 'drizzle-orm';
import { db } from '../config/db';
import { categories } from '../models/schema';
export const createCategory = async (
  userId: string,
  payload: { name: string; description?: string }
) => {
  console.log(userId, 'wwwwww');
  const [newCategory] = await db
    .insert(categories)
    .values({
      ...payload,
      userId,
    })
    .returning();
  return newCategory;
};

export const getAllCategories = async () => {
  const allCategories = await db.select().from(categories);
  return allCategories;
};

export const getAllUserCategories = async (userId: string) => {
  const allCategories = await db
    .select()
    .from(categories)
    .where(eq(categories.userId, userId));
  return allCategories;
};

export const getDetails = async (id: number) => {
  const [category] = await db
    .select()
    .from(categories)
    .where(eq(categories.id, id))
    .limit(1);
  return category;
};

export const findCategoryByIdAndUserId = async (id: number, userId: string) => {
  const [category] = await db
    .select()
    .from(categories)
    .where(and(eq(categories.id, id), eq(categories.userId, userId)))
    .limit(1);
  return category;
};

export const updateCategory = async (
  userId: string,
  categoryId: number,
  payload: {
    name?: string;
    description?: string;
  }
) => {
  const updatedCategory = await db
    .update(categories)
    .set({ ...payload })
    .where(and(eq(categories.id, categoryId), eq(categories.userId, userId)))
    .returning();

  return updatedCategory;
};
export const deleteCategory = async (userId: string, categoryId: number) => {
  const deletedCategory = await db
    .delete(categories)
    .where(and(eq(categories.id, categoryId), eq(categories.userId, userId)))
    .returning();
  return deletedCategory;
};
