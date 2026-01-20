import { createClient } from '@supabase/supabase-js'

export function getSupabaseServerClient() {
  console.log('SUPABASE URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
  console.log(
    'SUPABASE SERVICE ROLE PRESENT:',
    Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY)
  )

  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}
