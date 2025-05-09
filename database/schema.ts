import type { InferSelectModel } from "drizzle-orm";
import { pgTable, varchar, uuid, timestamp, pgEnum, boolean, text } from "drizzle-orm/pg-core";

const timestamps = {
  updated_at: timestamp(),
  created_at: timestamp().defaultNow().notNull(),
  deleted_at: timestamp(),
}

export const user = pgTable("users", {
  id: uuid().primaryKey().defaultRandom(),
  // username: varchar({ length: 255 }).notNull().unique(),
  email: varchar({ length: 255 }).notNull().unique(),
  password: varchar({ length: 255 }).notNull(),
  ...timestamps
});
export type SelectUser = InferSelectModel<typeof user>;

export const post = pgTable("posts", {
  id: uuid().primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => user.id),
  isPrivate: boolean("is_private").default(false),
  // TODO parse with timezone
  timestamp: timestamp({ withTimezone: false }).notNull(),
  content: text().notNull(),
  ...timestamps
});
export type SelectPost = InferSelectModel<typeof post>;