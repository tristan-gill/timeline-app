import { Link, Outlet } from "react-router";
import type { Route } from "./+types/navbar";
import { getSession } from "../session/sessions.server";
import { getUserById } from "../controllers/user.server";

// copied from https://flowbite.com/docs/components/navbar/

export async function loader({ request }: Route.LoaderArgs) {
  const session = await getSession(request.headers.get("Cookie"));

  if (!session) {
    return null;
  }

  const userId = session.get("userId");
  if (!userId) {
    return null;
  }

  const user = await getUserById(userId);
  if (!user) {
    return null;
  }

  return { user };
}

export default function Navbar({
  loaderData
}: Route.ComponentProps) {
  const user = loaderData?.user;

  return (
    <>
      <nav className="bg-white border-gray-200 dark:bg-gray-900">
        <div className="flex flex-wrap items-center justify-between mx-auto p-4">
    
          <Link to="/" className="flex items-center space-x-3 rtl:space-x-reverse">
            <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">Chronicle</span>
          </Link>
  
          <div className="flex items-center md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
            {!user && (
              <Link to="/login" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 cursor-pointer">
                Login
              </Link>
            )}
          </div>
        </div>
      </nav>

      <Outlet />
    </>
  );
};
