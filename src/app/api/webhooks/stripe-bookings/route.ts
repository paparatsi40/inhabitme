/**
 * Stripe Webhook — InhabitMe (único punto de entrada)
 *
 * Maneja checkout.session.completed para guest y host.
 * Ambos pueden pagar en cualquier orden. Cuando los dos han pagado,
 * el booking pasa a 'confirmed' y se liberan los datos de contacto.
 *
 * Eventos manejados:
 *  - checkout.session.completed → payment_type: 'guest' | 'host'
 *  - checkout.session.expired   → logging futuro
 */

import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-02-25.clover',
})

const resend = new Resend(process.env.RESEND_API_KEY!)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = (await headers()).get('stripe-signature')!

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err: any) {
    console.error('❌ Webhook signature inválida:', err.message)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  console.log('🔔 Stripe webhook:', event.type)

  const supabase = createClient(supabaseUrl, supabaseKey)

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session

        const bookingId = session.metadata?.booking_id
        const paymentType = session.metadata?.payment_type // 'guest' | 'host'

        if (!bookingId || !paymentType) {
          console.error('❌ Metadata incompleto:', session.metadata)
          return NextResponse.json({ error: 'Missing metadata' }, { status: 400 })
        }

        // Obtener booking actualizado
        const { data: booking, error: bookingError } = await supabase
          .from('bookings')
          .select('*, listings(*)')
          .eq('id', bookingId)
          .single()

        if (bookingError || !booking) {
          console.error('❌ Booking no encontrado:', bookingId)
          return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
        }

        const paymentIntentId = typeof session.payment_intent === 'string'
          ? session.payment_intent
          : null

        const sessionLocale = session.metadata?.locale ?? 'en'
        const sessionCurrency = session.metadata?.currency ?? session.currency ?? 'eur'

        // ── Pago del GUEST ─────────────────────────────────────────────────
        if (paymentType === 'guest') {
          // Idempotency guard — ignorar evento duplicado de Stripe
          if (booking.guest_payment_status === 'paid') {
            console.log('⚠️ Evento duplicado ignorado — guest ya pagó:', bookingId)
            return NextResponse.json({ received: true })
          }

          console.log('💳 Guest payment completado para booking:', bookingId)

          await supabase.from('bookings').update({
            guest_payment_status: 'paid',
            guest_paid_at: new Date().toISOString(),
            guest_payment_intent_id: paymentIntentId,
            updated_at: new Date().toISOString(),
          }).eq('id', bookingId)

          // Registrar transacción
          await supabase.from('payment_transactions').insert({
            booking_id: bookingId,
            payer_role: 'guest',
            payer_id: booking.guest_id,
            amount_cents: Number(session.amount_total ?? 0),
            currency: sessionCurrency,
            payment_type: 'booking_guest_fee',
            status: 'paid',
            stripe_session_id: session.id,
            stripe_payment_intent_id: paymentIntentId,
            metadata: { source: 'stripe_webhook', tier: session.metadata?.tier },
          }).then(({ error }: { error: any }) => {
            if (error) console.error('⚠️ payment_transactions insert (guest):', error.message)
          })

          // Verificar si el host ya pagó → si es así, confirmar y liberar contactos
          const hostAlreadyPaid = booking.host_payment_status === 'paid' || booking.host_payment_status === 'waived'

          if (hostAlreadyPaid) {
            await confirmAndReleaseContacts(supabase, booking, session.id, 'guest')
          } else {
            // Host no ha pagado aún — actualizar estado y notificarle
            await supabase.from('bookings').update({
              status: 'pending_host_payment',
              flow_state: 'payment_pending',
              updated_at: new Date().toISOString(),
            }).eq('id', bookingId)

            console.log('⏳ Guest pagó. Esperando pago del host para liberar contactos.')
            await sendHostPaymentReminderEmail(booking, sessionLocale)
          }
        }

        // ── Pago del HOST ──────────────────────────────────────────────────
        else if (paymentType === 'host') {
          // Idempotency guard — ignorar evento duplicado de Stripe
          if (booking.host_payment_status === 'paid') {
            console.log('⚠️ Evento duplicado ignorado — host ya pagó:', bookingId)
            return NextResponse.json({ received: true })
          }

          console.log('💳 Host payment completado para booking:', bookingId)

          await supabase.from('bookings').update({
            host_payment_status: 'paid',
            host_paid_at: new Date().toISOString(),
            host_payment_intent_id: paymentIntentId,
            updated_at: new Date().toISOString(),
          }).eq('id', bookingId)

          // Registrar transacción
          await supabase.from('payment_transactions').insert({
            booking_id: bookingId,
            payer_role: 'host',
            payer_id: booking.host_id,
            amount_cents: Number(session.amount_total ?? 0),
            currency: sessionCurrency,
            payment_type: 'booking_host_fee',
            status: 'paid',
            stripe_session_id: session.id,
            stripe_payment_intent_id: paymentIntentId,
            metadata: { source: 'stripe_webhook', tier: session.metadata?.tier, featured: session.metadata?.featured },
          }).then(({ error }: { error: any }) => {
            if (error) console.error('⚠️ payment_transactions insert (host):', error.message)
          })

          // Verificar si el guest ya pagó → si es así, confirmar y liberar contactos
          const guestAlreadyPaid = booking.guest_payment_status === 'paid'

          if (guestAlreadyPaid) {
            await confirmAndReleaseContacts(supabase, booking, session.id, 'host')
          } else {
            // Guest no ha pagado aún — actualizar estado y notificarle
            await supabase.from('bookings').update({
              status: 'pending_guest_payment',
              flow_state: 'payment_pending',
              updated_at: new Date().toISOString(),
            }).eq('id', bookingId)

            console.log('⏳ Host pagó. Esperando pago del guest para liberar contactos.')
            await sendGuestPaymentReminderEmail(booking, sessionLocale)
          }
        }

        break
      }

      case 'checkout.session.expired': {
        const session = event.data.object as Stripe.Checkout.Session
        console.log('⏰ Checkout expirado:', session.id, '| booking:', session.metadata?.booking_id)
        // TODO: notificar al usuario que el enlace expiró y generar uno nuevo
        break
      }

      default:
        console.log(`ℹ️ Evento no manejado: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error: any) {
    console.error('❌ Webhook handler error:', error)
    return NextResponse.json(
      { error: 'Webhook handler failed', message: error.message },
      { status: 500 }
    )
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Confirmar booking y liberar datos de contacto a ambas partes
// ─────────────────────────────────────────────────────────────────────────────
async function confirmAndReleaseContacts(
  supabase: any,
  booking: any,
  sessionId: string,
  lastPayer: 'guest' | 'host'
) {
  console.log(`✅ Ambos pagaron. Confirmando booking ${booking.id} y liberando contactos.`)

  // Confirmar el booking
  await supabase.from('bookings').update({
    status: 'confirmed',
    flow_state: 'confirmed',
    updated_at: new Date().toISOString(),
  }).eq('id', booking.id)

  // Log del evento
  await supabase.from('booking_flow_events').insert([
    {
      booking_id: booking.id,
      event_name: 'payment_completed',
      actor_role: lastPayer,
      actor_id: lastPayer === 'guest' ? booking.guest_id : booking.host_id,
      metadata: { sessionId, lastPayer },
    },
    {
      booking_id: booking.id,
      event_name: 'booking_confirmed',
      actor_role: 'system',
      actor_id: null,
      metadata: { trigger: 'both_payments_received' },
    },
  ]).then(({ error }: { error: any }) => {
    if (error) console.error('⚠️ booking_flow_events insert:', error.message)
  })

  // Enviar datos de contacto a ambas partes
  await Promise.all([
    sendContactsEmail(supabase, booking, 'guest'),
    sendContactsEmail(supabase, booking, 'host'),
  ])
}

// ─────────────────────────────────────────────────────────────────────────────
// Email con datos de contacto (se envía cuando ambos han pagado)
// ─────────────────────────────────────────────────────────────────────────────
async function sendContactsEmail(
  supabase: any,
  booking: any,
  recipient: 'guest' | 'host'
) {
  try {
    const { data: guestUser } = await supabase
      .from('users').select('email, full_name, phone').eq('id', booking.guest_id).single()
    const { data: hostUser } = await supabase
      .from('users').select('email, full_name, phone').eq('id', booking.host_id).single()

    const recipientEmail = recipient === 'guest' ? booking.guest_email : hostUser?.email
    const otherName  = recipient === 'guest' ? (hostUser?.full_name  ?? 'tu host')    : (guestUser?.full_name  ?? 'tu huésped')
    const otherEmail = recipient === 'guest' ? (hostUser?.email      ?? 'N/A')        : (booking.guest_email  ?? 'N/A')
    const otherPhone = recipient === 'guest' ? (hostUser?.phone      ?? 'No registrado') : (guestUser?.phone ?? 'No registrado')

    if (!recipientEmail) {
      console.error(`❌ Sin email para ${recipient}`)
      return
    }

    const listingData = Array.isArray(booking.listings) ? booking.listings[0] : booking.listings
    const checkIn = booking.check_in
      ? new Date(booking.check_in).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })
      : 'Por confirmar'
    const months = booking.months_duration ?? '?'
    const durLabel = months === 1 ? '1 mes' : `${months} meses`
    const propertyTitle = listingData?.title ?? 'tu propiedad'
    const roleLabel = recipient === 'guest' ? 'host' : 'huésped'
    const nextStepsGuest = '1. Contacta al host para coordinar la llegada<br>2. Acuerda detalles de check-in y llaves<br>3. Confirma método de pago de renta y depósito directamente con el host'
    const nextStepsHost  = '1. El huésped te contactará pronto<br>2. Coordina detalles de llegada y entrega de llaves<br>3. Acuerda el método de pago de renta y depósito directamente'

    await resend.emails.send({
      from: process.env.EMAIL_FROM!,
      to: recipientEmail,
      subject: `✅ Reserva confirmada — Datos de contacto de tu ${roleLabel}`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
          <div style="background:#059669;padding:28px;text-align:center;border-radius:10px 10px 0 0;">
            <h1 style="color:#fff;margin:0;font-size:26px;">🎉 Reserva Confirmada</h1>
            <p style="color:#d1fae5;margin:8px 0 0;">Ambos pagos recibidos — contactos liberados</p>
          </div>
          <div style="background:#fff;padding:30px;border:1px solid #e5e7eb;border-top:none;border-radius:0 0 10px 10px;">
            <h2 style="color:#111827;font-size:20px;margin-top:0;">Datos de contacto de tu ${roleLabel}</h2>
            <div style="background:#059669;padding:20px;border-radius:8px;margin:20px 0;">
              <p style="color:#fff;margin:6px 0;"><strong>Nombre:</strong> ${otherName}</p>
              <p style="color:#fff;margin:6px 0;"><strong>Email:</strong> <a href="mailto:${otherEmail}" style="color:#d1fae5;">${otherEmail}</a></p>
              <p style="color:#fff;margin:6px 0;"><strong>Teléfono:</strong> ${otherPhone}</p>
            </div>
            <div style="background:#f3f4f6;padding:18px;border-radius:8px;margin:20px 0;">
              <p style="margin:6px 0;color:#374151;"><strong>Propiedad:</strong> ${propertyTitle}</p>
              <p style="margin:6px 0;color:#374151;"><strong>Check-in:</strong> ${checkIn}</p>
              <p style="margin:6px 0;color:#374151;"><strong>Duración:</strong> ${durLabel}</p>
            </div>
            <div style="background:#fef3c7;border-left:4px solid #f59e0b;padding:14px;border-radius:4px;margin:20px 0;">
              <p style="margin:0;color:#92400e;font-size:14px;">
                <strong>Próximos pasos:</strong><br>
                ${recipient === 'guest' ? nextStepsGuest : nextStepsHost}
              </p>
            </div>
            <p style="color:#6b7280;font-size:13px;margin-top:24px;padding-top:16px;border-top:1px solid #e5e7eb;">
              A partir de aquí InhabitMe no interviene. La renta, el depósito y todos los detalles los coordinan directamente entre ustedes. ¡Mucho éxito!
            </p>
            <p style="color:#9ca3af;font-size:12px;text-align:center;margin-top:20px;">
              Powered by <strong>InhabitMe</strong>
            </p>
          </div>
        </div>
      `,
    })

    console.log(`✅ Email de contactos enviado a ${recipient}: ${recipientEmail}`)
  } catch (err) {
    console.error(`❌ Error enviando email a ${recipient}:`, err)
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Recordatorio al host para que pague (guest pagó primero)
// ─────────────────────────────────────────────────────────────────────────────
async function sendHostPaymentReminderEmail(booking: any, locale = 'en') {
  try {
    const { data: hostUser } = await createClient(supabaseUrl, supabaseKey)
      .from('users').select('email, full_name').eq('id', booking.host_id).single()

    const hostEmail = hostUser?.email
    if (!hostEmail) return

    const listingDataH = Array.isArray(booking.listings) ? booking.listings[0] : booking.listings
    const propertyTitle = listingDataH?.title ?? 'tu propiedad'
    const months = booking.months_duration ?? '?'
    const durLabel = months === 1 ? '1 mes' : `${months} meses`
    const payUrl = `${process.env.NEXT_PUBLIC_APP_URL}/${locale}/host/dashboard`

    await resend.emails.send({
      from: process.env.EMAIL_FROM!,
      to: hostEmail,
      subject: `⏳ El huésped ya pagó — Completa tu pago para liberar contactos`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:30px;">
          <h2 style="color:#111827;">¡El huésped ya realizó su pago!</h2>
          <p style="color:#4b5563;">Tu huésped ha pagado la tarifa de conexión para <strong>${propertyTitle}</strong> (${durLabel}).</p>
          <p style="color:#4b5563;">En cuanto completes tu pago, ambos recibirán los datos de contacto del otro para coordinar directamente.</p>
          <div style="text-align:center;margin:30px 0;">
            <a href="${payUrl}"
               style="background:#2563eb;color:#fff;padding:14px 32px;border-radius:8px;text-decoration:none;font-weight:bold;font-size:15px;">
              Completar mi pago →
            </a>
          </div>
          <p style="color:#9ca3af;font-size:12px;text-align:center;">Powered by InhabitMe</p>
        </div>
      `,
    })
  } catch (err) {
    console.error('❌ Error enviando recordatorio al host:', err)
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Recordatorio al guest para que pague (host pagó primero)
// ─────────────────────────────────────────────────────────────────────────────
async function sendGuestPaymentReminderEmail(booking: any, locale = 'en') {
  try {
    const guestEmail = booking.guest_email
    if (!guestEmail) return

    const listingDataG = Array.isArray(booking.listings) ? booking.listings[0] : booking.listings
    const propertyTitle = listingDataG?.title ?? 'tu propiedad'
    const months = booking.months_duration ?? '?'
    const durLabel = months === 1 ? '1 mes' : `${months} meses`
    const payUrl = `${process.env.NEXT_PUBLIC_APP_URL}/${locale}/bookings/${booking.id}`

    await resend.emails.send({
      from: process.env.EMAIL_FROM!,
      to: guestEmail,
      subject: `⏳ El host ya pagó — Completa tu pago para obtener sus datos de contacto`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:30px;">
          <h2 style="color:#111827;">¡El host ya realizó su pago!</h2>
          <p style="color:#4b5563;">Tu host ha pagado la tarifa de conexión para <strong>${propertyTitle}</strong> (${durLabel}).</p>
          <p style="color:#4b5563;">En cuanto completes tu pago, ambos recibirán los datos de contacto del otro para coordinar directamente.</p>
          <div style="text-align:center;margin:30px 0;">
            <a href="${payUrl}"
               style="background:#7c3aed;color:#fff;padding:14px 32px;border-radius:8px;text-decoration:none;font-weight:bold;font-size:15px;">
              Completar mi pago →
            </a>
          </div>
          <p style="color:#9ca3af;font-size:12px;text-align:center;">Powered by InhabitMe</p>
        </div>
      `,
    })
  } catch (err) {
    console.error('❌ Error enviando recordatorio al guest:', err)
  }
}
