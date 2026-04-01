import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { getSupabaseServerClient } from '@/lib/supabase/server'
import { scoreLead } from '@/lib/leads/scoreLead'

const toIsoDate = (value: string) => {
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return null
  return d.toISOString().split('T')[0]
}

function getDefaultStartDate() {
  const now = new Date()
  now.setDate(now.getDate() + 14)
  return now.toISOString().split('T')[0]
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    const listingId = String(body?.listingId || '').trim()
    const moveInDateRaw = String(body?.moveInDate || '').trim()
    const durationMonthsRaw = Number(body?.durationMonths)
    const message = String(body?.message || '').trim()
    const guestEmailFromBody = String(body?.guestEmail || '').trim().toLowerCase()

    if (!listingId) {
      return NextResponse.json({ error: 'listingId is required' }, { status: 400 })
    }

    if (!durationMonthsRaw || durationMonthsRaw < 1 || durationMonthsRaw > 12) {
      return NextResponse.json({ error: 'Duration must be between 1 and 12 months' }, { status: 400 })
    }

    if (message.length < 8) {
      return NextResponse.json({ error: 'Please write a longer message (min 8 characters)' }, { status: 400 })
    }

    const { userId } = await auth()
    const supabase = getSupabaseServerClient()

    const { data: listing, error: listingError } = await supabase
      .from('listings')
      .select('id, city_name, neighborhood, owner_id, title, status')
      .eq('id', listingId)
      .single()

    if (listingError || !listing) {
      return NextResponse.json({ error: 'Listing not found' }, { status: 404 })
    }

    if (listing.status !== 'active') {
      return NextResponse.json({ error: 'Listing is not available' }, { status: 400 })
    }

    if (userId && String(listing.owner_id) === String(userId)) {
      return NextResponse.json({ error: 'You cannot send an inquiry to your own listing' }, { status: 400 })
    }

    const startDate = toIsoDate(moveInDateRaw) || getDefaultStartDate()

    const { score, label } = scoreLead({
      city: listing.city_name || '',
      neighborhood: listing.neighborhood || undefined,
      startDate,
      email: guestEmailFromBody || 'guest@inhabitme.local',
    })

    const { data: inserted, error: insertError } = await supabase
      .from('availability_leads')
      .insert({
        listing_id: listing.id,
        city: listing.city_name,
        neighborhood: listing.neighborhood || null,
        start_date: startDate,
        duration_months: durationMonthsRaw,
        email: guestEmailFromBody || null,
        source: `inquiry_form:${message}`,
        relocating: false,
        score,
        score_label: label,
      })
      .select('id')
      .single()

    if (insertError) {
      console.error('[inquiries.POST] insert error:', insertError)
      return NextResponse.json({ error: 'Failed to create inquiry' }, { status: 500 })
    }

    return NextResponse.json({ success: true, inquiryId: inserted.id })
  } catch (error: any) {
    console.error('[inquiries.POST] error:', error)
    return NextResponse.json({ error: error?.message || 'Internal server error' }, { status: 500 })
  }
}
