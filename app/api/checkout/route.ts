import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { env } from "@/lib/env";
import Stripe from "stripe";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { designId } = body;

    if (!designId) {
      return NextResponse.json(
        { error: "Design ID is required" },
        { status: 400 }
      );
    }

    // Get design with full details
    const design = await prisma.design.findUnique({
      where: { id: designId },
      include: {
        bracelet: {
          select: {
            id: true,
            slug: true,
            name: true,
            basePriceCents: true,
          },
        },
        charms: {
          include: {
            charm: {
              select: {
                id: true,
                name: true,
                priceCents: true,
                stock: true,
              },
            },
          },
        },
      },
    });

    if (!design) {
      return NextResponse.json(
        { error: "Design not found" },
        { status: 404 }
      );
    }

    if (design.status === "ORDERED") {
      return NextResponse.json(
        { error: "Design has already been ordered" },
        { status: 400 }
      );
    }

    // Check stock availability before checkout
    for (const designCharm of design.charms) {
      if (designCharm.charm.stock < designCharm.quantity) {
        return NextResponse.json(
          { error: `Insufficient stock for ${designCharm.charm.name}` },
          { status: 409 }
        );
      }
    }

    // Handle payment provider
    if (env.PAYMENT_PROVIDER === "stripe") {
      if (!env.STRIPE_SECRET_KEY) {
        return NextResponse.json(
          { error: "Stripe not configured" },
          { status: 500 }
        );
      }

      const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
        apiVersion: "2023-10-16",
      });

      // Create Stripe checkout session
      const session = await stripe.checkout.sessions.create({
        mode: "payment",
        success_url: `${env.APP_URL}/success?design=${design.id}`,
        cancel_url: `${env.APP_URL}/designer/${design.bracelet.slug}?canceled=1`,
        metadata: {
          designId: design.id,
        },
        line_items: [
          {
            price_data: {
              currency: design.currency.toLowerCase(),
              product_data: {
                name: `Custom Bracelet - ${design.bracelet.name}`,
                description: `${design.charms.length} charm(s)`,
              },
              unit_amount: design.totalCents,
            },
            quantity: 1,
          },
        ],
        payment_intent_data: {
          metadata: {
            designId: design.id,
          },
        },
      });

      return NextResponse.json({
        url: session.url,
        sessionId: session.id,
      });
    } else if (env.PAYMENT_PROVIDER === "mollie") {
      // TODO: Implement Mollie integration
      return NextResponse.json(
        { error: "Mollie integration not yet implemented" },
        { status: 501 }
      );
    } else {
      // Mock/development mode - simulate successful payment
      return NextResponse.json({
        url: `${env.APP_URL}/success?design=${design.id}&mock=1`,
        sessionId: "mock_session_" + Date.now(),
      });
    }

  } catch (error: any) {
    console.error("Error creating checkout session:", error);
    
    if (error.type && error.type.startsWith('Stripe')) {
      return NextResponse.json(
        { error: "Payment processing error", details: error.message },
        { status: 402 }
      );
    }
    
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}