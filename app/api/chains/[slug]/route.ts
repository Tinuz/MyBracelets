import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;
    console.log('🔍 Chains API - Looking for chain with slug:', slug);

    // For now, just return the first active chain since we don't have proper slug matching yet
    const chain = await prisma.chain.findFirst({
      where: {
        active: true,
      },
    });

    if (!chain) {
      console.log('❌ No active chain found');
      return NextResponse.json(
        { 
          error: 'Chain not found',
          debug: {
            searchSlug: slug,
            message: 'No active chains available'
          }
        },
        { status: 404 }
      );
    }

    // Ensure chain has a proper SVG path that fits the Designer viewBox (1000x300)
    let svgPath = chain.svgPath;
    
    // Fix small paths that don't fit well in the Designer viewBox
    if (!svgPath || svgPath === 'M 20 25 L 280 25') {
      svgPath = 'M 100 150 L 900 150'; // Horizontal line across most of the canvas
    }
    
    const chainWithSvg = {
      ...chain,
      svgPath: svgPath
    };

    console.log('✅ Returning chain:', {
      name: chain.name,
      lengthMm: chain.lengthMm,
      priceCents: chain.priceCents,
      type: chain.type,
      metalType: chain.metalType,
      svgPath: chainWithSvg.svgPath,
      originalSvgPath: chain.svgPath
    });
    return NextResponse.json(chainWithSvg);
  } catch (error) {
    console.error('💥 Error fetching chain:', error);
    return NextResponse.json(
      { error: 'Failed to fetch chain' },
      { status: 500 }
    );
  }
}