import prisma from "../prisma.js";
import { publishMessage } from "./chat.stream.js";

const ensureChatAccess = async (tradeId: string, userId: string) => {
  const trade = await prisma.tradeOffer.findUnique({
    where: { id: tradeId },
    select: { senderId: true, receiverId: true },
  });
  if (!trade) throw new Error("Trade not found");

  const isOpenOffer = trade.senderId === trade.receiverId;
  if (!isOpenOffer && trade.senderId !== userId && trade.receiverId !== userId) {
    throw new Error("You are not a participant of this trade");
  }

  return trade;
};

export const sendMessage = async (
  tradeId: string,
  senderId: string,
  content: string
) => {
  await ensureChatAccess(tradeId, senderId);

  const message = await prisma.message.create({
    data: {
      tradeOfferId: tradeId,
      senderId,
      content,
    },
    include: {
      sender: {
        select: {
          id: true,
          name: true,
          pokePokeId: true,
          role: true,
          isBlacklisted: true,
          createdAt: true,
          updatedAt: true,
        },
      },
    },
  });

  publishMessage(tradeId, message);

  return message;
};

export const getMessages = async (tradeId: string, userId: string) => {
  await ensureChatAccess(tradeId, userId);

  return prisma.message.findMany({
    where: { tradeOfferId: tradeId },
    orderBy: { createdAt: "asc" },
    include: {
      sender: {
        select: {
          id: true,
          name: true,
          pokePokeId: true,
          role: true,
          isBlacklisted: true,
          createdAt: true,
          updatedAt: true,
        },
      },
    },
  });
};

export const canAccessChat = async (tradeId: string, userId: string) => {
  await ensureChatAccess(tradeId, userId);
};
