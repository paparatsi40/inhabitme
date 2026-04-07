'use server'

import { getSupabaseServerClient } from '@/lib/supabase/server'
import { sendInternalLeadAlert } from '@/lib/email/sendInternalLeadAlert'
import { scoreLead } from '@/lib/leads/scoreLead'

type CreateLeadInput = {
  listingId: string
  city: string
  neighborhood?: string
  startDate: string
  endDate?: string
  durationMonths?: number
  email: string
  relocating?: boolean
}

export async function createAvailabilityLead(input: CreateLeadInput) {
  const supabase = getSupabaseServerClient()

  /**
   * 1️⃣ Lead scoring (server-only)
   */
  const { score, label } = scoreLead({
    city: input.city,
    neighborhood: input.neighborhood,
    startDate: input.startDate,
    relocating: input.relocating,
    email: input.email,
  })

  /**
   * 2️⃣ Resolve host email from listing owner
   */
  let hostEmail: string | null = null
  try {
    const { data: listing } = await supabase
      .from('listings')
      .select('owner_id')
      .eq('id', input.listingId)
      .single()

    if (listing?.owner_id) {
      // Try User table first (legacy)
      const { data: userRow } = await supabase
        .from('User')
        .select('email')
        .or(`clerkId.eq.${listing.owner_id},id.eq.${listing.owner_id}`)
        .maybeSingle()

      hostEmail = (userRow as any)?.email ?? null
    }
  } catch (e) {
    console.warn('[createAvailabilityLead] Could not resolve host email:', e)
  }

  /**
   * 3️⃣ Persist lead
   */
  const { error } = await supabase
    .from('availability_leads')
    .insert({
      listing_id: input.listingId,
      city: input.city,
      neighborhood: input.neighborhood,
      start_date: input.startDate,
      end_date: input.endDate,
      duration_months: input.durationMonths,
      email: input.email,
      relocating: input.relocating ?? false,
      source: 'seo',

      // ✅ Lead scoring fields
      score,
      score_label: label,

      // ✅ Host email — necesario para filtrar leads por host en el dashboard
      host_email: hostEmail,
    })

  if (error) {
    console.error('Failed to create availability lead:', error)
    throw new Error('Failed to create lead')
  }

  /**
   * 4️⃣ Internal alert (non-blocking)
   */
  sendInternalLeadAlert({
    listingId: input.listingId,
    city: input.city,
    neighborhood: input.neighborhood,
    startDate: input.startDate,
    email: input.email,
    relocating: input.relocating,
    score,
    label,
  }).catch(console.error)

  return { success: true }
}
