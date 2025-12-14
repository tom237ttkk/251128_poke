import prisma from "../prisma.js";

export const searchUsersByCard = async (cardId: string) => {
  // Find CollectionItems with this cardId
  // Join with CardCollection -> User
  // Filter where User.isBlacklisted is false
  const items = await prisma.collectionItem.findMany({
    where: {
      cardId: cardId,
      collection: {
        user: {
          isBlacklisted: false,
        },
      },
    },
    include: {
      collection: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              pokePokeId: true,
            },
          },
        },
      },
    },
  });

  // Normalize result
  return items.map((item) => ({
    user: item.collection.user,
    quantity: item.quantity,
  }));
};
