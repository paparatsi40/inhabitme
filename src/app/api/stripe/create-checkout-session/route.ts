import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-04-10',
})

export async function POST(req: NextRequest) {
  const { leadId, scoreLabel } = await req.json()

  if (!leadId || !scoreLabel) {
    return NextResponse.json(
      { error: 'Missing leadId or scoreLabel' },
      { status: 400 }
    )
  }

  const priceId =
    scoreLabel === 'HOT'
      ? process.env.STRIPE_PRICE_HOT
      : process.env.STRIPE_PRICE_WARM

  if (!priceId) {
    return NextResponse.json(
      { error: 'Stripe price not configured' },
      { status: 500 }
    )
  }

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    payment_method_types: ['card'],
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/host/dashboard?paid=1`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/host/dashboard`,
    metadata: {
      lead_id: leadId,
    },
  })

  return NextResponse.json({ url: session.url })
}
