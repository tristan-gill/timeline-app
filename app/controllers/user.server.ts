import crypto from "crypto";
import { database } from "~/database/context";
import * as schema from "~/database/schema";

const hash = async (password: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const salt = crypto.randomBytes(16).toString("hex");
    crypto.scrypt(password, salt, 64, (err, derivedKey) => {
      if (err) {
        reject(err);
      } else {
        resolve(`${salt}:${derivedKey.toString("hex")}`);
      }
    })
  });
};

const verify = async (password: string, hashedPassword: string): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    const [salt, key] = hashedPassword.split(":", 2);
    crypto.scrypt(password, salt, 64, (err, derivedKey) => {
      if (err) {
        reject(err);
      } else {
        resolve(key === derivedKey.toString("hex"));
      }
    });
  });
};

export const createUser = async (email: string, password: string) => {
  const db = database();
  const hashedPassword = await hash(password);
  const user = await db.insert(schema.user).values({ email, password: hashedPassword }).returning();
  return user;
};

export const authenticateUser = async (email: string, password: string) => {
  const db = database();
  const user = await db.query.user.findFirst({
    where: (users, { eq }) => eq(users.email, email)
  });
  if (!user) {
    return;
  }

  const isValid = await verify(password, user.password);
  if (!isValid) {
    return;
  }

  return user;
};

export const getUserById = async (userId: string) => {
  const db = database();
  const user = await db.query.user.findFirst({
    where: (users, { eq }) => eq(users.id, userId)
  });
  return user;
};