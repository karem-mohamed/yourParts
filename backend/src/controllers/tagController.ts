import { Context } from 'hono';
import {
  createTag,
  deleteTag,
  getAllTags,
  getAllUserTags,
  getDetails,
  updateTag,
} from '../services/tagService';
import { errorResponse } from '../utils/sendErrorResponse';
import getLocaleValue from '../utils/getLocaleValue';

export const create = async (c: Context) => {
  const userId = c.get('userId');
  const { name } = await c.req.json();
  if (!name) {
    return errorResponse(
      c,
      400,
      'WrongPayload',
      getLocaleValue(c, 'wrong_payload')
    );
  }
  const newtag = await createTag(userId, { name });
  return c.json(newtag, 201);
};

export const updateUserTag = async (c: Context) => {
  const userId = c.get('userId');
  const tagId = parseInt(c.req.param('id'));
  const { name } = await c.req.json();
  if (!name) {
    return errorResponse(
      c,
      400,
      'WrongPayload',
      getLocaleValue(c, 'wrong_payload')
    );
  }
  const updatedtag = await updateTag(userId, tagId, {
    name,
  });

  if (updatedtag.length === 0) {
    return errorResponse(
      c,
      401,
      'CannotUpdatetag',
      getLocaleValue(c, 'cannot-update-tag')
    );
  }

  return c.json(updatedtag[0]);
};

export const getAllPublicTags = async (c: Context) => {
  const allTags = await getAllTags();
  return c.json(allTags);
};

export const getAllOwnerTags = async (c: Context) => {
  const userId = c.get('userId');
  const allTags = await getAllUserTags(userId);
  return c.json(allTags);
};

export const getTagDetails = async (c: Context) => {
  const tagId = parseInt(c.req.param('id'));
  const details = await getDetails(tagId);
  return c.json(details);
};

export const deleteUserTag = async (c: Context) => {
  const userId = c.get('userId');
  const tagId = parseInt(c.req.param('id'));

  const deletedtag = await deleteTag(userId, tagId);

  if (deletedtag.length === 0) {
    return errorResponse(
      c,
      401,
      'CannotDeletetag',
      getLocaleValue(c, 'cannot-delete-tag')
    );
  }
  return c.json({
    message: getLocaleValue(c, 'tag-deleted-successfully'),
  });
};
