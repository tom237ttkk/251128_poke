import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const packs = [
  {
    name: "スカーレットex",
    code: "SV1S",
    releaseDate: new Date("2023-01-20"),
  },
  {
    name: "バイオレットex",
    code: "SV1V",
    releaseDate: new Date("2023-01-20"),
  },
  {
    name: "トリプレットビート",
    code: "SV2a",
    releaseDate: new Date("2023-03-10"),
  },
  {
    name: "スノーハザード",
    code: "SV2P",
    releaseDate: new Date("2023-04-14"),
  },
  {
    name: "クレイバースト",
    code: "SV2D",
    releaseDate: new Date("2023-04-14"),
  },
];

async function main() {
  console.log("Seeding packs...");

  for (const pack of packs) {
    await prisma.pack.upsert({
      where: { name: pack.name },
      update: pack,
      create: pack,
    });
  }

  console.log("Packs seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
