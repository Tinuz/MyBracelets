import { NextRequest, NextResponse } from 'next/server';
import { isValidAdminRequest } from '@/lib/admin-auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET - Fetch all orders for admin
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
    const orders = await prisma.order.findMany({
      include: {
        items: true
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(orders);
  } catch (error) {
    console.error('Failed to fetch orders:', error);
    
    // Return empty array if orders table doesn't exist yet (first time setup)
    if (error instanceof Error && error.message.includes('Table') && error.message.includes('does not exist')) {
      return NextResponse.json([]);
    }
    
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}