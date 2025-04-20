import { database } from "~/database/context";
import * as schema from "~/database/schema";

export const createPost = async (userId: string, content: string, timestamp: Date) => {
    const db = database();
    const post = await db.insert(schema.post).values({ userId, content, timestamp }).returning();
    return post;
};