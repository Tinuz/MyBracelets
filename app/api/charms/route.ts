import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const charms = await prisma.charm.findMany({
      where: { 
        active: true,
        stock: { gt: 0 }
      },
      select: {
        id: true,
        sku: true,
        name: true,
        priceCents: true,
        widthMm: true,
        heightMm: true,
        anchorPoint: true,
        maxPerBracelet: true,
        stock: true,
        svg: true,
        imageUrl: true,
      },
      orderBy: {
        name: 'asc',
      },
    });

    return NextResponse.json(charms, {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
      },
    });
  } catch (error) {
    console.error("Error fetching charms:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // This would be admin-only in production
    const charm = await prisma.charm.create({
      data: {
        sku: body.sku,
        name: body.name,
        priceCents: body.priceCents,
        widthMm: body.widthMm,
        heightMm: body.heightMm,
        anchorPoint: body.anchorPoint || "center",
        maxPerBracelet: body.maxPerBracelet || 10,
        stock: body.stock || 0,
        svg: body.svg,
        imageUrl: body.imageUrl,
      },
    });

    return NextResponse.json(charm, { status: 201 });
  } catch (error) {
    console.error("Error creating charm:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}