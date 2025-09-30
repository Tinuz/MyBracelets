const { PrismaClient } = require('@prisma/client');

async function checkCharms() {
  const prisma = new PrismaClient();
  
  try {
    const charms = await prisma.charm.findMany({
      where: {
        active: true,
        stock: { gt: 0 }
      }
    });
    
    console.log(`Found ${charms.length} active charms in database:`);
    charms.forEach(charm => {
      console.log(`- ${charm.name} (€${(charm.priceCents/100).toFixed(2)}) - Stock: ${charm.stock}`);
    });
    
    if (charms.length === 0) {
      console.log('\n❌ No charms found! Need to seed charms data.');
    }
    
  } catch (error) {
    console.error('Error checking charms:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkCharms();