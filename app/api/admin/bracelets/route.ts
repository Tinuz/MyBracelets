import { NextRequest, NextResponse } from 'next/server';
import { isValidAdminRequest } from '@/lib/admin-auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET - Fetch all bracelets for admin
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
    const bracelets = await prisma.baseBracelet.findMany({
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(bracelets);
  } catch (error) {
    console.error('Failed to fetch bracelets:', error);
    return NextResponse.json(
      { error: 'Failed to fetch bracelets' },
      { status: 500 }
    );
  }
}

// POST - Create new bracelet
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
    
    const bracelet = await prisma.baseBracelet.create({
      data: {
        slug: data.slug,
        name: data.name,
        description: data.description,
        svgPath: data.svgPath,
        imageUrl: data.imageUrl,
        imageUrl2: data.imageUrl2,
        imageUrl3: data.imageUrl3,
        lengthMm: data.lengthMm,
        basePriceCents: data.basePriceCents,
        braceletType: data.braceletType,
        thickness: data.thickness,
        color: data.color,
        metalType: data.metalType,
        chainType: data.chainType,
        stock: data.stock,
        featured: data.featured,
        active: data.active,
      }
    });

    return NextResponse.json(bracelet);
  } catch (error) {
    console.error('Failed to create bracelet:', error);
    return NextResponse.json(
      { error: 'Failed to create bracelet' },
      { status: 500 }
    );
  }
}