import prisma from "../prisma.js";

export const sendMessage = async (
  tradeId: string,
  senderId: string,
  content: string
) => {
  const trade = await prisma.tradeOffer.findUnique({ where: { id: tradeId } });
  if (!trade) throw new Error("Trade not found");

  const isOpenOffer = trade.senderId === trade.receiverId;
  if (!isOpenOffer && trade.senderId !== senderId && trade.receiverId !== senderId) {
    throw new Error("You are not a participant of this trade");
  }

  return prisma.message.create({
    data: {
      tradeOfferId: tradeId,
      senderId,
      content,
    },
  });
};

export const getMessages = async (tradeId: string, userId: string) => {
  const trade = await prisma.tradeOffer.findUnique({ where: { id: tradeId } });
  if (!trade) throw new Error("Trade not found");

  const isOpenOffer = trade.senderId === trade.receiverId;
  if (!isOpenOffer && trade.senderId !== userId && trade.receiverId !== userId) {
    throw new Error("You are not a participant of this trade");
  }

  return prisma.message.findMany({
    where: { tradeOfferId: tradeId },
    orderBy: { createdAt: "asc" },
    include: {
      sender: { select: { id: true, name: true, pokePokeId: true } },
    },
  });
};
