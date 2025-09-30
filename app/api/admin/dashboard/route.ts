import { NextRequest, NextResponse } from 'next/server';
import { isValidAdminRequest } from '@/lib/admin-auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

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
    // Get total counts 
    const [bracelets, charms, beads] = await Promise.all([
      prisma.baseBracelet.count(),
      prisma.charm.count(),
      prisma.bead.count(),
    ]);

    // Mock data for orders since we haven't implemented orders table yet
    const stats = {
      totalOrders: 12, // Mock data
      totalRevenue: 58900, // Mock revenue in cents (€589.00)
      totalProducts: bracelets + charms + beads,
      recentOrders: [
        {
          id: "ORD-001",
          customerEmail: "customer@example.com",
          totalCents: 2500,
          createdAt: "2 hours ago"
        },
        {
          id: "ORD-002", 
          customerEmail: "another@example.com",
          totalCents: 3200,
          createdAt: "5 hours ago"
        },
        {
          id: "ORD-003",
          customerEmail: "test@example.com", 
          totalCents: 1800,
          createdAt: "1 day ago"
        }
      ]
    };

    return NextResponse.json(stats);

  } catch (error) {
    console.error('Dashboard stats error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard stats' },
      { status: 500 }
    );
  }
}