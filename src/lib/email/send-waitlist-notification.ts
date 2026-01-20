/**
 * Waitlist Notification System
 * Automatically notify users when a new property is added to a city they're waiting for
 */

import { Resend } from 'resend'
import { getSupabaseServerClient } from '@/lib/supabase/server'

const resend = new Resend(process.env.RESEND_API_KEY)
const FROM_EMAIL = process.env.EMAIL_FROM || 'InhabitMe <noreply@mail.inhabitme.com>'

export interface WaitlistNotificationData {
  propertyId: string
  propertyTitle: string
  cityName: string
  citySlug: string
  propertyUrl: string
  imageUrl?: string
}

// ============================================================================
// EMAIL TEMPLATE
// ============================================================================

function generateWaitlistNotificationHTML(data: WaitlistNotificationData, userEmail: string): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>¡Ya hay propiedades en ${data.cityName}!</title>
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
                🎉 ¡Buenas noticias!
              </h1>
              <p style="margin: 10px 0 0 0; color: rgba(255, 255, 255, 0.9); font-size: 18px;">
                Ya hay propiedades en ${data.cityName}
              </p>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px;">
              
              <p style="margin: 0 0 20px 0; font-size: 16px; line-height: 1.6; color: #374151;">
                Hola,
              </p>
              
              <p style="margin: 0 0 30px 0; font-size: 16px; line-height: 1.6; color: #374151;">
                Nos pediste que te avisáramos cuando tuviéramos propiedades en <strong>${data.cityName}</strong> y ¡ya están aquí!
              </p>
              
              ${data.imageUrl ? `
              <!-- Property Image -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 24px;">
                <tr>
                  <td>
                    <img src="${data.imageUrl}" alt="${data.propertyTitle}" style="width: 100%; height: auto; border-radius: 12px; display: block;" />
                  </td>
                </tr>
              </table>
              ` : ''}
              
              <!-- Property Info -->
              <div style="background: linear-gradient(135deg, #eff6ff 0%, #f3e8ff 100%); border-radius: 12px; padding: 24px; margin-bottom: 30px;">
                <h2 style="margin: 0 0 8px 0; font-size: 20px; font-weight: 700; color: #1f2937;">
                  ${data.propertyTitle}
                </h2>
                <p style="margin: 0; font-size: 14px; color: #6b7280;">
                  📍 ${data.cityName}
                </p>
              </div>
              
              <!-- CTA -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 30px;">
                <tr>
                  <td align="center">
                    <a href="${data.propertyUrl}" style="display: inline-block; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: #ffffff; text-decoration: none; padding: 16px 40px; border-radius: 12px; font-weight: 700; font-size: 16px;">
                      🏡 Ver propiedad
                    </a>
                  </td>
                </tr>
              </table>
              
              <p style="margin: 0 0 20px 0; font-size: 16px; line-height: 1.6; color: #374151; text-align: center;">
                o explora todas las opciones en ${data.cityName}:
              </p>
              
              <!-- Secondary CTA -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    <a href="https://inhabitme.com/${data.citySlug}" style="display: inline-block; background-color: #ffffff; border: 2px solid #10b981; color: #10b981; text-decoration: none; padding: 14px 32px; border-radius: 12px; font-weight: 600; font-size: 16px;">
                      Ver todas en ${data.cityName}
                    </a>
                  </td>
                </tr>
              </table>
              
              <!-- Tips -->
              <div style="background-color: #fef3c7; border-radius: 12px; padding: 24px; margin-top: 30px;">
                <p style="margin: 0 0 12px 0; font-size: 16px; font-weight: 700; color: #92400e;">
                  💡 Consejo
                </p>
                <p style="margin: 0; font-size: 14px; line-height: 1.6; color: #92400e;">
                  <strong>Actúa rápido:</strong> Las mejores propiedades se reservan en las primeras 48 horas. Sé de los primeros en contactar y asegura tu lugar.
                </p>
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

function generateWaitlistNotificationText(data: WaitlistNotificationData): string {
  return `
🎉 ¡Buenas noticias! Ya hay propiedades en ${data.cityName}

Hola,

Nos pediste que te avisáramos cuando tuviéramos propiedades en ${data.cityName} y ¡ya están aquí!

${data.propertyTitle}
📍 ${data.cityName}

🏡 Ver propiedad:
${data.propertyUrl}

O explora todas las opciones en ${data.cityName}:
https://inhabitme.com/${data.citySlug}

💡 Consejo: Las mejores propiedades se reservan en las primeras 48 horas. 
Sé de los primeros en contactar y asegura tu lugar.

¡Éxito encontrando tu próximo hogar! 🏡

— inhabitme
Estancias medias para nómadas digitales
  `.trim()
}

// ============================================================================
// MAIN FUNCTION
// ============================================================================

/**
 * Notifies all users in waitlist for a specific city
 * Call this when a new property is added
 */
export async function notifyWaitlist(data: WaitlistNotificationData) {
  try {
    console.log('[Waitlist] 🔔 Notifying waitlist for:', data.cityName)
    
    // 1. Get all users waiting for this city (not yet notified)
    const supabase = getSupabaseServerClient()
    
    const { data: waitlistUsers, error } = await supabase
      .from('property_waitlist')
      .select('id, email, city, city_slug')
      .eq('city_slug', data.citySlug)
      .eq('notified', false)
    
    if (error) {
      console.error('[Waitlist] Error fetching waitlist:', error)
      return { success: false, error }
    }
    
    if (!waitlistUsers || waitlistUsers.length === 0) {
      console.log('[Waitlist] ℹ️ No users waiting for', data.cityName)
      return { success: true, notified: 0 }
    }
    
    console.log(`[Waitlist] 📧 Sending to ${waitlistUsers.length} users...`)
    
    // 2. Send emails to all users
    const emailPromises = waitlistUsers.map(async (user) => {
      try {
        const result = await resend.emails.send({
          from: FROM_EMAIL,
          to: user.email,
          subject: `🎉 ¡Ya hay propiedades en ${data.cityName}!`,
          html: generateWaitlistNotificationHTML(data, user.email),
          text: generateWaitlistNotificationText(data),
        })
        
        console.log(`[Waitlist] ✅ Email sent to ${user.email}`)
        
        // Mark as notified in DB
        await supabase
          .from('property_waitlist')
          .update({ 
            notified: true, 
            notified_at: new Date().toISOString() 
          })
          .eq('id', user.id)
        
        return { success: true, email: user.email, id: result.id }
      } catch (emailError) {
        console.error(`[Waitlist] ❌ Error sending to ${user.email}:`, emailError)
        return { success: false, email: user.email, error: emailError }
      }
    })
    
    const results = await Promise.allSettled(emailPromises)
    
    const successful = results.filter(r => r.status === 'fulfilled' && r.value.success).length
    const failed = results.length - successful
    
    console.log(`[Waitlist] 📊 Results: ${successful} sent, ${failed} failed`)
    
    return {
      success: true,
      notified: successful,
      failed,
      total: waitlistUsers.length
    }
    
  } catch (error) {
    console.error('[Waitlist] Error in notification process:', error)
    return { success: false, error }
  }
}

/**
 * Check if there are users waiting for a city
 * Returns the count of users waiting (not yet notified)
 */
export async function getWaitlistCount(citySlug: string): Promise<number> {
  try {
    const supabase = getSupabaseServerClient()
    
    const { count, error } = await supabase
      .from('property_waitlist')
      .select('*', { count: 'exact', head: true })
      .eq('city_slug', citySlug)
      .eq('notified', false)
    
    if (error) {
      console.error('[Waitlist] Error getting count:', error)
      return 0
    }
    
    return count || 0
  } catch (error) {
    console.error('[Waitlist] Error getting count:', error)
    return 0
  }
}
