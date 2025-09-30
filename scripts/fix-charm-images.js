const { PrismaClient } = require('@prisma/client');

async function fixCharmImages() {
  const prisma = new PrismaClient();
  
  try {
    // Define the correct image mappings based on existing files
    const imageMapping = {
      'Silver Star': '/images/charms/hart.png',
      'Blue Butterfly': '/images/charms/blad.png', 
      'Crescent Moon': '/images/charms/klaver.png',
      'Diamond Gem': '/images/charms/hart.png',
      'Gold Heart': '/images/charms/hart.png',
      'Rose Gold Flower': '/images/charms/blad.png',
      'Four-Leaf Clover': '/images/charms/klaver.png'
    };
    
    console.log('Updating charm image URLs...');
    
    for (const [charmName, imageUrl] of Object.entries(imageMapping)) {
      const result = await prisma.charm.updateMany({
        where: { name: charmName },
        data: { imageUrl }
      });
      
      if (result.count > 0) {
        console.log(`✅ Updated ${charmName} -> ${imageUrl}`);
      } else {
        console.log(`❌ No charm found with name: ${charmName}`);
      }
    }
    
    console.log('\n🎯 Charm image URLs updated successfully!');
    
  } catch (error) {
    console.error('Error updating charm images:', error);
  } finally {
    await prisma.$disconnect();
  }
}

fixCharmImages();