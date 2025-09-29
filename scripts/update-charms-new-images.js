const { PrismaClient } = require('@prisma/client');

async function updateCharmsWithNewImages() {
  const prisma = new PrismaClient();
  
  try {
    console.log('Updating charms with new images...');
    
    // Check current charms
    const allCharms = await prisma.charm.findMany({
      select: { id: true, sku: true, name: true, imageUrl: true }
    });
    
    console.log('Current charms:');
    allCharms.forEach(charm => {
      console.log(`${charm.sku}: ${charm.name} - ${charm.imageUrl || 'no image'}`);
    });
    
    // Update heart charm - try multiple possible SKUs
    let heartUpdated = false;
    for (const heartSku of ['CHARM-HEART-001', 'heart-01']) {
      try {
        const result = await prisma.charm.updateMany({
          where: { sku: heartSku },
          data: { imageUrl: '/images/charms/hart.png' }
        });
        if (result.count > 0) {
          console.log(`Updated ${result.count} heart charm(s) with SKU ${heartSku}`);
          heartUpdated = true;
          break;
        }
      } catch (e) {
        // Continue to next SKU
      }
    }
    
    // Update flower charm - try multiple possible SKUs
    let flowerUpdated = false;
    for (const flowerSku of ['CHARM-FLOWER-001', 'flower-01']) {
      try {
        const result = await prisma.charm.updateMany({
          where: { sku: flowerSku },
          data: { imageUrl: '/images/charms/blad.png' }
        });
        if (result.count > 0) {
          console.log(`Updated ${result.count} flower charm(s) with SKU ${flowerSku}`);
          flowerUpdated = true;
          break;
        }
      } catch (e) {
        // Continue to next SKU
      }
    }
    
    // Check if clover already exists, if not create it
    const existingClover = await prisma.charm.findFirst({
      where: { 
        OR: [
          { sku: 'clover-01' },
          { sku: 'CHARM-CLOVER-001' },
          { name: { contains: 'Clover', mode: 'insensitive' } }
        ]
      }
    });
    
    if (existingClover) {
      // Update existing clover
      const cloverResult = await prisma.charm.update({
        where: { id: existingClover.id },
        data: { imageUrl: '/images/charms/klaver.png' }
      });
      console.log(`Updated existing clover: ${cloverResult.name}`);
    } else {
      // Create new clover charm
      const newClover = await prisma.charm.create({
        data: {
          sku: 'CHARM-CLOVER-001',
          name: 'Four-Leaf Clover',
          priceCents: 1250,
          widthMm: 12,
          heightMm: 12,
          anchorPoint: 'center',
          maxPerBracelet: 3,
          stock: 50,
          active: true,
          imageUrl: '/images/charms/klaver.png',
          svg: `<g fill="#22c55e" stroke="#16a34a" stroke-width="0.5">
            <path d="M12 8C10 8 8 6 8 4S10 2 12 2S16 4 16 6S14 8 12 8Z"/>
            <path d="M12 16C10 16 8 14 8 12S10 10 12 10S16 12 16 14S14 16 12 16Z"/>
            <path d="M8 12C8 10 6 8 4 8S2 10 2 12S4 16 6 16S8 14 8 12Z"/>
            <path d="M16 12C16 10 18 8 20 8S22 10 22 12S20 16 18 16S16 14 16 12Z"/>
            <circle cx="12" cy="12" r="1" fill="#15803d"/>
          </g>`
        }
      });
      console.log(`Created new clover: ${newClover.name}`);
    }
    
    // Show final result
    console.log('\nCharms with PNG images:');
    const updatedCharms = await prisma.charm.findMany({
      where: {
        imageUrl: {
          in: ['/images/charms/hart.png', '/images/charms/blad.png', '/images/charms/klaver.png']
        }
      },
      select: { sku: true, name: true, imageUrl: true }
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

updateCharmsWithNewImages();