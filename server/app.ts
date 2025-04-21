import { createRequestHandler } from "@react-router/express";
import { drizzle } from "drizzle-orm/postgres-js";
import express from "express";
import postgres from "postgres";
import "react-router";

import { DatabaseContext } from "~/database/context";
import * as schema from "~/database/schema";

declare module "react-router" {
  interface AppLoadContext {
    VALUE_FROM_EXPRESS: string;
  }
}

export const app = express();

if (
  !process.env.DATABASE_URL ||
  !process.env.DATABASE_HOST ||
  !process.env.DATABASE_PORT ||
  !process.env.DATABASE_USER ||
  !process.env.DATABASE_PASSWORD ||
  !process.env.DATABASE_DATABASE
) {
  throw new Error("Database env variables are required");
}

const client = process.env.NODE_ENV === "development" ?
  postgres(process.env.DATABASE_URL) :
  postgres({
    host: process.env.DATABASE_HOST,
    port: Number(process.env.DATABASE_PORT),
    database: process.env.DATABASE_DATABASE,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    ssl: "require"
  }
);
const db = drizzle(client, { schema, casing: "snake_case" });
app.use((_, __, next) => DatabaseContext.run(db, next));

app.use(
  createRequestHandler({
    // virtual module provided by React Router at build time
    build: () => import("virtual:react-router/server-build"),
    getLoadContext() {
      return {
        VALUE_FROM_EXPRESS: "Hello from Express",
      };
    },
  })
);
