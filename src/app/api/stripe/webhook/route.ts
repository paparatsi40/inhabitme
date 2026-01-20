import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { getSupabaseServerClient } from '@/lib/supabase/server'
import { sendUnlockedLeadEmail } from '@/lib/email/sendUnlockedLeadEmail'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-12-15.clover',
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
      })
      .eq('id', leadId)
      .select()
      .single()

    if (lead) {
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
