import { Hono } from "hono";
import {
  messageSendSchema,
  tradeOfferCreateSchema,
  tradeOfferStatusUpdateSchema,
} from "@pokepoke/shared";
import * as tradeService from "./trade.service.js";
import * as chatService from "../chat/chat.service.js";
import { subscribeToTrade } from "../chat/chat.stream.js";
import { authMiddleware } from "../middlewares/auth.js";
import prisma from "../prisma.js";
import { parseJson, validationError } from "../utils/validation.js";

type Variables = {
  user: {
    id: string;
    role: string;
    isBlacklisted: boolean;
  };
};

const app = new Hono<{ Variables: Variables }>();

app.use("*", authMiddleware);

type NamedCardInput = {
  cardName: string;
  quantity: number;
};

type TradeItemInput = {
  cardId: string;
  type: "WANTED" | "GIVEN";
  quantity: number;
};

const buildItemsFromCardNames = async (
  wantedCards: NamedCardInput[],
  offeredCards: NamedCardInput[]
): Promise<TradeItemInput[]> => {
  const allNames = [...wantedCards, ...offeredCards].map((card) => card.cardName);
  const uniqueNames = Array.from(new Set(allNames));

  const cards = await prisma.card.findMany({
    where: { name: { in: uniqueNames } },
    select: { id: true, name: true },
  });
  const cardMap = new Map(cards.map((card) => [card.name, card.id]));

  const missing = uniqueNames.filter((name) => !cardMap.has(name));
  if (missing.length > 0) {
    throw new Error(`Card not found: ${missing.join(", ")}`);
  }

  const wantedItems = wantedCards.map((card) => ({
    cardId: cardMap.get(card.cardName) as string,
    type: "WANTED" as const,
    quantity: Number(card.quantity),
  }));

  const offeredItems = offeredCards.map((card) => ({
    cardId: cardMap.get(card.cardName) as string,
    type: "GIVEN" as const,
    quantity: Number(card.quantity),
  }));

  return [...wantedItems, ...offeredItems];
};

app.post("/", async (c) => {
  const user = c.get("user");
  let tradeItems: TradeItemInput[] | null = null;

  const parsed = await parseJson(c, tradeOfferCreateSchema);
  if (!parsed.success) {
    return c.json({ error: validationError(parsed.error.flatten()) }, 400);
  }

  const payload = parsed.data;
  if ("items" in payload) {
    tradeItems = payload.items;
  } else {
    try {
      tradeItems = await buildItemsFromCardNames(
        payload.wantedCards,
        payload.offeredCards
      );
    } catch (e: any) {
      return c.json({ error: e.message }, 400);
    }
  }

  if (!tradeItems || tradeItems.length === 0) {
    return c.json({ error: "Invalid payload" }, 400);
  }

  try {
    const trade = await tradeService.createTradeOffer(
      user.id,
      payload.receiverId,
      tradeItems
    );
    return c.json(trade, 201);
  } catch (e: any) {
    return c.json({ error: e.message }, 400);
  }
});

app.get("/", async (c) => {
  const type = c.req.query("type") as "sent" | "received" | undefined;
  const cardName = c.req.query("cardName");
  const pageParam = c.req.query("page");
  const page = pageParam ? Number(pageParam) : 1;

  if (type) {
    const user = c.get("user");
    const trades = await tradeService.getTradeOffers(user.id, type);
    return c.json(trades);
  }

  const result = await tradeService.searchTradeOffers({
    cardName: cardName ?? undefined,
    page,
  });
  return c.json(result);
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
  const parsed = await parseJson(c, tradeOfferStatusUpdateSchema);
  if (!parsed.success) {
    return c.json({ error: validationError(parsed.error.flatten()) }, 400);
  }
  const { status } = parsed.data;
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
  const parsed = await parseJson(c, messageSendSchema);
  if (!parsed.success) {
    return c.json({ error: validationError(parsed.error.flatten()) }, 400);
  }
  const { content } = parsed.data;
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

app.get("/:id/messages/stream", async (c) => {
  const user = c.get("user");
  const id = c.req.param("id");

  try {
    await chatService.canAccessChat(id, user.id);
  } catch (e: any) {
    return c.json({ error: e.message }, 403);
  }

  const encoder = new TextEncoder();
  let cleanup: (() => void) | null = null;

  const stream = new ReadableStream({
    start(controller) {
      const send = (payload: string) => {
        controller.enqueue(encoder.encode(payload));
      };

      cleanup = subscribeToTrade(id, {
        send,
        close: () => controller.close(),
      });

      send("retry: 3000\n");
      send(": connected\n\n");

      c.req.raw.signal.addEventListener("abort", () => {
        cleanup?.();
        controller.close();
      });
    },
    cancel() {
      cleanup?.();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
});

export default app;
