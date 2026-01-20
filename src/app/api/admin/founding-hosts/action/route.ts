import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { auth } from '@clerk/nextjs/server';
import { Resend } from 'resend';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    // Verify admin
    const { userId, sessionClaims } = await auth();
    const publicMetadata = (sessionClaims as any)?.public_metadata || (sessionClaims as any)?.publicMetadata || (sessionClaims as any)?.metadata;
    const role = publicMetadata?.role;
    
    // TEMPORARY: Hardcode your user ID as admin until Clerk token is configured
    const TEMP_ADMIN_USER_ID = 'user_37XxJQhGu4KbCylCP8ra8P8Nt0i';
    const isAdmin = role === 'admin' || userId === TEMP_ADMIN_USER_ID;
    
    if (!userId || !isAdmin) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { id, action } = body; // action: 'approve' | 'reject'

    if (!id || !action) {
      return NextResponse.json(
        { error: 'Missing id or action' },
        { status: 400 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Get application details
    const { data: app, error: fetchError } = await supabase
      .from('founding_host_applications')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError || !app) {
      return NextResponse.json(
        { error: 'Application not found' },
        { status: 404 }
      );
    }

    // Update status
    const newStatus = action === 'approve' ? 'approved' : 'rejected';
    const { error: updateError } = await supabase
      .from('founding_host_applications')
      .update({ 
        status: newStatus,
        reviewed_at: new Date().toISOString()
      })
      .eq('id', id);

    if (updateError) {
      console.error('Update error:', updateError);
      return NextResponse.json(
        { error: 'Error updating application' },
        { status: 500 }
      );
    }

    // Send email to applicant
    try {
      if (action === 'approve') {
        // Count approved applications to assign spot number
        const { data: approvedApps } = await supabase
          .from('founding_host_applications')
          .select('id')
          .eq('status', 'approved');
        
        const spotNumber = (approvedApps?.length || 0);

        // Generate unique invitation token
        const invitationToken = `fh_${Date.now()}_${Math.random().toString(36).substring(7)}`;
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 14); // Expires in 14 days

        // Create invitation in database
        const { error: invitationError } = await supabase
          .from('founding_host_invitations')
          .insert({
            application_id: id,
            token: invitationToken,
            email: app.email,
            founding_host_number: spotNumber,
            status: 'pending',
            expires_at: expiresAt.toISOString()
          });

        if (invitationError) {
          console.error('Error creating invitation:', invitationError);
          return NextResponse.json(
            { error: 'Error creating invitation' },
            { status: 500 }
          );
        }

        const invitationUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/founding-host/join/${invitationToken}`;

        await resend.emails.send({
          from: process.env.EMAIL_FROM || 'inhabitme <noreply@inhabitme.com>',
          to: app.email,
          subject: '🎉 ¡Felicidades! Has sido aceptado como Founding Host',
          html: `
            <!DOCTYPE html>
            <html>
            <head>
              <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0; text-align: center; }
                .content { background: #fff; padding: 30px; border: 1px solid #e0e0e0; border-top: none; border-radius: 0 0 10px 10px; }
                .badge { background: #ffd700; color: #333; padding: 10px 20px; border-radius: 50px; display: inline-block; font-weight: bold; margin: 20px 0; }
                .cta { background: #667eea; color: white; padding: 15px 30px; text-decoration: none; border-radius: 50px; display: inline-block; margin: 20px 0; font-weight: bold; }
                ul { padding-left: 20px; }
                li { margin: 10px 0; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h1 style="margin: 0;">🏆 ¡Felicidades ${app.full_name}!</h1>
                  <p style="margin: 10px 0 0 0; font-size: 18px;">Has sido aceptado como Founding Host</p>
                </div>
                
                <div class="content">
                  <div class="badge">Founding Host #${spotNumber} of 10</div>
                  
                  <p>Nos emociona tenerte como uno de nuestros primeros 10 Founding Hosts de inhabitme.</p>
                  
                  <h2>🎁 Tus Beneficios:</h2>
                  <ul>
                    <li><strong>Gratis durante todo 2026</strong> - Cero comisiones</li>
                    <li><strong>Featured listings sin costo</strong> en 2026</li>
                    <li><strong>Badge exclusivo</strong> "Founding Host #${spotNumber} of 10"</li>
                    <li><strong>Prioridad en búsquedas</strong> durante 2026</li>
                  </ul>
                  
                  <h2>📋 Próximos Pasos:</h2>
                  <ol>
                    <li><strong>Crea tu cuenta:</strong> Click en el botón de abajo para registrarte</li>
                    <li><strong>Completa tu perfil:</strong> Agrega foto y detalles</li>
                    <li><strong>Publica tu propiedad:</strong> Sube fotos y descripción</li>
                    <li><strong>¡Listo!</strong> Empieza a recibir inquilinos</li>
                  </ol>
                  
                  <div style="text-align: center; margin: 30px 0;">
                    <a href="${invitationUrl}" class="cta">✨ Crear Mi Cuenta de Founding Host</a>
                  </div>
                  
                  <p style="color: #666; font-size: 14px; margin-top: 30px;">
                    ⏰ Este link de invitación expira en <strong>14 días</strong><br/>
                    📧 Si tienes preguntas, responde este email<br/>
                    🔗 Link de invitación: <a href="${invitationUrl}">${invitationUrl}</a>
                  </p>
                  </ol>
                  
                  <h2>🎁 Tus Beneficios:</h2>
                  <ul>
                    <li>✅ Gratis durante TODO 2026</li>
                    <li>✅ Badge "Founding Host #${spotNumber} of 10"</li>
                    <li>✅ Featured listings sin costo</li>
                    <li>✅ WhatsApp directo con founder</li>
                    <li>✅ Reconocimiento en homepage</li>
                  </ul>
                  
                  <h2>📞 Contacto:</h2>
                  <p>Te contactaremos por WhatsApp en las próximas 24-48 horas para coordinar los siguientes pasos.</p>
                  
                  <p>Mientras tanto, si tienes preguntas, responde este email o escríbenos a WhatsApp.</p>
                  
                  <p style="margin-top: 30px;"><strong>¡Bienvenido a inhabitme! 🚀</strong></p>
                  
                  <p style="color: #666; font-size: 14px; margin-top: 30px;">
                    inhabitme<br>
                    Building the future of medium-term stays
                  </p>
                </div>
              </div>
            </body>
            </html>
          `,
        });
      } else {
        // Rejection email
        await resend.emails.send({
          from: process.env.EMAIL_FROM || 'inhabitme <noreply@inhabitme.com>',
          to: app.email,
          subject: 'Actualización sobre tu aplicación a Founding Host',
          html: `
            <!DOCTYPE html>
            <html>
            <head>
              <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .content { background: #fff; padding: 30px; border: 1px solid #e0e0e0; border-radius: 10px; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="content">
                  <h1>Hola ${app.full_name},</h1>
                  
                  <p>Gracias por tu interés en ser Founding Host de inhabitme.</p>
                  
                  <p>Lamentablemente, en este momento no podemos aceptar tu aplicación para el programa de Founding Hosts, ya que los 10 spots están completos o buscamos perfiles específicos para esta fase inicial.</p>
                  
                  <p><strong>Esto NO significa que no puedas ser parte de inhabitme.</strong></p>
                  
                  <p>Te invitamos a:</p>
                  <ul>
                    <li>Unirte como host regular cuando lancemos públicamente (muy pronto)</li>
                    <li>Mantenerte al tanto - te avisaremos cuando abramos el registro</li>
                  </ul>
                  
                  <p>Valoramos mucho tu interés y esperamos poder trabajar contigo en el futuro.</p>
                  
                  <p>¡Gracias!<br>
                  El equipo de inhabitme</p>
                </div>
              </div>
            </body>
            </html>
          `,
        });
      }

      // Notify admin
      await resend.emails.send({
        from: process.env.EMAIL_FROM || 'inhabitme <noreply@inhabitme.com>',
        to: process.env.INTERNAL_ALERT_EMAIL || 'contact@inhabitme.com',
        subject: `[ADMIN] Aplicación ${action === 'approve' ? 'ACEPTADA' : 'RECHAZADA'}: ${app.full_name}`,
        html: `
          <h2>Acción realizada en Founding Host Application</h2>
          <p><strong>Aplicante:</strong> ${app.full_name}</p>
          <p><strong>Email:</strong> ${app.email}</p>
          <p><strong>Acción:</strong> ${action === 'approve' ? '✅ ACEPTADO' : '❌ RECHAZADO'}</p>
          <p><strong>Ciudad:</strong> ${app.city}</p>
          <p><strong>Propiedad:</strong> ${app.property_address}</p>
          
          ${action === 'approve' ? '<p><strong>Próximos pasos:</strong> Contactar por WhatsApp para verificación.</p>' : ''}
        `,
      });
    } catch (emailError) {
      console.error('Email error:', emailError);
      // Continue even if email fails
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
