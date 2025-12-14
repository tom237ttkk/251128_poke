import { Hono } from "hono";
import * as userService from "./user.service.js";

const app = new Hono();

app.get("/:id/profile", async (c) => {
  try {
    const userId = c.req.param("id");
    const profile = await userService.getUserProfile(userId);
    return c.json(profile);
  } catch (e: any) {
    return c.json({ error: e.message }, 404);
  }
});

export default app;
