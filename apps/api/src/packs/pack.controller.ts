import { Hono } from "hono";
import * as packService from "./pack.service.js";

const app = new Hono();

app.get("/", async (c) => {
  const packs = await packService.getAllPacks();
  return c.json(packs);
});

app.get("/:id", async (c) => {
  const id = c.req.param("id");
  const pack = await packService.getPackById(id);

  if (!pack) {
    return c.json({ error: "Pack not found" }, 404);
  }

  return c.json(pack);
});

export default app;
