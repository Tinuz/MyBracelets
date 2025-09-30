const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkBeadUrls() {
  const beads = await prisma.bead.findMany({
    select: {
      color: true,
      diameterMm: true,
      imageUrl: true
    }
  });
  
  console.log('Current bead URLs:');
  beads.forEach(bead => {
    console.log(`${bead.color} ${bead.diameterMm}mm: ${bead.imageUrl}`);
  });
  
  await prisma.$disconnect();
}

checkBeadUrls();