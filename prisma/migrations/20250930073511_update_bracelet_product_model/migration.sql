-- AlterTable
ALTER TABLE "base_bracelets" ADD COLUMN     "description" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "featured" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "imageUrl2" TEXT,
ADD COLUMN     "imageUrl3" TEXT,
ADD COLUMN     "stock" INTEGER NOT NULL DEFAULT 0,
ALTER COLUMN "svgPath" DROP NOT NULL;
