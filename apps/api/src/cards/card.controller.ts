import { Hono } from "hono";
import { collectionUpdateSchema } from "@pokepoke/shared";
import * as cardService from "./card.service.js";
import * as cardMasterService from "./card-master.service.js";
import { authMiddleware } from "../middlewares/auth.js";
import { parseJson, validationError } from "../utils/validation.js";

type Variables = {
  user: {
    id: string;
    role: string;
    isBlacklisted: boolean;
  };
};

const app = new Hono<{ Variables: Variables }>();

// Public endpoint for card master
app.get("/master", async (c) => {
  const packId = c.req.query("packId");
  const cards = await cardMasterService.getCardMaster({ packId });
  return c.json(cards);
});

app.use("*", authMiddleware);

app.get("/", async (c) => {
  const user = c.get("user");
  const items = await cardService.getCollection(user.id);
  return c.json(items);
});

app.put("/", async (c) => {
  const user = c.get("user");
  const parsed = await parseJson(c, collectionUpdateSchema);
  if (!parsed.success) {
    return c.json({ error: validationError(parsed.error.flatten()) }, 400);
  }
  const { cardId, quantity, cardType } = parsed.data;
  try {
    const item = await cardService.updateCollection(
      user.id,
      cardId,
      quantity,
      cardType
    );
    return c.json(item);
  } catch (e: any) {
    return c.json({ error: e.message }, 400);
  }
});

app.delete("/:cardId", async (c) => {
  const user = c.get("user");
  const itemId = c.req.param("cardId");
  try {
    await cardService.removeFromCollection(user.id, itemId);
    return c.json({ success: true });
  } catch (e: any) {
    return c.json({ error: e.message }, 404);
  }
});

export default app;
