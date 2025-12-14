import { Hono } from "hono";
import * as cardService from "./card.service.js";
import { authMiddleware } from "../middlewares/auth.js";

type Variables = {
  user: {
    id: string;
    role: string;
    isBlacklisted: boolean;
  };
};

const app = new Hono<{ Variables: Variables }>();

app.use("*", authMiddleware);

app.get("/", async (c) => {
  const user = c.get("user");
  const items = await cardService.getCollection(user.id);
  return c.json(items);
});

app.put("/", async (c) => {
  const user = c.get("user");
  const { cardId, quantity } = await c.req.json();
  if (!cardId || quantity === undefined) {
    return c.json({ error: "Missing cardId or quantity" }, 400);
  }
  const item = await cardService.updateCollection(
    user.id,
    cardId,
    Number(quantity)
  );
  return c.json(item);
});

app.delete("/:cardId", async (c) => {
  const user = c.get("user");
  const cardId = c.req.param("cardId");
  await cardService.removeFromCollection(user.id, cardId);
  return c.json({ success: true });
});

export default app;
