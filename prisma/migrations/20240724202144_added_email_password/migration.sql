/*
  Warnings:

  - Added the required column `email` to the `owner` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password` to the `owner` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "owner" ADD COLUMN     "email" VARCHAR(100) NOT NULL,
ADD COLUMN     "password" VARCHAR(100) NOT NULL;
