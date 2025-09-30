import { NextRequest, NextResponse } from 'next/server';
import { isValidAdminRequest } from '@/lib/admin-auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// PUT - Update bracelet
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
    
    const bracelet = await prisma.baseBracelet.update({
      where: { id: params.id },
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
    console.error('Failed to update bracelet:', error);
    return NextResponse.json(
      { error: 'Failed to update bracelet' },
      { status: 500 }
    );
  }
}

// PATCH - Partially update bracelet
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
    
    const bracelet = await prisma.baseBracelet.update({
      where: { id: params.id },
      data
    });

    return NextResponse.json(bracelet);
  } catch (error) {
    console.error('Failed to update bracelet:', error);
    return NextResponse.json(
      { error: 'Failed to update bracelet' },
      { status: 500 }
    );
  }
}

// DELETE - Delete bracelet
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const authHeader = request.headers.get('authorization');
  const adminUser = isValidAdminRequest(authHeader);

  if (!adminUser) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    await prisma.baseBracelet.delete({
      where: { id: params.id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete bracelet:', error);
    return NextResponse.json(
      { error: 'Failed to delete bracelet' },
      { status: 500 }
    );
  }
}