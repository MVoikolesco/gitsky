import { Outlet } from "@tanstack/react-router";

export const rootRouteOptions = {
  component: RootRoute,
};

function RootRoute() {
  return <Outlet />;
}
