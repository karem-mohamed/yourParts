import {
  pgTable,
  varchar,
  timestamp,
  serial,
  integer,
  uuid,
} from 'drizzle-orm/pg-core';
import { posts, users } from './schema';
import { relations } from 'drizzle-orm';

export const tags = pgTable('tags', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 50 }).unique().notNull(),
  userId: uuid('user_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const postsToTags = pgTable('posts_to_tags', {
  postId: uuid('post_id')
    .references(() => posts.id, { onDelete: 'cascade' })
    .notNull(),
  tagId: integer('tag_id')
    .references(() => tags.id, { onDelete: 'cascade' })
    .notNull(),
});

export const tagsRelations = relations(tags, ({ one, many }) => ({
  user: one(users, {
    fields: [tags.userId],
    references: [users.id],
  }),
  posts: many(postsToTags),
}));

export const postsToTagsRelations = relations(postsToTags, ({ one }) => ({
  post: one(posts, {
    fields: [postsToTags.postId],
    references: [posts.id],
  }),
  tag: one(tags, {
    fields: [postsToTags.tagId],
    references: [tags.id],
  }),
}));
