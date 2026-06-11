import { Hono } from "hono";

export const healthRoute = new Hono().get("/", (context) => {
  return context.json({ status: "ok" });
});
