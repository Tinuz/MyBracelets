-- CreateEnum
CREATE TYPE "BraceletType" AS ENUM ('CHAIN', 'BEADS');

-- CreateEnum
CREATE TYPE "BeadColor" AS ENUM ('RED', 'BLUE', 'YELLOW', 'GREEN', 'GOLD');

-- AlterTable
ALTER TABLE "base_bracelets" ADD COLUMN     "braceletType" "BraceletType" NOT NULL DEFAULT 'CHAIN';

-- CreateTable
CREATE TABLE "beads" (
    "id" TEXT NOT NULL,
    "color" "BeadColor" NOT NULL,
    "name" TEXT NOT NULL,
    "priceCents" INTEGER NOT NULL,
    "diameterMm" DOUBLE PRECISION NOT NULL,
    "imageUrl" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "beads_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "design_beads" (
    "id" TEXT NOT NULL,
    "designId" TEXT NOT NULL,
    "beadId" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "design_beads_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "design_beads" ADD CONSTRAINT "design_beads_beadId_fkey" FOREIGN KEY ("beadId") REFERENCES "beads"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "design_beads" ADD CONSTRAINT "design_beads_designId_fkey" FOREIGN KEY ("designId") REFERENCES "designs"("id") ON DELETE CASCADE ON UPDATE CASCADE;
