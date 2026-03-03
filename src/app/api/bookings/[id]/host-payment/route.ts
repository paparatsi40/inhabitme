import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { createClient } from '@supabase/supabase-js'
import Stripe from 'stripe'

type Ctx = { params: Promise<{ id: string }> }

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-12-15.clover',
})

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(_request: NextRequest, { params }: Ctx) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id: bookingId } = await params
    if (!bookingId) {
      return NextResponse.json({ error: 'Booking ID is required' }, { status: 400 })
    }

    // 1) Fetch booking
    const { data: booking, error: fetchError } = await supabase
      .from('bookings')
      .select('*')
      .eq('id', bookingId)
      .single()

    if (fetchError || !booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
    }

    // 2) Verify host
    if (booking.host_id !== userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    // 3) Verify booking status
    if (booking.status !== 'pending_host_payment') {
      return NextResponse.json(
        { error: 'Booking not ready for host payment' },
        { status: 400 }
      )
    }

    // 4) Founding host waive logic (si tu tabla lo soporta)
    // Ajusta el campo a como lo tengas realmente.
    const isFoundingHost =
      booking.host_payment_status === 'waived' ||
      booking.founding_host === true ||
      booking.is_founding_host === true

    if (isFoundingHost) {
      // Marcar como confirmado / waived si aplica
      const { error: updateError } = await supabase
        .from('bookings')
        .update({
          host_payment_status: 'waived',
          status: 'confirmed',
        })
        .eq('id', bookingId)

      if (updateError) {
        console.error('Error updating booking:', updateError)
        return NextResponse.json({ error: 'Error confirming booking' }, { status: 500 })
      }

      return NextResponse.json({
        success: true,
        founding_host: true,
        message: 'Booking confirmed! As a Founding Host, no fee applies.',
      })
    }

    // 5) Create Stripe checkout session for host fee
    const hostFeeAmount =
      booking.host_fee_amount ??
      booking.host_fee ??
      7900 // fallback

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/bookings/${bookingId}/host-payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/host/bookings/${bookingId}`,
      metadata: {
        booking_id: bookingId,
        host_id: userId,
        payment_type: 'host_fee',
      },
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: 'inhabitme Host Fee',
              description: 'Host fee to confirm booking',
            },
            unit_amount: hostFeeAmount,
          },
          quantity: 1,
        },
      ],
    })

    return NextResponse.json({
      success: true,
      sessionId: session.id,
      url: session.url,
    })
  } catch (error) {
    console.error('Host payment checkout error:', error)
    return NextResponse.json({ error: 'Failed to create checkout' }, { status: 500 })
  }
}