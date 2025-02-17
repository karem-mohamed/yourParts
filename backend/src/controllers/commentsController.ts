import { Context } from 'hono';
import { errorResponse } from '../utils/sendErrorResponse';
import getLocaleValue from '../utils/getLocaleValue';
import { createCommentSchema, updatePostSchema } from '../shemas';
import {
  createComment,
  deleteComment,
  getAllPostComments,
  getDetails,
  updateComment,
} from '../services/commentsService';

export const create = async (c: Context) => {
  const userId = c.get('userId');
  const { content, postId } = await c.req.json();

  const result = createCommentSchema.safeParse({ content, postId });
  if (!result.success) {
    return errorResponse(
      c,
      400,
      'Validation_Error',
      getLocaleValue(c, 'validation_error'),
      result.error.flatten().fieldErrors
    );
  }

  const newComment = await createComment(userId, {
    content,
    postId,
  });
  return c.json(newComment, 201);
};

export const update = async (c: Context) => {
  const userId = c.get('userId');
  const commentId = c.req.param('id');
  const { content } = await c.req.json();
  const result = updatePostSchema.safeParse({ content });
  if (!result.success) {
    return errorResponse(
      c,
      400,
      'Validation_Error',
      getLocaleValue(c, 'validation_error'),
      result.error.flatten().fieldErrors
    );
  }
  const updatedComment = await updateComment(userId, commentId, {
    content,
  });

  if (updatedComment.length === 0) {
    return errorResponse(
      c,
      400,
      'CannotUpdateComment',
      getLocaleValue(c, 'cannot-update-comment')
    );
  }

  return c.json(updatedComment[0]);
};

export const getPostComments = async (c: Context) => {
  const postId = c.req.param('postId');
  const allComments = await getAllPostComments(postId);
  return c.json(allComments);
};

export const getCommentDetails = async (c: Context) => {
  const commentId = c.req.param('id');
  const details = await getDetails(commentId);
  return c.json(details);
};

export const deleteUserComment = async (c: Context) => {
  const userId = c.get('userId');
  const commentId = c.req.param('id');
  const deletedComment = await deleteComment(userId, commentId);

  if (deletedComment.length === 0) {
    return errorResponse(
      c,
      400,
      'CannotDeleteComment',
      getLocaleValue(c, 'cannot-delete-comment')
    );
  }
  return c.json({
    message: getLocaleValue(c, 'comment-deleted-successfully'),
  });
};
