import { NextRequest, NextResponse } from 'next/server';
import { isValidAdminRequest } from '@/lib/admin-auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// PATCH - Update order status
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
    
    const order = await prisma.order.update({
      where: { id: params.id },
      data: {
        status: data.status,
        notes: data.notes,
        updatedAt: new Date()
      },
      include: {
        items: true
      }
    });

    return NextResponse.json(order);
  } catch (error) {
    console.error('Failed to update order:', error);
    return NextResponse.json(
      { error: 'Failed to update order' },
      { status: 500 }
    );
  }
}