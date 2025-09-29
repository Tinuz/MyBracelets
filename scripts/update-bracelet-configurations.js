const { PrismaClient } = require('@prisma/client');

async function updateBraceletConfigurations() {
  const prisma = new PrismaClient();
  
  try {
    console.log('Updating existing bracelets with configuration options...');
    
    // Update Classic Bracelet
    const classic = await prisma.baseBracelet.update({
      where: { slug: 'classic' },
      data: {
        thickness: 2.0,
        color: 'silver',
        metalType: 'SILVER',
        chainType: 'CABLE'
      }
    });
    console.log(`Updated Classic: ${classic.name}`);
    
    // Update Elegant Bracelet
    const elegant = await prisma.baseBracelet.update({
      where: { slug: 'elegant' },
      data: {
        thickness: 2.5,
        color: 'gold',
        metalType: 'GOLD',
        chainType: 'CURB'
      }
    });
    console.log(`Updated Elegant: ${elegant.name}`);
    
    // Update Modern Bracelet
    const modern = await prisma.baseBracelet.update({
      where: { slug: 'modern' },
      data: {
        thickness: 3.0,
        color: 'rose-gold',
        metalType: 'ROSE_GOLD',
        chainType: 'BOX'
      }
    });
    console.log(`Updated Modern: ${modern.name}`);
    
    // Verify updates
    const allBracelets = await prisma.baseBracelet.findMany({
      select: {
        slug: true,
        name: true,
        thickness: true,
        color: true,
        metalType: true,
        chainType: true
      }
    });
    
    console.log('\nAll bracelets with new configuration:');
    allBracelets.forEach(bracelet => {
      console.log(`${bracelet.slug}: ${bracelet.thickness}mm ${bracelet.color} ${bracelet.metalType} ${bracelet.chainType}`);
    });
    
  } catch (error) {
    console.error('Error updating bracelets:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updateBraceletConfigurations();