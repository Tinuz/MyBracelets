import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function updateBraceletPaths() {
  try {
    // Update classic bracelet - simple horizontal line with slight curve
    await prisma.baseBracelet.update({
      where: { slug: 'classic' },
      data: {
        svgPath: 'M 100 150 Q 500 130 900 150'
      }
    })

    // Update elegant bracelet - elegant curved line
    await prisma.baseBracelet.update({
      where: { slug: 'elegant' },
      data: {
        svgPath: 'M 100 150 Q 300 120 500 140 Q 700 160 900 150'
      }
    })

    // Update modern bracelet - modern geometric line
    await prisma.baseBracelet.update({
      where: { slug: 'modern' },
      data: {
        svgPath: 'M 100 150 L 300 140 L 500 150 L 700 140 L 900 150'
      }
    })

    console.log('✅ Successfully updated bracelet paths to horizontal lines!')
  } catch (error) {
    console.error('❌ Error updating bracelet paths:', error)
  } finally {
    await prisma.$disconnect()
  }
}

updateBraceletPaths()