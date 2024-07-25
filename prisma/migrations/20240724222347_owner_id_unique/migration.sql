/*
  Warnings:

  - A unique constraint covering the columns `[ownerId]` on the table `owner` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "owner_ownerId_key" ON "owner"("ownerId");
