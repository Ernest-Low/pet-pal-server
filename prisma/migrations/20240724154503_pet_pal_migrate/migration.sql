-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('Male', 'Female');

-- CreateEnum
CREATE TYPE "Size" AS ENUM ('Small', 'Medium', 'Large');

-- CreateTable
CREATE TABLE "owner" (
    "ownerId" SERIAL NOT NULL,
    "areaLocation" VARCHAR(100) NOT NULL,
    "ownerName" VARCHAR(100) NOT NULL,
    "petPicture" TEXT NOT NULL,
    "petName" VARCHAR(100) NOT NULL,
    "petBreed" VARCHAR(100) NOT NULL,
    "petGender" "Gender" NOT NULL,
    "petAge" INTEGER NOT NULL,
    "petSize" "Size" NOT NULL,
    "petDescription" TEXT NOT NULL,
    "petIsNeutered" BOOLEAN NOT NULL,

    CONSTRAINT "owner_pkey" PRIMARY KEY ("ownerId")
);
