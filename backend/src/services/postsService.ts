import { eq, and, count } from 'drizzle-orm';
import { db } from '../config/db';
import { posts, postsToTags } from '../models/schema';
import { saveValueInRedis } from '../utils/redisFnc';
import { redis } from '../config/redis';
import { CustomError } from '../utils/customError';
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
  const [oldTag] = await db
    .select()
    .from(postsToTags)
    .where(and(eq(postsToTags.postId, postId), eq(postsToTags.tagId, tagId)))
    .limit(1);
  if (oldTag) {
    throw new CustomError('postHasTagBefore', 400);
  }
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
  const allPosts = await db.query.posts.findMany({
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
      tags: {
        with: {
          tag: {
            columns: {
              id: true,
              name: true,
            },
          },
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
      tags: {
        with: {
          tag: {
            columns: {
              id: true,
              name: true,
            },
          },
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

export const cachePosts = async (url: string, data: object) => {
  await saveValueInRedis(`posts:${url}`, JSON.stringify(data));
};

export const removeCachePosts = async () => {
  let cursor = 0;
  let done = false;

  while (!done) {
    const { cursor: newCursor, keys } = await redis.scan(cursor, {
      MATCH: 'posts*',
      COUNT: 100,
    });
    cursor = newCursor;

    if (keys.length > 0) {
      await redis.del(keys);
    }
    if (cursor === 0) {
      done = true;
    }
  }
};
