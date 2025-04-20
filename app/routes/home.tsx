import { database } from "~/database/context";
import * as schema from "~/database/schema";
import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export async function loader({ request }: Route.LoaderArgs) {
  const db = database();
  const posts = await db.select().from(schema.post);
  return { posts };
}

export default function Home({ loaderData }: Route.ComponentProps) {
  const userLocale = Intl.DateTimeFormat().resolvedOptions().locale;
  const dateFormatter = new Intl.DateTimeFormat(userLocale, {
    year: "numeric",
    month: "short",
    day: "2-digit",
    timeZone: "UTC",
  });
  
  return (
    <div className="flex flex-col">
      {loaderData.posts.map((post) => (
        <div key={post.id} className="flex gap-4">
          <h2>{post.content}</h2>
          <p>{dateFormatter.format(post.timestamp)}</p>
        </div>
      ))}
    </div>
  );
}
