import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { users, posts } from './schema';
import { relations, sql } from 'drizzle-orm';

export const comments = pgTable('comments', {
  id: uuid('id')
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  content: text('content').notNull(),
  userId: uuid('user_id')
    .references(() => users.id)
    .notNull(),
  postId: uuid('post_id')
    .references(() => posts.id, { onDelete: 'cascade' })
    .notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const commentsRelations = relations(comments, ({ one }) => ({
  user: one(users, {
    fields: [comments.userId],
    references: [users.id],
  }),
  post: one(posts, {
    fields: [comments.postId],
    references: [posts.id],
  }),
}));
