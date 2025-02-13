import { Context } from 'hono';
import { errorResponse } from '../utils/sendErrorResponse';
import getLocaleValue from '../utils/getLocaleValue';
import { createPostSchema, updatePostSchema } from '../shemas';
import {
  createPost,
  deletePost,
  getAllPosts,
  getAllUserPosts,
  getDetails,
  updatePost,
} from '../services/postsService';
// import { findCategoryByIdAndUserId } from '../services/categoryService';

export const create = async (c: Context) => {
  const userId = c.get('userId');
  const { title, content, categoryId } = await c.req.json();

  const result = createPostSchema.safeParse({ title, content, categoryId });
  if (!result.success) {
    return errorResponse(
      c,
      400,
      'Validation_Error',
      getLocaleValue(c, 'validation_error'),
      result.error.flatten().fieldErrors
    );
  }

  // this validation if we need user add his post only to his category
  // const catagory = await findCategoryByIdAndUserId(categoryId, userId);
  // if (!catagory) {
  //   return errorResponse(
  //     c,
  //     400,
  //     'Unauthorized',
  //     getLocaleValue(c, 'unauthorized')
  //   );
  // }

  const newPost = await createPost(userId, {
    title,
    content,
    categoryId,
  });
  return c.json(newPost, 201);
};

export const update = async (c: Context) => {
  const userId = c.get('userId');
  const postId = c.req.param('id');
  const { title, content } = await c.req.json();
  if (!title && !content) {
    return errorResponse(
      c,
      400,
      'WrongPayload',
      getLocaleValue(c, 'wrong_payload')
    );
  }
  const result = updatePostSchema.safeParse({ title, content });
  if (!result.success) {
    return errorResponse(
      c,
      400,
      'Validation_Error',
      getLocaleValue(c, 'validation_error'),
      result.error.flatten().fieldErrors
    );
  }
  const updatedPost = await updatePost(userId, postId, {
    title,
    content,
  });

  if (updatedPost.length === 0) {
    return errorResponse(
      c,
      401,
      'CannotUpdatePost',
      getLocaleValue(c, 'cannot-update-post')
    );
  }

  return c.json(updatedPost[0]);
};

export const getAllPublicPosts = async (c: Context) => {
  const allPosts = await getAllPosts();
  return c.json(allPosts);
};

export const getAllOwnerPosts = async (c: Context) => {
  const userId = c.get('userId');
  const allPosts = await getAllUserPosts(userId);
  return c.json(allPosts);
};

export const getPostDetails = async (c: Context) => {
  const postId = c.req.param('id');
  const details = await getDetails(postId);
  return c.json(details);
};

export const deleteUserPost = async (c: Context) => {
  const userId = c.get('userId');
  const postId = c.req.param('id');
  const deletedPost = await deletePost(userId, postId);

  if (deletedPost.length === 0) {
    return errorResponse(
      c,
      401,
      'CannotDeletePost',
      getLocaleValue(c, 'cannot-delete-post')
    );
  }
  return c.json({
    message: getLocaleValue(c, 'post-deleted-successfully'),
  });
};

// // 3. Endpoints للوسوم (Tags)
// app
//   .post('/tags', async (c) => {
//     const userId = c.get('userId');
//     const { name } = await c.req.json();

//     const newTag = await db.insert(tags).values({
//       name,
//       userId,
//     }).returning();

//     return c.json(newTag[0]);
//   })
//   .get('/tags', async (c) => {
//     const allTags = await db.select().from(tags);
//     return c.json(allTags);
//   })
//   .put('/tags/:id', async (c) => {
//     const userId = c.get('userId');
//     const tagId = parseInt(c.req.param('id'));
//     const { name } = await c.req.json();

//     const updatedTag = await db
//       .update(tags)
//       .set({ name })
//       .where(and(eq(tags.id, tagId), eq(tags.userId, userId)))
//       .returning();

//     if (updatedTag.length === 0) {
//       return c.json({ error: 'Tag not found or unauthorized' }, 404);
//     }

//     return c.json(updatedTag[0]);
//   })
//   .delete('/tags/:id', async (c) => {
//     const userId = c.get('userId');
//     const tagId = parseInt(c.req.param('id'));

//     const deletedTag = await db
//       .delete(tags)
//       .where(and(eq(tags.id, tagId), eq(tags.userId, userId)))
//       .returning();

//     if (deletedTag.length === 0) {
//       return c.json({ error: 'Tag not found or unauthorized' }, 404);
//     }

//     return c.json({ message: 'Tag deleted successfully' });
//   });

// // 4. Endpoints للتعليقات (Comments)
// app
//   .post('/comments', async (c) => {
//     const userId = c.get('userId');
//     const { content, postId } = await c.req.json();

//     const newComment = await db.insert(comments).values({
//       content,
//       userId,
//       postId,
//     }).returning();

//     return c.json(newComment[0]);
//   })
//   .get('/comments', async (c) => {
//     const allComments = await db.select().from(comments);
//     return c.json(allComments);
//   })
//   .put('/comments/:id', async (c) => {
//     const userId = c.get('userId');
//     const commentId = parseInt(c.req.param('id'));
//     const { content } = await c.req.json();

//     const updatedComment = await db
//       .update(comments)
//       .set({ content })
//       .where(and(eq(comments.id, commentId), eq(comments.userId, userId)))
//       .returning();

//     if (updatedComment.length === 0) {
//       return c.json({ error: 'Comment not found or unauthorized' }, 404);
//     }

//     return c.json(updatedComment[0]);
//   })
//   .delete('/comments/:id', async (c) => {
//     const userId = c.get('userId');
//     const commentId = parseInt(c.req.param('id'));

//     const deletedComment = await db
//       .delete(comments)
//       .where(and(eq(comments.id, commentId), eq(comments.userId, userId)))
//       .returning();

//     if (deletedComment.length === 0) {
//       return c.json({ error: 'Comment not found or unauthorized' }, 404);
//     }

//     return c.json({ message: 'Comment deleted successfully' });
//   });

// export default app;
