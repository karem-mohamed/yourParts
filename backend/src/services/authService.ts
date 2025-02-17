import { db } from '../config/db';
import { users } from '../models/schema';
import bcrypt from 'bcrypt';
import { nanoid } from 'nanoid';
import { eq, or } from 'drizzle-orm';
import {
  getValueFromRedis,
  removeFromRedis,
  saveValueInRedis,
} from '../utils/redisFnc';
import { CustomError } from '../utils/customError';

export async function registerUser(
  username: string,
  email: string,
  password: string
) {
  const [user] = await db
    .select()
    .from(users)
    .where(or(eq(users.email, email), eq(users.username, username)))
    .limit(1);
  if (user) {
    throw new CustomError('email_or_username_is_used', 400);
  }
  const hashedPassword = await bcrypt.hash(password, 10);

  const [newUser] = await db
    .insert(users)
    .values({ username, email, password: hashedPassword })
    .returning();

  const token = nanoid();
  await saveValueInRedis(`auth:${token}`, newUser.id, 60 * 60 * 24);
  return { token, newUser };
}
export async function loginUser(identifier: string, password: string) {
  const [user] = await db
    .select()
    .from(users)
    .where(or(eq(users.email, identifier), eq(users.username, identifier)))
    .limit(1);
  if (!user) throw new CustomError('inv_username_email', 400);

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) throw new CustomError('inv_pass', 400);

  const token = nanoid();
  await saveValueInRedis(`auth:${token}`, user.id, 60 * 60 * 24);

  return { token, user };
}
export async function logOutUser(authHeader: string) {
  const token = authHeader.split(' ')[1];
  const exists = await getValueFromRedis(`auth:${token}`);
  if (exists) {
    await removeFromRedis(`auth:${token}`);
  }
}

export async function checkOtp(otp: string, email: string) {
  const savedOtp: string | null = await getValueFromRedis(`forget:${email}`);
  if (savedOtp) {
    return otp === savedOtp;
  } else {
    return false;
  }
}

export async function changePassword(email: string, newPassword: string) {
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  await db
    .update(users)
    .set({ password: hashedPassword })
    .where(eq(users.email, email));
}

export async function userIsExist(email: string) {
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);
  return user ? true : false;
}

export async function findUserById(id: string) {
  const [user] = await db
    .select({ id: users.id, username: users.username, email: users.email })
    .from(users)
    .where(eq(users.id, id))
    .limit(1);
  return user;
}

export async function generateNewToken(userId: string) {
  const token = nanoid();
  await saveValueInRedis(`auth:${token}`, userId, 60 * 60 * 24);
  return token;
}
