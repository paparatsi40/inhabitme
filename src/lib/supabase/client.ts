import { createClient } from '@supabase/supabase-js'

// Cliente de Supabase para el navegador (usa ANON key, no SERVICE_ROLE)
export function getSupabaseBrowserClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

// Cliente para flujos que requieran realtime (mismo constructor; las suscripciones se activan al usarlas)
export function getSupabaseBrowserClientWithRealtime() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

// Export legacy para compatibilidad
export const supabaseClient = getSupabaseBrowserClient()
