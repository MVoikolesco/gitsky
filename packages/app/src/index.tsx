import "@mantine/core/styles.css";
import "./styles/global.css";

import { MantineProvider } from "@mantine/core";
import { createRootRoute, createRoute, createRouter, RouterProvider } from "@tanstack/react-router";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { AppShell } from "./components/AppShell";
import { rootRouteOptions } from "./routes/__root";
import { indexRouteOptions } from "./routes/index";

const rootRoute = createRootRoute(rootRouteOptions);
const indexRoute = createRoute({
  ...indexRouteOptions,
  getParentRoute: () => rootRoute,
});

const routeTree = rootRoute.addChildren([indexRoute]);
const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

createRoot(document.getElementById("root") as HTMLElement).render(
  <StrictMode>
    <MantineProvider>
      <AppShell>
        <RouterProvider router={router} />
      </AppShell>
    </MantineProvider>
  </StrictMode>,
);
