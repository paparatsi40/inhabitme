/**
 * Email Automation - InhabitMe
 * 
 * Cuando un guest paga por un lead:
 * 1. Host recibe notificación de nuevo lead
 * 2. Guest recibe template para contactar
 */

import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)
const FROM_EMAIL = process.env.EMAIL_FROM || 'InhabitMe <noreply@mail.inhabitme.com>'

// ============================================================================
// TYPES
// ============================================================================

export interface LeadNotificationData {
  // Property info
  propertyId: string
  propertyTitle: string
  propertyCity: string
  
  // Host info
  hostEmail: string
  hostName?: string
  
  // Guest info
  guestEmail: string
  guestName?: string
  
  // Payment info
  amountPaid: number
  stripeSessionId: string
  
  // Timestamp
  paidAt: Date
}

// ============================================================================
// 1. EMAIL TO HOST - "Tienes un nuevo lead"
// ============================================================================

function generateHostEmailHTML(data: LeadNotificationData): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Nuevo Lead - ${data.propertyTitle}</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f9fafb;">
  
  <!-- Container -->
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f9fafb; padding: 40px 20px;">
    <tr>
      <td align="center">
        
        <!-- Card -->
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          
          <!-- Header con gradiente -->
          <tr>
            <td style="background: linear-gradient(135deg, #2563eb 0%, #9333ea 100%); padding: 40px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 32px; font-weight: 900;">
                🎉 Nuevo Lead
              </h1>
              <p style="margin: 10px 0 0 0; color: rgba(255, 255, 255, 0.9); font-size: 18px;">
                Alguien quiere contactar contigo
              </p>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px;">
              
              <!-- Greeting -->
              <p style="margin: 0 0 20px 0; font-size: 16px; line-height: 1.6; color: #374151;">
                Hola${data.hostName ? ` ${data.hostName}` : ''},
              </p>
              
              <p style="margin: 0 0 30px 0; font-size: 16px; line-height: 1.6; color: #374151;">
                ¡Buenas noticias! <strong>Tienes un nuevo lead</strong> para tu propiedad en ${data.propertyCity}.
              </p>
              
              <!-- Property Card -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #eff6ff 0%, #f3e8ff 100%); border-radius: 12px; padding: 24px; margin-bottom: 30px;">
                <tr>
                  <td>
                    <p style="margin: 0 0 8px 0; font-size: 14px; color: #6b7280; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em;">
                      Tu propiedad
                    </p>
                    <h2 style="margin: 0; font-size: 20px; font-weight: 700; color: #1f2937;">
                      ${data.propertyTitle}
                    </h2>
                  </td>
                </tr>
              </table>
              
              <!-- Guest Info -->
              <div style="background-color: #f9fafb; border-radius: 12px; padding: 24px; margin-bottom: 30px;">
                <h3 style="margin: 0 0 16px 0; font-size: 18px; font-weight: 700; color: #1f2937;">
                  📧 Contacto del interesado
                </h3>
                <p style="margin: 0 0 12px 0; font-size: 16px; color: #374151;">
                  <strong>Email:</strong> 
                  <a href="mailto:${data.guestEmail}" style="color: #2563eb; text-decoration: none; font-weight: 600;">
                    ${data.guestEmail}
                  </a>
                </p>
                <p style="margin: 0; font-size: 14px; color: #6b7280; line-height: 1.6;">
                  💡 <strong>Consejo:</strong> Responde en las próximas 24 horas para aumentar tus posibilidades de cerrar el alquiler.
                </p>
              </div>
              
              <!-- What to do -->
              <div style="background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%); border-radius: 12px; padding: 24px; margin-bottom: 30px;">
                <h3 style="margin: 0 0 16px 0; font-size: 18px; font-weight: 700; color: #065f46;">
                  ✅ Qué hacer ahora
                </h3>
                <ol style="margin: 0; padding-left: 20px; color: #065f46; line-height: 1.8;">
                  <li><strong>Contacta al interesado</strong> por email lo antes posible</li>
                  <li><strong>Responde sus preguntas</strong> sobre la propiedad</li>
                  <li><strong>Coordina una visita</strong> (presencial o virtual)</li>
                  <li><strong>Cierra el alquiler</strong> directamente con ellos</li>
                </ol>
              </div>
              
              <!-- CTA -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 30px;">
                <tr>
                  <td align="center">
                    <a href="mailto:${data.guestEmail}" style="display: inline-block; background: linear-gradient(135deg, #2563eb 0%, #9333ea 100%); color: #ffffff; text-decoration: none; padding: 16px 40px; border-radius: 12px; font-weight: 700; font-size: 16px;">
                      📧 Contactar ahora
                    </a>
                  </td>
                </tr>
              </table>
              
              <!-- Payment info -->
              <p style="margin: 0 0 8px 0; font-size: 14px; color: #6b7280;">
                El interesado pagó <strong>€${data.amountPaid}</strong> para contactarte.
              </p>
              
              <!-- Footer message -->
              <p style="margin: 30px 0 0 0; font-size: 16px; line-height: 1.6; color: #374151;">
                ¡Éxito con el alquiler! 🎉
              </p>
              
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0 0 10px 0; font-size: 16px; font-weight: 700; color: #1f2937;">
                inhabitme
              </p>
              <p style="margin: 0; font-size: 14px; color: #6b7280;">
                Estancias medias para nómadas digitales
              </p>
            </td>
          </tr>
          
        </table>
        
      </td>
    </tr>
  </table>
  
</body>
</html>
  `.trim()
}

function generateHostEmailText(data: LeadNotificationData): string {
  return `
🎉 Nuevo Lead - ${data.propertyTitle}

Hola${data.hostName ? ` ${data.hostName}` : ''},

¡Buenas noticias! Tienes un nuevo lead para tu propiedad en ${data.propertyCity}.

📧 Contacto del interesado:
${data.guestEmail}

✅ Qué hacer ahora:
1. Contacta al interesado por email lo antes posible
2. Responde sus preguntas sobre la propiedad
3. Coordina una visita (presencial o virtual)
4. Cierra el alquiler directamente con ellos

💡 Consejo: Responde en las próximas 24 horas para aumentar tus posibilidades.

El interesado pagó €${data.amountPaid} para contactarte.

¡Éxito con el alquiler! 🎉

— inhabitme
Estancias medias para nómadas digitales
  `.trim()
}

export async function sendHostNewLeadEmail(data: LeadNotificationData) {
  try {
    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to: data.hostEmail,
      subject: `🎉 Nuevo lead para "${data.propertyTitle}"`,
      html: generateHostEmailHTML(data),
      text: generateHostEmailText(data),
    })
    
    if (result.error) {
      throw new Error(result.error.message)
    }
    
    console.log('[Email] Host notification sent:', result.data?.id)
    return { success: true, id: result.data?.id }
  } catch (error) {
    console.error('[Email] Error sending host notification:', error)
    return { success: false, error }
  }
}

// ============================================================================
// 2. EMAIL TO GUEST - Template para contactar
// ============================================================================

function generateGuestEmailHTML(data: LeadNotificationData): string {
  const emailSubject = encodeURIComponent(`Interesado en tu propiedad: ${data.propertyTitle}`)
  const emailBody = encodeURIComponent(`Hola,

Vi tu propiedad "${data.propertyTitle}" en inhabitme y me gustaría saber más detalles.

Estoy buscando alojamiento en ${data.propertyCity} y tu espacio parece perfecto para mis necesidades.

¿Podríamos coordinar una visita o videollamada para conocer más?

Gracias,
${data.guestName || 'Un saludo'}`)

  const mailtoLink = `mailto:${data.hostEmail}?subject=${emailSubject}&body=${emailBody}`

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Contacto Desbloqueado - ${data.propertyTitle}</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f9fafb;">
  
  <!-- Container -->
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f9fafb; padding: 40px 20px;">
    <tr>
      <td align="center">
        
        <!-- Card -->
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 40px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 32px; font-weight: 900;">
                ✅ Contacto Desbloqueado
              </h1>
              <p style="margin: 10px 0 0 0; color: rgba(255, 255, 255, 0.9); font-size: 18px;">
                Ya puedes contactar al anfitrión
              </p>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px;">
              
              <p style="margin: 0 0 20px 0; font-size: 16px; line-height: 1.6; color: #374151;">
                Hola${data.guestName ? ` ${data.guestName}` : ''},
              </p>
              
              <p style="margin: 0 0 30px 0; font-size: 16px; line-height: 1.6; color: #374151;">
                ¡Perfecto! Ya tienes <strong>acceso directo</strong> al anfitrión de:
              </p>
              
              <!-- Property -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #eff6ff 0%, #f3e8ff 100%); border-radius: 12px; padding: 24px; margin-bottom: 30px;">
                <tr>
                  <td>
                    <h2 style="margin: 0 0 8px 0; font-size: 20px; font-weight: 700; color: #1f2937;">
                      ${data.propertyTitle}
                    </h2>
                    <p style="margin: 0; font-size: 14px; color: #6b7280;">
                      📍 ${data.propertyCity}
                    </p>
                  </td>
                </tr>
              </table>
              
              <!-- Contact Info -->
              <div style="background-color: #f0fdf4; border: 2px solid #86efac; border-radius: 12px; padding: 24px; margin-bottom: 30px;">
                <h3 style="margin: 0 0 16px 0; font-size: 18px; font-weight: 700; color: #065f46;">
                  📧 Email del anfitrión
                </h3>
                <p style="margin: 0 0 16px 0; font-size: 18px; color: #065f46; font-weight: 600;">
                  <a href="mailto:${data.hostEmail}" style="color: #059669; text-decoration: none;">
                    ${data.hostEmail}
                  </a>
                </p>
                
                <!-- CTA Button -->
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td align="center">
                      <a href="${mailtoLink}" style="display: inline-block; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: #ffffff; text-decoration: none; padding: 16px 32px; border-radius: 12px; font-weight: 700; font-size: 16px;">
                        ✉️ Enviar email ahora
                      </a>
                    </td>
                  </tr>
                </table>
              </div>
              
              <!-- Template -->
              <div style="background-color: #f9fafb; border-radius: 12px; padding: 24px; margin-bottom: 30px;">
                <h3 style="margin: 0 0 16px 0; font-size: 18px; font-weight: 700; color: #1f2937;">
                  📝 Template para tu primer mensaje
                </h3>
                <div style="background-color: #ffffff; border: 1px solid #e5e7eb; border-radius: 8px; padding: 16px; font-family: monospace; font-size: 14px; line-height: 1.6; color: #374151;">
<strong>Asunto:</strong> Interesado en tu propiedad: ${data.propertyTitle}

<strong>Mensaje:</strong>
Hola,

Vi tu propiedad "${data.propertyTitle}" en inhabitme y me gustaría saber más detalles.

Estoy buscando alojamiento en ${data.propertyCity} y tu espacio parece perfecto para mis necesidades.

¿Podríamos coordinar una visita o videollamada para conocer más?

Gracias,
[Tu nombre]
                </div>
              </div>
              
              <!-- Next Steps -->
              <div style="background-color: #fef3c7; border-radius: 12px; padding: 24px;">
                <h3 style="margin: 0 0 16px 0; font-size: 18px; font-weight: 700; color: #92400e;">
                  💡 Próximos pasos
                </h3>
                <ol style="margin: 0; padding-left: 20px; color: #92400e; line-height: 1.8;">
                  <li><strong>Envía el email</strong> al anfitrión lo antes posible</li>
                  <li><strong>Espera su respuesta</strong> (usualmente <24h)</li>
                  <li><strong>Coordina una visita</strong> o videollamada</li>
                  <li><strong>Cierra los detalles</strong> (fechas, precio, contrato)</li>
                </ol>
              </div>
              
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0 0 10px 0; font-size: 16px; font-weight: 700; color: #1f2937;">
                inhabitme
              </p>
              <p style="margin: 0; font-size: 14px; color: #6b7280;">
                ¡Éxito encontrando tu próximo hogar! 🏡
              </p>
            </td>
          </tr>
          
        </table>
        
      </td>
    </tr>
  </table>
  
</body>
</html>
  `.trim()
}

function generateGuestEmailText(data: LeadNotificationData): string {
  return `
✅ Contacto Desbloqueado - ${data.propertyTitle}

Hola${data.guestName ? ` ${data.guestName}` : ''},

¡Perfecto! Ya tienes acceso directo al anfitrión de:
${data.propertyTitle} - ${data.propertyCity}

📧 Email del anfitrión:
${data.hostEmail}

📝 Template para tu primer mensaje:

Asunto: Interesado en tu propiedad: ${data.propertyTitle}

Mensaje:
Hola,

Vi tu propiedad "${data.propertyTitle}" en inhabitme y me gustaría saber más detalles.

Estoy buscando alojamiento en ${data.propertyCity} y tu espacio parece perfecto para mis necesidades.

¿Podríamos coordinar una visita o videollamada para conocer más?

Gracias,
[Tu nombre]

---

💡 Próximos pasos:
1. Envía el email al anfitrión lo antes posible
2. Espera su respuesta (usualmente <24h)
3. Coordina una visita o videollamada
4. Cierra los detalles (fechas, precio, contrato)

¡Éxito encontrando tu próximo hogar! 🏡

— inhabitme
  `.trim()
}

export async function sendGuestUnlockedEmail(data: LeadNotificationData) {
  try {
    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to: data.guestEmail,
      subject: `✅ Contacto desbloqueado: ${data.propertyTitle}`,
      html: generateGuestEmailHTML(data),
      text: generateGuestEmailText(data),
    })
    
    console.log('[Email] Guest confirmation sent:', result.data?.id || 'unknown')
    return { success: true, id: result.data?.id || 'unknown' }
  } catch (error) {
    console.error('[Email] Error sending guest confirmation:', error)
    return { success: false, error }
  }
}

// ============================================================================
// 3. MAIN FUNCTION - Envía ambos emails
// ============================================================================

export async function sendLeadNotificationEmails(data: LeadNotificationData) {
  console.log('[Email] Sending lead notifications for:', data.propertyTitle)
  
  const results = await Promise.allSettled([
    sendHostNewLeadEmail(data),
    sendGuestUnlockedEmail(data),
  ])
  
  const [hostResult, guestResult] = results
  
  return {
    host: hostResult.status === 'fulfilled' ? hostResult.value : { success: false },
    guest: guestResult.status === 'fulfilled' ? guestResult.value : { success: false },
  }
}
