import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    console.log('🔗 Fetching all chains from database...');
    
    const chains = await prisma.chain.findMany({
      where: {
        active: true,
      },
      orderBy: {
        name: 'asc',
      },
    });

    console.log(`📊 Found ${chains.length} active chains:`, chains.map(c => ({
      id: c.id,
      name: c.name,
      type: c.type,
      metalType: c.metalType,
      active: c.active
    })));

    return NextResponse.json(chains);
  } catch (error) {
    console.error('💥 Error fetching chains:', error);
    return NextResponse.json(
      { error: 'Failed to fetch chains' },
      { status: 500 }
    );
  }
}