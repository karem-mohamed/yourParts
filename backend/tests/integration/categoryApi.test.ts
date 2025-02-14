import { test, expect, beforeEach } from 'bun:test';
import { Context, Hono, Next } from 'hono';
import {
  create,
  updateUserCategory,
  getAllPublicCategories,
  getAllOwnerCategories,
  getCategoryDetails,
  deleteUserCategory,
} from '../../src/controllers/categoryController';
import { db } from '../../src/config/db';
import { categories, users } from '../../src/models/schema';
import { resetDatabase } from './setup';
import errorHandler from '../../src/middlewares/errorHandler';
import langDetector from '../../src/middlewares/langDetector';
import { registerUser } from '../../src/services/authService';

let user: {
  id: string;
  username: string;
  email: string;
};

beforeEach(async () => {
  await resetDatabase();
  const { newUser } = await registerUser(
    'testuser',
    'test@example.com',
    'password123'
  );
  user = newUser;
});

const app = new Hono();
app.use(langDetector);
// Mock auth middleware
app.use('*', async (c: Context, next: Next) => {
  c.set('userId', user.id);
  await next();
});

app.post('/categories', create);
app.put('/categories/:id', updateUserCategory);
app.get('/categories', getAllPublicCategories);
app.get('/categories/user', getAllOwnerCategories);
app.get('/categories/:id', getCategoryDetails);
app.delete('/categories/:id', deleteUserCategory);

app.onError(errorHandler);

test('should create a new category', async () => {
  const response = await app.request('/categories', {
    method: 'POST',
    body: JSON.stringify({ name: 'Tech', description: 'Technology news' }),
    headers: { 'Content-Type': 'application/json' },
  });

  expect(response.status).toBe(201);
  const json = await response.json();
  expect(json).toHaveProperty('id');
  expect(json.name).toBe('Tech');
});

test('should fetch all public categories', async () => {
  await db
    .insert(categories)
    .values({ name: 'Tech', description: 'Tech news', userId: user.id });

  const response = await app.request('/categories', { method: 'GET' });
  expect(response.status).toBe(200);
  const json = await response.json();
  expect(json.length).toBeGreaterThan(0);
});

test('should fetch all user categories', async () => {
  await db
    .insert(categories)
    .values({ name: 'Tech', description: 'Tech news', userId: user.id });

  const response = await app.request('/categories/user', {
    method: 'GET',
    headers: { userId: user.id },
  });

  expect(response.status).toBe(200);
  const json = await response.json();
  expect(json.length).toBe(1);
});

test('should fetch category details by ID', async () => {
  const category = await db
    .insert(categories)
    .values({ name: 'Tech', description: 'Tech news', userId: user.id })
    .returning();

  const response = await app.request(`/categories/${category[0].id}`, {
    method: 'GET',
  });
  expect(response.status).toBe(200);
  const json = await response.json();
  expect(json.name).toBe('Tech');
});

test('should update a category', async () => {
  const category = await db
    .insert(categories)
    .values({ name: 'Tech', description: 'Tech news', userId: user.id })
    .returning();

  const response = await app.request(`/categories/${category[0].id}`, {
    method: 'PUT',
    body: JSON.stringify({ name: 'Updated Tech' }),
    headers: { 'Content-Type': 'application/json', userId: user.id },
  });

  expect(response.status).toBe(200);
  const json = await response.json();
  expect(json.name).toBe('Updated Tech');
});

test('should delete a category', async () => {
  const category = await db
    .insert(categories)
    .values({ name: 'Tech', description: 'Tech news', userId: user.id })
    .returning();

  const response = await app.request(`/categories/${category[0].id}`, {
    method: 'DELETE',
    headers: { userId: user.id },
  });

  expect(response.status).toBe(200);
  const json = await response.json();
  expect(json.message).toBe('Category Deleted Successfully');
});
