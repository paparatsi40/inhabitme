import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { createClient } from '@supabase/supabase-js'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
})

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const bookingId = params.id
    const { sessionId } = await request.json()

    if (!sessionId) {
      return NextResponse.json({ error: 'Session ID required' }, { status: 400 })
    }

    // Retrieve session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId)

    if (session.payment_status !== 'paid') {
      return NextResponse.json({ error: 'Payment not completed' }, { status: 400 })
    }

    // Verify booking belongs to user
    const { data: booking, error: fetchError } = await supabase
      .from('bookings')
      .select('host_id, host_payment_status')
      .eq('id', bookingId)
      .single()

    if (fetchError || !booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
    }

    if (booking.host_id !== userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    // Update booking status
    const { error: updateError } = await supabase
      .from('bookings')
      .update({
        host_payment_status: 'paid',
        host_payment_intent_id: session.payment_intent as string,
        host_paid_at: new Date().toISOString(),
        status: 'pending_guest_payment', // Update status to waiting for guest
      })
      .eq('id', bookingId)

    if (updateError) {
      console.error('Update error:', updateError)
      return NextResponse.json({ error: 'Failed to update booking' }, { status: 500 })
    }

    // TODO: Send email to guest notifying they can pay

    return NextResponse.json({ 
      success: true,
      message: 'Host payment verified'
    })

  } catch (error: any) {
    console.error('Verification error:', error)
    return NextResponse.json(
      { error: error.message || 'Verification failed' },
      { status: 500 }
    )
  }
}
