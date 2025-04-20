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

export const post = pgTable("posts", {
  id: uuid().primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => user.id),
  isPrivate: boolean("is_private").default(false),
  timestamp: timestamp().notNull(),
  content: text().notNull(),
  ...timestamps
});