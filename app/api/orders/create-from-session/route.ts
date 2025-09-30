import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

// This endpoint is called from the success page to create an order if webhook hasn't fired yet
export async function POST(req: NextRequest) {
  try {
    const { sessionId } = await req.json();

    if (!sessionId) {
      return NextResponse.json({ error: 'Session ID required' }, { status: 400 });
    }

    // Retrieve session from Stripe first to get payment_intent
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['line_items', 'customer']
    });

    if (session.payment_status !== 'paid') {
      return NextResponse.json({ error: 'Payment not completed' }, { status: 400 });
    }

    // Check if order already exists using payment_intent (more reliable)
    const existingOrder = await prisma.order.findFirst({
      where: {
        OR: [
          { paymentId: session.payment_intent as string },
          { notes: { contains: sessionId } }
        ]
      },
      include: {
        items: true
      }
    });

    if (existingOrder) {
      console.log('Order already exists for session:', sessionId, 'Order:', existingOrder.orderNumber);
      return NextResponse.json({ order: existingOrder, created: false });
    }

    // Create order
    const order = await createOrderFromStripeSession(session);
    
    return NextResponse.json({ order, created: true });

  } catch (error) {
    console.error('Failed to create order from session:', error);
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  }
}

async function createOrderFromStripeSession(session: Stripe.Checkout.Session) {
  const customer = session.customer as Stripe.Customer | null;
  const lineItems = session.line_items?.data || [];

  // Generate order number
  const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`;

  // Parse cart items from metadata if available
  const cartItems = session.metadata?.cartItems ? JSON.parse(session.metadata.cartItems) : [];

  const order = await prisma.order.create({
    data: {
      orderNumber,
      customerEmail: customer?.email || session.customer_details?.email || 'unknown@example.com',
      customerName: customer?.name || session.customer_details?.name || null,
      totalCents: session.amount_total || 0,
      currency: session.currency?.toUpperCase() || 'EUR',
      status: 'CONFIRMED',
      paymentProvider: 'stripe',
      paymentId: session.payment_intent as string,
      shippingAddress: formatShippingAddress(session.shipping_details),
      notes: `Created via success page from session: ${session.id}`,
      items: {
        create: cartItems.map((item: any, index: number) => ({
          productType: 'design',
          productId: item.id || `item-${index}`,
          productName: item.name || 'Custom Bracelet Design',
          quantity: item.quantity || 1,
          priceCents: Math.round((item.price || 0) * 100 * (item.quantity || 1)),
        }))
      }
    },
    include: {
      items: true
    }
  });

  return order;
}

function formatShippingAddress(shippingDetails: Stripe.Checkout.Session.ShippingDetails | null): string | null {
  if (!shippingDetails?.address) return null;

  const address = shippingDetails.address;
  const parts = [
    shippingDetails.name,
    address.line1,
    address.line2,
    `${address.postal_code} ${address.city}`,
    address.country
  ].filter(Boolean);

  return parts.join('\n');
}