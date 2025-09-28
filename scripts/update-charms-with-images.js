const { PrismaClient } = require('@prisma/client');

async function updateCharmsWithImages() {
  const prisma = new PrismaClient();
  
  try {
    console.log('Updating charms with new images...');
    
    // Update heart charm with hart.png
    const heartUpdate = await prisma.charm.updateMany({
      where: { sku: 'heart-01' },
      data: { imageUrl: '/images/charms/hart.png' }
    });
    console.log(`Updated ${heartUpdate.count} heart charm(s) with hart.png`);
    
    // Update flower charm with blad.png (leaf/blade can represent nature/flower)
    const flowerUpdate = await prisma.charm.updateMany({
      where: { sku: 'flower-01' },
      data: { imageUrl: '/images/charms/blad.png' }
    });
    console.log(`Updated ${flowerUpdate.count} flower charm(s) with blad.png`);
    
    // Check if we have a clover/shamrock charm, if not create one
    const existingClover = await prisma.charm.findFirst({
      where: { 
        OR: [
          { name: { contains: 'Clover', mode: 'insensitive' } },
          { name: { contains: 'Shamrock', mode: 'insensitive' } },
          { sku: 'clover-01' }
        ]
      }
    });
    
    if (!existingClover) {
      // Create new clover charm
      const cloverCharm = await prisma.charm.create({
        data: {
          sku: 'clover-01',
          name: 'Four-Leaf Clover',
          priceCents: 1250, // €12.50
          widthMm: 12,
          heightMm: 12,
          anchorPoint: 'center',
          maxPerBracelet: 3,
          stock: 50,
          active: true,
          imageUrl: '/images/charms/klaver.png',
          svg: `<g>
            <path d="M12 2C10 2 8 4 8 6C8 7 8.5 7.5 9 8C8.5 8.5 8 9 8 10C8 12 10 14 12 14C14 14 16 12 16 10C16 9 15.5 8.5 15 8C15.5 7.5 16 7 16 6C16 4 14 2 12 2Z" fill="#22c55e"/>
            <path d="M12 14C14 14 16 12 16 10C16 9 15.5 8.5 15 8C15.5 7.5 16 7 16 6C16 8 14 10 12 10C10 10 8 8 8 6C8 7 8.5 7.5 9 8C8.5 8.5 8 9 8 10C8 12 10 14 12 14Z" fill="#16a34a"/>
          </g>`
        }
      });
      console.log(`Created new clover charm: ${cloverCharm.name} (${cloverCharm.sku})`);
    } else {
      // Update existing clover charm
      const cloverUpdate = await prisma.charm.update({
        where: { id: existingClover.id },
        data: { imageUrl: '/images/charms/klaver.png' }
      });
      console.log(`Updated existing clover charm: ${cloverUpdate.name} with klaver.png`);
    }
    
    // Show updated charms
    console.log('\nUpdated charms:');
    const updatedCharms = await prisma.charm.findMany({
      where: {
        imageUrl: {
          in: ['/images/charms/hart.png', '/images/charms/blad.png', '/images/charms/klaver.png']
        }
      },
      select: {
        sku: true,
        name: true,
        imageUrl: true
      }
    });
    
    updatedCharms.forEach(charm => {
      console.log(`${charm.sku}: ${charm.name} -> ${charm.imageUrl}`);
    });
    
  } catch (error) {
    console.error('Error updating charms:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updateCharmsWithImages();