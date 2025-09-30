import { NextRequest, NextResponse } from 'next/server';
import { isValidAdminRequest } from '@/lib/admin-auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET - Fetch all charms for admin
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
    const charms = await prisma.charm.findMany({
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(charms);
  } catch (error) {
    console.error('Failed to fetch charms:', error);
    return NextResponse.json(
      { error: 'Failed to fetch charms' },
      { status: 500 }
    );
  }
}

// POST - Create new charm
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
    
    const charm = await prisma.charm.create({
      data: {
        sku: data.sku,
        name: data.name,
        description: data.description,
        priceCents: data.priceCents,
        widthMm: data.widthMm,
        heightMm: data.heightMm,
        anchorPoint: data.anchorPoint || 'center',
        maxPerBracelet: data.maxPerBracelet,
        stock: data.stock,
        imageUrl: data.imageUrl,
        active: data.active,
      }
    });

    return NextResponse.json(charm);
  } catch (error) {
    console.error('Failed to create charm:', error);
    return NextResponse.json(
      { error: 'Failed to create charm' },
      { status: 500 }
    );
  }
}