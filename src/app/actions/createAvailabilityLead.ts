'use server'

import { headers } from 'next/headers'
import { z } from 'zod'
import { getSupabaseServerClient } from '@/lib/supabase/server'
import { sendInternalLeadAlert } from '@/lib/email/sendInternalLeadAlert'
import { scoreLead } from '@/lib/leads/scoreLead'
import { rateLimit, getClientIp } from '@/lib/rate-limit'

// Una server action es un endpoint POST publico: cualquiera con el action id
// puede invocarla sin pasar por el formulario. Se valida, se limita por IP y se
// comprueba que el listing existe antes de escribir o de mandar ningun email.

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/

const leadSchema = z
  .object({
    listingId: z.string().uuid(),
    city: z.string().min(1).max(100),
    neighborhood: z.string().max(100).optional(),
    startDate: z.string().regex(ISO_DATE),
    endDate: z.string().regex(ISO_DATE).optional(),
    durationMonths: z.number().int().min(1).max(24).optional(),
    email: z.string().email().max(254),
    relocating: z.boolean().optional(),
  })
  .refine((v) => !Number.isNaN(Date.parse(v.startDate)), {
    message: 'startDate invalida',
    path: ['startDate'],
  })
  .refine((v) => !v.endDate || Date.parse(v.endDate) >= Date.parse(v.startDate), {
    message: 'endDate anterior a startDate',
    path: ['endDate'],
  })

type CreateLeadInput = z.infer<typeof leadSchema>

export async function createAvailabilityLead(input: CreateLeadInput) {
  const parsed = leadSchema.safeParse(input)

  if (!parsed.success) {
    throw new Error('Invalid lead data')
  }

  const ip = getClientIp(await headers())
  const { success } = await rateLimit(ip, 5, 60)

  if (!success) {
    throw new Error('Too many requests')
  }

  const data = parsed.data
  const supabase = getSupabaseServerClient()

  // El listing tiene que existir antes de insertar nada o de disparar el alert
  const { data: listing, error: listingError } = await supabase
    .from('listings')
    .select('id, owner_id')
    .eq('id', data.listingId)
    .maybeSingle()

  if (listingError || !listing) {
    throw new Error('Listing not found')
  }

  /**
   * 1️⃣ Lead scoring (server-only)
   */
  const { score, label } = scoreLead({
    city: data.city,
    neighborhood: data.neighborhood,
    startDate: data.startDate,
    relocating: data.relocating,
    email: data.email,
  })

  /**
   * 2️⃣ Resolve host email from listing owner
   */
  let hostEmail: string | null = null
  try {
    if (listing.owner_id) {
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
      listing_id: data.listingId,
      city: data.city,
      neighborhood: data.neighborhood,
      start_date: data.startDate,
      end_date: data.endDate,
      duration_months: data.durationMonths,
      email: data.email,
      relocating: data.relocating ?? false,
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
    listingId: data.listingId,
    city: data.city,
    neighborhood: data.neighborhood,
    startDate: data.startDate,
    email: data.email,
    relocating: data.relocating,
    score,
    label,
  }).catch(console.error)

  return { success: true }
}
