import { expect, test, beforeEach } from 'bun:test';
import { registerUser, loginUser } from '../../src/services/authService';
import { db } from '../../src/config/db';
import { users } from '../../src/models/schema';

beforeEach(async () => {
  await db.delete(users);
});

test('user registered successfully', async () => {
  const { newUser: user } = await registerUser(
    'testuser',
    'test@example.com',
    'password123'
  );
  expect(user).toHaveProperty('id');
  expect(user?.username).toBe('testuser');
});

test('user login successfully', async () => {
  await registerUser('testuser', 'test@example.com', 'password123');
  const { token } = await loginUser('test@example.com', 'password123');
  expect(typeof token).toBe('string');
});

test('Login with wrong password should fail', async () => {
  await registerUser('testuser', 'test@example.com', 'password123');
  await expect(loginUser('test@example.com', 'wrongpassword')).rejects.toThrow(
    'inv_pass'
  );
});
