import { NextRequest, NextResponse } from 'next/server'
import { auth, clerkClient } from '@clerk/nextjs/server'
import { createClient } from '@supabase/supabase-js'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-12-15.clover',
})

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  console.log('🔥 HOST CHECKOUT CALLED')
  
  try {
    const { userId } = await auth()
    if (!userId) {
      console.log('❌ No user authenticated')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    console.log('✅ User authenticated:', userId)
    
    const bookingId = params.id
    console.log('📍 Booking ID:', bookingId)

    // Get booking
    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .select('*, property:property_id(title, featured)')
      .eq('id', bookingId)
      .single()

    if (bookingError || !booking) {
      console.log('❌ Booking not found:', bookingError?.message)
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
    }

    console.log('✅ Booking found:', bookingId)

    // Verify user is the host
    if (booking.host_id !== userId) {
      console.log('❌ Unauthorized - user is not the host')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    console.log('✅ User is the host')

    // Check if already paid or waived
    if (booking.host_payment_status === 'paid') {
      console.log('⚠️ Already paid')
      return NextResponse.json({ error: 'Already paid' }, { status: 400 })
    }

    if (booking.host_payment_status === 'waived') {
      console.log('✅ Payment waived (Founding Host)')
      return NextResponse.json({ 
        message: 'Payment waived for Founding Host',
        waived: true 
      })
    }

    // Get host email from Clerk
    let hostEmail = process.env.INTERNAL_ALERT_EMAIL!
    try {
      const client = await clerkClient()
      const user = await client.users.getUser(userId)
      hostEmail = user.emailAddresses[0]?.emailAddress || hostEmail
      console.log('✅ Host email:', hostEmail)
    } catch (err) {
      console.log('⚠️ Could not fetch host email, using fallback')
    }

    // Use host_fee_amount from database (calculated by trigger based on booking value)
    // If not set, calculate based on duration and featured status
    let hostFeeAmount = booking.host_fee_amount
    
    if (!hostFeeAmount && booking.months_duration) {
      const { calculateDurationFees } = await import('@/lib/pricing/duration-fees')
      const fees = calculateDurationFees(booking.months_duration)
      hostFeeAmount = booking.featured_used ? fees.hostFeaturedFee : fees.hostFee
    } else if (!hostFeeAmount) {
      hostFeeAmount = 7900 // Default to 2-3 months tier if no duration
    }
    
    const pricingTier = booking.pricing_tier || 'Standard'

    console.log('💰 Host fee amount:', hostFeeAmount / 100, 'EUR')
    console.log('📊 Pricing tier:', pricingTier)

    // Create Stripe checkout session
    console.log('🔵 Creating Stripe checkout session...')
    
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      customer_email: hostEmail,
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: `inhabitme Host Fee - ${pricingTier}`,
              description: `Fee for accepting booking: ${booking.property?.title || 'Property'}`,
              images: ['https://res.cloudinary.com/dkrpgt4o5/image/upload/v1234567890/inhabitme-logo.png'],
            },
            unit_amount: hostFeeAmount,
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/bookings/${bookingId}/host-payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/host/bookings/${bookingId}`,
      metadata: {
        booking_id: bookingId,
        host_id: userId,
        payment_type: 'host_fee',
      },
    })

    console.log('✅ Stripe session created:', session.id)
    console.log('🔗 Checkout URL:', session.url)

    return NextResponse.json({ 
      sessionId: session.id,
      url: session.url,
    })

  } catch (error: any) {
    console.error('❌ Host checkout error:', error)
    console.error('Stack:', error.stack)
    return NextResponse.json(
      { error: error.message || 'Failed to create checkout' },
      { status: 500 }
    )
  }
}
