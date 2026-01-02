import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding cards...");

  // Get packs
  const scarletEx = await prisma.pack.findUnique({
    where: { name: "スカーレットex" },
  });
  const violetEx = await prisma.pack.findUnique({
    where: { name: "バイオレットex" },
  });
  const tripletBeat = await prisma.pack.findUnique({
    where: { name: "トリプレットビート" },
  });

  if (!scarletEx || !violetEx || !tripletBeat) {
    throw new Error("Packs not found. Please run pack seeds first.");
  }

  const cards = [
    // スカーレットex
    {
      packId: scarletEx.id,
      name: "ピカチュウex",
      rarity: "RR",
      description: "でんきタイプのポケモン",
    },
    {
      packId: scarletEx.id,
      name: "リザードンex",
      rarity: "RR",
      description: "ほのおタイプのポケモン",
    },
    {
      packId: scarletEx.id,
      name: "ミュウツーex",
      rarity: "RR",
      description: "エスパータイプのポケモン",
    },
    {
      packId: scarletEx.id,
      name: "コライドンex",
      rarity: "RR",
      description: "かくとうタイプのポケモン",
    },
    {
      packId: scarletEx.id,
      name: "ニャオハ",
      rarity: "C",
      description: "くさタイプのポケモン",
    },

    // バイオレットex
    {
      packId: violetEx.id,
      name: "ミライドンex",
      rarity: "RR",
      description: "でんきタイプのポケモン",
    },
    {
      packId: violetEx.id,
      name: "ゲンガーex",
      rarity: "RR",
      description: "ゴーストタイプのポケモン",
    },
    {
      packId: violetEx.id,
      name: "ルカリオex",
      rarity: "RR",
      description: "かくとうタイプのポケモン",
    },
    {
      packId: violetEx.id,
      name: "ホゲータ",
      rarity: "C",
      description: "ほのおタイプのポケモン",
    },
    {
      packId: violetEx.id,
      name: "クワッス",
      rarity: "C",
      description: "みずタイプのポケモン",
    },

    // トリプレットビート
    {
      packId: tripletBeat.id,
      name: "カイリューex",
      rarity: "RR",
      description: "ドラゴンタイプのポケモン",
    },
    {
      packId: tripletBeat.id,
      name: "ギャラドスex",
      rarity: "RR",
      description: "みずタイプのポケモン",
    },
    {
      packId: tripletBeat.id,
      name: "イーブイ",
      rarity: "C",
      description: "ノーマルタイプのポケモン",
    },
    {
      packId: tripletBeat.id,
      name: "ブースター",
      rarity: "U",
      description: "ほのおタイプのポケモン",
    },
    {
      packId: tripletBeat.id,
      name: "シャワーズ",
      rarity: "U",
      description: "みずタイプのポケモン",
    },
  ];

  for (const card of cards) {
    await prisma.card.upsert({
      where: { name: card.name },
      update: card,
      create: card,
    });
  }

  console.log(`${cards.length} cards seeded successfully!`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
