// Cliente de Supabase para el navegador
export {
  getSupabaseBrowserClient,
  getSupabaseBrowserClientWithRealtime,
  supabaseClient,
} from './client'

// Cliente de Supabase para el servidor
export { getSupabaseServerClient } from './server'

// Hook seguro para suscripciones realtime
export {
  useSupabaseSubscription,
  type UseSupabaseSubscriptionOptions,
} from './useSupabaseSubscription'
