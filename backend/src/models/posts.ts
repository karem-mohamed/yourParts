import {
  pgTable,
  text,
  varchar,
  timestamp,
  integer,
  uuid,
} from 'drizzle-orm/pg-core';
import { users, categories, comments, postsToTags } from './schema';
import { relations, sql } from 'drizzle-orm';

export const posts = pgTable('posts', {
  id: uuid('id')
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  title: varchar('title', { length: 200 }).notNull(),
  content: text('content').notNull(),
  userId: uuid('user_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  categoryId: integer('category_id')
    .references(() => categories.id, { onDelete: 'cascade' })
    .notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const postsRelations = relations(posts, ({ one, many }) => ({
  user: one(users, {
    fields: [posts.userId],
    references: [users.id],
  }),
  category: one(categories, {
    fields: [posts.categoryId],
    references: [categories.id],
  }),
  comments: many(comments),
  tags: many(postsToTags),
}));
