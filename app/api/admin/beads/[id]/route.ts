import { NextRequest, NextResponse } from 'next/server';
import { isValidAdminRequest } from '@/lib/admin-auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// PUT - Update bead
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
    
    const bead = await prisma.bead.update({
      where: { id: params.id },
      data: {
        name: data.name,
        color: data.color,
        priceCents: data.priceCents,
        diameterMm: data.diameterMm,
        imageUrl: data.imageUrl,
        active: data.active,
      }
    });

    return NextResponse.json(bead);
  } catch (error) {
    console.error('Failed to update bead:', error);
    return NextResponse.json(
      { error: 'Failed to update bead' },
      { status: 500 }
    );
  }
}

// PATCH - Partially update bead (e.g., toggle active status)
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
    
    const bead = await prisma.bead.update({
      where: { id: params.id },
      data
    });

    return NextResponse.json(bead);
  } catch (error) {
    console.error('Failed to update bead:', error);
    return NextResponse.json(
      { error: 'Failed to update bead' },
      { status: 500 }
    );
  }
}

// DELETE - Delete bead
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
    await prisma.bead.delete({
      where: { id: params.id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete bead:', error);
    return NextResponse.json(
      { error: 'Failed to delete bead' },
      { status: 500 }
    );
  }
}