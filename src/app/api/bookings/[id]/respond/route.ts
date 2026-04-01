import { NextRequest, NextResponse } from 'next/server'
import { auth, clerkClient } from '@clerk/nextjs/server'
import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const resend = new Resend(process.env.RESEND_API_KEY)

type Ctx = { params: Promise<{ id: string }> }

export async function POST(request: NextRequest, { params }: Ctx) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id: bookingId } = await params
    if (!bookingId) {
      return NextResponse.json({ error: 'Booking ID is required' }, { status: 400 })
    }

    const body = await request.json()
    const { action, message } = body as { action?: 'accept' | 'reject' | 'changes'; message?: string }

    const supabase = createClient(supabaseUrl, supabaseKey)

    // Get booking
    const { data: booking, error: fetchError } = await supabase
      .from('bookings')
      .select('*')
      .eq('id', bookingId)
      .single()

    if (fetchError || !booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
    }

    // Verify user is the host
    if (booking.host_id !== userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    // Verify booking is in correct status
    if (booking.status !== 'pending_host_approval') {
      return NextResponse.json({ error: 'Booking cannot be modified' }, { status: 400 })
    }

    if (action === 'accept') {
      // Update booking to pending guest payment
      const { error: updateError } = await supabase
        .from('bookings')
        .update({
          status: 'pending_guest_payment',
          flow_state: 'payment_pending',
          host_response: message,
          updated_at: new Date().toISOString(),
        })
        .eq('id', bookingId)

      if (updateError) {
        console.error('Update error:', updateError)
        return NextResponse.json({ error: 'Failed to update booking' }, { status: 500 })
      }

      // Get guest email from booking (stored at creation)
      const guestEmail = booking.guest_email

      if (!guestEmail) {
        console.error('❌ CRITICAL: Guest email not found in booking')
        return NextResponse.json({ error: 'Guest email not found' }, { status: 500 })
      }

      console.log('✅ Guest email from DB:', guestEmail)

      // (Opcional) notificación por email usando Resend
      // NOTA: no conozco tu template exacto, así que dejo un envío mínimo y seguro.
      try {
        if (process.env.RESEND_API_KEY) {
          await resend.emails.send({
            from: process.env.RESEND_FROM_EMAIL || 'hola@inhabitme.com',
            to: guestEmail,
            subject: 'Tu host aceptó la reserva',
            html: `<p>Tu host aceptó la reserva. Ya puedes proceder con el pago.</p>`,
          })
        }
      } catch (emailErr) {
        console.warn('⚠️ Could not send email (accept):', emailErr)
      }

      try {
        await supabase.from('booking_flow_events').insert({
          booking_id: bookingId,
          event_name: 'booking_accepted',
          actor_role: 'host',
          actor_id: userId,
          metadata: {
            nextState: 'payment_pending',
          },
        })
      } catch (eventError) {
        console.error('[bookings/respond] event log failed (accept):', eventError)
      }

      return NextResponse.json({
        success: true,
        message: 'Booking accepted. Guest notified to pay.',
      })
    }

    if (action === 'changes') {
      const { error: updateError } = await supabase
        .from('bookings')
        .update({
          status: 'pending_host_approval',
          flow_state: 'booking_pending_host',
          host_response: message || 'Host requested changes before acceptance.',
          updated_at: new Date().toISOString(),
        })
        .eq('id', bookingId)

      if (updateError) {
        return NextResponse.json({ error: 'Failed to request changes' }, { status: 500 })
      }

      const guestEmail = booking.guest_email
      if (guestEmail) {
        try {
          if (process.env.RESEND_API_KEY) {
            await resend.emails.send({
              from: process.env.RESEND_FROM_EMAIL || 'hola@inhabitme.com',
              to: guestEmail,
              subject: 'The host requested changes to your booking request',
              html: `<p>Your host requested changes before acceptance.</p><p>${message || ''}</p>`,
            })
          }
        } catch (emailErr) {
          console.warn('⚠️ Could not send email (changes):', emailErr)
        }
      }

      try {
        await supabase.from('booking_flow_events').insert({
          booking_id: bookingId,
          event_name: 'booking_changes_requested',
          actor_role: 'host',
          actor_id: userId,
          metadata: {
            note: message || null,
          },
        })
      } catch (eventError) {
        console.error('[bookings/respond] event log failed (changes):', eventError)
      }

      return NextResponse.json({
        success: true,
        message: 'Host requested changes. Guest notified.',
      })
    }

    if (action === 'reject') {
      // Update booking to cancelled
      const { error: updateError } = await supabase
        .from('bookings')
        .update({
          status: 'cancelled',
          flow_state: 'declined',
          host_response: message,
          updated_at: new Date().toISOString(),
        })
        .eq('id', bookingId)

      if (updateError) {
        return NextResponse.json({ error: 'Failed to update booking' }, { status: 500 })
      }

      // Notificación al guest (si quieres, usa booking.guest_email igual que arriba)
      const guestEmail = booking.guest_email
      if (guestEmail) {
        try {
          if (process.env.RESEND_API_KEY) {
            await resend.emails.send({
              from: process.env.RESEND_FROM_EMAIL || 'hola@inhabitme.com',
              to: guestEmail,
              subject: 'Tu host rechazó la reserva',
              html: `<p>Tu host rechazó la reserva.</p>`,
            })
          }
        } catch (emailErr) {
          console.warn('⚠️ Could not send email (reject):', emailErr)
        }
      }

      try {
        await supabase.from('booking_flow_events').insert({
          booking_id: bookingId,
          event_name: 'booking_declined',
          actor_role: 'host',
          actor_id: userId,
          metadata: {
            note: message || null,
          },
        })
      } catch (eventError) {
        console.error('[bookings/respond] event log failed (reject):', eventError)
      }

      return NextResponse.json({
        success: true,
        message: 'Booking rejected. Guest notified.',
      })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error) {
    console.error('Booking response error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}