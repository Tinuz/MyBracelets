import { NextRequest, NextResponse } from 'next/server';
import { isValidAdminRequest } from '@/lib/admin-auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET - Fetch all chains for admin
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
    const chains = await prisma.chain.findMany({
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(chains);
  } catch (error) {
    console.error('Failed to fetch chains:', error);
    return NextResponse.json(
      { error: 'Failed to fetch chains' },
      { status: 500 }
    );
  }
}

// POST - Create new chain
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
    
    const chain = await prisma.chain.create({
      data: {
        name: data.name,
        type: data.type,
        description: data.description,
        priceCents: data.priceCents,
        thickness: data.thickness,
        metalType: data.metalType,
        imageUrl: data.imageUrl,
        svgPath: data.svgPath,
        active: data.active,
      }
    });

    return NextResponse.json(chain);
  } catch (error) {
    console.error('Failed to create chain:', error);
    return NextResponse.json(
      { error: 'Failed to create chain' },
      { status: 500 }
    );
  }
}