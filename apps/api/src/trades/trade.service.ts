import prisma from "../prisma.js";

interface TradeItem {
  cardId: string;
  type: "WANTED" | "GIVEN";
  quantity: number;
}

export const createTradeOffer = async (
  senderId: string,
  receiverId: string,
  items: TradeItem[]
) => {
  if (senderId === receiverId) {
    throw new Error("Cannot trade with yourself");
  }

  // Validate sender owns GIVEN cards
  const givenItems = items.filter((i) => i.type === "GIVEN");
  if (givenItems.length > 0) {
    const senderCollection = await prisma.cardCollection.findUnique({
      where: { userId: senderId },
      include: { items: true },
    });

    if (!senderCollection) {
      throw new Error("Sender has no collection");
    }

    for (const item of givenItems) {
      const owned = senderCollection.items.find(
        (i) => i.cardId === item.cardId
      );
      if (!owned || owned.quantity < item.quantity) {
        throw new Error(
          `You do not have enough quantity of card ${item.cardId}`
        );
      }
    }
  }

  // Create Trade Offer
  const trade = await prisma.tradeOffer.create({
    data: {
      senderId,
      receiverId,
      status: "PENDING",
      details: {
        create: items.map((i) => ({
          cardId: i.cardId,
          type: i.type,
          quantity: i.quantity,
        })),
      },
    },
    include: { details: true },
  });

  return trade;
};

export const getTradeOffers = async (
  userId: string,
  type?: "sent" | "received"
) => {
  const where: any = {};
  if (type === "sent") where.senderId = userId;
  else if (type === "received") where.receiverId = userId;
  else where.OR = [{ senderId: userId }, { receiverId: userId }];

  return prisma.tradeOffer.findMany({
    where,
    include: {
      sender: { select: { id: true, name: true, pokePokeId: true } },
      receiver: { select: { id: true, name: true, pokePokeId: true } },
      details: true,
    },
    orderBy: { createdAt: "desc" },
  });
};

export const getTradeOfferById = async (id: string) => {
  return prisma.tradeOffer.findUnique({
    where: { id },
    include: {
      sender: { select: { id: true, name: true, pokePokeId: true } },
      receiver: { select: { id: true, name: true, pokePokeId: true } },
      details: true,
      messages: { orderBy: { createdAt: "asc" } },
    },
  });
};

export const updateTradeStatus = async (
  tradeId: string,
  userId: string,
  status: string
) => {
  const trade = await prisma.tradeOffer.findUnique({ where: { id: tradeId } });
  if (!trade) throw new Error("Trade offer not found");

  if (trade.status !== "PENDING") {
    throw new Error("Trade is already finalized");
  }

  // Permission Logic
  // ACCEPT/REJECT: Only Receiver
  // CANCEL: Sender or Receiver
  if (status === "ACCEPTED" || status === "REJECTED") {
    if (trade.receiverId !== userId) {
      throw new Error("Only receiver can accept or reject");
    }
  } else if (status === "CANCELED") {
    if (trade.senderId !== userId && trade.receiverId !== userId) {
      throw new Error("Not authorized to cancel this trade");
    }
  } else {
    throw new Error("Invalid status");
  }

  return prisma.tradeOffer.update({
    where: { id: tradeId },
    data: { status },
  });
};
