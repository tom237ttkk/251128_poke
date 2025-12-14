/*
  Warnings:

  - You are about to drop the column `cards` on the `CardCollection` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_CardCollection" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    CONSTRAINT "CardCollection_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_CardCollection" ("id", "userId") SELECT "id", "userId" FROM "CardCollection";
DROP TABLE "CardCollection";
ALTER TABLE "new_CardCollection" RENAME TO "CardCollection";
CREATE UNIQUE INDEX "CardCollection_userId_key" ON "CardCollection"("userId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
