import { Context } from 'hono';
import { errorResponse } from '../utils/sendErrorResponse';
import getLocaleValue from '../utils/getLocaleValue';
import { createPostSchema, updatePostSchema } from '../shemas';
import {
  addTagtoPost,
  countAllPosts,
  createPost,
  deletePost,
  deleteTagFromPost,
  getAllPosts,
  getAllUserPosts,
  getDetails,
  updatePost,
} from '../services/postsService';
import { getDetails as getTagDetails } from '../services/tagService';
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
      400,
      'CannotUpdatePost',
      getLocaleValue(c, 'cannot-update-post')
    );
  }

  return c.json(updatedPost[0]);
};

export const getAllPublicPosts = async (c: Context) => {
  const { limit, page } = await c.req.query();
  const allPosts = await getAllPosts(parseInt(limit), parseInt(page));
  const count = await countAllPosts();
  return c.json({ posts: allPosts, count });
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
      400,
      'CannotDeletePost',
      getLocaleValue(c, 'cannot-delete-post')
    );
  }
  return c.json({
    message: getLocaleValue(c, 'post-deleted-successfully'),
  });
};

export const addTag = async (c: Context) => {
  const postId = c.req.param('postId');
  const tagId = parseInt(c.req.param('tagId'));

  const postDetails = await getDetails(postId);
  if (!postDetails) {
    return errorResponse(
      c,
      400,
      'PostNotFound',
      getLocaleValue(c, 'PostNotFound')
    );
  }
  const tagDetails = await getTagDetails(tagId);
  if (!tagDetails) {
    return errorResponse(
      c,
      400,
      'TagNotFound',
      getLocaleValue(c, 'TagNotFound')
    );
  }
  await addTagtoPost(postId, tagId);
  return c.json({ message: getLocaleValue(c, 'tag-added-to-post') });
};

export const removeTag = async (c: Context) => {
  const postId = c.req.param('postId');
  const tagId = parseInt(c.req.param('tagId'));

  const postDetails = await getDetails(postId);
  if (!postDetails) {
    return errorResponse(
      c,
      400,
      'PostNotFound',
      getLocaleValue(c, 'PostNotFound')
    );
  }
  const tagDetails = await getTagDetails(tagId);
  if (!tagDetails) {
    return errorResponse(
      c,
      400,
      'TagNotFound',
      getLocaleValue(c, 'TagNotFound')
    );
  }
  await deleteTagFromPost(postId, tagId);
  return c.json({ message: getLocaleValue(c, 'tag-removed-from-post') });
};
