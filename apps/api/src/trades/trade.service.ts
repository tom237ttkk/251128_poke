import prisma from "../prisma.js";

interface TradeItem {
  cardId: string;
  type: "WANTED" | "GIVEN";
  quantity: number;
}

const normalizeStatus = (status: string) => {
  const lowered = status.toLowerCase();
  if (lowered === "active" || status === "PENDING") return "active";
  if (lowered === "closed") return "closed";
  return "closed";
};

const mapTradeOfferCard = (detail: {
  id: string;
  tradeOfferId: string;
  type: string;
  quantity: number;
  createdAt: Date;
  card: { name: string } | null;
}) => ({
  id: detail.id,
  tradeOfferId: detail.tradeOfferId,
  cardName: detail.card?.name ?? "",
  cardType: detail.type === "WANTED" ? "wanted" : "offered",
  quantity: detail.quantity,
  createdAt: detail.createdAt,
});

const mapTradeOffer = (trade: {
  id: string;
  senderId: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  sender?: {
    id: string;
    pokePokeId: string;
    name: string;
    role: string;
    isBlacklisted: boolean;
    createdAt: Date;
  } | null;
  details?: Array<{
    id: string;
    tradeOfferId: string;
    type: string;
    quantity: number;
    createdAt: Date;
    card: { name: string } | null;
  }>;
}) => ({
  id: trade.id,
  userId: trade.senderId,
  status: normalizeStatus(trade.status),
  createdAt: trade.createdAt,
  updatedAt: trade.updatedAt,
  cards: trade.details ? trade.details.map(mapTradeOfferCard) : [],
  user: trade.sender
    ? {
        id: trade.sender.id,
        pokePokeId: trade.sender.pokePokeId,
        name: trade.sender.name,
        role: trade.sender.role,
        isBlacklisted: trade.sender.isBlacklisted,
        createdAt: trade.sender.createdAt,
      }
    : undefined,
});

export const createTradeOffer = async (
  senderId: string,
  receiverId: string | undefined,
  items: TradeItem[]
) => {
  if (receiverId && senderId === receiverId) {
    throw new Error("Cannot trade with yourself");
  }

  const targetReceiverId = receiverId ?? senderId;

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
      receiverId: targetReceiverId,
      status: "PENDING",
      details: {
        create: items.map((i) => ({
          cardId: i.cardId,
          type: i.type,
          quantity: i.quantity,
        })),
      },
    },
    include: {
      sender: {
        select: {
          id: true,
          pokePokeId: true,
          name: true,
          role: true,
          isBlacklisted: true,
          createdAt: true,
        },
      },
      details: { include: { card: { select: { name: true } } } },
    },
  });

  return mapTradeOffer(trade);
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
      sender: {
        select: {
          id: true,
          pokePokeId: true,
          name: true,
          role: true,
          isBlacklisted: true,
          createdAt: true,
        },
      },
      receiver: { select: { id: true, name: true, pokePokeId: true } },
      details: { include: { card: { select: { name: true } } } },
    },
    orderBy: { createdAt: "desc" },
  }).then((trades) => trades.map(mapTradeOffer));
};

export const searchTradeOffers = async ({
  cardName,
  page = 1,
  pageSize = 20,
}: {
  cardName?: string;
  page?: number;
  pageSize?: number;
}) => {
  const normalizedPage = Number.isFinite(page) && page > 0 ? page : 1;
  const normalizedPageSize =
    Number.isFinite(pageSize) && pageSize > 0 ? pageSize : 20;

  const where: any = {
    status: "PENDING",
    sender: { isBlacklisted: false },
  };

  if (cardName && cardName.trim().length > 0) {
    where.details = {
      some: {
        type: "GIVEN",
        card: {
          name: {
            contains: cardName.trim(),
          },
        },
      },
    };
  }

  const total = await prisma.tradeOffer.count({ where });

  const trades = await prisma.tradeOffer.findMany({
    where,
    include: {
      sender: {
        select: {
          id: true,
          pokePokeId: true,
          name: true,
          role: true,
          isBlacklisted: true,
          createdAt: true,
        },
      },
      receiver: { select: { id: true, name: true, pokePokeId: true } },
      details: { include: { card: { select: { name: true } } } },
    },
    orderBy: { createdAt: "desc" },
    skip: (normalizedPage - 1) * normalizedPageSize,
    take: normalizedPageSize,
  });

  return {
    tradeOffers: trades.map(mapTradeOffer),
    total,
  };
};

export const getTradeOfferById = async (id: string) => {
  return prisma.tradeOffer
    .findUnique({
    where: { id },
    include: {
      sender: {
        select: {
          id: true,
          pokePokeId: true,
          name: true,
          role: true,
          isBlacklisted: true,
          createdAt: true,
        },
      },
      receiver: { select: { id: true, name: true, pokePokeId: true } },
      details: { include: { card: { select: { name: true } } } },
      messages: { orderBy: { createdAt: "asc" } },
    },
  })
    .then((trade) => (trade ? mapTradeOffer(trade) : null));
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

  const updated = await prisma.tradeOffer.update({
    where: { id: tradeId },
    data: { status },
    include: {
      sender: {
        select: {
          id: true,
          pokePokeId: true,
          name: true,
          role: true,
          isBlacklisted: true,
          createdAt: true,
        },
      },
      receiver: { select: { id: true, name: true, pokePokeId: true } },
      details: { include: { card: { select: { name: true } } } },
    },
  });

  return mapTradeOffer(updated);
};
