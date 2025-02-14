import { db } from '../../src/config/db';
import {
  users,
  posts,
  categories,
  comments,
  tags,
} from '../../src/models/schema';

export async function resetDatabase() {
  await db.delete(comments);
  await db.delete(posts);
  await db.delete(categories);
  await db.delete(tags);
  await db.delete(users);
}
