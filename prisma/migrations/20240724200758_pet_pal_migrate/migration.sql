/*
  Warnings:

  - The `petPicture` column on the `owner` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "owner" DROP COLUMN "petPicture",
ADD COLUMN     "petPicture" TEXT[];
