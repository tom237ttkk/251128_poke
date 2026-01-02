import prisma from "../prisma.js";

export const getAllPacks = async () => {
  return await prisma.pack.findMany({
    orderBy: {
      releaseDate: "desc",
    },
  });
};

export const getPackById = async (id: string) => {
  return await prisma.pack.findUnique({
    where: { id },
    include: {
      cards: true,
    },
  });
};
