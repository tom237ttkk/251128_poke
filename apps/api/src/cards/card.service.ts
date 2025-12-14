import prisma from "../prisma.js";

export const getCollection = async (userId: string) => {
  const collection = await prisma.cardCollection.findUnique({
    where: { userId },
    include: { items: true },
  });
  return collection?.items || [];
};

export const updateCollection = async (
  userId: string,
  cardId: string,
  quantity: number
) => {
  // Ensure collection exists
  let collection = await prisma.cardCollection.findUnique({
    where: { userId },
  });
  if (!collection) {
    collection = await prisma.cardCollection.create({ data: { userId } });
  }

  // Upsert item
  // Note: key is compound unique [collectionId, cardId]
  const item = await prisma.collectionItem.upsert({
    where: {
      collectionId_cardId: {
        collectionId: collection.id,
        cardId,
      },
    },
    update: {
      quantity,
    },
    create: {
      collectionId: collection.id,
      cardId,
      quantity,
    },
  });

  return item;
};

export const removeFromCollection = async (userId: string, cardId: string) => {
  const collection = await prisma.cardCollection.findUnique({
    where: { userId },
  });
  if (!collection) {
    throw new Error("Collection not found");
  }

  await prisma.collectionItem.delete({
    where: {
      collectionId_cardId: {
        collectionId: collection.id,
        cardId: cardId,
      },
    },
  });
};
