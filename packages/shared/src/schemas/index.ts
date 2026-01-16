import { z } from "zod";

export const isoDateTimeSchema = z.string().datetime({ offset: true });

export const userSchema = z.object({
  id: z.string(),
  pokePokeId: z.string(),
  name: z.string(),
  role: z.string(),
  isBlacklisted: z.boolean(),
  createdAt: isoDateTimeSchema,
  updatedAt: isoDateTimeSchema.optional(),
});

export const packSchema = z.object({
  id: z.string(),
  name: z.string(),
  code: z.string().nullable().optional(),
  releaseDate: isoDateTimeSchema.nullable().optional(),
  createdAt: isoDateTimeSchema,
  updatedAt: isoDateTimeSchema,
});

export const cardSchema = z.object({
  id: z.string(),
  packId: z.string(),
  name: z.string(),
  description: z.string().nullable().optional(),
  rarity: z.string().nullable().optional(),
  createdAt: isoDateTimeSchema,
  updatedAt: isoDateTimeSchema,
  pack: packSchema.nullable().optional(),
});

export const cardCollectionSchema = z.object({
  id: z.string(),
  userId: z.string(),
  cardId: z.string(),
  cardName: z.string(),
  cardType: z.enum(["wanted", "offered"]),
  quantity: z.number(),
  createdAt: isoDateTimeSchema,
  updatedAt: isoDateTimeSchema,
  card: cardSchema.nullable().optional(),
});

export const tradeOfferCardSchema = z.object({
  id: z.string(),
  tradeOfferId: z.string(),
  cardId: z.string().optional(),
  cardName: z.string(),
  cardType: z.enum(["wanted", "offered"]),
  quantity: z.number(),
  createdAt: isoDateTimeSchema,
  card: cardSchema.nullable().optional(),
});

export const tradeOfferSchema = z.object({
  id: z.string(),
  userId: z.string(),
  status: z.enum(["active", "closed"]),
  createdAt: isoDateTimeSchema,
  updatedAt: isoDateTimeSchema,
  senderId: z.string().optional(),
  receiverId: z.string().optional(),
  cards: z.array(tradeOfferCardSchema).optional(),
  user: userSchema.optional(),
});

export const messageSchema = z.object({
  id: z.string(),
  tradeOfferId: z.string(),
  senderId: z.string(),
  content: z.string(),
  createdAt: isoDateTimeSchema,
  sender: userSchema.optional(),
});

export const apiErrorSchema = z.object({
  error: z.union([
    z.string(),
    z.object({
      code: z.string(),
      message: z.string(),
      details: z.unknown().optional(),
    }),
  ]),
});

export const registerRequestSchema = z.object({
  pokePokeId: z.string().regex(/^[A-Z0-9]{10}$/),
  name: z.string().min(1),
  password: z.string().min(1),
});

export const loginRequestSchema = z.object({
  pokePokeId: z.string().regex(/^[A-Z0-9]{10}$/),
  password: z.string().min(1),
});

export const tradeOfferStatusSchema = z.enum([
  "ACCEPTED",
  "REJECTED",
  "CANCELED",
]);

export const tradeOfferStatusUpdateSchema = z.object({
  status: tradeOfferStatusSchema,
});

const tradeOfferNamedCardSchema = z.object({
  cardName: z.string().min(1),
  quantity: z.coerce.number().int().positive(),
});

const tradeOfferItemSchema = z.object({
  cardId: z.string().min(1),
  type: z.enum(["WANTED", "GIVEN"]),
  quantity: z.coerce.number().int().positive(),
});

export const tradeOfferCreateSchema = z.union([
  z.object({
    receiverId: z.string().optional(),
    items: z.array(tradeOfferItemSchema).min(1),
  }),
  z
    .object({
      receiverId: z.string().optional(),
      wantedCards: z.array(tradeOfferNamedCardSchema),
      offeredCards: z.array(tradeOfferNamedCardSchema),
    })
    .refine(
      (data) => data.wantedCards.length > 0 || data.offeredCards.length > 0,
      {
        message: "At least one card is required",
        path: ["wantedCards"],
      }
    ),
]);

export const messageSendSchema = z.object({
  content: z.string().min(1),
});

export const collectionUpdateSchema = z.object({
  cardId: z.string().min(1),
  quantity: z.coerce.number().int().positive(),
  cardType: z.enum(["wanted", "offered"]).optional(),
});

export const quantityUpdateSchema = z.object({
  quantity: z.coerce.number().int().positive(),
});

export type User = z.infer<typeof userSchema>;
export type Pack = z.infer<typeof packSchema>;
export type Card = z.infer<typeof cardSchema>;
export type CardCollection = z.infer<typeof cardCollectionSchema>;
export type TradeOfferCard = z.infer<typeof tradeOfferCardSchema>;
export type TradeOffer = z.infer<typeof tradeOfferSchema>;
export type Message = z.infer<typeof messageSchema>;
export type ApiError = z.infer<typeof apiErrorSchema>;
export type RegisterRequest = z.infer<typeof registerRequestSchema>;
export type LoginRequest = z.infer<typeof loginRequestSchema>;
export type TradeOfferCreateRequest = z.infer<typeof tradeOfferCreateSchema>;
export type TradeOfferStatusUpdate = z.infer<
  typeof tradeOfferStatusUpdateSchema
>;
export type MessageSendRequest = z.infer<typeof messageSendSchema>;
export type CollectionUpdateRequest = z.infer<typeof collectionUpdateSchema>;
export type QuantityUpdateRequest = z.infer<typeof quantityUpdateSchema>;
