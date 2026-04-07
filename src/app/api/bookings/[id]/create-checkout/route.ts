/**
 * Guest Checkout — InhabitMe
 *
 * Crea una sesión de Stripe Checkout para que el GUEST pague la tarifa
 * de conexión de InhabitMe. Solo un line item: el fee según duración.
 *
 * Fuente de verdad de precios: src/lib/pricing/duration-fees.ts
 *
 * Flujo:
 *  Host aprueba booking → ambos reciben notificación de pago
 *  Guest paga aquí → webhook actualiza guest_payment_status = 'paid'
 *  Si host ya pagó → booking pasa a 'confirmed' y se liberan contactos
 *  Si host no ha pagado → booking queda en estado intermedio hasta que host pague
 */

import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { createClient } from '@supabase/supabase-js'
import Stripe from 'stripe'
import { calculateDurationFees, getTierName, type SupportedCurrency } from '@/lib/pricing/duration-fees'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-02-25.clover',
})

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Cualquier estado post-aprobación permite pagar (host y guest pueden pagar en cualquier orden)
const PAYABLE_STATUSES = ['approved', 'pending_guest_payment', 'pending_host_payment']

type Ctx = { params: Promise<{ id: string }> }

export async function POST(request: NextRequest, { params }: Ctx) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id: bookingId } = await params
    if (!bookingId) {
      return NextResponse.json({ error: 'Booking ID requerido' }, { status: 400 })
    }

    // Obtener booking con datos de la propiedad
    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .select('*, listings(title, city)')
      .eq('id', bookingId)
      .single()

    if (bookingError || !booking) {
      return NextResponse.json({ error: 'Booking no encontrado' }, { status: 404 })
    }

    // Verificar que el usuario es el guest
    if (booking.guest_id !== userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    // Verificar que el booking está en un estado que permite pago
    if (!PAYABLE_STATUSES.includes(booking.status)) {
      return NextResponse.json(
        { error: `Booking no disponible para pago. Estado actual: ${booking.status}` },
        { status: 400 }
      )
    }

    // No cobrar dos veces
    if (booking.guest_payment_status === 'paid') {
      return NextResponse.json({ error: 'Ya completaste el pago' }, { status: 400 })
    }

    // Moneda: el guest puede elegir EUR o USD en el UI.
    // Si no se envía en el body, se usa la moneda del booking (detectada por ubicación).
    const body = await request.json().catch(() => ({}))
    const rawCurrency = (body.currency ?? booking.currency ?? 'eur').toLowerCase()
    const currency: SupportedCurrency = rawCurrency === 'usd' ? 'usd' : 'eur'

    // Calcular fee — fuente única de verdad: duration-fees.ts
    const months = booking.months_duration ?? 2
    const fees = calculateDurationFees(months, currency)
    const guestFeeAmount = fees.guestFee  // siempre desde duration-fees, no de la DB

    const tierName = getTierName(months)
    const durationLabel = months === 1 ? '1 mes' : `${months} meses`
    const propertyTitle = booking.listings?.title ?? 'tu propiedad'
    const currencySymbol = currency === 'usd' ? '$' : '€'

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      customer_email: booking.guest_email,
      line_items: [
        {
          price_data: {
            currency,
            product_data: {
              name: `InhabitMe — Conexión confirmada · ${durationLabel}`,
              description: `Acceso a los datos de contacto de tu host en "${propertyTitle}". Pago único ${currencySymbol}${guestFeeAmount / 100}. Sin comisiones adicionales sobre la renta.`,
            },
            unit_amount: guestFeeAmount,
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/en/bookings/${bookingId}/payment-success`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/en/bookings/${bookingId}`,
      metadata: {
        booking_id: bookingId,
        guest_id: userId,
        payment_type: 'guest',
        months_duration: String(months),
        tier: tierName,
        fee_cents: String(guestFeeAmount),
        currency,
      },
    })

    return NextResponse.json({ sessionId: session.id, url: session.url })
  } catch (error: any) {
    console.error('❌ Guest checkout error:', error?.message)
    return NextResponse.json(
      { error: 'Error al crear el checkout', details: error?.message },
      { status: 500 }
    )
  }
}
