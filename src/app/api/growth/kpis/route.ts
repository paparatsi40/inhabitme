import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { getSupabaseServerClient } from '@/lib/supabase/server'

function normalizeDate(input: string | null) {
  if (!input) return new Date().toISOString().split('T')[0]
  const d = new Date(input)
  if (Number.isNaN(d.getTime())) return new Date().toISOString().split('T')[0]
  return d.toISOString().split('T')[0]
}

export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const date = normalizeDate(req.nextUrl.searchParams.get('date'))
    const supabase = getSupabaseServerClient()

    const { data, error } = await supabase
      .from('growth_daily_kpis')
      .select('*')
      .eq('owner_id', userId)
      .eq('kpi_date', date)
      .maybeSingle()

    if (error) {
      console.error('[growth/kpis.GET] error:', error)
      return NextResponse.json({ error: 'Failed to load KPI row' }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      kpi: data || {
        owner_id: userId,
        kpi_date: date,
        outbound_sent: 0,
        contacted_count: 0,
        replies_count: 0,
        interested_count: 0,
        listings_started: 0,
        listings_published: 0,
        followups_done: 0,
        onboarding_calls: 0,
        inquiries_generated: 0,
        notes: null,
      },
    })
  } catch (error: any) {
    console.error('[growth/kpis.GET] error:', error)
    return NextResponse.json({ error: error?.message || 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await req.json()
    const date = normalizeDate(String(body?.kpiDate || null))

    const payload = {
      owner_id: userId,
      kpi_date: date,
      outbound_sent: Math.max(0, Number(body?.outboundSent) || 0),
      contacted_count: Math.max(0, Number(body?.contactedCount) || 0),
      replies_count: Math.max(0, Number(body?.repliesCount) || 0),
      interested_count: Math.max(0, Number(body?.interestedCount) || 0),
      listings_started: Math.max(0, Number(body?.listingsStarted) || 0),
      listings_published: Math.max(0, Number(body?.listingsPublished) || 0),
      followups_done: Math.max(0, Number(body?.followupsDone) || 0),
      onboarding_calls: Math.max(0, Number(body?.onboardingCalls) || 0),
      inquiries_generated: Math.max(0, Number(body?.inquiriesGenerated) || 0),
      notes: String(body?.notes || '').trim() || null,
    }

    const supabase = getSupabaseServerClient()

    const { data, error } = await supabase
      .from('growth_daily_kpis')
      .upsert(payload, { onConflict: 'owner_id,kpi_date' })
      .select('*')
      .single()

    if (error || !data) {
      console.error('[growth/kpis.PUT] upsert error:', error)
      return NextResponse.json({ error: 'Failed to save KPI row' }, { status: 500 })
    }

    return NextResponse.json({ success: true, kpi: data })
  } catch (error: any) {
    console.error('[growth/kpis.PUT] error:', error)
    return NextResponse.json({ error: error?.message || 'Internal server error' }, { status: 500 })
  }
}
