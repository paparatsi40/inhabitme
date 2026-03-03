import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { createClient } from '@supabase/supabase-js';
import Stripe from 'stripe';

const stripeKey = process.env.STRIPE_SECRET_KEY;

if (!stripeKey) {
  console.error('❌ STRIPE_SECRET_KEY not found in environment variables');
}

const stripe = new Stripe(stripeKey!, {
  apiVersion: '2025-12-15.clover',
});

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

type Ctx = { params: Promise<{ id: string }> }

export async function POST(request: NextRequest, { params }: Ctx) {
  const { id } = await params
  // ... y reemplaza TODOS los "params.id" por "id"
}
  try {
    console.log('🔥 CREATE CHECKOUT CALLED');
    console.log('🔥 Booking ID:', params.id);
    
    const { userId } = await auth();
    
    if (!userId) {
      console.log('❌ Unauthorized - no userId');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('✅ User authenticated:', userId);

    const bookingId = params.id;
    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log('🔍 Fetching booking from DB...');
    
    // Get booking
    const { data: booking, error: fetchError } = await supabase
      .from('bookings')
      .select('*')
      .eq('id', bookingId)
      .single();

    if (fetchError || !booking) {
      console.error('❌ Booking not found:', fetchError);
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    // Get property details
    const { data: property, error: propertyError } = await supabase
      .from('listings')
      .select('title')
      .eq('id', booking.property_id)
      .single();

    if (propertyError || !property) {
      console.error('❌ Property not found:', propertyError);
      return NextResponse.json({ error: 'Property not found' }, { status: 404 });
    }

    // Add property to booking object
    booking.property = property;

    console.log('✅ Booking found:', booking.id);
    console.log('📧 Guest email:', booking.guest_email);
    
    // Use guest_fee_amount from database (calculated by trigger based on booking value)
    // If not set, calculate based on duration
    let guestFeeAmount = booking.guest_fee_amount || booking.guest_fee
    
    if (!guestFeeAmount && booking.months_duration) {
      const { calculateDurationFees } = await import('@/lib/pricing/duration-fees')
      const fees = calculateDurationFees(booking.months_duration)
      guestFeeAmount = fees.guestFee
    } else if (!guestFeeAmount) {
      guestFeeAmount = 13900 // Default to 2-3 months tier if no duration
    }
    
    const pricingTier = booking.pricing_tier || 'Standard'
    
    console.log('💰 Amounts:', {
      monthly_price: booking.monthly_price,
      deposit: booking.deposit_amount,
      guest_fee: guestFeeAmount,
      pricing_tier: pricingTier
    });

    // Verify user is the guest
    if (booking.guest_id !== userId) {
      console.log('❌ Unauthorized - user is not the guest');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Verify booking status
    if (booking.status !== 'pending_guest_payment') {
      console.log('❌ Booking not ready for payment. Status:', booking.status);
      return NextResponse.json({ error: 'Booking not ready for payment' }, { status: 400 });
    }

    console.log('🔵 Creating Stripe checkout session...');

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/en/bookings/${bookingId}/payment-success`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/en/bookings/${bookingId}`,
      customer_email: booking.guest_email,
      metadata: {
        booking_id: bookingId,
        guest_id: userId,
        type: 'guest_payment',
      },
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: `Primer mes - ${booking.property.title}`,
              description: `${booking.check_in} - ${booking.check_out}`,
            },
            unit_amount: booking.monthly_price,
          },
          quantity: 1,
        },
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: 'Depósito',
              description: 'Reembolsable al final de la estancia',
            },
            unit_amount: booking.deposit_amount,
          },
          quantity: 1,
        },
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: `inhabitme service fee - ${pricingTier}`,
              description: 'Pago único por conexión (valor basado en duración del booking)',
            },
            unit_amount: guestFeeAmount,
          },
          quantity: 1,
        },
      ],
      payment_intent_data: {
        metadata: {
          booking_id: bookingId,
        },
      },
    });

    console.log('✅ Stripe session created:', session.id);
    console.log('🔗 Checkout URL:', session.url);

    return NextResponse.json({ 
      success: true,
      sessionId: session.id,
      url: session.url,
    });

  } catch (error: any) {
    console.error('❌ Checkout creation error:', error);
    console.error('❌ Error name:', error?.name);
    console.error('❌ Error message:', error?.message);
    console.error('❌ Error stack:', error?.stack);
    return NextResponse.json({ 
      error: 'Failed to create checkout',
      details: error?.message 
    }, { status: 500 });
  }
}
