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
import * as Sentry from '@sentry/nextjs'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-02-25.clover',
})

// Estados desde los que un pago puede hacer avanzar el booking. Coincide con
// PAYABLE_STATUSES de create-checkout / host-checkout. Fuera de este conjunto
// (confirmed, cancelled, rejected, pending_host_approval) un webhook no debe
// mover nada: 'cancelled' lo escribe bookings/[id]/respond cuando el host
// rechaza, y un pago tardío no puede resucitar ese booking.
const PAYMENT_FLOW_STATUSES = ['approved', 'pending_guest_payment', 'pending_host_payment']

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
        const paymentType = session.metadata?.payment_type as 'guest' | 'host' | undefined

        if (!bookingId || (paymentType !== 'guest' && paymentType !== 'host')) {
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

        // ── 1. Registrar la transacción ────────────────────────────────────
        // Idempotente vía el índice único parcial uq_payment_transactions_stripe_session:
        // en un reintento del mismo evento la inserción choca con 23505
        // (unique_violation), que aquí es el resultado esperado, no un error.
        // No usamos upsert/onConflict porque Postgres no infiere un índice
        // parcial sin repetir su predicado, y PostgREST no lo emite.
        const { error: txError } = await supabase
          .from('payment_transactions')
          .insert({
            booking_id: bookingId,
            payer_role: paymentType,
            payer_id: paymentType === 'guest' ? booking.guest_id : booking.host_id,
            amount_cents: Number(session.amount_total ?? 0),
            currency: sessionCurrency,
            payment_type: paymentType === 'guest' ? 'booking_guest_fee' : 'booking_host_fee',
            status: 'paid',
            stripe_session_id: session.id,
            stripe_payment_intent_id: paymentIntentId,
            metadata: {
              source: 'stripe_webhook',
              tier: session.metadata?.tier,
              ...(paymentType === 'host' && { featured: session.metadata?.featured }),
            },
          })

        if (txError && txError.code === '23505') {
          console.log(`↻ Transacción ya registrada (${paymentType}):`, session.id)
        } else if (txError) {
          console.error(`⚠️ payment_transactions insert (${paymentType}):`, txError.message)
        }

        // ── 2. Marcar el pago del pagador ──────────────────────────────────
        const payerAlreadyPaid = booking[`${paymentType}_payment_status`] === 'paid'

        if (!payerAlreadyPaid) {
          await supabase.from('bookings').update({
            [`${paymentType}_payment_status`]: 'paid',
            [`${paymentType}_paid_at`]: new Date().toISOString(),
            [`${paymentType}_payment_intent_id`]: paymentIntentId,
            updated_at: new Date().toISOString(),
          }).eq('id', bookingId)

          console.log(`💳 Pago del ${paymentType} completado para booking:`, bookingId)
        } else {
          // Reintento de Stripe. El flag de pago ya estaba puesto, pero los
          // efectos posteriores (confirmar, liberar contactos, emails) pueden
          // haber quedado a medias en la entrega anterior: seguimos para
          // completarlos. Las transiciones de abajo evitan duplicarlos.
          console.log(`↻ Reintento de Stripe (${paymentType} ya pagado) — completando efectos:`, bookingId)
        }

        // ── 3. Estado de pagos una vez aplicado este evento ────────────────
        // Releemos los flags: si guest y host pagan casi a la vez, el `booking`
        // cargado arriba está obsoleto y ninguno de los dos eventos vería al
        // otro como pagado (el booking se quedaría sin confirmar). Como cada
        // handler lee DESPUÉS de su propia escritura, al menos uno ve ambos.
        const { data: fresh } = await supabase
          .from('bookings')
          .select('guest_payment_status, host_payment_status')
          .eq('id', bookingId)
          .single()

        const guestPaid = paymentType === 'guest' || fresh?.guest_payment_status === 'paid'
        const hostPaid =
          paymentType === 'host' ||
          fresh?.host_payment_status === 'paid' ||
          fresh?.host_payment_status === 'waived'

        if (guestPaid && hostPaid) {
          await confirmAndReleaseContacts(supabase, booking, session.id, paymentType)
        } else if (guestPaid) {
          // Falta el host
          if (await claimStatusTransition(supabase, bookingId, 'pending_host_payment', 'payment_pending')) {
            console.log('⏳ Guest pagó. Esperando pago del host para liberar contactos.')
            await sendHostPaymentReminderEmail(booking, sessionLocale)
          }
        } else {
          // Falta el guest
          if (await claimStatusTransition(supabase, bookingId, 'pending_guest_payment', 'payment_pending')) {
            console.log('⏳ Host pagó. Esperando pago del guest para liberar contactos.')
            await sendGuestPaymentReminderEmail(booking, sessionLocale)
          }
        }

        break
      }

      case 'checkout.session.expired': {
        // Solo se registra. Deliberadamente NO muta el estado del booking: la
        // sesión expirada no cancela nada, el booking sigue en su estado de pago
        // y el usuario puede generar un checkout nuevo.
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
      { error: 'Webhook handler failed' },
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
  // Reclamamos la transición a 'confirmed' de forma atómica: solo la entrega
  // que gana la carrera envía los emails de contacto. Un reintento de Stripe
  // sobre un booking ya confirmado no reenvía nada.
  const claimed = await claimStatusTransition(supabase, booking.id, 'confirmed', 'confirmed')

  if (!claimed) {
    // claimStatusTransition ya ha logueado el motivo (reintento benigno vs anomalía).
    return
  }

  console.log(`✅ Ambos pagaron. Confirmando booking ${booking.id} y liberando contactos.`)

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
// Transición de estado atómica — devuelve true solo si esta llamada fue la que
// movió el booking a `nextStatus`. Es el guard de idempotencia del webhook:
// `UPDATE ... WHERE status IN (origenes válidos)` bloquea la fila, y una
// segunda entrega concurrente re-evalúa el WHERE tras el commit de la primera,
// ya no encuentra un origen válido y no recibe ninguna fila.
//
// El origen se acota a PAYMENT_FLOW_STATUSES (menos el destino, que es lo que
// hace de guard). Así un pago tardío o un reintento NO puede mover un booking
// 'cancelled' / 'rejected' / 'confirmed' ni saltarse la aprobación del host
// desde 'pending_host_approval'.
// ─────────────────────────────────────────────────────────────────────────────
async function claimStatusTransition(
  supabase: any,
  bookingId: string,
  nextStatus: string,
  flowState: string
): Promise<boolean> {
  const sourceStatuses = PAYMENT_FLOW_STATUSES.filter((s) => s !== nextStatus)

  const { data, error } = await supabase
    .from('bookings')
    .update({
      status: nextStatus,
      flow_state: flowState,
      updated_at: new Date().toISOString(),
    })
    .eq('id', bookingId)
    .in('status', sourceStatuses)
    .select('id')

  if (error) {
    console.error(`⚠️ No se pudo reclamar la transición a ${nextStatus}:`, error.message)
    Sentry.captureException(error, {
      tags: { area: 'stripe-webhook', booking_id: bookingId },
      extra: { bookingId, nextStatus, sourceStatuses },
    })
    return false
  }

  if ((data?.length ?? 0) > 0) return true

  // No se actualizó ninguna fila: o es un reintento benigno (el booking ya está
  // en el estado destino) o es una anomalía que hay que ver en Sentry — dinero
  // cobrado sobre un booking cancelado, rechazado o aún sin aprobar.
  const { data: current } = await supabase
    .from('bookings')
    .select('status')
    .eq('id', bookingId)
    .single()

  const currentStatus = current?.status ?? 'desconocido'

  if (currentStatus === nextStatus) {
    console.log(`↻ Booking ${bookingId} ya estaba en '${nextStatus}' — sin efectos duplicados.`)
  } else {
    console.error(
      `🚨 Pago sobre booking ${bookingId} en estado '${currentStatus}': no se aplica '${nextStatus}'.`
    )
    Sentry.captureMessage('Stripe payment on booking outside the payment flow', {
      level: 'error',
      tags: { area: 'stripe-webhook', booking_id: bookingId },
      extra: { bookingId, currentStatus, attemptedStatus: nextStatus, sourceStatuses },
    })
  }

  return false
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
      Sentry.captureMessage('Confirmed booking without contact email', {
        level: 'error',
        tags: { area: 'stripe-webhook', booking_id: booking.id },
        extra: { bookingId: booking.id, recipient },
      })
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
    // Crítico: el booking ya está confirmado, así que un reintento de Stripe no
    // reenviará este email. Tiene que ser visible en Sentry, no solo en Vercel.
    console.error(`❌ Error enviando email a ${recipient}:`, err)
    Sentry.captureException(err, {
      tags: { area: 'stripe-webhook', booking_id: booking.id },
      extra: { bookingId: booking.id, recipient, stage: 'contacts_email' },
    })
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
    Sentry.captureException(err, {
      tags: { area: 'stripe-webhook', booking_id: booking.id },
      extra: { bookingId: booking.id, stage: 'host_payment_reminder' },
    })
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
    Sentry.captureException(err, {
      tags: { area: 'stripe-webhook', booking_id: booking.id },
      extra: { bookingId: booking.id, stage: 'guest_payment_reminder' },
    })
  }
}
