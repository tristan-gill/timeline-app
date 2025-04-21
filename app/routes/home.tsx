import { desc } from 'drizzle-orm';
import { useState } from "react";
import { createPortal } from "react-dom";
import { Form, useNavigation } from "react-router";
import { createPost } from "~/controllers/post.server";
import { database } from "~/database/context";
import * as schema from "~/database/schema";
import { requireUser } from "~/session/guards.server";
import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export async function loader({ request }: Route.LoaderArgs) {
  const db = database();
  const posts = await db.select().from(schema.post).orderBy(schema.post.timestamp);
  return { posts };
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

export default function Home({ loaderData }: Route.ComponentProps) {
  const navigation = useNavigation();
  const { posts } = loaderData;
  // TODO try to use remix GET instead of useState
  const [isModalOpen, setIsModalOpen] = useState(false);

  const userLocale = Intl.DateTimeFormat().resolvedOptions().locale;
  const dateFormatter = new Intl.DateTimeFormat(userLocale, {
    year: "numeric",
    month: "short",
    day: "2-digit",
    timeZone: "UTC",
  });
  
  return (
    <>
      <div className="flex flex-col">
        {posts.map((post, i) => {
          const isTimestampHidden = i > 1 && posts[i-1].timestamp.getTime() === post.timestamp.getTime();
          console.log(isTimestampHidden, post.timestamp)
          return (
            <div key={post.id} className="flex p-4 gap-4">
              <div className="w-2/5 flex justify-end items-start pt-0.5">
                {!isTimestampHidden && (<p className="font-light text-sm">
                  {dateFormatter.format(post.timestamp)}
                </p>)}
              </div>
              <div className="flex items-start relative pt-1">
                <div className="w-4 h-4 rounded-full border-2 border-slate-500"></div>
                {/* <div className="w-[2px] bg-slate-500 absolute top-8 h-[calc(100%-(var(--spacing)*4))]"></div> */}
              </div>
              <div className="w-3/5 flex">
                <p className="w-4/5">
                  {post.content}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="fixed bottom-0 right-0 p-4">
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 cursor-pointer"
        >
          Create entry
        </button>
      </div>

      {isModalOpen && createPortal(
        <>
          <div className="absolute h-full w-full bg-gray-900 top-0 left-0 opacity-60"></div>
          <div className="absolute h-full w-full top-0 left-0 flex items-center justify-center">
            <div className="bg-gray-950 p-4 rounded-lg border-2 border-slate-500">
              <h2 className="text-xl font-bold">Create entry</h2>
              <Form
                method="post"
                className="flex flex-col mt-4"
                onSubmit={(event: any) => {
                  if (navigation.state === "submitting") {
                    event.preventDefault();
                  }
                  setIsModalOpen(false);
                }}
              >
                <label>
                  Content:<br/>
                  <textarea
                    name="content"
                    placeholder="Today I did..."
                    required
                    className="border-2 border-slate-500 p-2 rounded mb-2 min-h-32"
                  />
                </label>
                <label>
                  Date:<br/>
                  <input
                    name="timestamp"
                    type="date"
                    defaultValue={new Date().toISOString().split("T")[0]}
                    required
                    className="border-2 border-slate-500 p-2 rounded"
                  />
                </label>

                <div className="flex gap-4 mt-6">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="bg-transparent text-white px-4 py-2 rounded border-2 border-slate-500 hover:border-slate-400 cursor-pointer"
                  >
                    Close
                  </button>
                  <button
                    type="submit"
                    className="grow-1 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 cursor-pointer"
                  >
                    Create
                  </button>
                </div>
              </Form>
            </div>
          </div>
        </>,
        document.body
      )}
    </>
  );
}
