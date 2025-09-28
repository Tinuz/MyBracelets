const { PrismaClient } = require('@prisma/client');

async function checkBraceletImages() {
  const prisma = new PrismaClient();
  try {
    const bracelets = await prisma.baseBracelet.findMany({
      select: { 
        slug: true, 
        name: true, 
        imageUrl: true 
      }
    });
    
    console.log('Bracelet images in database:');
    bracelets.forEach(bracelet => {
      console.log(`${bracelet.slug}: ${bracelet.imageUrl || 'null'}`);
    });
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkBraceletImages();