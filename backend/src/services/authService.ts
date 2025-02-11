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
    throw new Error('email_or_username_is_used');
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
  if (!user) throw new Error('inv_username_pass');

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) throw new Error('inv_username_pass');

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

export async function checkOtp(otp: number, email: string) {
  const savedOtp: string | number | null = await getValueFromRedis(
    `forget:${email}`
  );
  if (savedOtp) {
    return otp === Number(savedOtp);
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
