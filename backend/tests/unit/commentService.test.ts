import { test, expect, beforeEach } from 'bun:test';
import { db } from '../../src/config/db';
import {
  createComment,
  getAllPostComments,
  getDetails,
  updateComment,
  deleteComment,
} from '../../src/services/commentsService';
import { comments, users } from '../../src/models/schema';
import { registerUser } from '../../src/services/authService';
import { createPost } from '../../src/services/postsService';
import { createCategory } from '../../src/services/categoryService';

beforeEach(async () => {
  await db.delete(comments);
  await db.delete(users);
});

test('should create a new comment', async () => {
  const { newUser } = await registerUser(
    'testuser444',
    'test@e448xample.com',
    'password123'
  );
  const uuid1 = newUser.id;
  const category = await createCategory(uuid1, {
    name: 'Tech',
    description: 'Technology news',
  });
  const p1 = await createPost(uuid1, {
    title: 'Post 2',
    content: 'Content 2',
    categoryId: category.id,
  });

  const comment = await createComment(uuid1, {
    content: 'Nice post',
    postId: p1.id,
  });
  expect(comment).toHaveProperty('id');
  expect(comment.content).toBe('Nice post');
});

test('should fetch all comments for a specific post', async () => {
  const { newUser } = await registerUser(
    'testuser444',
    'test@e448xample.com',
    'password123'
  );
  const uuid1 = newUser.id;
  const category = await createCategory(uuid1, {
    name: 'Tech',
    description: 'Technology news',
  });
  const p1 = await createPost(uuid1, {
    title: 'Post 2',
    content: 'Content 2',
    categoryId: category.id,
  });
  await createComment(uuid1, {
    content: 'First comment',
    postId: p1.id,
  });
  await createComment(uuid1, {
    content: 'karem comment',
    postId: p1.id,
  });
  const allComments = await getAllPostComments(p1.id);

  expect(allComments.length).toBe(2);
});

test('should fetch comment details by ID', async () => {
  const { newUser } = await registerUser(
    'testuser444',
    'test@e448xample.com',
    'password123'
  );
  const uuid1 = newUser.id;
  const category = await createCategory(uuid1, {
    name: 'Tech',
    description: 'Technology news',
  });
  const p1 = await createPost(uuid1, {
    title: 'Post 2',
    content: 'Content 2',
    categoryId: category.id,
  });
  const comment = await createComment(uuid1, {
    content: 'Nice post',
    postId: p1.id,
  });
  const details = await getDetails(comment.id);
  expect(details).not.toBeNull();
  expect(details.content).toBe('Nice post');
});

test('should update a comment', async () => {
  const { newUser } = await registerUser(
    'testuser444',
    'test@e448xample.com',
    'password123'
  );
  const uuid1 = newUser.id;
  const category = await createCategory(uuid1, {
    name: 'Tech',
    description: 'Technology news',
  });
  const p1 = await createPost(uuid1, {
    title: 'Post 2',
    content: 'Content 2',
    categoryId: category.id,
  });
  const comment = await createComment(uuid1, {
    content: 'first comment',
    postId: p1.id,
  });
  const updated = await updateComment(uuid1, comment.id, {
    content: 'Updated comment',
  });
  expect(updated[0].content).toBe('Updated comment');
});

test('should delete a comment', async () => {
  const { newUser } = await registerUser(
    'testuser444',
    'test@e448xample.com',
    'password123'
  );
  const uuid1 = newUser.id;
  const category = await createCategory(uuid1, {
    name: 'Tech',
    description: 'Technology news',
  });
  const p1 = await createPost(uuid1, {
    title: 'Post 2',
    content: 'Content 2',
    categoryId: category.id,
  });
  const comment = await createComment(uuid1, {
    content: 'comment To be deleted',
    postId: p1.id,
  });
  const deleted = await deleteComment(uuid1, comment.id);
  expect(deleted.length).toBe(1);
});
