import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { getSupabaseServerClient } from '@/lib/supabase/server'

type CreateBookingRequestBody = {
  conversationId?: string
  inquiryId?: string
  checkIn?: string
  monthsDuration?: number
  guestsCount?: number
  guestMessage?: string
}

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = (await req.json()) as CreateBookingRequestBody
    const conversationId = String(body?.conversationId || '').trim()
    const inquiryId = String(body?.inquiryId || '').trim()

    if (!conversationId && !inquiryId) {
      return NextResponse.json({ error: 'conversationId or inquiryId is required' }, { status: 400 })
    }

    const supabase = getSupabaseServerClient()

    let conversation: any = null

    if (conversationId) {
      const { data } = await supabase
        .from('conversations')
        .select('id, inquiry_id, listing_id, host_id, guest_id, guest_email, status')
        .eq('id', conversationId)
        .single()
      conversation = data
    } else {
      const { data } = await supabase
        .from('conversations')
        .select('id, inquiry_id, listing_id, host_id, guest_id, guest_email, status')
        .eq('inquiry_id', inquiryId)
        .single()
      conversation = data
    }

    if (!conversation) {
      return NextResponse.json({ error: 'Conversation not found' }, { status: 404 })
    }

    if (String(conversation.guest_id || '') !== String(userId) && String(conversation.host_id || '') !== String(userId)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const actorRole = String(conversation.host_id) === String(userId) ? 'host' : 'guest'
    if (actorRole !== 'guest') {
      return NextResponse.json({ error: 'Only guest can request booking from conversation' }, { status: 403 })
    }

    const startDate = String(body?.checkIn || '').trim()
    const requestedMonths = Math.min(12, Math.max(1, Number(body?.monthsDuration) || 1))
    const guestsCount = Math.min(8, Math.max(1, Number(body?.guestsCount) || 1))
    const guestMessage = String(body?.guestMessage || '').trim() || null

    const { data: existingRequest } = await supabase
      .from('booking_requests')
      .select('id, status')
      .eq('conversation_id', conversation.id)
      .in('status', ['booking_requested', 'booking_pending_host', 'changes_requested'])
      .maybeSingle()

    if (existingRequest?.id) {
      return NextResponse.json({
        success: true,
        bookingRequestId: existingRequest.id,
        status: existingRequest.status,
        alreadyExists: true,
      })
    }

    const { data: inserted, error: insertError } = await supabase
      .from('booking_requests')
      .insert({
        conversation_id: conversation.id,
        inquiry_id: conversation.inquiry_id || null,
        listing_id: conversation.listing_id,
        host_id: conversation.host_id,
        guest_id: conversation.guest_id || userId,
        guest_email: conversation.guest_email || null,
        check_in: startDate || null,
        months_duration: requestedMonths,
        guests_count: guestsCount,
        guest_message: guestMessage,
        status: 'booking_pending_host',
      })
      .select('id, status')
      .single()

    if (insertError || !inserted) {
      console.error('[booking-requests.POST] insert error:', insertError)
      return NextResponse.json({ error: 'Failed to create booking request' }, { status: 500 })
    }

    await supabase
      .from('conversations')
      .update({
        status: 'booking_requested',
        intent_score: 85,
        last_message_at: new Date().toISOString(),
      })
      .eq('id', conversation.id)

    if (conversation.inquiry_id) {
      await supabase
        .from('availability_leads')
        .update({
          conversation_status: 'booking_requested',
          intent_score: 85,
          last_interaction_at: new Date().toISOString(),
        })
        .eq('id', conversation.inquiry_id)
    }

    await supabase.from('booking_flow_events').insert({
      inquiry_id: conversation.inquiry_id || null,
      event_name: 'booking_requested',
      actor_role: 'guest',
      actor_id: userId,
      metadata: {
        conversationId: conversation.id,
        bookingRequestId: inserted.id,
        monthsDuration: requestedMonths,
        guestsCount,
      },
    })

    return NextResponse.json({
      success: true,
      bookingRequestId: inserted.id,
      status: inserted.status,
      alreadyExists: false,
    })
  } catch (error: any) {
    console.error('[booking-requests.POST] error:', error)
    return NextResponse.json({ error: error?.message || 'Internal server error' }, { status: 500 })
  }
}
