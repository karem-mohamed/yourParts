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
  console.log(userId, 'ppppppppppp');
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
      401,
      'CannotUpdateCategory',
      getLocaleValue(c, 'cannot-update-category')
    );
  }

  return c.json(updatedCategory[0]);
};

export const getAllPublicCategories = async (c: Context) => {
  const allCategories = await getAllCategories();
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
      401,
      'CannotDeleteCategory',
      getLocaleValue(c, 'cannot-delete-category')
    );
  }
  return c.json({
    message: getLocaleValue(c, 'category-deleted-successfully'),
  });
};

// app
//   .post('/posts', async (c) => {
//     const userId = c.get('userId');
//     const { title, content, categoryId } = await c.req.json();

//     const newPost = await db.insert(posts).values({
//       title,
//       content,
//       userId,
//       categoryId,
//     }).returning();

//     return c.json(newPost[0]);
//   })
//   .get('/posts', async (c) => {
//     const allPosts = await db.select().from(posts);
//     return c.json(allPosts);
//   })
//   .put('/posts/:id', async (c) => {
//     const userId = c.get('userId');
//     const postId = parseInt(c.req.param('id'));
//     const { title, content, categoryId } = await c.req.json();

//     const updatedPost = await db
//       .update(posts)
//       .set({ title, content, categoryId })
//       .where(and(eq(posts.id, postId), eq(posts.userId, userId)))
//       .returning();

//     if (updatedPost.length === 0) {
//       return c.json({ error: 'Post not found or unauthorized' }, 404);
//     }

//     return c.json(updatedPost[0]);
//   })
//   .delete('/posts/:id', async (c) => {
//     const userId = c.get('userId');
//     const postId = parseInt(c.req.param('id'));

//     const deletedPost = await db
//       .delete(posts)
//       .where(and(eq(posts.id, postId), eq(posts.userId, userId)))
//       .returning();

//     if (deletedPost.length === 0) {
//       return c.json({ error: 'Post not found or unauthorized' }, 404);
//     }

//     return c.json({ message: 'Post deleted successfully' });
//   });

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
