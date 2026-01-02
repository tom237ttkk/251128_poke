/*
  Warnings:

  - Added the required column `cardType` to the `CollectionItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `CollectionItem` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "Pack" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "code" TEXT,
    "releaseDate" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Card" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "packId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "rarity" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Card_packId_fkey" FOREIGN KEY ("packId") REFERENCES "Pack" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_CollectionItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "collectionId" TEXT NOT NULL,
    "cardId" TEXT NOT NULL,
    "cardType" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "CollectionItem_collectionId_fkey" FOREIGN KEY ("collectionId") REFERENCES "CardCollection" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "CollectionItem_cardId_fkey" FOREIGN KEY ("cardId") REFERENCES "Card" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_CollectionItem" ("cardId", "collectionId", "id", "quantity") SELECT "cardId", "collectionId", "id", "quantity" FROM "CollectionItem";
DROP TABLE "CollectionItem";
ALTER TABLE "new_CollectionItem" RENAME TO "CollectionItem";
CREATE INDEX "CollectionItem_cardId_idx" ON "CollectionItem"("cardId");
CREATE UNIQUE INDEX "CollectionItem_collectionId_cardId_cardType_key" ON "CollectionItem"("collectionId", "cardId", "cardType");
CREATE TABLE "new_TradeOfferCard" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tradeOfferId" TEXT NOT NULL,
    "cardId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "TradeOfferCard_tradeOfferId_fkey" FOREIGN KEY ("tradeOfferId") REFERENCES "TradeOffer" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "TradeOfferCard_cardId_fkey" FOREIGN KEY ("cardId") REFERENCES "Card" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_TradeOfferCard" ("cardId", "id", "quantity", "tradeOfferId", "type") SELECT "cardId", "id", "quantity", "tradeOfferId", "type" FROM "TradeOfferCard";
DROP TABLE "TradeOfferCard";
ALTER TABLE "new_TradeOfferCard" RENAME TO "TradeOfferCard";
CREATE INDEX "TradeOfferCard_tradeOfferId_idx" ON "TradeOfferCard"("tradeOfferId");
CREATE INDEX "TradeOfferCard_cardId_idx" ON "TradeOfferCard"("cardId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "Pack_name_key" ON "Pack"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Pack_code_key" ON "Pack"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Card_name_key" ON "Card"("name");

-- CreateIndex
CREATE INDEX "Card_packId_idx" ON "Card"("packId");
