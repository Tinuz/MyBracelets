const { PrismaClient } = require('@prisma/client');

async function checkCurrentCharms() {
  const prisma = new PrismaClient();
  try {
    const charms = await prisma.charm.findMany({
      select: { 
        id: true,
        sku: true,
        name: true, 
        imageUrl: true,
        svg: true
      }
    });
    
    console.log('Current charms in database:');
    charms.forEach(charm => {
      console.log(`${charm.sku}: ${charm.name}`);
      console.log(`  - imageUrl: ${charm.imageUrl || 'null'}`);
      console.log(`  - has svg: ${charm.svg ? 'yes' : 'no'}`);
      console.log('---');
    });
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkCurrentCharms();