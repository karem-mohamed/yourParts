import { eq, and } from 'drizzle-orm';
import { db } from '../config/db';
import { posts } from '../models/schema';
export const createPost = async (
  userId: string,
  payload: { title: string; content: string; categoryId: number }
) => {
  const [newPost] = await db
    .insert(posts)
    .values({
      ...payload,
      userId,
    })
    .returning();
  return newPost;
};

export const getAllPosts = async () => {
  const allPosts = await db.select().from(posts);
  return allPosts;
};

export const getAllUserPosts = async (userId: string) => {
  const allPosts = await db
    .select()
    .from(posts)
    .where(eq(posts.userId, userId));
  return allPosts;
};

export const getDetails = async (id: string) => {
  const [Post] = await db.select().from(posts).where(eq(posts.id, id)).limit(1);
  return Post;
};

export const updatePost = async (
  userId: string,
  PostId: string,
  payload: {
    title?: string;
    content?: string;
  }
) => {
  const updatedPost = await db
    .update(posts)
    .set({ ...payload })
    .where(and(eq(posts.id, PostId), eq(posts.userId, userId)))
    .returning();

  return updatedPost;
};
export const deletePost = async (userId: string, PostId: string) => {
  const deletedPost = await db
    .delete(posts)
    .where(and(eq(posts.id, PostId), eq(posts.userId, userId)))
    .returning();
  return deletedPost;
};
