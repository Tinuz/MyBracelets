import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not defined');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
});

export async function POST(req: NextRequest) {
  try {
    const { cartItems } = await req.json();

    if (!cartItems || cartItems.length === 0) {
      return NextResponse.json(
        { error: 'Cart is empty' },
        { status: 400 }
      );
    }

    // Convert cart items to Stripe line items
    const lineItems = cartItems.map((item: any) => ({
      price_data: {
        currency: 'eur',
        product_data: {
          name: item.name,
          description: item.description || `Custom ${item.details?.braceletType || 'Bracelet'} Design`,
          images: [], // Add product images later if needed
          metadata: {
            itemId: item.id,
            braceletType: item.details?.braceletType || 'unknown',
            beadCount: (item.details?.beads?.length || 0).toString(),
            charmCount: (item.details?.charms?.length || 0).toString(),
            cartItemType: 'bracelet_design',
          },
        },
        unit_amount: Math.round(item.price * 100), // Convert euros to cents
      },
      quantity: item.quantity,
    }));

    // Add shipping as separate line item
    lineItems.push({
      price_data: {
        currency: 'eur',
        product_data: {
          name: 'Shipping',
          description: 'Standard shipping',
        },
        unit_amount: 500, // €5.00 shipping
      },
      quantity: 1,
    });

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card', 'ideal'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${req.nextUrl.origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.nextUrl.origin}/cart`,
      metadata: {
        orderType: 'bracelet_order',
        cartItemsCount: cartItems.length.toString(),
        cartItems: JSON.stringify(cartItems.map((item: any) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          braceletType: item.details?.braceletType,
        }))),
      },
      billing_address_collection: 'required',
      shipping_address_collection: {
        allowed_countries: ['NL', 'BE', 'DE', 'FR'], // Add more countries as needed
      },
      customer_creation: 'always',
      invoice_creation: {
        enabled: true,
      },
    });

    return NextResponse.json({ sessionId: session.id, url: session.url });
  } catch (error) {
    console.error('Stripe checkout error:', error);
    
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}