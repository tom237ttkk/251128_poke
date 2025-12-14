import { Hono } from "hono";
import * as searchService from "./search.service.js";
import { authMiddleware } from "../middlewares/auth.js";

const app = new Hono();

app.use("*", authMiddleware);

app.get("/", async (c) => {
  const cardId = c.req.query("cardId");
  if (!cardId) {
    return c.json({ error: "Missing cardId query parameter" }, 400);
  }
  const results = await searchService.searchUsersByCard(cardId);
  return c.json(results);
});

export default app;
