import { Hono } from "hono";
import * as tradeService from "./trade.service.js";
import * as chatService from "../chat/chat.service.js";
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

app.post("/", async (c) => {
  const user = c.get("user");
  const { receiverId, items } = await c.req.json();
  if (!receiverId || !items || !Array.isArray(items)) {
    return c.json({ error: "Invalid payload" }, 400);
  }
  try {
    const trade = await tradeService.createTradeOffer(
      user.id,
      receiverId,
      items
    );
    return c.json(trade, 201);
  } catch (e: any) {
    return c.json({ error: e.message }, 400);
  }
});

app.get("/", async (c) => {
  const user = c.get("user");
  const type = c.req.query("type") as "sent" | "received" | undefined;
  const trades = await tradeService.getTradeOffers(user.id, type);
  return c.json(trades);
});

app.get("/:id", async (c) => {
  const id = c.req.param("id");
  const trade = await tradeService.getTradeOfferById(id);
  if (!trade) return c.json({ error: "Not found" }, 404);
  return c.json(trade);
});

app.patch("/:id/status", async (c) => {
  const user = c.get("user");
  const id = c.req.param("id");
  const { status } = await c.req.json();
  try {
    const updated = await tradeService.updateTradeStatus(id, user.id, status);
    return c.json(updated);
  } catch (e: any) {
    return c.json({ error: e.message }, 400);
  }
});

app.post("/:id/messages", async (c) => {
  const user = c.get("user");
  const id = c.req.param("id");
  const { content } = await c.req.json();
  if (!content) return c.json({ error: "Message content required" }, 400);
  try {
    const message = await chatService.sendMessage(id, user.id, content);
    return c.json(message, 201);
  } catch (e: any) {
    return c.json({ error: e.message }, 403);
  }
});

app.get("/:id/messages", async (c) => {
  const user = c.get("user");
  const id = c.req.param("id");
  try {
    const messages = await chatService.getMessages(id, user.id);
    return c.json(messages);
  } catch (e: any) {
    return c.json({ error: e.message }, 403);
  }
});

export default app;
