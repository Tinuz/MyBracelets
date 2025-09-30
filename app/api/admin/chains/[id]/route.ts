import { NextRequest, NextResponse } from 'next/server';
import { isValidAdminRequest } from '@/lib/admin-auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// PUT - Update chain
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
    
    const chain = await prisma.chain.update({
      where: { id: params.id },
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
    console.error('Failed to update chain:', error);
    return NextResponse.json(
      { error: 'Failed to update chain' },
      { status: 500 }
    );
  }
}

// DELETE - Delete chain
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
    await prisma.chain.delete({
      where: { id: params.id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete chain:', error);
    return NextResponse.json(
      { error: 'Failed to delete chain' },
      { status: 500 }
    );
  }
}