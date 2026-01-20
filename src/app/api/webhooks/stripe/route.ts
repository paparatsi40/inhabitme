import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import Stripe from 'stripe';
import { Resend } from 'resend';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-12-15.clover',
});

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('stripe-signature')!;

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET!
      );
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Handle different event types
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const bookingId = session.metadata?.booking_id;

        if (!bookingId) break;

        // Get booking
        const { data: booking } = await supabase
          .from('bookings')
          .select('*')
          .eq('id', bookingId)
          .single();

        if (!booking) break;

        // Mark guest as paid
        await supabase
          .from('bookings')
          .update({
            guest_paid: true,
            guest_paid_at: new Date().toISOString(),
            guest_payment_intent: session.payment_intent as string,
            guest_payment_amount: session.amount_total,
            status: 'pending_host_payment',
            updated_at: new Date().toISOString(),
          })
          .eq('id', bookingId);

        // Send email to host to pay their fee
        await resend.emails.send({
          from: process.env.EMAIL_FROM!,
          to: booking.host_email,
          subject: '💰 Nuevo pago recibido - inhabitme',
          html: `
            <h2>¡El inquilino completó su pago! 🎉</h2>
            <p>Para confirmar la reserva y recibir el pago, completa tu success fee.</p>
            <p><strong>Fee:</strong> €${(booking.host_fee / 100).toFixed(2)}</p>
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/bookings/${bookingId}/host-payment" 
               style="background: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block; margin: 20px 0;">
              Pagar Fee y Confirmar
            </a>
            <p><small>Una vez pagues, recibirás: €${((booking.monthly_price + booking.deposit_amount - booking.guest_fee - booking.host_fee) / 100).toFixed(2)}</small></p>
          `
        });

        break;
      }

      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        const bookingId = paymentIntent.metadata?.booking_id;

        if (!bookingId) break;

        // Check if this is host payment (will have different metadata)
        const isHostPayment = paymentIntent.metadata?.type === 'host_payment';

        if (isHostPayment) {
          // Get booking
          const { data: booking } = await supabase
            .from('bookings')
            .select('*')
            .eq('id', bookingId)
            .single();

          if (!booking) break;

          // Mark host as paid
          await supabase
            .from('bookings')
            .update({
              host_paid: true,
              host_paid_at: new Date().toISOString(),
              host_payment_intent: paymentIntent.id,
              host_payment_amount: paymentIntent.amount,
              status: 'confirmed',
              contacts_released: true,
              contacts_released_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            })
            .eq('id', bookingId);

          // Send emails to both with contact info
          const checkInDate = new Date(booking.check_in).toLocaleDateString('es-ES', { 
            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
          });
          const checkOutDate = new Date(booking.check_out).toLocaleDateString('es-ES', { 
            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
          });

          await Promise.all([
            // Email to guest - Professional design
            resend.emails.send({
              from: process.env.EMAIL_FROM!,
              to: booking.guest_email,
              subject: '🎉 ¡Reserva Confirmada! - Contactos del Anfitrión',
              html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                  <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
                    <h1 style="color: white; margin: 0;">🎉 ¡Reserva Confirmada!</h1>
                  </div>
                  
                  <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px;">
                    <p style="font-size: 16px; color: #374151;">Tu reserva está completamente confirmada y pagada.</p>
                    
                    <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #10b981;">
                      <h2 style="margin-top: 0; color: #1f2937;">📞 Contacto del Anfitrión</h2>
                      <p style="margin: 10px 0;"><strong>Email:</strong> <a href="mailto:${booking.host_email}" style="color: #667eea;">${booking.host_email}</a></p>
                      <p style="margin: 10px 0;"><strong>Teléfono:</strong> ${booking.host_phone || 'Contacta por email'}</p>
                    </div>
                    
                    <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
                      <h3 style="margin-top: 0; color: #1f2937;">📅 Detalles</h3>
                      <p style="margin: 8px 0;"><strong>Check-in:</strong> ${checkInDate}</p>
                      <p style="margin: 8px 0;"><strong>Check-out:</strong> ${checkOutDate}</p>
                      <p style="margin: 8px 0;"><strong>Duración:</strong> ${booking.months_duration} ${booking.months_duration === 1 ? 'mes' : 'meses'}</p>
                    </div>
                    
                    <div style="text-align: center; margin-top: 30px;">
                      <a href="${process.env.NEXT_PUBLIC_APP_URL}/en/bookings/${bookingId}" 
                         style="background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">
                        Ver Detalles Completos
                      </a>
                    </div>
                  </div>
                </div>
              `
            }),
            // Email to host - Professional design
            resend.emails.send({
              from: process.env.EMAIL_FROM!,
              to: booking.host_email,
              subject: '💰 Pago Confirmado - Nueva Reserva',
              html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                  <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
                    <h1 style="color: white; margin: 0;">💰 ¡Pago Confirmado!</h1>
                  </div>
                  
                  <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px;">
                    <p style="font-size: 16px; color: #374151;">Nueva reserva confirmada y pagada.</p>
                    
                    <div style="background: #d1fae5; padding: 20px; border-radius: 8px; margin: 20px 0;">
                      <h3 style="margin-top: 0; color: #065f46;">💵 Recibirás</h3>
                      <p style="font-size: 24px; font-weight: bold; color: #065f46; margin: 10px 0;">
                        €${((booking.monthly_price + booking.deposit_amount - booking.guest_fee - booking.host_fee) / 100).toFixed(2)}
                      </p>
                      <p style="font-size: 14px; color: #065f46; margin: 0;">En 1-3 días hábiles</p>
                    </div>
                    
                    <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea;">
                      <h2 style="margin-top: 0; color: #1f2937;">👤 Contacto del Huésped</h2>
                      <p style="margin: 10px 0;"><strong>Email:</strong> <a href="mailto:${booking.guest_email}" style="color: #10b981;">${booking.guest_email}</a></p>
                      <p style="margin: 10px 0;"><strong>Teléfono:</strong> ${booking.guest_phone || 'Contacta por email'}</p>
                    </div>
                    
                    <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
                      <h3 style="margin-top: 0; color: #1f2937;">📅 Detalles</h3>
                      <p style="margin: 8px 0;"><strong>Check-in:</strong> ${checkInDate}</p>
                      <p style="margin: 8px 0;"><strong>Duración:</strong> ${booking.months_duration} ${booking.months_duration === 1 ? 'mes' : 'meses'}</p>
                      <p style="margin: 8px 0;"><strong>Precio/mes:</strong> €${(booking.monthly_price / 100).toFixed(2)}</p>
                    </div>
                    
                    <div style="text-align: center; margin-top: 30px;">
                      <a href="${process.env.NEXT_PUBLIC_APP_URL}/en/host/bookings/${bookingId}" 
                         style="background: #10b981; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">
                        Ver Detalles Completos
                      </a>
                    </div>
                  </div>
                </div>
              `
            }),
          ]);

          // TODO: Create Stripe Transfer to host (requires Stripe Connect)
        }

        break;
      }
    }

    return NextResponse.json({ received: true });

  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 });
  }
}
