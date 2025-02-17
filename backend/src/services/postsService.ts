import { eq, and, count } from 'drizzle-orm';
import { db } from '../config/db';
import { posts, postsToTags } from '../models/schema';
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

export const addTagtoPost = async (postId: string, tagId: number) => {
  await db.insert(postsToTags).values({
    postId,
    tagId,
  });
};

export const deleteTagFromPost = async (postId: string, tagId: number) => {
  await db
    .delete(postsToTags)
    .where(and(eq(postsToTags.postId, postId), eq(postsToTags.tagId, tagId)));
};
export const getAllPosts = async (limit: number | undefined, page: number) => {
  let allPosts = await db.query.posts.findMany({
    with: {
      comments: {
        with: {
          user: {
            columns: {
              id: true,
              username: true,
            },
          },
        },
      },
      user: {
        columns: {
          id: true,
          username: true,
        },
      },
    },
    limit: limit,
    offset: (page - 1) * (limit ?? 1),
  });

  return allPosts;
};

export const getAllUserPosts = async (userId: string) => {
  const allPosts = await db.query.posts.findMany({
    where: eq(posts.userId, userId),
    with: {
      comments: {
        with: {
          user: {
            columns: {
              id: true,
              username: true,
            },
          },
        },
      },
      user: {
        columns: {
          id: true,
          username: true,
        },
      },
    },
  });

  return allPosts;
};

export const countAllPosts = async () => {
  const [allCount] = await db.select({ count: count() }).from(posts);
  return allCount.count;
};

export const getDetails = async (id: string) => {
  const Post = await db.query.posts.findFirst({
    where: eq(posts.id, id),
    with: {
      comments: true,
    },
  });
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
