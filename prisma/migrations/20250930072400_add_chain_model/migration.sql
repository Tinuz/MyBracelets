-- CreateTable
CREATE TABLE "chains" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "ChainType" NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "priceCents" INTEGER NOT NULL,
    "thickness" DOUBLE PRECISION NOT NULL,
    "metalType" "MetalType" NOT NULL,
    "imageUrl" TEXT,
    "svgPath" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "chains_pkey" PRIMARY KEY ("id")
);
