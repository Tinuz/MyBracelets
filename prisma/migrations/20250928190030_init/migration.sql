-- CreateEnum
CREATE TYPE "DesignStatus" AS ENUM ('DRAFT', 'ORDERED');

-- CreateTable
CREATE TABLE "base_bracelets" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "svgPath" TEXT NOT NULL,
    "lengthMm" INTEGER NOT NULL,
    "basePriceCents" INTEGER NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "base_bracelets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "charms" (
    "id" TEXT NOT NULL,
    "sku" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "priceCents" INTEGER NOT NULL,
    "widthMm" DOUBLE PRECISION NOT NULL,
    "heightMm" DOUBLE PRECISION NOT NULL,
    "anchorPoint" TEXT NOT NULL DEFAULT 'center',
    "maxPerBracelet" INTEGER NOT NULL DEFAULT 10,
    "stock" INTEGER NOT NULL DEFAULT 0,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "svg" TEXT,
    "imageUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "charms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "designs" (
    "id" TEXT NOT NULL,
    "braceletId" TEXT NOT NULL,
    "subtotalCents" INTEGER NOT NULL,
    "discountCents" INTEGER NOT NULL DEFAULT 0,
    "totalCents" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'EUR',
    "status" "DesignStatus" NOT NULL DEFAULT 'DRAFT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "designs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "design_charms" (
    "id" TEXT NOT NULL,
    "designId" TEXT NOT NULL,
    "charmId" TEXT NOT NULL,
    "t" DOUBLE PRECISION NOT NULL,
    "offsetMm" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "rotationDeg" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "zIndex" INTEGER NOT NULL DEFAULT 0,
    "quantity" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "design_charms_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "base_bracelets_slug_key" ON "base_bracelets"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "charms_sku_key" ON "charms"("sku");

-- AddForeignKey
ALTER TABLE "designs" ADD CONSTRAINT "designs_braceletId_fkey" FOREIGN KEY ("braceletId") REFERENCES "base_bracelets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "design_charms" ADD CONSTRAINT "design_charms_designId_fkey" FOREIGN KEY ("designId") REFERENCES "designs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "design_charms" ADD CONSTRAINT "design_charms_charmId_fkey" FOREIGN KEY ("charmId") REFERENCES "charms"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
