import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseServerClient } from '@/lib/supabase/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: NextRequest) {
  try {
    const { email, city, citySlug } = await request.json()
    
    console.log('[Waitlist] Starting process for:', { email, city, citySlug })

    if (!email || !city) {
      return NextResponse.json(
        { error: 'Email y ciudad son requeridos' },
        { status: 400 }
      )
    }

    // Guardar en base de datos
    const supabase = getSupabaseServerClient()
    
    const { data, error: dbError } = await supabase
      .from('property_waitlist')
      .insert({
        email,
        city,
        city_slug: citySlug,
        created_at: new Date().toISOString(),
        notified: false,
      })
      .select()
      .single()

    if (dbError) {
      console.error('[Waitlist] ❌ DB ERROR:', dbError)
      // Continuar aunque falle la DB
    } else {
      console.log('[Waitlist] ✅ Saved to DB successfully')
    }

    // Enviar email de confirmación al usuario
    console.log('[Waitlist] 📧 Attempting to send user email to:', email)
    try {
      await resend.emails.send({
        from: 'InhabitMe <noreply@mail.inhabitme.com>',
        to: email,
        subject: `Te avisaremos cuando haya propiedades en ${city}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%); padding: 40px 20px; text-align: center; border-radius: 12px 12px 0 0;">
              <h1 style="color: white; margin: 0; font-size: 28px;">¡Gracias por tu interés!</h1>
            </div>
            
            <div style="background: white; padding: 40px 20px; border-radius: 0 0 12px 12px; border: 1px solid #e5e7eb;">
              <p style="font-size: 16px; color: #374151; line-height: 1.6;">
                Hola,
              </p>
              
              <p style="font-size: 16px; color: #374151; line-height: 1.6;">
                Te confirmo que estás en nuestra lista de espera para <strong>${city}</strong>.
              </p>
              
              <p style="font-size: 16px; color: #374151; line-height: 1.6;">
                Te avisaremos por email tan pronto tengamos propiedades disponibles que cumplan con nuestros estándares:
              </p>
              
              <ul style="font-size: 16px; color: #374151; line-height: 1.8;">
                <li>✅ WiFi verificado de alta velocidad</li>
                <li>✅ Escritorio dedicado para trabajar</li>
                <li>✅ Estancias flexibles de 1-12 meses</li>
                <li>✅ Sin comisiones ocultas</li>
              </ul>
              
              <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 30px 0;">
                <p style="font-size: 14px; color: #6b7280; margin: 0;">
                  <strong>Mientras tanto:</strong> Explora nuestras propiedades en otras ciudades en 
                  <a href="https://inhabitme.com" style="color: #3b82f6; text-decoration: none;">inhabitme.com</a>
                </p>
              </div>
              
              <p style="font-size: 16px; color: #374151; line-height: 1.6;">
                ¡Gracias por confiar en inhabitme!
              </p>
              
              <p style="font-size: 16px; color: #374151; line-height: 1.6;">
                El equipo de inhabitme
              </p>
            </div>
            
            <div style="text-align: center; padding: 20px; color: #9ca3af; font-size: 12px;">
              <p>inhabitme - Alojamiento para nómadas digitales</p>
            </div>
          </div>
        `,
      })
      console.log('[Waitlist] ✅ User email sent successfully')
    } catch (emailError) {
      console.error('[Waitlist] ❌ USER EMAIL ERROR:', emailError)
      // No fallar si el email no se envía
    }

    // Notificar al admin (tú)
    console.log('[Waitlist] 📧 Attempting to send admin email')
    try {
      await resend.emails.send({
        from: 'InhabitMe <noreply@mail.inhabitme.com>',
        to: 'carlos@inhabitme.com', // Email directo sin alias
        subject: `🔔 Nuevo interesado en ${city}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #1f2937;">Nuevo registro en waitlist</h2>
            <p><strong>Ciudad:</strong> ${city}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Fecha:</strong> ${new Date().toLocaleString('es-ES')}</p>
          </div>
        `,
      })
      console.log('[Waitlist] ✅ Admin email sent successfully')
    } catch (adminEmailError) {
      console.error('[Waitlist] ❌ ADMIN EMAIL ERROR:', adminEmailError)
    }

    console.log('[Waitlist] ✅ Process completed successfully')
    return NextResponse.json({ 
      success: true,
      message: 'Registrado correctamente' 
    })

  } catch (error) {
    console.error('[Waitlist] Error:', error)
    return NextResponse.json(
      { error: 'Error al procesar la solicitud' },
      { status: 500 }
    )
  }
}
