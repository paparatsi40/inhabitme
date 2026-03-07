import { createClient } from '@supabase/supabase-js'

// Cliente de Supabase para el navegador (usa ANON key, no SERVICE_ROLE)
// Realtime deshabilitado por defecto para evitar errores WebSocket
export function getSupabaseBrowserClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      realtime: {
        enabled: false, // Deshabilitado por defecto, habilitar solo cuando se necesite
      },
    }
  )
}

// Cliente con realtime habilitado (usar solo cuando se necesiten suscripciones en tiempo real)
export function getSupabaseBrowserClientWithRealtime() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      realtime: {
        enabled: true,
        timeout: 20000,
        heartbeatIntervalMs: 15000,
      },
    }
  )
}

// Export legacy para compatibilidad
export const supabaseClient = getSupabaseBrowserClient()
