import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;
    
    const bracelet = await prisma.baseBracelet.findUnique({
      where: { slug },
      select: {
        id: true,
        slug: true,
        name: true,
        description: true,
        svgPath: true,
        imageUrl: true,
        imageUrl2: true,
        imageUrl3: true,
        lengthMm: true,
        basePriceCents: true,
        braceletType: true,
        thickness: true,
        color: true,
        metalType: true,
        chainType: true,
        stock: true,
        featured: true,
        active: true,
      },
    });

    if (!bracelet || !bracelet.active) {
      return NextResponse.json(
        { error: "Bracelet not found or inactive" },
        { status: 404 }
      );
    }

    return NextResponse.json(bracelet, {
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
      },
    });
  } catch (error) {
    console.error("Error fetching bracelet:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}