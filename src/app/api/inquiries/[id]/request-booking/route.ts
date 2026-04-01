import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { getSupabaseServerClient } from '@/lib/supabase/server'
import { normalizeCurrency, getCurrencyFromLocation } from '@/lib/currency'

type Ctx = { params: Promise<{ id: string }> }

function parseInquirySource(source: string | null | undefined) {
  const raw = String(source || '')
  const payload = raw.replace('inquiry_form:', '')

  let numberOfGuests = 1
  let message = payload

  if (payload.includes('guests=')) {
    const guestsMatch = payload.match(/guests=(\d+)/)
    if (guestsMatch?.[1]) {
      numberOfGuests = Math.min(8, Math.max(1, Number(guestsMatch[1]) || 1))
    }

    const messageMatch = payload.match(/message=(.*)$/)
    if (messageMatch?.[1]) {
      message = messageMatch[1]
    }
  }

  return { numberOfGuests, message }
}

async function createBookingFromInquiry(userId: string, inquiryId: string) {
  const supabase = getSupabaseServerClient()

  const { data: inquiry, error: inquiryError } = await supabase
    .from('availability_leads')
    .select('id, listing_id, city, start_date, duration_months, email, source')
    .eq('id', inquiryId)
    .single()

  if (inquiryError || !inquiry) {
    return { error: 'Inquiry not found', status: 404 as const }
  }

  const { data: listing, error: listingError } = await supabase
    .from('listings')
    .select('id, owner_id, monthly_price, deposit_amount, currency, country_code, country, city_slug, city_name, featured')
    .eq('id', inquiry.listing_id)
    .single()

  if (listingError || !listing) {
    return { error: 'Listing not found', status: 404 as const }
  }

  if (String(listing.owner_id) !== String(userId)) {
    return { error: 'Only the host can request booking from this inquiry', status: 403 as const }
  }

  const existingBooking = await supabase
    .from('bookings')
    .select('id, status')
    .eq('property_id', listing.id)
    .eq('guest_email', inquiry.email || '')
    .eq('check_in', `${inquiry.start_date}T12:00:00`)
    .maybeSingle()

  if (existingBooking.data?.id) {
    return {
      bookingId: existingBooking.data.id,
      statusValue: existingBooking.data.status,
      alreadyExists: true,
      status: 200 as const,
    }
  }

  const monthsDuration = Math.min(12, Math.max(1, Number(inquiry.duration_months) || 1))
  const startDate = new Date(`${inquiry.start_date}T12:00:00`)
  const endDate = new Date(startDate)
  endDate.setMonth(endDate.getMonth() + monthsDuration)

  const monthlyPrice = Math.round(Number(listing.monthly_price || 0) * 100)
  const depositAmount = Math.round(Number(listing.deposit_amount || listing.monthly_price || 0) * 100)

  const { calculateDurationFees } = await import('@/lib/pricing/duration-fees')
  const fees = calculateDurationFees(monthsDuration)
  const guestFee = fees.guestFee
  const hostFee = listing.featured ? fees.hostFeaturedFee : fees.hostFee

  const bookingCurrency = normalizeCurrency(
    listing.currency || getCurrencyFromLocation(listing.country_code || listing.country, listing.city_slug || listing.city_name)
  )

  const totalFirstPayment = monthlyPrice + depositAmount + guestFee
  const parsedSource = parseInquirySource(inquiry.source)

  const { data: booking, error: bookingError } = await supabase
    .from('bookings')
    .insert({
      property_id: listing.id,
      host_id: listing.owner_id,
      guest_id: null,
      check_in: `${inquiry.start_date}T12:00:00`,
      check_out: endDate.toISOString(),
      months_duration: monthsDuration,
      monthly_price: monthlyPrice,
      deposit_amount: depositAmount,
      guest_fee: guestFee,
      host_fee: hostFee,
      total_first_payment: totalFirstPayment,
      currency: bookingCurrency,
      status: 'pending_guest_payment',
      flow_state: 'payment_pending',
      guest_message: parsedSource.message,
      guest_email: inquiry.email || null,
      host_response: 'Booking request initiated from inquiry thread',
      featured_used: Boolean(listing.featured),
      expires_at: new Date(Date.now() + 72 * 60 * 60 * 1000).toISOString(),
    })
    .select('id, status')
    .single()

  if (bookingError || !booking) {
    console.error('[inquiries/request-booking] bookingError:', bookingError)
    return { error: 'Failed to create booking request', status: 500 as const }
  }

  try {
    await supabase
      .from('availability_leads')
      .update({
        booking_id: booking.id,
        conversation_status: 'booking_requested',
        intent_score: 80,
        last_interaction_at: new Date().toISOString(),
      })
      .eq('id', inquiry.id)

    const { data: conversation } = await supabase
      .from('conversations')
      .select('id')
      .eq('inquiry_id', inquiry.id)
      .maybeSingle()

    let conversationId = conversation?.id || null

    if (!conversationId) {
      const { data: createdConversation } = await supabase
        .from('conversations')
        .insert({
          listing_id: listing.id,
          inquiry_id: inquiry.id,
          booking_id: booking.id,
          host_id: String(listing.owner_id),
          guest_email: inquiry.email || null,
          status: 'booking_requested',
          intent_score: 80,
          message_count: 1,
          last_message_at: new Date().toISOString(),
          metadata: {
            seededFrom: 'request_booking',
          },
        })
        .select('id')
        .single()

      conversationId = createdConversation?.id || null
    } else {
      await supabase
        .from('conversations')
        .update({
          booking_id: booking.id,
          status: 'booking_requested',
          intent_score: 80,
          last_message_at: new Date().toISOString(),
        })
        .eq('id', conversationId)
    }

    await supabase
      .from('booking_requests')
      .insert({
        conversation_id: conversationId,
        inquiry_id: inquiry.id,
        booking_id: booking.id,
        listing_id: listing.id,
        host_id: String(listing.owner_id),
        guest_id: null,
        guest_email: inquiry.email || null,
        check_in: inquiry.start_date,
        months_duration: monthsDuration,
        guests_count: parsedSource.numberOfGuests,
        guest_message: parsedSource.message,
        status: 'booking_pending_host',
      })

    await supabase.from('booking_flow_events').insert([
      {
        inquiry_id: inquiry.id,
        booking_id: booking.id,
        event_name: 'booking_requested',
        actor_role: 'host',
        actor_id: userId,
        metadata: {
          monthsDuration,
          numberOfGuests: parsedSource.numberOfGuests,
          conversationId,
        },
      },
      {
        inquiry_id: inquiry.id,
        booking_id: booking.id,
        event_name: 'payment_pending',
        actor_role: 'system',
        actor_id: null,
        metadata: {
          reason: 'booking_request_created_from_inquiry',
          conversationId,
        },
      },
    ])
  } catch (transitionError) {
    console.error('[inquiries/request-booking] transition logging error:', transitionError)
  }

  return {
    bookingId: booking.id,
    statusValue: booking.status,
    monthsDuration,
    numberOfGuests: parsedSource.numberOfGuests,
    alreadyExists: false,
    status: 200 as const,
  }
}

export async function POST(req: NextRequest, { params }: Ctx) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const result = await createBookingFromInquiry(userId, id)

    if ('error' in result) {
      return NextResponse.json({ error: result.error }, { status: result.status })
    }

    return NextResponse.json({
      success: true,
      bookingId: result.bookingId,
      status: result.statusValue,
      monthsDuration: result.monthsDuration,
      numberOfGuests: result.numberOfGuests,
      alreadyExists: result.alreadyExists,
    })
  } catch (error: any) {
    console.error('[inquiries/request-booking] error:', error)
    return NextResponse.json({ error: error?.message || 'Internal server error' }, { status: 500 })
  }
}

export async function GET(req: NextRequest, { params }: Ctx) {
  const locale = req.nextUrl.searchParams.get('locale') || 'en'

  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.redirect(new URL(`/${locale}/sign-in`, req.url))
    }

    const { id } = await params
    const result = await createBookingFromInquiry(userId, id)

    if ('error' in result) {
      return NextResponse.redirect(new URL(`/${locale}/dashboard/inquiries/${id}?error=request_booking`, req.url))
    }

    return NextResponse.redirect(new URL(`/${locale}/host/bookings/${result.bookingId}?fromInquiry=1`, req.url))
  } catch (error) {
    console.error('[inquiries/request-booking][GET] error:', error)
    const { id } = await params
    return NextResponse.redirect(new URL(`/${locale}/dashboard/inquiries/${id}?error=request_booking`, req.url))
  }
}
