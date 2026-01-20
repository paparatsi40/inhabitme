import { getSupabaseServerClient } from '@/lib/supabase/server'

export async function getHostLeads(hostEmail: string) {
  const supabase = getSupabaseServerClient()

  const { data, error } = await supabase
    .from('availability_leads')
    .select(`
      id,
      listing_id,
      city,
      neighborhood,
      start_date,
      email,
      score,
      score_label,
      paid,
      created_at
    `)
    .eq('host_email', hostEmail)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Failed to fetch host leads', error)
    return []
  }

  return data
}
