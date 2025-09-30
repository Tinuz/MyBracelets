import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const beads = await prisma.bead.findMany({
      where: {
        active: true,
      },
      orderBy: [
        { diameterMm: "asc" },
        { color: "asc" },
      ],
    });

    return NextResponse.json(beads);
  } catch (error) {
    console.error("Error fetching beads:", error);
    return NextResponse.json(
      { error: "Failed to fetch beads" },
      { status: 500 }
    );
  }
}