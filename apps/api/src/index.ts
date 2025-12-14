import { Hono } from "hono";
import authController from "./auth/auth.controller.js";

const app = new Hono();

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

app.route("/api/auth", authController);

export default app;
