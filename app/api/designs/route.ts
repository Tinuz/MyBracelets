import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { priceDesign } from "@/lib/pricing";
import { DesignCreateSchema, DesignUpdateSchema } from "@/lib/validation";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = DesignCreateSchema.parse(body);

    // Get bracelet
    const bracelet = await prisma.baseBracelet.findUnique({
      where: { slug: validatedData.braceletSlug },
    });

    if (!bracelet || !bracelet.active) {
      return NextResponse.json(
        { error: "Bracelet not found or inactive" },
        { status: 404 }
      );
    }

    // Get charms and validate availability
    const charmIds = validatedData.placements.map(p => p.charmId);
    const charms = await prisma.charm.findMany({
      where: {
        id: { in: charmIds },
        active: true,
      },
    });

    const charmMap = new Map(charms.map(c => [c.id, c]));

    // Validate each placement
    for (const placement of validatedData.placements) {
      const charm = charmMap.get(placement.charmId);
      
      if (!charm) {
        return NextResponse.json(
          { error: `Charm with ID ${placement.charmId} not found or inactive` },
          { status: 400 }
        );
      }
      
      if (charm.stock < placement.quantity) {
        return NextResponse.json(
          { error: `Insufficient stock for ${charm.name}. Available: ${charm.stock}` },
          { status: 409 }
        );
      }
      
      if (placement.quantity > charm.maxPerBracelet) {
        return NextResponse.json(
          { error: `Maximum ${charm.maxPerBracelet} ${charm.name} charms allowed per bracelet` },
          { status: 400 }
        );
      }
    }

    // Calculate pricing
    const pricingData = priceDesign(
      { basePriceCents: bracelet.basePriceCents },
      validatedData.placements,
      new Map(charms.map(c => [c.id, { priceCents: c.priceCents }]))
    );

    // Create design with placements
    const design = await prisma.design.create({
      data: {
        braceletId: bracelet.id,
        subtotalCents: pricingData.subtotalCents,
        discountCents: pricingData.discountCents,
        totalCents: pricingData.totalCents,
        charms: {
          create: validatedData.placements.map(p => ({
            charmId: p.charmId,
            t: p.t,
            offsetMm: p.offsetMm,
            rotationDeg: p.rotationDeg,
            zIndex: p.zIndex,
            quantity: p.quantity,
          })),
        },
      },
      include: {
        charms: {
          include: {
            charm: {
              select: {
                id: true,
                name: true,
                priceCents: true,
              },
            },
          },
        },
        bracelet: {
          select: {
            id: true,
            name: true,
            basePriceCents: true,
          },
        },
      },
    });

    return NextResponse.json({
      id: design.id,
      subtotalCents: design.subtotalCents,
      discountCents: design.discountCents,
      totalCents: design.totalCents,
      charmCount: validatedData.placements.reduce((sum, p) => sum + p.quantity, 0),
    }, { status: 201 });

  } catch (error: any) {
    console.error("Error creating design:", error);
    
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: "Invalid data", details: error.errors },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const designId = url.searchParams.get('id');

    if (!designId) {
      return NextResponse.json(
        { error: "Design ID is required" },
        { status: 400 }
      );
    }

    const design = await prisma.design.findUnique({
      where: { id: designId },
      include: {
        bracelet: {
          select: {
            id: true,
            slug: true,
            name: true,
            svgPath: true,
            lengthMm: true,
            basePriceCents: true,
          },
        },
        charms: {
          include: {
            charm: {
              select: {
                id: true,
                sku: true,
                name: true,
                priceCents: true,
                widthMm: true,
                heightMm: true,
                svg: true,
                imageUrl: true,
              },
            },
          },
        },
      },
    });

    if (!design) {
      return NextResponse.json(
        { error: "Design not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(design);

  } catch (error) {
    console.error("Error fetching design:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}