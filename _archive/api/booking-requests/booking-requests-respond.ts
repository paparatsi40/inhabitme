import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { getSupabaseServerClient } from '@/lib/supabase/server'

type Ctx = { params: Promise<{ id: string }> }

export async function POST(req: NextRequest, { params }: Ctx) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const action = String(body?.action || '').trim().toLowerCase()
    const message = String(body?.message || '').trim() || null

    if (!['accept', 'decline', 'changes'].includes(action)) {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }

    const { id } = await params
    const supabase = getSupabaseServerClient()

    const { data: bookingRequest, error } = await supabase
      .from('booking_requests')
      .select('id, conversation_id, inquiry_id, booking_id, host_id, status')
      .eq('id', id)
      .single()

    if (error || !bookingRequest) {
      return NextResponse.json({ error: 'Booking request not found' }, { status: 404 })
    }

    if (String(bookingRequest.host_id) !== String(userId)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const nextStatus = action === 'accept' ? 'accepted' : action === 'decline' ? 'declined' : 'changes_requested'

    const { error: updateError } = await supabase
      .from('booking_requests')
      .update({
        status: nextStatus,
        host_response: message,
        responded_at: new Date().toISOString(),
      })
      .eq('id', bookingRequest.id)

    if (updateError) {
      console.error('[booking-requests/respond] update error:', updateError)
      return NextResponse.json({ error: 'Failed to update booking request' }, { status: 500 })
    }

    const nextConversationStatus =
      action === 'accept' ? 'payment_pending' : action === 'decline' ? 'declined' : 'booking_pending_host'

    await supabase
      .from('conversations')
      .update({
        status: nextConversationStatus,
        last_message_at: new Date().toISOString(),
      })
      .eq('id', bookingRequest.conversation_id)

    if (bookingRequest.inquiry_id) {
      await supabase
        .from('availability_leads')
        .update({
          conversation_status: nextConversationStatus,
          last_interaction_at: new Date().toISOString(),
        })
        .eq('id', bookingRequest.inquiry_id)
    }

    const eventName = action === 'accept'
      ? 'booking_accepted'
      : action === 'decline'
        ? 'booking_declined'
        : 'booking_changes_requested'

    await supabase.from('booking_flow_events').insert({
      inquiry_id: bookingRequest.inquiry_id || null,
      booking_id: bookingRequest.booking_id || null,
      event_name: eventName,
      actor_role: 'host',
      actor_id: userId,
      metadata: {
        bookingRequestId: bookingRequest.id,
        note: message,
      },
    })

    return NextResponse.json({
      success: true,
      bookingRequestId: bookingRequest.id,
      status: nextStatus,
      conversationStatus: nextConversationStatus,
    })
  } catch (error: any) {
    console.error('[booking-requests/respond] error:', error)
    return NextResponse.json({ error: error?.message || 'Internal server error' }, { status: 500 })
  }
}
