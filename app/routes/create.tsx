import { Form, useNavigation } from "react-router";
import type { Route } from "./+types/create";
import { requireUser } from "~/session/guards.server";
import { createPost } from "~/controllers/post.server";

export async function loader({ request }: Route.LoaderArgs) {
  await requireUser(request);
}

export async function action({ request }: Route.ActionArgs) {
  const user = await requireUser(request);
  const form = await request.formData();
  const content = form.get("content");
  const timestamp = form.get("timestamp");

  if (
    typeof content !== "string" ||
    !content ||
    typeof timestamp !== "string" ||
    !timestamp
  ) {
    // TODO surface this
    return { formError: "Content and timestamp are required" };
  }

  console.log(content, timestamp)
  const post = await createPost(user.id, content, new Date(timestamp));
  console.log(post)
  return null;
}

export default function Create({
  loaderData,
  actionData
}: Route.ComponentProps) {
  const navigation = useNavigation();
  
  return (
    <div className="flex flex-col">
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
          name="content"
          type="text"
          placeholder="Event details"
          required
        />
        <input
          name="timestamp"
          type="date"
          required
        />
        <button
          type="submit"
          disabled={navigation.state === "submitting"}
        >
          Create
        </button>
      </Form>
    </div>
  );
}
