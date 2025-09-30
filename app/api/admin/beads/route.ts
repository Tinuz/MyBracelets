import { NextRequest, NextResponse } from 'next/server';
import { isValidAdminRequest } from '@/lib/admin-auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET - Fetch all beads for admin
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  const adminUser = isValidAdminRequest(authHeader);

  if (!adminUser) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    const beads = await prisma.bead.findMany({
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(beads);
  } catch (error) {
    console.error('Failed to fetch beads:', error);
    return NextResponse.json(
      { error: 'Failed to fetch beads' },
      { status: 500 }
    );
  }
}

// POST - Create new bead
export async function POST(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  const adminUser = isValidAdminRequest(authHeader);

  if (!adminUser) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    const data = await request.json();
    
    const bead = await prisma.bead.create({
      data: {
        name: data.name,
        color: data.color,
        colorHex: data.colorHex || '#6B7280', // Default gray if not provided
        priceCents: data.priceCents,
        diameterMm: data.diameterMm,
        imageUrl: data.imageUrl,
        active: data.active,
      }
    });

    return NextResponse.json(bead);
  } catch (error) {
    console.error('Failed to create bead:', error);
    return NextResponse.json(
      { error: 'Failed to create bead' },
      { status: 500 }
    );
  }
}