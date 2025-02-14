import { eq, and } from 'drizzle-orm';
import { db } from '../config/db';
import { comments } from '../models/schema';
export const createComment = async (
  userId: string,
  payload: { content: string; postId: string }
) => {
  const [newComment] = await db
    .insert(comments)
    .values({
      ...payload,
      userId,
    })
    .returning();
  return newComment;
};

export const getAllPostComments = async (postId: string) => {
  const allPostComments = await db
    .select()
    .from(comments)
    .where(eq(comments.postId, postId));
  return allPostComments;
};

export const getDetails = async (id: string) => {
  const [comment] = await db
    .select()
    .from(comments)
    .where(eq(comments.id, id))
    .limit(1);
  return comment;
};

export const updateComment = async (
  userId: string,
  commentId: string,
  payload: {
    content: string;
  }
) => {
  const updatedComment = await db
    .update(comments)
    .set({ ...payload })
    .where(and(eq(comments.id, commentId), eq(comments.userId, userId)))
    .returning();

  return updatedComment;
};

export const deleteComment = async (userId: string, commentId: string) => {
  const deletedComment = await db
    .delete(comments)
    .where(and(eq(comments.id, commentId), eq(comments.userId, userId)))
    .returning();
  return deletedComment;
};
