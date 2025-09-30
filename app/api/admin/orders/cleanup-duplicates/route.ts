import { NextRequest, NextResponse } from 'next/server';
import { isValidAdminRequest } from '@/lib/admin-auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

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
    // Find duplicate orders based on paymentId
    const allOrders = await prisma.order.findMany({
      where: {
        paymentId: {
          not: null
        }
      },
      orderBy: {
        createdAt: 'asc'
      }
    });

    const duplicates = [];
    const seen = new Set();

    for (const order of allOrders) {
      if (order.paymentId && seen.has(order.paymentId)) {
        duplicates.push(order);
      } else if (order.paymentId) {
        seen.add(order.paymentId);
      }
    }

    // Delete duplicate orders (keep the first one, remove later ones)
    const deletedIds = [];
    for (const duplicate of duplicates) {
      // First delete order items
      await prisma.orderItem.deleteMany({
        where: { orderId: duplicate.id }
      });
      
      // Then delete the order
      await prisma.order.delete({
        where: { id: duplicate.id }
      });
      
      deletedIds.push(duplicate.id);
    }

    return NextResponse.json({
      message: `Cleaned up ${duplicates.length} duplicate orders`,
      deletedOrderIds: deletedIds,
      duplicatesFound: duplicates.map(d => ({
        id: d.id,
        orderNumber: d.orderNumber,
        paymentId: d.paymentId,
        createdAt: d.createdAt
      }))
    });

  } catch (error) {
    console.error('Failed to cleanup duplicates:', error);
    return NextResponse.json(
      { error: 'Failed to cleanup duplicate orders' },
      { status: 500 }
    );
  }
}