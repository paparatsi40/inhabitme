import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const resend = new Resend(process.env.RESEND_API_KEY);
const adminEmail = process.env.INTERNAL_ALERT_EMAIL || 'contact@inhabitme.com';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { data, error } = await supabase
      .from('founding_host_applications')
      .insert([
        {
          full_name: body.fullName,
          email: body.email,
          phone: body.phone,
          city: body.city,
          property_address: body.propertyAddress,
          property_type: body.propertyType,
          monthly_price: parseInt(body.monthlyPrice),
          available_from: body.availableFrom,
          about_you: body.aboutYou,
          why_join: body.whyJoin,
          status: 'pending',
          created_at: new Date().toISOString(),
        }
      ])
      .select();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Error al guardar la aplicación' },
        { status: 500 }
      );
    }

    // Enviar email de notificación al admin
    try {
      await resend.emails.send({
        from: process.env.EMAIL_FROM || 'InhabitMe <noreply@mail.inhabitme.com>',
        to: adminEmail,
        subject: `🏆 Nueva Aplicación Founding Host: ${body.fullName}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #7c3aed;">🏆 Nueva Aplicación Founding Host</h1>
            
            <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h2 style="margin-top: 0;">Información Personal</h2>
              <p><strong>Nombre:</strong> ${body.fullName}</p>
              <p><strong>Email:</strong> <a href="mailto:${body.email}">${body.email}</a></p>
              <p><strong>Teléfono:</strong> <a href="tel:${body.phone}">${body.phone}</a></p>
            </div>

            <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h2 style="margin-top: 0;">Propiedad</h2>
              <p><strong>Ciudad:</strong> ${body.city}</p>
              <p><strong>Dirección:</strong> ${body.propertyAddress}</p>
              <p><strong>Tipo:</strong> ${body.propertyType}</p>
              <p><strong>Precio Mensual:</strong> €${body.monthlyPrice}</p>
              <p><strong>Disponible desde:</strong> ${body.availableFrom}</p>
            </div>

            <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h2 style="margin-top: 0;">Motivación</h2>
              <p><strong>¿Por qué quiere ser Founding Host?</strong></p>
              <p style="white-space: pre-wrap;">${body.whyJoin}</p>
              
              ${body.aboutYou ? `
                <p><strong>Sobre él/ella:</strong></p>
                <p style="white-space: pre-wrap;">${body.aboutYou}</p>
              ` : ''}
            </div>

            <div style="margin-top: 30px; padding-top: 20px; border-top: 2px solid #e5e7eb;">
              <p style="color: #6b7280; font-size: 14px;">
                Esta aplicación fue enviada el ${new Date().toLocaleString('es-ES', { 
                  dateStyle: 'long', 
                  timeStyle: 'short' 
                })}
              </p>
              <p style="color: #6b7280; font-size: 14px;">
                <a href="https://supabase.com/dashboard/project/agjntynuysvwgzlcdmiq/editor" 
                   style="color: #7c3aed;">
                  Ver en Supabase →
                </a>
              </p>
            </div>
          </div>
        `,
      });

      console.log('✅ Email de notificación enviado a:', adminEmail);
    } catch (emailError) {
      console.error('❌ Error enviando email (no crítico):', emailError);
      // No fallar la request si el email falla
    }

    // Enviar email de confirmación al aplicante
    try {
      await resend.emails.send({
        from: process.env.EMAIL_FROM || 'InhabitMe <noreply@mail.inhabitme.com>',
        to: body.email,
        subject: '✅ Aplicación Recibida - Founding Host Program',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #7c3aed;">¡Gracias por tu aplicación, ${body.fullName}!</h1>
            
            <p style="font-size: 16px; line-height: 1.6;">
              Hemos recibido tu aplicación para el <strong>Founding Host Program</strong> de inhabitme.
            </p>

            <div style="background: #eff6ff; border-left: 4px solid #7c3aed; padding: 20px; margin: 20px 0;">
              <h2 style="margin-top: 0; color: #7c3aed;">📬 Próximos Pasos:</h2>
              <ol style="line-height: 1.8;">
                <li>Revisaremos tu aplicación en las próximas <strong>24-48 horas</strong></li>
                <li>Te contactaremos por <strong>email</strong> o <strong>WhatsApp</strong></li>
                <li>Si eres aceptado, te guiaremos en el proceso de verificación</li>
              </ol>
            </div>

            <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin-top: 0;">Resumen de tu aplicación:</h3>
              <p><strong>Propiedad:</strong> ${body.propertyType} en ${body.city}</p>
              <p><strong>Dirección:</strong> ${body.propertyAddress}</p>
              <p><strong>Precio:</strong> €${body.monthlyPrice}/mes</p>
              <p><strong>Disponible:</strong> ${body.availableFrom}</p>
            </div>

            <p style="font-size: 14px; color: #6b7280; margin-top: 30px;">
              Mientras tanto, revisa tu email (incluyendo spam) y mantén tu WhatsApp activo.
            </p>

            <div style="margin-top: 40px; padding-top: 20px; border-top: 2px solid #e5e7eb; text-align: center;">
              <p style="color: #6b7280; font-size: 14px;">
                ¿Preguntas? Escríbenos a 
                <a href="mailto:contact@inhabitme.com" style="color: #7c3aed;">contact@inhabitme.com</a>
              </p>
            </div>
          </div>
        `,
      });

      console.log('✅ Email de confirmación enviado a:', body.email);
    } catch (emailError) {
      console.error('❌ Error enviando email confirmación (no crítico):', emailError);
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
