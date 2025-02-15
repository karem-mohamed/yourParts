import { pgTable, text, varchar, timestamp, uuid } from 'drizzle-orm/pg-core';

import { relations, sql } from 'drizzle-orm';
import { categories, posts, comments, tags } from './schema';

export const users = pgTable('users', {
  id: uuid('id')
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  username: varchar('username', { length: 50 }).unique().notNull(),
  email: varchar('email', { length: 100 }).unique().notNull(),
  password: text('password').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const usersRelations = relations(users, ({ many }) => ({
  categories: many(categories),
  posts: many(posts),
  comments: many(comments),
  tags: many(tags),
}));
