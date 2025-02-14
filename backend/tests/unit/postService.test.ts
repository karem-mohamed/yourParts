import { test, expect, beforeEach } from 'bun:test';
import { db } from '../../src/config/db';
import {
  createPost,
  addTagtoPost,
  deleteTagFromPost,
  getAllPosts,
  getAllUserPosts,
  getDetails,
  updatePost,
  deletePost,
} from '../../src/services/postsService';
import { posts, postsToTags, users } from '../../src/models/schema';
import { eq } from 'drizzle-orm';
import { registerUser } from '../../src/services/authService';
import { createCategory } from '../../src/services/categoryService';
import { createTag } from '../../src/services/tagService';
beforeEach(async () => {
  await db.delete(postsToTags);
  await db.delete(posts);
  await db.delete(users);
});

test('should create a new post', async () => {
  const { newUser } = await registerUser(
    'testuser444',
    'test@e448xample.com',
    'password123'
  );
  const uuid1 = newUser.id;
  const cat = await createCategory(uuid1, { name: 'test' });

  const post = await createPost(uuid1, {
    title: 'Test Post',
    content: 'This is a test',
    categoryId: cat.id,
  });
  expect(post).toHaveProperty('id');
  expect(post.title).toBe('Test Post');
});

test('should fetch all posts', async () => {
  const { newUser } = await registerUser(
    'testuser444',
    'test@e448xample.com',
    'password123'
  );
  const uuid1 = newUser.id;
  const cat = await createCategory(uuid1, { name: 'test' });

  await createPost(uuid1, {
    title: 'Post 1',
    content: 'Content 1',
    categoryId: cat.id,
  });
  await createPost(uuid1, {
    title: 'Post 2',
    content: 'Content 2',
    categoryId: cat.id,
  });
  const allPosts = await getAllPosts();
  expect(allPosts.length).toBe(2);
});

test('should fetch all posts for a specific user', async () => {
  const { newUser } = await registerUser(
    'testuser444',
    'test@e448xample.com',
    'password123'
  );
  const uuid1 = newUser.id;
  const cat = await createCategory(uuid1, { name: 'test' });

  await createPost(uuid1, {
    title: 'Post 1',
    content: 'Content 1',
    categoryId: cat.id,
  });
  await createPost(uuid1, {
    title: 'Post 2',
    content: 'Content 2',
    categoryId: cat.id,
  });
  const userPosts = await getAllUserPosts(uuid1);
  expect(userPosts.length).toBe(2);
  expect(userPosts[0].title).toBe('Post 1');
});

test('should fetch post details by ID', async () => {
  const { newUser } = await registerUser(
    'testuser444',
    'test@e448xample.com',
    'password123'
  );
  const uuid1 = newUser.id;
  const cat = await createCategory(uuid1, { name: 'test' });

  const post = await createPost(uuid1, {
    title: 'Test Post',
    content: 'This is a test',
    categoryId: cat.id,
  });
  const details = await getDetails(post.id);
  expect(details).not.toBeNull();
  expect(details?.title).toBe('Test Post');
});

test('should update a post', async () => {
  const { newUser } = await registerUser(
    'testuser444',
    'test@e448xample.com',
    'password123'
  );
  const uuid1 = newUser.id;
  const cat = await createCategory(uuid1, { name: 'test' });

  const post = await createPost(uuid1, {
    title: 'Test Post',
    content: 'This is a test',
    categoryId: cat.id,
  });
  const updated = await updatePost(uuid1, post.id, {
    title: 'Updated Title',
  });
  expect(updated[0].title).toBe('Updated Title');
});

test('should delete a post', async () => {
  const { newUser } = await registerUser(
    'testuser444',
    'test@e448xample.com',
    'password123'
  );
  const uuid1 = newUser.id;
  const cat = await createCategory(uuid1, { name: 'test' });

  const post = await createPost(uuid1, {
    title: 'Test Post',
    content: 'This is a test',
    categoryId: cat.id,
  });
  const deleted = await deletePost(uuid1, post.id);
  expect(deleted.length).toBe(1);
});

test('should add a tag to a post', async () => {
  const { newUser } = await registerUser(
    'testuser444',
    'test@e448xample.com',
    'password123'
  );
  const uuid1 = newUser.id;
  const cat = await createCategory(uuid1, { name: 'test' });

  const post = await createPost(uuid1, {
    title: 'Test Post',
    content: 'This is a test',
    categoryId: cat.id,
  });
  const tag = await createTag(uuid1, { name: 'Tech' });

  await addTagtoPost(post.id, tag.id);
  const tags = await db
    .select()
    .from(postsToTags)
    .where(eq(postsToTags.postId, post.id));
  expect(tags.length).toBe(1);
  expect(tags[0].tagId).toBe(tag.id);
});

test('should remove a tag from a post', async () => {
  const { newUser } = await registerUser(
    'testuser444',
    'test@e448xample.com',
    'password123'
  );
  const uuid1 = newUser.id;
  const cat = await createCategory(uuid1, { name: 'test' });
  const tag = await createTag(uuid1, { name: 'Tech' });
  const tag2 = await createTag(uuid1, { name: 'Tech2' });

  const post = await createPost(uuid1, {
    title: 'Test Post',
    content: 'This is a test',
    categoryId: cat.id,
  });
  await addTagtoPost(post.id, tag.id);
  await addTagtoPost(post.id, tag2.id);
  await deleteTagFromPost(post.id, tag.id);
  const tags = await db
    .select()
    .from(postsToTags)
    .where(eq(postsToTags.postId, post.id));
  expect(tags.length).toBe(1);
});
