import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { auth } from '@clerk/nextjs/server'
import { getSupabaseServerClient } from '@/lib/supabase/server'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-02-25.clover' as any,
})

// Precio por calidad del lead (en céntimos)
const LEAD_PRICES: Record<'HOT' | 'WARM', number> = {
  HOT: 2500,  // €25
  WARM: 1000, // €10
}

const LEAD_DESCRIPTIONS: Record<'HOT' | 'WARM', string> = {
  HOT: 'High-intent lead — guest ready to move',
  WARM: 'Medium-intent lead — guest planning ahead',
}

export async function POST(req: NextRequest) {
  // 1. Solo hosts autenticados pueden desbloquear
  const { userId } = await auth()
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { leadId } = await req.json()
  if (!leadId || typeof leadId !== 'string') {
    return NextResponse.json({ error: 'Missing leadId' }, { status: 400 })
  }

  // 2. Verificar que el lead existe, no está pagado, y no es COLD
  const supabase = getSupabaseServerClient()
  const { data: lead, error } = await supabase
    .from('availability_leads')
    .select('id, city, neighborhood, start_date, score_label, paid, host_email')
    .eq('id', leadId)
    .single()

  if (error || !lead) {
    return NextResponse.json({ error: 'Lead not found' }, { status: 404 })
  }

  if (lead.paid) {
    return NextResponse.json({ error: 'Lead already unlocked' }, { status: 409 })
  }

  const label = lead.score_label as 'HOT' | 'WARM' | 'COLD'
  if (label === 'COLD') {
    return NextResponse.json({ error: 'COLD leads are free — contact support' }, { status: 400 })
  }

  const price = LEAD_PRICES[label]
  const description = LEAD_DESCRIPTIONS[label]
  const location = [lead.neighborhood, lead.city].filter(Boolean).join(' · ')

  // 3. Crear Stripe Checkout Session dinámica
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'
  const locale = 'en' // TODO: pasar locale desde el cliente si se necesita

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    mode: 'payment',
    line_items: [
      {
        price_data: {
          currency: 'eur',
          unit_amount: price,
          product_data: {
            name: `Unlock lead — ${location}`,
            description: `${description}. Move-in: ${lead.start_date}`,
          },
        },
        quantity: 1,
      },
    ],
    metadata: {
      lead_id: leadId,
      host_user_id: userId,
      host_email: lead.host_email ?? '',
    },
    success_url: `${baseUrl}/${locale}/host/dashboard?unlocked=${leadId}`,
    cancel_url: `${baseUrl}/${locale}/host/dashboard`,
  })

  return NextResponse.json({ url: session.url })
}
