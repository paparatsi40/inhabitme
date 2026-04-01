import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { getSupabaseServerClient } from '@/lib/supabase/server'
import { scoreLead } from '@/lib/leads/scoreLead'
import { getHostInfo } from '@/lib/clerk/getHostInfo'
import { sendHostInquiryNotification } from '@/lib/email/send-host-inquiry-notification'

const toIsoDate = (value: string) => {
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return null
  return d.toISOString().split('T')[0]
}

function getDefaultStartDate() {
  const now = new Date()
  now.setDate(now.getDate() + 14)
  return now.toISOString().split('T')[0]
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    const listingId = String(body?.listingId || '').trim()
    const moveInDateRaw = String(body?.moveInDate || '').trim()
    const durationMonthsRaw = Number(body?.durationMonths)
    const message = String(body?.message || '').trim()
    const numberOfGuests = Math.min(8, Math.max(1, Number(body?.numberOfGuests) || 1))
    const guestEmailFromBody = String(body?.guestEmail || '').trim().toLowerCase()

    if (!listingId) {
      return NextResponse.json({ error: 'listingId is required' }, { status: 400 })
    }

    if (!durationMonthsRaw || durationMonthsRaw < 1 || durationMonthsRaw > 12) {
      return NextResponse.json({ error: 'Duration must be between 1 and 12 months' }, { status: 400 })
    }

    if (message.length < 8) {
      return NextResponse.json({ error: 'Please write a longer message (min 8 characters)' }, { status: 400 })
    }

    const { userId } = await auth()
    const supabase = getSupabaseServerClient()

    const { data: listing, error: listingError } = await supabase
      .from('listings')
      .select('id, city_name, neighborhood, owner_id, title, status')
      .eq('id', listingId)
      .single()

    if (listingError || !listing) {
      return NextResponse.json({ error: 'Listing not found' }, { status: 404 })
    }

    if (listing.status !== 'active') {
      return NextResponse.json({ error: 'Listing is not available' }, { status: 400 })
    }

    if (userId && String(listing.owner_id) === String(userId)) {
      return NextResponse.json({ error: 'You cannot send an inquiry to your own listing' }, { status: 400 })
    }

    const startDate = toIsoDate(moveInDateRaw) || getDefaultStartDate()

    const { score, label } = scoreLead({
      city: listing.city_name || '',
      neighborhood: listing.neighborhood || undefined,
      startDate,
      email: guestEmailFromBody || 'guest@inhabitme.local',
    })

    const { data: inserted, error: insertError } = await supabase
      .from('availability_leads')
      .insert({
        listing_id: listing.id,
        city: listing.city_name,
        neighborhood: listing.neighborhood || null,
        start_date: startDate,
        duration_months: durationMonthsRaw,
        email: guestEmailFromBody || null,
        source: `inquiry_form:guests=${numberOfGuests};message=${message}`,
        relocating: false,
        score,
        score_label: label,
        conversation_status: 'inquiry_sent',
        intent_score: 20,
        message_count: 1,
        last_interaction_at: new Date().toISOString(),
      })
      .select('id')
      .single()

    if (insertError) {
      console.error('[inquiries.POST] insert error:', insertError)
      return NextResponse.json({ error: 'Failed to create inquiry' }, { status: 500 })
    }

    let conversationId: string | null = null

    try {
      const { data: conversation, error: conversationError } = await supabase
        .from('conversations')
        .insert({
          listing_id: listing.id,
          inquiry_id: inserted.id,
          host_id: String(listing.owner_id),
          guest_id: userId || null,
          guest_email: guestEmailFromBody || null,
          status: 'inquiry_sent',
          intent_score: 20,
          message_count: 1,
          last_message_at: new Date().toISOString(),
          metadata: {
            moveInDate: startDate,
            durationMonths: durationMonthsRaw,
            numberOfGuests,
          },
        })
        .select('id')
        .single()

      if (conversationError) {
        console.error('[inquiries.POST] conversation insert failed:', conversationError)
      } else {
        conversationId = conversation.id

        const { error: messageError } = await supabase.from('messages').insert({
          conversation_id: conversation.id,
          sender_role: userId ? 'guest' : 'anonymous_guest',
          sender_id: userId || null,
          sender_email: guestEmailFromBody || null,
          body: message,
          message_type: 'inquiry',
        })

        if (messageError) {
          console.error('[inquiries.POST] first message insert failed:', messageError)
        }
      }
    } catch (conversationError) {
      console.error('[inquiries.POST] conversation bootstrap failed:', conversationError)
    }

    try {
      await supabase.from('booking_flow_events').insert({
        inquiry_id: inserted.id,
        event_name: 'send_inquiry',
        actor_role: userId ? 'guest' : 'anonymous_guest',
        actor_id: userId || null,
        metadata: {
          listingId: listing.id,
          durationMonths: durationMonthsRaw,
          numberOfGuests,
          score,
          scoreLabel: label,
          conversationId,
        },
      })
    } catch (eventError) {
      console.error('[inquiries.POST] booking_flow_events insert failed:', eventError)
    }

    try {
      const hostInfo = await getHostInfo(String(listing.owner_id))
      if (hostInfo?.email) {
        await sendHostInquiryNotification({
          hostEmail: hostInfo.email,
          hostName: hostInfo.name,
          listingTitle: listing.title || 'Listing',
          listingId: listing.id,
          city: listing.city_name || '',
          moveInDate: startDate,
          durationMonths: durationMonthsRaw,
          guestEmail: guestEmailFromBody || undefined,
          guestMessage: message,
          inquiryId: inserted.id,
        })
      }
    } catch (emailError) {
      console.error('[inquiries.POST] host email notify failed:', emailError)
    }

    return NextResponse.json({
      success: true,
      inquiryId: inserted.id,
      conversationId,
      conversationStatus: 'inquiry_sent',
    })
  } catch (error: any) {
    console.error('[inquiries.POST] error:', error)
    return NextResponse.json({ error: error?.message || 'Internal server error' }, { status: 500 })
  }
}
