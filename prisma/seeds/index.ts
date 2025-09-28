import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Seed Base Bracelets
  await prisma.baseBracelet.upsert({
    where: { slug: "classic" },
    update: {},
    create: {
      slug: "classic",
      name: "Classic Silver",
      svgPath: "M10,150 Q500,20 990,150 Q500,280 10,150",
      lengthMm: 180,
      basePriceCents: 3000, // €30.00
    },
  });

  await prisma.baseBracelet.upsert({
    where: { slug: "elegant" },
    update: {},
    create: {
      slug: "elegant",
      name: "Elegant Gold",
      svgPath: "M20,150 Q500,30 980,150 Q500,270 20,150",
      lengthMm: 175,
      basePriceCents: 4500, // €45.00
    },
  });

  // Seed Charms
  const charms = [
    {
      sku: "heart-01",
      name: "Heart",
      priceCents: 500, // €5.00
      widthMm: 6,
      heightMm: 6,
      stock: 100,
      svg: `<circle fill="#ff69b4" r="8"/>`,
      anchorPoint: "center",
      maxPerBracelet: 8,
    },
    {
      sku: "star-01",
      name: "Star",
      priceCents: 400, // €4.00
      widthMm: 5,
      heightMm: 5,
      stock: 100,
      svg: `<polygon fill="#ffd700" points="0,-10 2.9,-3.1 9.5,-3.1 4.8,1.9 7.6,8.1 0,4.9 -7.6,8.1 -4.8,1.9 -9.5,-3.1 -2.9,-3.1"/>`,
      anchorPoint: "center",
      maxPerBracelet: 10,
    },
    {
      sku: "moon-01",
      name: "Moon",
      priceCents: 450, // €4.50
      widthMm: 5,
      heightMm: 5,
      stock: 100,
      svg: `<path fill="#c0c0c0" d="M0,-8 A8,8 0 0,0 0,8 A6,6 0 0,1 0,-8"/>`,
      anchorPoint: "center",
      maxPerBracelet: 6,
    },
    {
      sku: "butterfly-01",
      name: "Butterfly",
      priceCents: 650, // €6.50
      widthMm: 8,
      heightMm: 6,
      stock: 75,
      svg: `<g fill="#9932cc"><ellipse cx="-3" cy="-2" rx="3" ry="4"/><ellipse cx="3" cy="-2" rx="3" ry="4"/><ellipse cx="-2" cy="2" rx="2" ry="3"/><ellipse cx="2" cy="2" rx="2" ry="3"/></g>`,
      anchorPoint: "center",
      maxPerBracelet: 4,
    },
    {
      sku: "flower-01",
      name: "Flower",
      priceCents: 550, // €5.50
      widthMm: 7,
      heightMm: 7,
      stock: 90,
      svg: `<g fill="#ff6347"><circle cx="0" cy="-4" r="2"/><circle cx="3" cy="-2" r="2"/><circle cx="3" cy="2" r="2"/><circle cx="0" cy="4" r="2"/><circle cx="-3" cy="2" r="2"/><circle cx="-3" cy="-2" r="2"/><circle cx="0" cy="0" r="1.5" fill="#ffff00"/></g>`,
      anchorPoint: "center",
      maxPerBracelet: 5,
    },
  ];

  for (const charm of charms) {
    await prisma.charm.upsert({
      where: { sku: charm.sku },
      update: {},
      create: charm,
    });
  }

  console.log("✅ Database seeded successfully!");
  console.log("📿 Created base bracelets: classic, elegant");
  console.log(`🎭 Created ${charms.length} charms with stock and SVG icons`);
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });