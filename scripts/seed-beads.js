const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function seedBeads() {
  console.log('Seeding beads...');

  const beadColors = [
    { color: 'RED', name: 'Red Bead', hex: '#DC2626' },
    { color: 'BLUE', name: 'Blue Bead', hex: '#2563EB' },
    { color: 'YELLOW', name: 'Yellow Bead', hex: '#FBBF24' },
    { color: 'GREEN', name: 'Green Bead', hex: '#059669' },
    { color: 'GOLD', name: 'Gold Bead', hex: '#D97706' }
  ];

  const beadSizes = [
    { diameterMm: 2.0, basePrice: 50 }, // €0.50 per bead
    { diameterMm: 4.0, basePrice: 100 }, // €1.00 per bead  
    { diameterMm: 6.0, basePrice: 150 } // €1.50 per bead
  ];

  for (const colorInfo of beadColors) {
    for (const sizeInfo of beadSizes) {
      await prisma.bead.create({
        data: {
          color: colorInfo.color,
          name: `${colorInfo.name} (${sizeInfo.diameterMm}mm)`,
          priceCents: sizeInfo.basePrice,
          diameterMm: sizeInfo.diameterMm,
          imageUrl: `/images/beads/${colorInfo.color.toLowerCase()}-${sizeInfo.diameterMm}mm.svg`,
          active: true
        }
      });
    }
  }

  console.log('Beads seeded successfully!');
}

async function createBeadsBaseBracelet() {
  console.log('Creating beads base bracelet...');

  await prisma.baseBracelet.create({
    data: {
      slug: 'beads-bracelet',
      name: 'Custom Beads Bracelet',
      svgPath: 'M10,40 Q100,35 190,40', // Simple curved line for beads
      imageUrl: '/images/bracelets/beads-bracelet.svg',
      lengthMm: 180, // Default length
      basePriceCents: 500, // €5.00 base price
      braceletType: 'BEADS',
      thickness: 4.0, // Default 4mm beads
      color: 'mixed',
      active: true
    }
  });

  console.log('Beads base bracelet created!');
}

async function main() {
  try {
    await seedBeads();
    await createBeadsBaseBracelet();
  } catch (error) {
    console.error('Error seeding beads:', error);
  } finally {
    await prisma.$disconnect();
  }
}

if (require.main === module) {
  main();
}

module.exports = { seedBeads, createBeadsBaseBracelet };