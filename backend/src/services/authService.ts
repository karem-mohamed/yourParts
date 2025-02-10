import { db } from '../config/db';
import { users } from '../models/schema';
import bcrypt from 'bcrypt';
import { nanoid } from 'nanoid';
import { eq, or } from 'drizzle-orm';
import { removeFromRedis, saveTokenInRedis } from '../utils/redisFnc';

export async function registerUser(
  username: string,
  email: string,
  password: string
) {
  const hashedPassword = await bcrypt.hash(password, 10);
  const [newUser] = await db
    .insert(users)
    .values({ username, email, password: hashedPassword })
    .returning();

  const token = nanoid();
  await saveTokenInRedis(`auth:${token}`, newUser.id, 60 * 60 * 24);
  return newUser;
}
export async function loginUser(identifier: string, password: string) {
  const [user] = await db
    .select()
    .from(users)
    .where(or(eq(users.email, identifier), eq(users.username, identifier)))
    .limit(1);
  if (!user) throw new Error('Invalid username or password');

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) throw new Error('Invalid username or password');

  const token = nanoid();
  await saveTokenInRedis(`auth:${token}`, user.id, 60 * 60 * 24);

  return token;
}
export async function logOutUser(token: string) {
  await removeFromRedis(`auth:${token}`);
}
