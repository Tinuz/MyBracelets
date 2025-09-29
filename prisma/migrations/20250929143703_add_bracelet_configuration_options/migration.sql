-- CreateEnum
CREATE TYPE "MetalType" AS ENUM ('GOLD', 'SILVER', 'ROSE_GOLD', 'WHITE_GOLD', 'PLATINUM', 'STAINLESS_STEEL');

-- CreateEnum
CREATE TYPE "ChainType" AS ENUM ('CABLE', 'CURB', 'FIGARO', 'ROPE', 'BOX', 'SNAKE', 'HERRINGBONE', 'BYZANTINE');

-- AlterTable
ALTER TABLE "base_bracelets" ADD COLUMN     "chainType" "ChainType",
ADD COLUMN     "color" TEXT,
ADD COLUMN     "imageUrl" TEXT,
ADD COLUMN     "metalType" "MetalType",
ADD COLUMN     "thickness" DOUBLE PRECISION;
