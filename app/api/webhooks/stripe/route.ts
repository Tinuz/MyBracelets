import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not defined');
}

if (!process.env.STRIPE_WEBHOOK_SECRET) {
  throw new Error('STRIPE_WEBHOOK_SECRET is not defined');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
});

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json({ error: 'No signature' }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  try {
    // Handle the checkout.session.completed event
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      
      // Create order from successful payment
      await createOrderFromSession(session);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook handler error:', error);
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 });
  }
}

async function createOrderFromSession(session: Stripe.Checkout.Session) {
  try {
    // Check if order already exists for this session/payment
    const existingOrder = await prisma.order.findFirst({
      where: {
        OR: [
          { paymentId: session.payment_intent as string },
          { notes: { contains: session.id } }
        ]
      }
    });

    if (existingOrder) {
      console.log('Order already exists for session:', session.id);
      return existingOrder;
    }

    // Get detailed session with line items
    const detailedSession = await stripe.checkout.sessions.retrieve(session.id, {
      expand: ['line_items', 'customer']
    });

    const customer = detailedSession.customer as Stripe.Customer;
    const lineItems = detailedSession.line_items?.data || [];

    // Generate order number
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`;

    // Calculate total (Stripe amounts are in cents)
    const totalCents = session.amount_total || 0;

    // Create order in database
    const order = await prisma.order.create({
      data: {
        orderNumber,
        customerEmail: customer?.email || session.customer_details?.email || 'unknown@example.com',
        customerName: customer?.name || session.customer_details?.name || null,
        totalCents,
        currency: session.currency?.toUpperCase() || 'EUR',
        status: 'CONFIRMED',
        paymentProvider: 'stripe',
        paymentId: session.payment_intent as string,
        shippingAddress: formatShippingAddress(session.shipping_details),
        notes: `Created via webhook from session: ${session.id}`,
        items: {
          create: lineItems.map((item, index) => {
            const product = item.price?.product;
            const isShipping = item.description?.toLowerCase().includes('shipping');
            const metadata = typeof product === 'object' && product && 'metadata' in product ? product.metadata : {};
            
            return {
              productType: isShipping ? 'shipping' : 'design',
              productId: (metadata?.itemId as string) || (isShipping ? 'shipping' : `item-${index}`),
              productName: item.description || 'Unknown Product',
              quantity: item.quantity || 1,
              priceCents: item.amount_total || 0,
            };
          })
        }
      },
      include: {
        items: true
      }
    });

    console.log('Order created successfully:', order.orderNumber);
    return order;

  } catch (error) {
    console.error('Failed to create order from session:', error);
    throw error;
  }
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