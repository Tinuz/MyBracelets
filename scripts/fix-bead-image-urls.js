const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function updateBeadImageUrls() {
  console.log('Updating bead image URLs...');

  const beads = await prisma.bead.findMany();
  
  for (const bead of beads) {
    // Convert from wrong format to correct format that matches actual files
    const correctImageUrl = bead.imageUrl
      .replace(/(\d+)\.0\.0mm\.svg$/, '$1.0mm.svg')  // Fix double .0
      .replace(/(\d+)\.0mm\.svg$/, '$1.0mm.svg')     // Keep existing .0
      .replace(/(\d+)mm\.svg$/, '$1.0mm.svg');       // Add .0 if missing
    
    if (correctImageUrl !== bead.imageUrl) {
      console.log(`Updating ${bead.name}: ${bead.imageUrl} -> ${correctImageUrl}`);
      
      await prisma.bead.update({
        where: { id: bead.id },
        data: { imageUrl: correctImageUrl }
      });
    }
  }

  console.log('Bead image URLs updated successfully!');
}

async function main() {
  try {
    await updateBeadImageUrls();
  } catch (error) {
    console.error('Error updating bead image URLs:', error);
  } finally {
    await prisma.$disconnect();
  }
}

if (require.main === module) {
  main();
}

module.exports = { updateBeadImageUrls };