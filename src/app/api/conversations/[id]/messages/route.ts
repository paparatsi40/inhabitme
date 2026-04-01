import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { getSupabaseServerClient } from '@/lib/supabase/server'
import { computeIntentScore } from '@/lib/conversations/status'

type Ctx = { params: Promise<{ id: string }> }

async function getConversationForUser(conversationId: string, userId: string) {
  const supabase = getSupabaseServerClient()
  const { data: conversation, error } = await supabase
    .from('conversations')
    .select('id, inquiry_id, host_id, guest_id, status, message_count, intent_score')
    .eq('id', conversationId)
    .single()

  if (error || !conversation) return { error: 'Conversation not found', status: 404 as const }

  if (String(conversation.host_id) !== String(userId) && String(conversation.guest_id || '') !== String(userId)) {
    return { error: 'Unauthorized', status: 403 as const }
  }

  return { conversation, supabase }
}

export async function GET(_: NextRequest, { params }: Ctx) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const access = await getConversationForUser(id, userId)

    if ('error' in access) {
      return NextResponse.json({ error: access.error }, { status: access.status })
    }

    const { data: messages, error } = await access.supabase
      .from('messages')
      .select('id, conversation_id, sender_role, sender_id, sender_email, body, message_type, created_at')
      .eq('conversation_id', id)
      .order('created_at', { ascending: true })

    if (error) {
      console.error('[conversations/messages.GET] error:', error)
      return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 })
    }

    return NextResponse.json({ success: true, messages: messages || [] })
  } catch (error: any) {
    console.error('[conversations/messages.GET] error:', error)
    return NextResponse.json({ error: error?.message || 'Internal server error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest, { params }: Ctx) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const messageBody = String(body?.body || '').trim()

    if (messageBody.length < 2) {
      return NextResponse.json({ error: 'Message too short' }, { status: 400 })
    }

    const { id } = await params
    const access = await getConversationForUser(id, userId)

    if ('error' in access) {
      return NextResponse.json({ error: access.error }, { status: access.status })
    }

    const senderRole = String(access.conversation.host_id) === String(userId) ? 'host' : 'guest'

    const { data: inserted, error: insertError } = await access.supabase
      .from('messages')
      .insert({
        conversation_id: id,
        sender_role: senderRole,
        sender_id: userId,
        body: messageBody,
        message_type: 'text',
      })
      .select('id, conversation_id, sender_role, sender_id, body, message_type, created_at')
      .single()

    if (insertError || !inserted) {
      console.error('[conversations/messages.POST] insert error:', insertError)
      return NextResponse.json({ error: 'Failed to send message' }, { status: 500 })
    }

    const { data: allMessages } = await access.supabase
      .from('messages')
      .select('sender_role')
      .eq('conversation_id', id)

    const messageCount = allMessages?.length || access.conversation.message_count || 1
    const roles = new Set((allMessages || []).map((m: any) => String(m.sender_role || '')))
    const isBidirectional = roles.has('host') && roles.has('guest')
    const nextStatus = isBidirectional ? 'conversation_active' : 'awaiting_host_reply'
    const nextIntent = computeIntentScore(messageCount, isBidirectional, access.conversation.status)

    await access.supabase
      .from('conversations')
      .update({
        status: nextStatus,
        message_count: messageCount,
        intent_score: nextIntent,
        last_message_at: new Date().toISOString(),
      })
      .eq('id', id)

    if (access.conversation.inquiry_id) {
      await access.supabase
        .from('availability_leads')
        .update({
          conversation_status: nextStatus,
          message_count: messageCount,
          intent_score: nextIntent,
          last_interaction_at: new Date().toISOString(),
        })
        .eq('id', access.conversation.inquiry_id)
    }

    await access.supabase.from('booking_flow_events').insert({
      inquiry_id: access.conversation.inquiry_id,
      event_name: 'message_sent',
      actor_role: senderRole,
      actor_id: userId,
      metadata: {
        conversationId: id,
        messageCount,
        isBidirectional,
        nextStatus,
        intentScore: nextIntent,
      },
    })

    return NextResponse.json({
      success: true,
      message: inserted,
      conversation: {
        id,
        status: nextStatus,
        intentScore: nextIntent,
        messageCount,
      },
    })
  } catch (error: any) {
    console.error('[conversations/messages.POST] error:', error)
    return NextResponse.json({ error: error?.message || 'Internal server error' }, { status: 500 })
  }
}
