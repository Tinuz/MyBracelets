import { NextRequest, NextResponse } from 'next/server';
import { isValidAdminRequest } from '@/lib/admin-auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// PUT - Update charm
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
    
    const charm = await prisma.charm.update({
      where: { id: params.id },
      data: {
        name: data.name,
        description: data.description,
        priceCents: data.priceCents,
        stock: data.stock,
        maxPerBracelet: data.maxPerBracelet,
        imageUrl: data.imageUrl,
        active: data.active,
      }
    });

    return NextResponse.json(charm);
  } catch (error) {
    console.error('Failed to update charm:', error);
    return NextResponse.json(
      { error: 'Failed to update charm' },
      { status: 500 }
    );
  }
}

// PATCH - Partially update charm (e.g., toggle active status)
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
    
    const charm = await prisma.charm.update({
      where: { id: params.id },
      data
    });

    return NextResponse.json(charm);
  } catch (error) {
    console.error('Failed to update charm:', error);
    return NextResponse.json(
      { error: 'Failed to update charm' },
      { status: 500 }
    );
  }
}

// DELETE - Delete charm
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
    await prisma.charm.delete({
      where: { id: params.id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete charm:', error);
    return NextResponse.json(
      { error: 'Failed to delete charm' },
      { status: 500 }
    );
  }
}