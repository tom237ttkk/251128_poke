import prisma from "../prisma.js";

export const getUserProfile = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      cardCollection: {
        include: {
          items: true,
        },
      },
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  return {
    id: user.id,
    pokePokeId: user.pokePokeId,
    name: user.name,
    collection: user.cardCollection?.items || [],
  };
};
