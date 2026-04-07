/**
 * Ruta legacy del sistema de leads — redirige al dashboard.
 * El flujo de contacto ahora se gestiona 100% a través de bookings.
 */
import { redirect } from 'next/navigation'

export default function LeadSuccessRedirect() {
  redirect('/en/dashboard')
}
