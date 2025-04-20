import { data, Form, redirect, useNavigation } from "react-router";
import type { Route } from "./+types/login";

import { getSession, commitSession } from "../session/sessions.server";
import { authenticateUser } from "../controllers/user.server";

export async function loader({ request }: Route.LoaderArgs) {
  const session = await getSession(request.headers.get("Cookie"));

  if (session.has("userId")) {
    return redirect("/");
  }

  return data(
    {
      error: session.get("error")
    },
    {
      headers: {
        "Set-Cookie": await commitSession(session)
      }
    }
  );
}

export async function action({ request }: Route.ActionArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  const form = await request.formData();
  const email = form.get("email");
  const password = form.get("password");

  if (
    typeof email !== "string" ||
    !email ||
    typeof password !== "string" ||
    !password
  ) {
    // TODO surface this
    return { formError: "Email and password are required" };
  }

  const user = await authenticateUser(
    email,
    password
  );
  
  if (!user) {
    session.flash("error", "Invalid username/password");

    // Redirect back to the login page with errors.
    return redirect("/login", {
      headers: { "Set-Cookie": await commitSession(session) }
    });
  }

  // TODO this could maybe live in session.server.ts
  session.set("userId", user.id);

  // Login succeeded, send them to the home page.
  return redirect("/", {
    headers: { "Set-Cookie": await commitSession(session) }
  });
}

export default function Login({
  loaderData,
}: Route.ComponentProps) {
  const { error } = loaderData;
  const navigation = useNavigation();

  return (
    <div>
      {error ? <div className="error">{error}</div> : null}
      <section className="rounded-3xl border border-gray-200 p-6 dark:border-gray-700 space-y-4">
        <Form
          method="post"
          className="space-y-4 w-full max-w-lg"
          onSubmit={(event: any) => {
            if (navigation.state === "submitting") {
              event.preventDefault();
            }
          }}
        >
          <input
            name="email"
            type="email"
            placeholder="your@email.com"
            required
            className="w-full dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700 dark:focus:ring-blue-500 h-10 px-3 rounded-lg border border-gray-200 focus:ring-1 focus:ring-blue-500"
          />
          <input
            name="password"
            type="password"
            required
            className="w-full dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700 dark:focus:ring-blue-500 h-10 px-3 rounded-lg border border-gray-200 focus:ring-1 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={navigation.state === "submitting"}
            className="w-full h-10 px-3 text-white bg-blue-500 rounded-lg hover:bg-blue-600"
          >
            Login
          </button>
        </Form>
      </section>
    </div>
  );
}