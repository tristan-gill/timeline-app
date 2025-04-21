import { defineConfig } from "drizzle-kit";

if (!process.env.DATABASE) {
  throw new Error("DATABASE is required");
}

export default defineConfig({
  out: "./drizzle",
  schema: "./database/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE,
  },
});
