import prisma from "../prisma.js";

interface GetCardMasterOptions {
  packId?: string;
}

export const getCardMaster = async (options: GetCardMasterOptions = {}) => {
  const { packId } = options;

  return await prisma.card.findMany({
    where: packId ? { packId } : undefined,
    include: {
      pack: true,
    },
    orderBy: [{ pack: { releaseDate: "desc" } }, { name: "asc" }],
  });
};

export const getCardById = async (id: string) => {
  return await prisma.card.findUnique({
    where: { id },
    include: {
      pack: true,
    },
  });
};
