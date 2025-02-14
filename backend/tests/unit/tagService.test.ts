import { test, expect, beforeEach } from 'bun:test';
import { db } from '../../src/config/db';
import {
  createTag,
  getAllTags,
  getAllUserTags,
  getDetails,
  updateTag,
  deleteTag,
} from '../../src/services/tagService';
import { tags, users } from '../../src/models/schema';
import { registerUser } from '../../src/services/authService';

beforeEach(async () => {
  await db.delete(tags);
  await db.delete(users);
});

test('should create a new tag', async () => {
  const { newUser } = await registerUser(
    'testuser444',
    'test@e448xample.com',
    'password123'
  );
  const uuid1 = newUser.id;
  const tag = await createTag(uuid1, { name: 'Tech' });
  expect(tag).toHaveProperty('id');
  expect(tag.name).toBe('Tech');
});

test('should fetch all tags', async () => {
  const { newUser } = await registerUser(
    'testuser444',
    'test@e448xample.com',
    'password123'
  );
  const uuid1 = newUser.id;
  await createTag(uuid1, { name: 'Tech' });
  await createTag(uuid1, { name: 'Health' });
  const allTags = await getAllTags();
  expect(allTags.length).toBe(2);
});

test('should fetch tags for a specific user', async () => {
  const { newUser } = await registerUser(
    'testuser444',
    'test@e448xample.com',
    'password123'
  );
  const uuid1 = newUser.id;

  const { newUser: newUser2 } = await registerUser(
    'testuser44',
    'test@e4xample.com',
    'password123'
  );

  await createTag(uuid1, { name: 'Tech' });
  await createTag(newUser2.id, { name: 'Health' });
  const userTags = await getAllUserTags(uuid1);
  expect(userTags.length).toBe(1);
  expect(userTags[0].name).toBe('Tech');
});

test('should fetch tag details by ID', async () => {
  const { newUser } = await registerUser(
    'testuser444',
    'test@e448xample.com',
    'password123'
  );
  const uuid1 = newUser.id;
  const tag = await createTag(uuid1, { name: 'Tech' });
  const details = await getDetails(tag.id);
  expect(details).not.toBeNull();
  expect(details.name).toBe('Tech');
});

test('should update a tag', async () => {
  const { newUser } = await registerUser(
    'testuser444',
    'test@e448xample.com',
    'password123'
  );
  const uuid1 = newUser.id;
  const tag = await createTag(uuid1, { name: 'Tech' });
  const updated = await updateTag(uuid1, tag.id, { name: 'Science' });
  expect(updated[0].name).toBe('Science');
});

test('should delete a tag', async () => {
  const { newUser } = await registerUser(
    'testuser444',
    'test@e448xample.com',
    'password123'
  );
  const uuid1 = newUser.id;
  const tag = await createTag(uuid1, { name: 'Tech' });
  const deleted = await deleteTag(uuid1, tag.id);
  expect(deleted.length).toBe(1);
});
