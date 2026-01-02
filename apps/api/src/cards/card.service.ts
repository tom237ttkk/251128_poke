import prisma from "../prisma.js";

type CardType = "wanted" | "offered";

const normalizeCardType = (cardType: string): CardType => {
  const normalized = cardType.toLowerCase();
  if (normalized === "wanted" || normalized === "offered") {
    return normalized;
  }
  throw new Error("Invalid card type");
};

const mapCollectionItem = (item: {
  id: string;
  cardId: string;
  cardType: string;
  quantity: number;
  createdAt: Date;
  updatedAt: Date;
  card: { name: string } | null;
  collection: { userId: string };
}) => ({
  id: item.id,
  userId: item.collection.userId,
  cardId: item.cardId,
  cardName: item.card?.name ?? "",
  cardType: normalizeCardType(item.cardType),
  quantity: item.quantity,
  createdAt: item.createdAt,
  updatedAt: item.updatedAt,
});

const ensureCollection = async (userId: string) => {
  let collection = await prisma.cardCollection.findUnique({
    where: { userId },
  });
  if (!collection) {
    collection = await prisma.cardCollection.create({ data: { userId } });
  }
  return collection;
};

export const getCollection = async (userId: string) => {
  const items = await prisma.collectionItem.findMany({
    where: { collection: { userId } },
    include: {
      card: { select: { name: true } },
      collection: { select: { userId: true } },
    },
    orderBy: { createdAt: "desc" },
  });
  return items.map(mapCollectionItem);
};

export const updateCollection = async (
  userId: string,
  cardId: string,
  quantity: number,
  cardType: string = "wanted"
) => {
  const normalizedType = normalizeCardType(cardType);
  const collection = await ensureCollection(userId);

  const item = await prisma.collectionItem.upsert({
    where: {
      collectionId_cardId_cardType: {
        collectionId: collection.id,
        cardId,
        cardType: normalizedType,
      },
    },
    update: { quantity },
    create: {
      collectionId: collection.id,
      cardId,
      cardType: normalizedType,
      quantity,
    },
    include: {
      card: { select: { name: true } },
      collection: { select: { userId: true } },
    },
  });

  return mapCollectionItem(item);
};

export const updateCollectionItemQuantity = async (
  userId: string,
  itemId: string,
  quantity: number
) => {
  const item = await prisma.collectionItem.findUnique({
    where: { id: itemId },
    include: {
      card: { select: { name: true } },
      collection: { select: { userId: true } },
    },
  });

  if (!item || item.collection.userId !== userId) {
    throw new Error("Card not found");
  }

  const updated = await prisma.collectionItem.update({
    where: { id: itemId },
    data: { quantity },
    include: {
      card: { select: { name: true } },
      collection: { select: { userId: true } },
    },
  });

  return mapCollectionItem(updated);
};

export const removeFromCollection = async (userId: string, itemId: string) => {
  const item = await prisma.collectionItem.findUnique({
    where: { id: itemId },
    include: { collection: { select: { userId: true } } },
  });

  if (!item || item.collection.userId !== userId) {
    throw new Error("Card not found");
  }

  await prisma.collectionItem.delete({ where: { id: itemId } });
};
