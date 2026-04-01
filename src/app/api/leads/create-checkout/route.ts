import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { getLeadPriceInCents, getLeadPrice } from '@/lib/pricing/lead-pricing'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-02-25.clover',
})

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { propertyId, propertyTitle, propertyCity, durationMonths } = body

    if (!propertyId) {
      return NextResponse.json(
        { error: 'Property ID is required' },
        { status: 400 }
      )
    }

    // Booking intent pricing by duration (1-3 / 4-6 / 7-12)
    const parsedDuration = Number(durationMonths || 3)
    const priceInCents = getLeadPriceInCents(parsedDuration)
    const pricing = getLeadPrice(parsedDuration)

    console.log('[Lead Checkout] Creating checkout session for property:', propertyId)
    console.log('[Lead Checkout] Booking intent pricing:', `${parsedDuration} months`, '→', `€${pricing.amount}`, `(${pricing.tier})`)

    // Crear Stripe Checkout Session con precio dinámico
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: 'Continue booking',
              description: `Booking intent fee (${parsedDuration} months) for ${propertyTitle || 'property'}`,
              images: ['https://inhabitme.com/og-image.jpg'], // TODO: Añadir imagen real
            },
            unit_amount: priceInCents, // Precio dinámico por ciudad
          },
          quantity: 1,
        },
      ],
      success_url: `${BASE_URL}/leads/success?session_id={CHECKOUT_SESSION_ID}&property_id=${propertyId}`,
      cancel_url: `${BASE_URL}/properties/${propertyId}?canceled=true`,
      metadata: {
        propertyId,
        propertyTitle: propertyTitle || '',
        propertyCity: propertyCity || '',
        type: 'host_contact_lead',
      },
      // Campos opcionales del cliente (para capturar email)
      customer_email: undefined, // Stripe pedirá email automáticamente
      payment_method_types: ['card'],
    })

    console.log('[Lead Checkout] Session created:', session.id)

    return NextResponse.json({
      url: session.url,
      sessionId: session.id,
    })
  } catch (error: any) {
    console.error('[Lead Checkout] Error:', error)
    return NextResponse.json(
      { error: error.message || 'Error creating checkout session' },
      { status: 500 }
    )
  }
}
