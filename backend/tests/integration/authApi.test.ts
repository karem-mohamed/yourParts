import { test, expect, beforeEach } from 'bun:test';
import { Hono } from 'hono';
import {
  register,
  login,
  logout,
  forgetPassword,
  verifyOtpAndResetPass,
} from '../../src/controllers/authController';
import { db } from '../../src/config/db';
import { users } from '../../src/models/schema';
import { resetDatabase } from './setup';
import langDetector from '../../src/middlewares/langDetector';
import { registerUser } from '../../src/services/authService';
import errorHandler from '../../src/middlewares/errorHandler';

const app = new Hono();
app.use(langDetector);
app.post('/auth/register', register);
app.post('/auth/login', login);
app.post('/auth/logout', logout);
app.post('/auth/forget-password', forgetPassword);
app.post('/auth/verify-otp', verifyOtpAndResetPass);

app.onError(errorHandler);

beforeEach(async () => {
  await resetDatabase();
});

test('should register a new user', async () => {
  const response = await app.request('/auth/register', {
    method: 'POST',
    body: JSON.stringify({
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123',
    }),
    headers: { 'Content-Type': 'application/json' },
  });

  expect(response.status).toBe(200);
  const json = await response.json();
  expect(json).toHaveProperty('message');
  expect(json).toHaveProperty('token');
  expect(json).toHaveProperty('user');
});

test('should log in an existing user', async () => {
  await registerUser('testuser', 'test@example.com', 'password123');
  const response = await app.request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({
      identifier: 'test@example.com',
      password: 'password123',
    }),
    headers: { 'Content-Type': 'application/json' },
  });

  expect(response.status).toBe(200);
  const json = await response.json();
  expect(json).toHaveProperty('token');
  expect(json).toHaveProperty('user');
});

test('should reject login with wrong password', async () => {
  await registerUser('testuser', 'test@example.com', 'password123');

  const response = await app.request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({
      identifier: 'test@example.com',
      password: 'wrongpassword',
    }),
    headers: { 'Content-Type': 'application/json' },
  });

  expect(response.status).toBe(400);
});

test('should send OTP for password reset', async () => {
  await db.insert(users).values({
    username: 'testuser',
    email: 'test@example.com',
    password: 'password123',
  });

  const response = await app.request('/auth/forget-password', {
    method: 'POST',
    body: JSON.stringify({ email: 'test@example.com' }),
    headers: { 'Content-Type': 'application/json' },
  });

  expect(response.status).toBe(200);
  const json = await response.json();
  expect(json).toHaveProperty('message');
});

test('should verify OTP and reset password', async () => {
  const response = await app.request('/auth/verify-otp', {
    method: 'POST',
    body: JSON.stringify({
      otp: 1111,
      email: 'test@example.com',
      newPassword: 'newpassword123',
    }),
    headers: { 'Content-Type': 'application/json' },
  });

  expect(response.status).toBe(200);
  const json = await response.json();
  expect(json.message).toBe('Password Changed successfully');
});
