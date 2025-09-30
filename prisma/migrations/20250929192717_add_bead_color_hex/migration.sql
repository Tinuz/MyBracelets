/*
  Warnings:

  - Added the required column `colorHex` to the `beads` table without a default value. This is not possible if the table is not empty.

*/
-- First add the column with a default value
ALTER TABLE "beads" ADD COLUMN "colorHex" TEXT NOT NULL DEFAULT '#6B7280';

-- Update existing records with appropriate hex colors based on their color names
UPDATE "beads" SET "colorHex" = 
  CASE 
    WHEN "color" = 'RED' THEN '#EF4444'
    WHEN "color" = 'BLUE' THEN '#3B82F6'
    WHEN "color" = 'GREEN' THEN '#10B981'
    WHEN "color" = 'YELLOW' THEN '#F59E0B'
    WHEN "color" = 'PURPLE' THEN '#8B5CF6'
    WHEN "color" = 'ORANGE' THEN '#F97316'
    WHEN "color" = 'PINK' THEN '#EC4899'
    WHEN "color" = 'BLACK' THEN '#000000'
    WHEN "color" = 'WHITE' THEN '#FFFFFF'
    WHEN "color" = 'GOLD' THEN '#FBBF24'
    WHEN "color" = 'SILVER' THEN '#D1D5DB'
    WHEN "color" = 'BROWN' THEN '#92400E'
    WHEN "color" = 'TURQUOISE' THEN '#14B8A6'
    WHEN "color" = 'MAROON' THEN '#991B1B'
    WHEN "color" = 'LIME' THEN '#65A30D'
    ELSE '#6B7280'  -- Default gray for unknown colors
  END;
