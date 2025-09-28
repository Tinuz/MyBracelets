import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function updateBraceletWithRealImage() {
  try {
    // Update all bracelets to use the real chain bracelet image
    // You can use the same image for all or create variations
    
    // Option 1: Use same image for all bracelets
    await prisma.baseBracelet.updateMany({
      where: { active: true },
      data: {
        imageUrl: '/images/bracelets/gold-chain-bracelet.png'
      }
    })

    // Option 2: If you want different variations, uncomment below:
    /*
    await prisma.baseBracelet.update({
      where: { slug: 'classic' },
      data: {
        imageUrl: '/images/bracelets/gold-chain-bracelet.png',
        name: 'Classic Gold Chain'
      }
    })

    await prisma.baseBracelet.update({
      where: { slug: 'elegant' },
      data: {
        imageUrl: '/images/bracelets/gold-chain-bracelet.png',
        name: 'Elegant Gold Chain'
      }
    })

    await prisma.baseBracelet.update({
      where: { slug: 'modern' },
      data: {
        imageUrl: '/images/bracelets/gold-chain-bracelet.png',
        name: 'Modern Gold Chain'
      }
    })
    */

    console.log('✅ Successfully updated bracelets with real chain image!')
    
    // Show updated bracelets
    const bracelets = await prisma.baseBracelet.findMany({
      where: { active: true },
      select: {
        slug: true,
        name: true,
        imageUrl: true
      }
    })
    
    console.log('Updated bracelets:', bracelets)
  } catch (error) {
    console.error('❌ Error updating bracelets:', error)
  } finally {
    await prisma.$disconnect()
  }
}

updateBraceletWithRealImage()