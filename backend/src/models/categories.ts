import { pgTable, varchar, timestamp, serial, uuid } from 'drizzle-orm/pg-core';
import { users, posts } from './schema';
import { relations } from 'drizzle-orm';
export const categories = pgTable('categories', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }).unique().notNull(),
  description: varchar('description'),
  userId: uuid('user_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const categoriesRelations = relations(categories, ({ one, many }) => ({
  user: one(users, {
    fields: [categories.userId],
    references: [users.id],
  }),
  posts: many(posts),
}));
