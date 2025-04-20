import { redirect } from "react-router";
import { getSession } from "./sessions.server";
import { getUserById } from "~/controllers/user.server";

export const requireUser = async (request: Request) => {
  const session = await getSession(request.headers.get("Cookie"));
  if (!session) {
    throw redirect("/login");
  }

  const userId = session.get("userId");
  if (!userId) {
    throw redirect("/login");
  }

  const user = await getUserById(userId);
  if (!user) {
    throw redirect("/login");
  }

  return user;
}