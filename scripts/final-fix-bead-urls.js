const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function fixBeadImageUrls() {
  console.log('Fixing bead image URLs...');

  const beads = await prisma.bead.findMany();
  
  for (const bead of beads) {
    // Create the correct URL based on color and diameter
    const color = bead.color.toLowerCase();
    const diameter = bead.diameterMm;
    const correctImageUrl = `/images/beads/${color}-${diameter}mm.svg`;
    
    if (correctImageUrl !== bead.imageUrl) {
      console.log(`Fixing ${bead.color} ${bead.diameterMm}mm: ${bead.imageUrl} -> ${correctImageUrl}`);
      
      await prisma.bead.update({
        where: { id: bead.id },
        data: { imageUrl: correctImageUrl }
      });
    }
  }

  console.log('Bead image URLs fixed successfully!');
}

async function main() {
  try {
    await fixBeadImageUrls();
  } catch (error) {
    console.error('Error fixing bead image URLs:', error);
  } finally {
    await prisma.$disconnect();
  }
}

if (require.main === module) {
  main();
}

module.exports = { fixBeadImageUrls };