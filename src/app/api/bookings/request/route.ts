import { NextRequest, NextResponse } from 'next/server';
import { auth, clerkClient } from '@clerk/nextjs/server';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';
import { formatMoneyFromMinor, getCurrencyFromLocation, normalizeCurrency } from '@/lib/currency';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { propertyId, checkIn, checkOut, message, locale = 'en' } = body;

    // Get guest email from Clerk at booking creation
    let guestEmail = '';
    try {
      const client = await clerkClient();
      const guestUser = await client.users.getUser(userId);
      const primaryEmail = guestUser.emailAddresses.find(e => e.id === guestUser.primaryEmailAddressId);
      if (primaryEmail) {
        guestEmail = primaryEmail.emailAddress;
      } else if (guestUser.emailAddresses.length > 0) {
        guestEmail = guestUser.emailAddresses[0].emailAddress;
      }
      
      if (!guestEmail) {
        console.error('CRITICAL: Guest has no email address');
        return NextResponse.json({ error: 'User email not found' }, { status: 400 });
      }
    } catch (clerkError) {
      console.error('CRITICAL: Failed to get guest email from Clerk:', clerkError);
      return NextResponse.json({ error: 'Failed to retrieve user information' }, { status: 500 });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get property details
    const { data: property, error: propError } = await supabase
      .from('listings')
      .select('*')
      .eq('id', propertyId)
      .single();

    if (propError || !property) {
      console.error('Property fetch error:', propError);
      return NextResponse.json({ error: 'Property not found' }, { status: 404 });
    }

    // Calculate months duration using calendar months (not fixed 30-day approximation)
    const checkInDate = new Date(`${checkIn}T12:00:00`);
    const checkOutDate = new Date(`${checkOut}T12:00:00`);
    const calendarMonths =
      (checkOutDate.getFullYear() - checkInDate.getFullYear()) * 12 +
      (checkOutDate.getMonth() - checkInDate.getMonth());
    const monthsDiff = Math.max(1, calendarMonths);

    
    // Resolve booking currency from listing/location (single source of truth)
    const bookingCurrency = normalizeCurrency(
      property.currency || getCurrencyFromLocation(property.country_code || property.country, property.city_slug || property.city_name)
    )

    // Calculate prices (in minor units: cents)
    const monthlyPrice = Math.round(Number(property.monthly_price) * 100)
    const depositAmount = Math.round(Number(property.deposit_amount || property.monthly_price) * 100)
    
    // Calculate fees based on duration
    const { calculateDurationFees } = await import('@/lib/pricing/duration-fees')
    const fees = calculateDurationFees(monthsDiff)
    const guestFee = fees.guestFee
    
    // Host fee based on duration and featured status
    const hostFee = property.featured ? fees.hostFeaturedFee : fees.hostFee
    const totalFirstPayment = monthlyPrice + depositAmount + guestFee;

    // Create booking
    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .insert({
        property_id: propertyId,
        guest_id: userId,
        host_id: property.owner_id,
        check_in: `${checkIn}T12:00:00`,
        check_out: `${checkOut}T12:00:00`,
        months_duration: monthsDiff,
        monthly_price: monthlyPrice,
        deposit_amount: depositAmount,
        guest_fee: guestFee,
        host_fee: hostFee,
        total_first_payment: totalFirstPayment,
        currency: bookingCurrency,
        status: 'pending_host_approval',
        guest_message: message,
        guest_email: guestEmail, // Saved from Clerk at booking creation
        featured_used: property.featured || false,
        expires_at: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(), // 48 hours
      })
      .select()
      .single();

    if (bookingError) {
      console.error('Booking creation error:', bookingError);
      return NextResponse.json({ error: 'Failed to create booking', details: bookingError.message }, { status: 500 });
    }

    // Send emails about new booking request
    try {
      const checkInFormatted = new Date(checkIn).toLocaleDateString('es-ES', { 
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
      });
      const checkOutFormatted = new Date(checkOut).toLocaleDateString('es-ES', { 
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
      });
      
      // Get host email from Clerk API
      let hostEmail = process.env.INTERNAL_ALERT_EMAIL!; // Fallback
      
      try {
        const client = await clerkClient();
        const hostUser = await client.users.getUser(property.owner_id);
        const primaryEmail = hostUser.emailAddresses.find(e => e.id === hostUser.primaryEmailAddressId);
        if (primaryEmail) {
          hostEmail = primaryEmail.emailAddress;
        }
      } catch (clerkError) {
        console.error('Error fetching host email from Clerk:', clerkError);
        // Si falla, usa el fallback
      }
      
      // Calculate earnings for host (minor units)
      const hostEarnings = (monthlyPrice * monthsDiff) + depositAmount - guestFee - hostFee;
      const moneyLocale = bookingCurrency === 'EUR' ? 'es-ES' : 'en-US'
      
      // Email al Host
      await resend.emails.send({
        from: process.env.EMAIL_FROM!,
        to: hostEmail,
        subject: `🏠 Nueva Solicitud de Reserva - ${property.title}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
              <h1 style="color: white; margin: 0; font-size: 28px;">inhabitme</h1>
              <p style="color: white; margin: 10px 0 0 0; font-size: 16px;">Nueva Solicitud de Reserva</p>
            </div>
            
            <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px;">
              <h2 style="color: #1f2937; margin-top: 0;">¡Tienes una nueva solicitud!</h2>
              
              <p style="font-size: 16px; color: #374151;">
                Un huésped quiere reservar tu propiedad <strong>${property.title}</strong>
              </p>
              
              <div style="background: white; padding: 20px; border-radius: 10px; margin: 20px 0; border-left: 4px solid #667eea;">
                <h3 style="margin-top: 0; color: #1f2937;">📅 Detalles de la Reserva</h3>
                <p style="margin: 8px 0;"><strong>Check-in:</strong> ${checkInFormatted}</p>
                <p style="margin: 8px 0;"><strong>Check-out:</strong> ${checkOutFormatted}</p>
                <p style="margin: 8px 0;"><strong>Duración:</strong> ${monthsDiff} ${monthsDiff === 1 ? 'mes' : 'meses'}</p>
                <p style="margin: 8px 0;"><strong>Precio mensual:</strong> ${formatMoneyFromMinor(monthlyPrice, bookingCurrency, moneyLocale)}</p>
              </div>
              
              ${message ? `
                <div style="background: #e0e7ff; padding: 15px; border-left: 4px solid #667eea; margin: 20px 0; border-radius: 5px;">
                  <p style="margin: 0;"><strong>Mensaje del huésped:</strong></p>
                  <p style="margin: 10px 0 0 0;">"${message}"</p>
                </div>
              ` : ''}
              
              <div style="background: #fef3c7; padding: 20px; border-radius: 10px; margin: 20px 0;">
                <p style="margin: 0 0 10px 0;"><strong>💰 Tu Ganancia Potencial:</strong></p>
                <p style="font-size: 32px; font-weight: bold; color: #16a34a; margin: 0;">
                  ${formatMoneyFromMinor(hostEarnings, bookingCurrency, moneyLocale)}
                </p>
                <p style="margin: 10px 0 0 0; font-size: 14px; color: #666;">
                  (${monthsDiff} ${monthsDiff === 1 ? 'mes' : 'meses'} + depósito - fees)
                </p>
              </div>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${process.env.NEXT_PUBLIC_APP_URL}/${locale}/host/bookings/${booking.id}"
                   style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 40px; text-decoration: none; border-radius: 10px; font-weight: bold; display: inline-block; font-size: 16px;">
                  Ver Solicitud y Responder
                </a>
              </div>
              
              <div style="background: #fee2e2; border-left: 4px solid #ef4444; padding: 15px; border-radius: 5px; margin: 20px 0;">
                <p style="margin: 0; color: #991b1b; font-size: 14px;">
                  <strong>⏰ Recuerda:</strong> Tienes 48 horas para responder. El huésped solo pagará si aceptas.
                </p>
              </div>
              
              <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
              
              <p style="color: #999; font-size: 12px; text-align: center;">
                inhabitme - Tu plataforma de alquileres de media estancia
              </p>
            </div>
          </div>
        `
      });

      // Email a Admin inhabitme (para monitoring)
      await resend.emails.send({
        from: process.env.EMAIL_FROM!,
        to: process.env.INTERNAL_ALERT_EMAIL!,
        subject: `[inhabitme] Nueva Solicitud de Reserva - ${booking.id}`,
        html: `
          <div style="font-family: Arial, sans-serif;">
            <h2>Nueva Solicitud de Reserva</h2>
            <p><strong>Booking ID:</strong> ${booking.id}</p>
            <p><strong>Propiedad:</strong> ${property.title}</p>
            <p><strong>Host:</strong> ${property.owner_id}</p>
            <p><strong>Guest:</strong> ${userId}</p>
            <p><strong>Check-in:</strong> ${checkIn}</p>
            <p><strong>Check-out:</strong> ${checkOut}</p>
            <p><strong>Duración:</strong> ${monthsDiff} meses</p>
            <p><strong>Valor:</strong> ${formatMoneyFromMinor(monthlyPrice, bookingCurrency, moneyLocale)}/mes</p>
            <hr>
            <p><a href="${process.env.NEXT_PUBLIC_APP_URL}/en/admin/bookings/${booking.id}">Ver en Admin</a></p>
          </div>
        `
      });
      
    } catch (emailError) {
      console.error('Error sending emails:', emailError);
      // Don't fail the request if email fails
    }

    return NextResponse.json({ 
      success: true, 
      bookingId: booking.id,
      booking,
      message: 'Booking request sent to host'
    });

  } catch (error: any) {
    console.error('Booking request error:', error);
    return NextResponse.json({ 
      error: 'Internal server error', 
      message: error.message 
    }, { status: 500 });
  }
}
