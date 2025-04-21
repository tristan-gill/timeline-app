import { defineConfig } from "drizzle-kit";

if (
  !process.env.DATABASE_HOST ||
  !process.env.DATABASE_PORT ||
  !process.env.DATABASE_USER ||
  !process.env.DATABASE_PASSWORD ||
  !process.env.DATABASE_DATABASE
) {
  throw new Error("Database env variables are required");
}

export default defineConfig({
  out: "./drizzle",
  schema: "./database/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    host: process.env.DATABASE_HOST,
    port: Number(process.env.DATABASE_PORT),
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_DATABASE,
    ssl: "require",
  },
});
