import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { getLeadPriceInCents, getLeadPrice } from '@/lib/pricing/lead-pricing'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-12-15.clover',
})

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { propertyId, propertyTitle, propertyCity } = body

    if (!propertyId) {
      return NextResponse.json(
        { error: 'Property ID is required' },
        { status: 400 }
      )
    }

    // Precio dinámico por ciudad
    const priceInCents = getLeadPriceInCents(propertyCity || 'Madrid')
    const pricing = getLeadPrice(propertyCity || 'Madrid')

    console.log('[Lead Checkout] Creating checkout session for property:', propertyId)
    console.log('[Lead Checkout] Dynamic pricing:', propertyCity, '→', `€${pricing.amount}`, `(${pricing.tier})`)

    // Crear Stripe Checkout Session con precio dinámico
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: 'Contacto con Anfitrión',
              description: `Desbloquea el contacto para: ${propertyTitle || 'Propiedad'} en ${propertyCity || ''}`,
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
