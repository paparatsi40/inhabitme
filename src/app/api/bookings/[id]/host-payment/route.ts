import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { createClient } from '@supabase/supabase-js';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-12-15.clover',
});

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

type Ctx = { params: Promise<{ id: string }> }

export async function POST(request: NextRequest, { params }: Ctx) {
  const { id: bookingId } = await params
  // ... resto igual, usando bookingId
}
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const bookingId = params.id;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get booking
    const { data: booking, error: fetchError } = await supabase
      .from('bookings')
      .select('*')
      .eq('id', bookingId)
      .single();

    if (fetchError || !booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    // Verify user is the host
    if (booking.host_id !== userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Verify booking status
    if (booking.status !== 'pending_host_payment') {
      return NextResponse.json({ error: 'Booking not ready for host payment' }, { status: 400 });
    }

    // Check if host is founding host with free benefits (2026)
    const { sessionClaims } = await auth();
    const publicMetadata = (sessionClaims as any)?.public_metadata || {};
    const unsafeMetadata = (sessionClaims as any)?.unsafe_metadata || {};
    const metadata = { ...publicMetadata, ...unsafeMetadata };
    
    const isFoundingHost2026 = 
      metadata.role === 'founding_host' && 
      (metadata.founding_host_year === 2026 || metadata.founding_host_year === '2026');
    
    // If Founding Host 2026, skip payment (fee = 0)
    if (isFoundingHost2026) {
      // Mark as paid without charging
      const { error: updateError } = await supabase
        .from('bookings')
        .update({
          host_paid: true,
          host_paid_at: new Date().toISOString(),
          host_payment_amount: 0,
          status: 'confirmed',
          contacts_released: true,
          contacts_released_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', bookingId);

      if (updateError) {
        console.error('Error updating booking:', updateError);
        return NextResponse.json({ error: 'Error confirming booking' }, { status: 500 });
      }

      // TODO: Send emails with contacts to both parties
      // TODO: Process transfer to host

      return NextResponse.json({ 
        success: true, 
        founding_host: true,
        message: 'Booking confirmed! As a Founding Host, no fee applies.' 
      });
    }

    // Create Stripe checkout for host fee
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/bookings/${bookingId}/confirmed`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/bookings/${bookingId}`,
      customer_email: booking.host_email,
      metadata: {
        booking_id: bookingId,
        host_id: userId,
        type: 'host_payment',
      },
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: 'inhabitme Success Fee',
              description: booking.featured_used 
                ? 'Success fee + Featured listing bonus'
                : 'Success fee - pago único',
            },
            unit_amount: booking.host_fee,
          },
          quantity: 1,
        },
      ],
      payment_intent_data: {
        metadata: {
          booking_id: bookingId,
          type: 'host_payment',
        },
      },
    });

    return NextResponse.json({ 
      success: true,
      sessionId: session.id,
      url: session.url,
    });

  } catch (error) {
    console.error('Host payment checkout error:', error);
    return NextResponse.json({ error: 'Failed to create checkout' }, { status: 500 });
  }
}
