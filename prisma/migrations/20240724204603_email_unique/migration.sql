/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `owner` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "owner_email_key" ON "owner"("email");
