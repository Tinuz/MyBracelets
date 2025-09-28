import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function updateBraceletImages() {
  try {
    // Update classic bracelet
    await prisma.baseBracelet.update({
      where: { slug: 'classic' },
      data: {
        imageUrl: '/images/bracelets/classic-silver.svg',
        svgPath: 'M 50 150 Q 250 50 500 100 Q 750 150 950 150 Q 750 200 500 180 Q 250 230 50 150 Z'
      }
    })

    // Update elegant bracelet
    await prisma.baseBracelet.update({
      where: { slug: 'elegant' },
      data: {
        imageUrl: '/images/bracelets/elegant-gold.svg',
        svgPath: 'M 50 150 Q 200 80 400 120 Q 600 160 800 140 Q 900 135 950 150 Q 900 165 800 160 Q 600 180 400 140 Q 200 200 50 150 Z'
      }
    })

    // Update modern bracelet
    await prisma.baseBracelet.update({
      where: { slug: 'modern' },
      data: {
        imageUrl: '/images/bracelets/modern-rose.svg',
        svgPath: 'M 60 150 L 240 120 Q 300 115 360 125 L 540 150 Q 600 155 660 150 L 840 130 Q 900 125 940 150 L 940 170 Q 900 175 840 170 L 660 190 Q 600 195 540 190 L 360 165 Q 300 175 240 170 L 60 170 Q 40 160 60 150 Z'
      }
    })

    console.log('✅ Successfully updated bracelet images and paths!')
  } catch (error) {
    console.error('❌ Error updating bracelets:', error)
  } finally {
    await prisma.$disconnect()
  }
}

updateBraceletImages()