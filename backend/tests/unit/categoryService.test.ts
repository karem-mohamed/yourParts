import { test, expect, beforeEach } from 'bun:test';
import { db } from '../../src/config/db';
import {
  createCategory,
  getAllCategories,
  getAllUserCategories,
  getDetails,
  findCategoryByIdAndUserId,
  updateCategory,
  deleteCategory,
} from '../../src/services/categoryService';
import { categories, users } from '../../src/models/schema';
import { registerUser } from '../../src/services/authService';

beforeEach(async () => {
  await db.delete(categories);
  await db.delete(users);
});

test('should create a new category', async () => {
  const { newUser } = await registerUser(
    'testuuser',
    'testu@example.com',
    'password123'
  );

  const uuid1 = newUser.id;
  const category = await createCategory(uuid1, {
    name: 'Tech',
    description: 'Technology news',
  });
  expect(category).toHaveProperty('id');
  expect(category.name).toBe('Tech');
});

test('should fetch all categories', async () => {
  const { newUser } = await registerUser(
    'testus75er',
    'test@examp59le.com',
    'password123'
  );
  const uuid1 = newUser.id;

  const { newUser: newUser2 } = await registerUser(
    'testu59ser2',
    'test2@examp48le.com',
    'password123'
  );
  const uuid2 = newUser2.id;

  await createCategory(uuid1, { name: 'Tech' });
  await createCategory(uuid2, { name: 'Health' });
  const allCategories = await getAllCategories();
  expect(allCategories.length).toBe(2);
});

test('should fetch categories for a specific user', async () => {
  const { newUser } = await registerUser(
    'testuser444',
    'test@e448xample.com',
    'password123'
  );
  const uuid1 = newUser.id;
  const { newUser: newUser2 } = await registerUser(
    'testus5952er2',
    'test2@exa852mple.com',
    'password123'
  );
  const uuid2 = newUser2.id;
  await createCategory(uuid1, { name: 'Tech' });
  await createCategory(uuid2, { name: 'Health' });
  const userCategories = await getAllUserCategories(uuid1);
  expect(userCategories.length).toBe(1);
  expect(userCategories[0].name).toBe('Tech');
});

test('should fetch category details by ID', async () => {
  const { newUser } = await registerUser(
    'testuser444',
    'test@e448xample.com',
    'password123'
  );
  const uuid1 = newUser.id;
  const category = await createCategory(uuid1, { name: 'Tech' });
  const details = await getDetails(category.id);
  expect(details).not.toBeNull();
  expect(details.name).toBe('Tech');
});

test('should find a category by ID and user ID', async () => {
  const { newUser } = await registerUser(
    'testuser444',
    'test@e448xample.com',
    'password123'
  );
  const uuid1 = newUser.id;
  const category = await createCategory(uuid1, { name: 'Tech' });
  const found = await findCategoryByIdAndUserId(category.id, uuid1);
  expect(found).not.toBeNull();
  expect(found?.name).toBe('Tech');
});

test('should update a category', async () => {
  const { newUser } = await registerUser(
    'testuser444',
    'test@e448xample.com',
    'password123'
  );
  const uuid1 = newUser.id;
  const category = await createCategory(uuid1, { name: 'Tech' });
  const updated = await updateCategory(uuid1, category.id, {
    name: 'Science',
  });
  expect(updated[0].name).toBe('Science');
});

test('should delete a category', async () => {
  const { newUser } = await registerUser(
    'testuser444',
    'test@e448xample.com',
    'password123'
  );
  const uuid1 = newUser.id;
  const category = await createCategory(uuid1, { name: 'Tech' });
  const deleted = await deleteCategory(uuid1, category.id);
  expect(deleted.length).toBe(1);
});
