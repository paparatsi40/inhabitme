import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { getSupabaseServerClient } from '@/lib/supabase/server'
import { sendUnlockedLeadEmail } from '@/lib/email/sendUnlockedLeadEmail'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-02-25.clover',
})

export async function POST(req: NextRequest) {
  const sig = req.headers.get('stripe-signature')

  if (!sig) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 })
  }

  const body = await req.text()

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    const leadId = session.client_reference_id

    if (!leadId) {
      return NextResponse.json({ received: true })
    }

    const supabase = getSupabaseServerClient()

    const { data: lead } = await supabase
      .from('availability_leads')
      .update({
        paid: true,
        stripe_session_id: session.id,
        contact_visible: true,
        contact_unlocked_at: new Date().toISOString(),
      })
      .eq('id', leadId)
      .select()
      .single()

    if (!lead) {
      await supabase
        .from('availability_leads')
        .update({
          paid: true,
          stripe_session_id: session.id,
          contact_visible: true,
          contact_unlocked_at: new Date().toISOString(),
        })
        .eq('stripe_session_id', session.id)
    }

    if (lead) {
      try {
        const { data: conversation } = await supabase
          .from('conversations')
          .select('id, booking_id')
          .eq('inquiry_id', lead.id)
          .maybeSingle()

        await supabase.from('payment_transactions')
          .update({
            status: 'paid',
            stripe_payment_intent_id: typeof session.payment_intent === 'string' ? session.payment_intent : null,
          })
          .eq('stripe_session_id', session.id)

        await supabase.from('booking_flow_events').insert({
          inquiry_id: lead.id,
          booking_id: conversation?.booking_id || null,
          event_name: 'payment_completed',
          actor_role: 'host',
          actor_id: null,
          metadata: {
            source: 'stripe_webhook',
            sessionId: session.id,
            paymentIntent: typeof session.payment_intent === 'string' ? session.payment_intent : null,
            conversationId: conversation?.id || null,
          },
        })

        if (conversation?.id) {
          await supabase
            .from('conversations')
            .update({
              status: 'confirmed',
              intent_score: 100,
              last_message_at: new Date().toISOString(),
            })
            .eq('id', conversation.id)
        }
      } catch (paymentSyncError) {
        console.error('[stripe/webhook] payment sync error:', paymentSyncError)
      }

      await sendUnlockedLeadEmail({
        hostEmail: lead.host_email,
        guestEmail: lead.email,
        city: lead.city,
        neighborhood: lead.neighborhood,
        startDate: lead.start_date,
      })
    }
  }

  return NextResponse.json({ received: true })
}
