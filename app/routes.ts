import { type RouteConfig, index, layout, route } from "@react-router/dev/routes";

export default [
  layout("routes/navbar.tsx", [
    index("routes/home.tsx"),
    route("login", "routes/login.tsx"),
    route("create", "routes/create.tsx")
  ])
] satisfies RouteConfig;
