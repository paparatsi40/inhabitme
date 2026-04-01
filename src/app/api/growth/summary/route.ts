import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { getSupabaseServerClient } from '@/lib/supabase/server'

const STAGES = [
  'lead',
  'contacted',
  'replied',
  'interested',
  'started_listing',
  'published',
  'live_inquiry',
  'lost',
] as const

export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const days = Math.max(1, Math.min(90, Number(req.nextUrl.searchParams.get('days')) || 30))
    const from = new Date()
    from.setDate(from.getDate() - (days - 1))
    const fromDate = from.toISOString().split('T')[0]

    const supabase = getSupabaseServerClient()

    const [{ data: leads }, { data: kpis }, { data: activities }] = await Promise.all([
      supabase
        .from('growth_pipeline_leads')
        .select('id, stage, city, source_channel, created_at')
        .eq('owner_id', userId),
      supabase
        .from('growth_daily_kpis')
        .select('*')
        .eq('owner_id', userId)
        .gte('kpi_date', fromDate)
        .order('kpi_date', { ascending: true }),
      supabase
        .from('growth_lead_activities')
        .select('id, lead_id, owner_id, activity_type, summary, occurred_at')
        .eq('owner_id', userId)
        .gte('occurred_at', `${fromDate}T00:00:00`)
        .order('occurred_at', { ascending: false })
        .limit(30),
    ])

    const stageCounts = STAGES.reduce((acc, stage) => {
      acc[stage] = (leads || []).filter((lead: any) => lead.stage === stage).length
      return acc
    }, {} as Record<string, number>)

    const totals = (kpis || []).reduce(
      (acc: any, row: any) => {
        acc.outboundSent += Number(row.outbound_sent || 0)
        acc.contactedCount += Number(row.contacted_count || 0)
        acc.repliesCount += Number(row.replies_count || 0)
        acc.interestedCount += Number(row.interested_count || 0)
        acc.listingsStarted += Number(row.listings_started || 0)
        acc.listingsPublished += Number(row.listings_published || 0)
        acc.followupsDone += Number(row.followups_done || 0)
        acc.onboardingCalls += Number(row.onboarding_calls || 0)
        acc.inquiriesGenerated += Number(row.inquiries_generated || 0)
        return acc
      },
      {
        outboundSent: 0,
        contactedCount: 0,
        repliesCount: 0,
        interestedCount: 0,
        listingsStarted: 0,
        listingsPublished: 0,
        followupsDone: 0,
        onboardingCalls: 0,
        inquiriesGenerated: 0,
      }
    )

    const conversion = {
      contactRate: totals.outboundSent > 0 ? totals.contactedCount / totals.outboundSent : 0,
      replyRate: totals.contactedCount > 0 ? totals.repliesCount / totals.contactedCount : 0,
      publishRate: totals.interestedCount > 0 ? totals.listingsPublished / totals.interestedCount : 0,
    }

    return NextResponse.json({
      success: true,
      days,
      stageCounts,
      totals,
      conversion,
      timeline: kpis || [],
      recentActivities: activities || [],
    })
  } catch (error: any) {
    console.error('[growth/summary.GET] error:', error)
    return NextResponse.json({ error: error?.message || 'Internal server error' }, { status: 500 })
  }
}
