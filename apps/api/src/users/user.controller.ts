import { Hono, type Context } from "hono";
import {
  collectionUpdateSchema,
  quantityUpdateSchema,
} from "@pokepoke/shared";
import * as userService from "./user.service.js";
import * as cardService from "../cards/card.service.js";
import { authMiddleware } from "../middlewares/auth.js";
import * as tradeService from "../trades/trade.service.js";
import { parseJson, validationError } from "../utils/validation.js";

type Variables = {
  user: {
    id: string;
    role: string;
    isBlacklisted: boolean;
  };
};

const app = new Hono<{ Variables: Variables }>();

app.use("/me/*", authMiddleware);

app.get("/me/cards", async (c) => {
  const user = c.get("user");
  const items = await cardService.getCollection(user.id);
  return c.json(items);
});

const addCardToCollection = async (
  c: Context<{ Variables: Variables }>,
  cardType: "wanted" | "offered"
) => {
  const user = c.get("user");
  const parsed = await parseJson(c, collectionUpdateSchema);
  if (!parsed.success) {
    return c.json({ error: validationError(parsed.error.flatten()) }, 400);
  }
  const { cardId, quantity } = parsed.data;

  try {
    const item = await cardService.updateCollection(
      user.id,
      cardId,
      quantity,
      cardType
    );
    return c.json(item, 201);
  } catch (e: any) {
    return c.json({ error: e.message }, 400);
  }
};

app.post("/me/cards/wanted", (c) => addCardToCollection(c, "wanted"));
app.post("/me/cards/offered", (c) => addCardToCollection(c, "offered"));

app.put("/me/cards/:id", async (c) => {
  const user = c.get("user");
  const id = c.req.param("id");
  const parsed = await parseJson(c, quantityUpdateSchema);
  if (!parsed.success) {
    return c.json({ error: validationError(parsed.error.flatten()) }, 400);
  }
  try {
    const item = await cardService.updateCollectionItemQuantity(
      user.id,
      id,
      parsed.data.quantity
    );
    return c.json(item);
  } catch (e: any) {
    return c.json({ error: e.message }, 404);
  }
});

app.delete("/me/cards/:id", async (c) => {
  const user = c.get("user");
  const id = c.req.param("id");
  try {
    await cardService.removeFromCollection(user.id, id);
    return c.json({ success: true });
  } catch (e: any) {
    return c.json({ error: e.message }, 404);
  }
});

app.get("/:id/profile", async (c) => {
  try {
    const userId = c.req.param("id");
    const profile = await userService.getUserProfile(userId);
    return c.json(profile);
  } catch (e: any) {
    return c.json({ error: e.message }, 404);
  }
});

app.get("/:id/trade-offers", async (c) => {
  try {
    const userId = c.req.param("id");
    const trades = await tradeService.getTradeOffers(userId, "sent");
    return c.json(trades);
  } catch (e: any) {
    return c.json({ error: e.message }, 404);
  }
});

export default app;
