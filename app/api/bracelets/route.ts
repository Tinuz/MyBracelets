import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    const bracelets = await prisma.baseBracelet.findMany({
      where: { active: true },
      select: {
        id: true,
        slug: true,
        name: true,
        svgPath: true,
        imageUrl: true,
        lengthMm: true,
        basePriceCents: true,
        active: true,
      },
      orderBy: {
        basePriceCents: 'asc',
      },
    })

    return NextResponse.json(bracelets)
  } catch (error) {
    console.error('Error fetching bracelets:', error)
    return NextResponse.json(
      { error: 'Failed to fetch bracelets' },
      { status: 500 }
    )
  }
}