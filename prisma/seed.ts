import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Create base bracelets
  const classicBracelet = await prisma.baseBracelet.upsert({
    where: { slug: 'classic' },
    update: {},
    create: {
      slug: 'classic',
      name: 'Classic Bracelet',
      svgPath: 'M 50 150 Q 250 50 500 100 Q 750 150 950 150 Q 750 200 500 180 Q 250 230 50 150 Z',
      imageUrl: '/images/bracelets/classic-silver.svg',
      lengthMm: 180,
      basePriceCents: 2500, // €25.00
      active: true
    }
  })

  const elegantBracelet = await prisma.baseBracelet.upsert({
    where: { slug: 'elegant' },
    update: {},
    create: {
      slug: 'elegant',
      name: 'Elegant Bracelet',
      svgPath: 'M 50 150 Q 200 80 400 120 Q 600 160 800 140 Q 900 135 950 150 Q 900 165 800 160 Q 600 180 400 140 Q 200 200 50 150 Z',
      imageUrl: '/images/bracelets/elegant-gold.svg',
      lengthMm: 200,
      basePriceCents: 3500, // €35.00
      active: true
    }
  })

  const modernBracelet = await prisma.baseBracelet.upsert({
    where: { slug: 'modern' },
    update: {},
    create: {
      slug: 'modern',
      name: 'Modern Bracelet',
      svgPath: 'M 60 150 L 240 120 Q 300 115 360 125 L 540 150 Q 600 155 660 150 L 840 130 Q 900 125 940 150 L 940 170 Q 900 175 840 170 L 660 190 Q 600 195 540 190 L 360 165 Q 300 175 240 170 L 60 170 Q 40 160 60 150 Z',
      imageUrl: '/images/bracelets/modern-rose.svg',
      lengthMm: 190,
      basePriceCents: 4000, // €40.00
      active: true
    }
  })

  // Create charms
  const heartCharm = await prisma.charm.upsert({
    where: { sku: 'CHARM-HEART-001' },
    update: {},
    create: {
      sku: 'CHARM-HEART-001',
      name: 'Gold Heart',
      priceCents: 850, // €8.50
      widthMm: 12,
      heightMm: 12,
      anchorPoint: 'center',
      maxPerBracelet: 5,
      stock: 100,
      active: true,
      svg: '<path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="gold" stroke="goldenrod" stroke-width="0.5"/>',
      imageUrl: '/images/charms/heart-gold.jpg'
    }
  })

  const starCharm = await prisma.charm.upsert({
    where: { sku: 'CHARM-STAR-001' },
    update: {},
    create: {
      sku: 'CHARM-STAR-001',
      name: 'Silver Star',
      priceCents: 750, // €7.50
      widthMm: 14,
      heightMm: 14,
      anchorPoint: 'center',
      maxPerBracelet: 6,
      stock: 150,
      active: true,
      svg: '<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="silver" stroke="lightgray" stroke-width="0.5"/>',
      imageUrl: '/images/charms/star-silver.jpg'
    }
  })

  const flowerCharm = await prisma.charm.upsert({
    where: { sku: 'CHARM-FLOWER-001' },
    update: {},
    create: {
      sku: 'CHARM-FLOWER-001',
      name: 'Rose Gold Flower',
      priceCents: 1200, // €12.00
      widthMm: 16,
      heightMm: 16,
      anchorPoint: 'center',
      maxPerBracelet: 4,
      stock: 80,
      active: true,
      svg: '<g fill="rosybrown" stroke="darkred" stroke-width="0.3"><circle cx="12" cy="8" r="3"/><circle cx="8" cy="12" r="3"/><circle cx="16" cy="12" r="3"/><circle cx="10" cy="16" r="3"/><circle cx="14" cy="16" r="3"/><circle cx="12" cy="12" r="2" fill="gold"/></g>',
      imageUrl: '/images/charms/flower-rosegold.jpg'
    }
  })

  const butterflyCharm = await prisma.charm.upsert({
    where: { sku: 'CHARM-BUTTERFLY-001' },
    update: {},
    create: {
      sku: 'CHARM-BUTTERFLY-001',
      name: 'Blue Butterfly',
      priceCents: 950, // €9.50
      widthMm: 18,
      heightMm: 12,
      anchorPoint: 'center',
      maxPerBracelet: 3,
      stock: 60,
      active: true,
      svg: '<g fill="lightblue" stroke="navy" stroke-width="0.4"><path d="M12 2C10 4 8 6 8 8c0 2 2 4 4 2 2 2 4 0 4-2 0-2-2-4-4-6z"/><path d="M12 22C10 20 8 18 8 16c0-2 2-4 4-2 2-2 4 0 4 2 0 2-2 4-4 6z"/><line x1="12" y1="8" x2="12" y2="16" stroke="black" stroke-width="1"/></g>',
      imageUrl: '/images/charms/butterfly-blue.jpg'
    }
  })

  const moonCharm = await prisma.charm.upsert({
    where: { sku: 'CHARM-MOON-001' },
    update: {},
    create: {
      sku: 'CHARM-MOON-001',
      name: 'Crescent Moon',
      priceCents: 680, // €6.80
      widthMm: 10,
      heightMm: 14,
      anchorPoint: 'center',
      maxPerBracelet: 8,
      stock: 200,
      active: true,
      svg: '<path d="M12 2C8 2 5 5 5 9s3 7 7 7c1 0 2-.2 3-.6C13 14 12 12 12 9s1-5 3-6.4c-1-.4-2-.6-3-.6z" fill="gold" stroke="goldenrod" stroke-width="0.5"/>',
      imageUrl: '/images/charms/moon-gold.jpg'
    }
  })

  const gemCharm = await prisma.charm.upsert({
    where: { sku: 'CHARM-GEM-001' },
    update: {},
    create: {
      sku: 'CHARM-GEM-001',
      name: 'Diamond Gem',
      priceCents: 1500, // €15.00
      widthMm: 8,
      heightMm: 10,
      anchorPoint: 'center',
      maxPerBracelet: 10,
      stock: 50,
      active: true,
      svg: '<path d="M12 2l4 6-4 10-4-10 4-6z" fill="lightcyan" stroke="darkblue" stroke-width="0.8"/>',
      imageUrl: '/images/charms/gem-diamond.jpg'
    }
  })

  console.log('Database seeded successfully!')
  console.log('Created bracelets:', { classicBracelet, elegantBracelet, modernBracelet })
  console.log('Created charms:', { heartCharm, starCharm, flowerCharm, butterflyCharm, moonCharm, gemCharm })
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })