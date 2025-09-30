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
      orderBy: [
        { featured: 'desc' }, // Featured products first
        { basePriceCents: 'asc' },
      ],
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