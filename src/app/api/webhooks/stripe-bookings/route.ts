import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
})

const resend = new Resend(process.env.RESEND_API_KEY!)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = headers().get('stripe-signature')!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err: any) {
    console.error('❌ Webhook signature verification failed:', err.message)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  console.log('🔔 Stripe webhook event:', event.type)

  const supabase = createClient(supabaseUrl, supabaseKey)

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        
        console.log('💳 Checkout completed:', {
          sessionId: session.id,
          metadata: session.metadata,
        })

        const bookingId = session.metadata?.booking_id
        const paymentType = session.metadata?.payment_type // 'guest' or 'host'

        if (!bookingId || !paymentType) {
          console.error('Missing metadata:', session.metadata)
          return NextResponse.json({ error: 'Missing metadata' }, { status: 400 })
        }

        // Get booking
        const { data: booking, error: bookingError } = await supabase
          .from('bookings')
          .select('*, listings(*)')
          .eq('id', bookingId)
          .single()

        if (bookingError || !booking) {
          console.error('Booking not found:', bookingId)
          return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
        }

        if (paymentType === 'guest') {
          console.log('✅ Guest payment completed')
          
          // Update booking status to confirmed
          const { error: updateError } = await supabase
            .from('bookings')
            .update({
              status: 'confirmed',
              guest_payment_status: 'paid',
              guest_payment_date: new Date().toISOString(),
              guest_stripe_session_id: session.id,
              updated_at: new Date().toISOString(),
            })
            .eq('id', bookingId)

          if (updateError) {
            console.error('Error updating booking:', updateError)
            return NextResponse.json({ error: 'Update failed' }, { status: 500 })
          }

          // Send confirmation emails to both guest and host with contacts
          await sendContactsEmail(booking, 'guest')
          await sendContactsEmail(booking, 'host')

          console.log('✅ Contacts released to both parties')

        } else if (paymentType === 'host') {
          console.log('✅ Host payment completed')

          // Update booking with host payment info
          const { error: updateError } = await supabase
            .from('bookings')
            .update({
              host_payment_status: 'paid',
              host_payment_date: new Date().toISOString(),
              host_stripe_session_id: session.id,
              updated_at: new Date().toISOString(),
            })
            .eq('id', bookingId)

          if (updateError) {
            console.error('Error updating booking:', updateError)
            return NextResponse.json({ error: 'Update failed' }, { status: 500 })
          }

          // Now accept the booking and send email to guest
          const { error: acceptError } = await supabase
            .from('bookings')
            .update({
              status: 'pending_guest_payment',
              updated_at: new Date().toISOString(),
            })
            .eq('id', bookingId)

          if (acceptError) {
            console.error('Error accepting booking:', acceptError)
            return NextResponse.json({ error: 'Accept failed' }, { status: 500 })
          }

          // Send email to guest to pay
          await sendGuestPaymentEmail(booking)

          console.log('✅ Guest notified to complete payment')
        }

        break
      }

      case 'checkout.session.expired': {
        const session = event.data.object as Stripe.Checkout.Session
        console.log('⏰ Checkout expired:', session.id)
        // Could update booking to mark payment as failed/expired
        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
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

// Send contacts to guest or host
async function sendContactsEmail(booking: any, recipient: 'guest' | 'host') {
  const supabase = createClient(supabaseUrl, supabaseKey)

  try {
    // Get both parties' info
    const { data: guestUser } = await supabase
      .from('users')
      .select('email, full_name, phone')
      .eq('id', booking.guest_id)
      .single()

    const { data: hostUser } = await supabase
      .from('users')
      .select('email, full_name, phone')
      .eq('id', booking.host_id)
      .single()

    const recipientEmail = recipient === 'guest' ? booking.guest_email : hostUser?.email
    const otherPartyName = recipient === 'guest' ? (hostUser?.full_name || 'Host') : (guestUser?.full_name || 'Guest')
    const otherPartyEmail = recipient === 'guest' ? (hostUser?.email || 'N/A') : booking.guest_email
    const otherPartyPhone = recipient === 'guest' ? (hostUser?.phone || 'N/A') : (guestUser?.phone || 'N/A')

    if (!recipientEmail) {
      console.error(`No email found for ${recipient}`)
      return
    }

    const checkInDate = new Date(booking.check_in).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })

    await resend.emails.send({
      from: process.env.EMAIL_FROM!,
      to: recipientEmail,
      subject: `✅ ¡Contactos Liberados! - ${booking.listings?.title}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">🎉 ¡Reserva Confirmada!</h1>
          </div>
          
          <div style="background: white; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 10px 10px;">
            <h2 style="color: #1f2937; font-size: 22px; margin-top: 0;">
              Todos los pagos completados - Contactos liberados
            </h2>
            
            <p style="color: #4b5563; font-size: 16px; line-height: 1.6;">
              ¡Excelente! ${recipient === 'guest' ? 'Tu pago' : 'El pago del huésped'} se ha procesado correctamente. 
              Ahora pueden coordinar directamente para finalizar todos los detalles.
            </p>

            <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 25px 0;">
              <h3 style="color: #1f2937; margin-top: 0; font-size: 18px;">📋 Detalles de la Reserva</h3>
              <p style="margin: 8px 0; color: #4b5563;"><strong>Propiedad:</strong> ${booking.listings?.title}</p>
              <p style="margin: 8px 0; color: #4b5563;"><strong>Check-in:</strong> ${checkInDate}</p>
              <p style="margin: 8px 0; color: #4b5563;"><strong>Duración:</strong> ${booking.months_duration} ${booking.months_duration === 1 ? 'mes' : 'meses'}</p>
            </div>

            <div style="background: #10b981; background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 20px; border-radius: 8px; margin: 25px 0;">
              <h3 style="color: white; margin-top: 0; font-size: 18px;">📞 Datos de Contacto</h3>
              <p style="margin: 8px 0; color: white;"><strong>Nombre:</strong> ${otherPartyName}</p>
              <p style="margin: 8px 0; color: white;"><strong>Email:</strong> ${otherPartyEmail}</p>
              <p style="margin: 8px 0; color: white;"><strong>Teléfono:</strong> ${otherPartyPhone}</p>
            </div>

            <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; border-radius: 4px;">
              <p style="margin: 0; color: #92400e; font-size: 14px;">
                <strong>💡 Próximos pasos:</strong><br>
                ${recipient === 'guest' 
                  ? '1. Contacta al host para coordinar llegada<br>2. Confirma detalles de check-in y llaves<br>3. Acuerda método de pago de renta y depósito'
                  : '1. El huésped te contactará pronto<br>2. Coordina detalles de llegada y entrega de llaves<br>3. Acuerda método de pago de renta y depósito'
                }
              </p>
            </div>

            <p style="color: #6b7280; font-size: 14px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
              A partir de ahora, inhabitme no interviene en la relación. Renta, depósito y todos los detalles 
              los coordinas directamente con ${recipient === 'guest' ? 'el host' : 'el huésped'}. ¡Que disfrutes tu estancia!
            </p>

            <div style="text-align: center; margin-top: 30px;">
              <p style="color: #9ca3af; font-size: 12px; margin: 5px 0;">
                Powered by <strong>inhabitme</strong>
              </p>
            </div>
          </div>
        </div>
      `,
    })

    console.log(`✅ Contacts email sent to ${recipient}: ${recipientEmail}`)
  } catch (error) {
    console.error(`Error sending contacts email to ${recipient}:`, error)
  }
}

// Send email to guest to complete payment
async function sendGuestPaymentEmail(booking: any) {
  try {
    const checkInDate = new Date(booking.check_in).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })

    const totalAmount = (booking.guest_fee / 100).toFixed(2)

    await resend.emails.send({
      from: process.env.EMAIL_FROM!,
      to: booking.guest_email,
      subject: `✅ ¡Host Aceptó! Completa el Pago - ${booking.listings?.title}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">🎉 ¡El Host Aceptó!</h1>
          </div>
          
          <div style="background: white; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 10px 10px;">
            <h2 style="color: #1f2937; font-size: 22px; margin-top: 0;">
              Tu solicitud fue aceptada - Completa el pago
            </h2>
            
            <p style="color: #4b5563; font-size: 16px; line-height: 1.6;">
              ¡Excelente noticia! El host ha aceptado tu solicitud para <strong>${booking.listings?.title}</strong>.
              Para finalizar la reserva y recibir los datos de contacto, completa el pago del service fee.
            </p>

            <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 25px 0;">
              <h3 style="color: #1f2937; margin-top: 0; font-size: 18px;">📋 Detalles de la Reserva</h3>
              <p style="margin: 8px 0; color: #4b5563;"><strong>Check-in:</strong> ${checkInDate}</p>
              <p style="margin: 8px 0; color: #4b5563;"><strong>Duración:</strong> ${booking.months_duration} ${booking.months_duration === 1 ? 'mes' : 'meses'}</p>
              <p style="margin: 8px 0; color: #4b5563;"><strong>Service fee:</strong> €${totalAmount}</p>
            </div>

            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.NEXT_PUBLIC_APP_URL}/bookings/${booking.id}" 
                 style="display: inline-block; background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%); color: white; 
                        padding: 15px 40px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">
                💳 Completar Pago
              </a>
            </div>

            <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; border-radius: 4px;">
              <p style="margin: 0; color: #92400e; font-size: 14px;">
                <strong>💡 Importante:</strong> Una vez completes el pago, recibirás inmediatamente 
                los datos de contacto del host (email + teléfono) para coordinar todos los detalles directamente.
              </p>
            </div>

            <p style="color: #6b7280; font-size: 14px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
              ¿Tienes preguntas? Escríbenos a <a href="mailto:${process.env.INTERNAL_ALERT_EMAIL}" style="color: #3b82f6;">
              ${process.env.INTERNAL_ALERT_EMAIL}</a>
            </p>

            <div style="text-align: center; margin-top: 30px;">
              <p style="color: #9ca3af; font-size: 12px; margin: 5px 0;">
                Powered by <strong>inhabitme</strong>
              </p>
            </div>
          </div>
        </div>
      `,
    })

    console.log('✅ Guest payment email sent:', booking.guest_email)
  } catch (error) {
    console.error('Error sending guest payment email:', error)
  }
}
