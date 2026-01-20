import { NextRequest, NextResponse } from 'next/server';
import { auth, clerkClient } from '@clerk/nextjs/server';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { action, message } = body; // action: 'accept' | 'reject'
    const bookingId = params.id;

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get booking
    const { data: booking, error: fetchError } = await supabase
      .from('bookings')
      .select('*')
      .eq('id', bookingId)
      .single();

    if (fetchError || !booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    // Verify user is the host
    if (booking.host_id !== userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Verify booking is in correct status
    if (booking.status !== 'pending_host_approval') {
      return NextResponse.json({ error: 'Booking cannot be modified' }, { status: 400 });
    }

    if (action === 'accept') {
      // Update booking to pending guest payment
      const { error: updateError } = await supabase
        .from('bookings')
        .update({
          status: 'pending_guest_payment',
          host_response: message,
          updated_at: new Date().toISOString(),
        })
        .eq('id', bookingId);

      if (updateError) {
        console.error('Update error:', updateError);
        return NextResponse.json({ error: 'Failed to update booking' }, { status: 500 });
      }

      // Get guest email from booking (stored at creation)
      const guestEmail = booking.guest_email;
      
      if (!guestEmail) {
        console.error('❌ CRITICAL: Guest email not found in booking');
        return NextResponse.json({ error: 'Guest email not found' }, { status: 500 });
      }
      
      console.log('✅ Guest email from DB:', guestEmail);

      // Send email to guest with better design
      const checkInDate = new Date(booking.check_in).toLocaleDateString('es-ES');
      const checkOutDate = new Date(booking.check_out).toLocaleDateString('es-ES');
      const totalFirstPayment = booking.total_first_payment / 100;
      
      console.log('📧 Sending acceptance email to guest:', guestEmail);
      console.log('📧 Guest email is different from admin?', guestEmail !== process.env.INTERNAL_ALERT_EMAIL!);
      console.log('📧 EMAIL_FROM:', process.env.EMAIL_FROM);
      console.log('📧 About to call resend.emails.send with:', {
        from: process.env.EMAIL_FROM,
        to: guestEmail,
        subject: '✅ ¡Tu Solicitud fue Aceptada! - Completa el Pago'
      });
      
      try {
        // Send to guest - use const to prevent mutation
        const finalGuestEmail = String(guestEmail);
        console.log('🔥 ABOUT TO CALL RESEND with finalGuestEmail:', finalGuestEmail);
        console.log('🔥 finalGuestEmail type:', typeof finalGuestEmail);
        console.log('🔥 Original guestEmail:', guestEmail);
        console.log('🔥 finalGuestEmail === guestEmail?', finalGuestEmail === guestEmail);
        
        // Use object destructuring to prevent variable mutation
        const emailConfig = {
          from: process.env.EMAIL_FROM!,
          to: finalGuestEmail,
          subject: '✅ ¡Tu Solicitud fue Aceptada! - Completa el Pago',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #16a34a 0%, #15803d 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
              <h2 style="color: white; margin: 0;">✅ ¡Solicitud Aceptada!</h2>
            </div>
            
            <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px;">
              <p style="font-size: 18px; color: #16a34a; font-weight: bold;">¡Buenas noticias! 🎉</p>
              
              <p>El anfitrión aceptó tu solicitud de reserva.</p>
              
              <div style="background: white; padding: 20px; border-radius: 10px; margin: 20px 0; border-left: 4px solid #16a34a;">
                <h3 style="margin-top: 0;">📅 Resumen de tu Reserva</h3>
                <p><strong>Check-in:</strong> ${checkInDate}</p>
                <p><strong>Check-out:</strong> ${checkOutDate}</p>
                <p><strong>Duración:</strong> ${booking.months_duration} ${booking.months_duration === 1 ? 'mes' : 'meses'}</p>
              </div>
              
              <div style="background: #fef3c7; padding: 20px; border-radius: 10px; margin: 20px 0;">
                <p style="margin: 0;"><strong>💰 Total a Pagar Ahora:</strong></p>
                <p style="font-size: 32px; font-weight: bold; color: #0f172a; margin: 10px 0;">
                  €${totalFirstPayment}
                </p>
                <p style="margin: 0; font-size: 14px; color: #666;">
                  Incluye: Primer mes + Depósito + Fee de inhabitme (€89)
                </p>
              </div>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${process.env.NEXT_PUBLIC_APP_URL}/bookings/${bookingId}" 
                   style="background: #2563eb; color: white; padding: 16px 40px; text-decoration: none; border-radius: 10px; font-weight: bold; display: inline-block; font-size: 18px;">
                  💳 Completar Pago
                </a>
              </div>
              
              <div style="background: #fee2e2; border-left: 4px solid #ef4444; padding: 15px; border-radius: 5px; margin: 20px 0;">
                <p style="margin: 0; color: #991b1b;">
                  <strong>⏰ Importante:</strong> Tienes 3 días para completar el pago o la reserva será cancelada automáticamente.
                </p>
              </div>
              
              <div style="background: #e0e7ff; padding: 15px; border-radius: 10px; margin: 20px 0;">
                <p style="margin: 0; font-size: 14px;">
                  <strong>✨ Qué pasa después del pago:</strong>
                </p>
                <ul style="margin: 10px 0; padding-left: 20px;">
                  <li>El anfitrión pagará su fee (€${booking.host_fee / 100})</li>
                  <li>Recibirás los datos de contacto del anfitrión</li>
                  <li>Podrás coordinar directamente tu check-in</li>
                </ul>
              </div>
            </div>
            
            <p style="color: #999; font-size: 12px; text-align: center; margin-top: 20px;">
              inhabitme - Tu hogar para meses, no noches
            </p>
          </div>
        `,
        };
        
        console.log('📧 Final email config:', JSON.stringify({ to: emailConfig.to, from: emailConfig.from }, null, 2));
        
        // Use direct fetch to bypass resend library issues
        const resendResponse = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(emailConfig),
        });
        
        const guestEmailResult = await resendResponse.json();
        
        console.log('📧 Resend HTTP status:', resendResponse.status);
        console.log('📧 Resend result for GUEST:', JSON.stringify(guestEmailResult, null, 2));
        
        if (guestEmailResult.error) {
          console.error('❌ Resend ERROR for guest:', guestEmailResult.error);
        } else {
          console.log('✅ Acceptance email sent successfully to guest:', guestEmail);
          console.log('✅ Resend ID:', guestEmailResult.data?.id);
        }
        
        // Also send copy to admin if guest email is different
        if (guestEmail !== process.env.INTERNAL_ALERT_EMAIL!) {
          console.log('📧 About to send ADMIN copy to:', process.env.INTERNAL_ALERT_EMAIL);
          const adminEmailResult = await resend.emails.send({
            from: process.env.EMAIL_FROM!,
            to: process.env.INTERNAL_ALERT_EMAIL!,
            subject: '[ADMIN COPY] ✅ Solicitud Aceptada - ' + bookingId,
            html: `
              <p><strong>COPIA ADMIN - Solicitud aceptada</strong></p>
              <p>Guest: ${guestEmail}</p>
              <p>Booking ID: ${bookingId}</p>
              <p>Check-in: ${checkInDate}</p>
              <p>Check-out: ${checkOutDate}</p>
              <p>Total: €${totalFirstPayment}</p>
            `
          });
          
          console.log('📧 Resend result for ADMIN:', JSON.stringify(adminEmailResult, null, 2));
          
          if (adminEmailResult.error) {
            console.error('❌ Resend ERROR for admin:', adminEmailResult.error);
          } else {
            console.log('✅ Admin copy sent to:', process.env.INTERNAL_ALERT_EMAIL!);
            console.log('✅ Resend ID:', adminEmailResult.data?.id);
          }
        }
      } catch (emailSendError: any) {
        console.error('❌ Error sending acceptance email:', emailSendError);
        console.error('❌ Error message:', emailSendError?.message);
        console.error('❌ Error stack:', emailSendError?.stack);
        console.error('❌ Full error object:', JSON.stringify(emailSendError, null, 2));
        // Don't fail the request if email fails
      }

      return NextResponse.json({ 
        success: true, 
        message: 'Booking accepted. Guest notified to pay.'
      });

    } else if (action === 'reject') {
      // Update booking to cancelled
      const { error: updateError } = await supabase
        .from('bookings')
        .update({
          status: 'cancelled',
          cancelled_by: userId,
          cancelled_at: new Date().toISOString(),
          cancellation_reason: message,
          updated_at: new Date().toISOString(),
        })
        .eq('id', bookingId);

      if (updateError) {
        return NextResponse.json({ error: 'Failed to update booking' }, { status: 500 });
      }

      // Get guest email from Clerk
      let guestEmail = process.env.INTERNAL_ALERT_EMAIL!;
      try {
        const guestUser = await clerkClient.users.getUser(booking.guest_id);
        guestEmail = guestUser.emailAddresses[0].emailAddress;
      } catch (emailError) {
        console.error('Error fetching guest email:', emailError);
      }

      // Send email to guest with better design
      await resend.emails.send({
        from: process.env.EMAIL_FROM!,
        to: guestEmail,
        subject: 'Actualización sobre tu Solicitud - inhabitme',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #0f172a;">Actualización sobre tu Solicitud</h2>
            
            <p>Hola,</p>
            
            <p>Lamentablemente, el anfitrión no pudo aceptar tu solicitud de reserva en esta ocasión.</p>
            
            ${message ? `
              <div style="background: #f3f4f6; padding: 15px; border-left: 4px solid #6b7280; margin: 20px 0; border-radius: 5px;">
                <p style="margin: 0;"><strong>Mensaje del anfitrión:</strong></p>
                <p style="margin: 10px 0 0 0;">"${message}"</p>
              </div>
            ` : ''}
            
            <div style="background: #dbeafe; padding: 20px; border-radius: 10px; margin: 20px 0;">
              <p style="margin: 0 0 15px 0;"><strong>💡 Sugerencias:</strong></p>
              <ul style="margin: 0; padding-left: 20px;">
                <li>Busca propiedades similares en la misma zona</li>
                <li>Contacta a otros anfitriones con fechas flexibles</li>
                <li>Revisa propiedades con disponibilidad inmediata</li>
              </ul>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.NEXT_PUBLIC_APP_URL}/search" 
                 style="background: #2563eb; color: white; padding: 15px 30px; text-decoration: none; border-radius: 10px; font-weight: bold; display: inline-block;">
                🔍 Ver Otras Propiedades
              </a>
            </div>
            
            <p style="color: #666; font-size: 14px;">
              Sabemos que encontrar el lugar perfecto toma tiempo. ¡No te desanimes! Hay muchas opciones increíbles esperándote.
            </p>
            
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
            
            <p style="color: #999; font-size: 12px; text-align: center;">
              inhabitme - Ayudándote a encontrar tu hogar perfecto
            </p>
          </div>
        `
      });

      return NextResponse.json({ 
        success: true, 
        message: 'Booking rejected. Guest notified.'
      });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });

  } catch (error) {
    console.error('Booking response error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
