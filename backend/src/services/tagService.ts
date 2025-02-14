import { eq, and } from 'drizzle-orm';
import { db } from '../config/db';
import { tags } from '../models/schema';
export const createTag = async (userId: string, payload: { name: string }) => {
  const [newTag] = await db
    .insert(tags)
    .values({
      ...payload,
      userId,
    })
    .returning();
  return newTag;
};

export const getAllTags = async () => {
  const alltags = await db.select().from(tags);
  return alltags;
};

export const getAllUserTags = async (userId: string) => {
  const alltags = await db.select().from(tags).where(eq(tags.userId, userId));
  return alltags;
};

export const getDetails = async (id: number) => {
  const [Tag] = await db.select().from(tags).where(eq(tags.id, id)).limit(1);
  return Tag;
};

export const updateTag = async (
  userId: string,
  tagId: number,
  payload: {
    name: string;
  }
) => {
  const updatedTag = await db
    .update(tags)
    .set({ ...payload })
    .where(and(eq(tags.id, tagId), eq(tags.userId, userId)))
    .returning();

  return updatedTag;
};

export const deleteTag = async (userId: string, tagId: number) => {
  const deletedTag = await db
    .delete(tags)
    .where(and(eq(tags.id, tagId), eq(tags.userId, userId)))
    .returning();
  return deletedTag;
};
