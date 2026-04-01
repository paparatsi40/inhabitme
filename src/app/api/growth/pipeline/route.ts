import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { getSupabaseServerClient } from '@/lib/supabase/server'

type PipelineStage =
  | 'lead'
  | 'contacted'
  | 'replied'
  | 'interested'
  | 'started_listing'
  | 'published'
  | 'live_inquiry'
  | 'lost'

const VALID_STAGES: PipelineStage[] = [
  'lead',
  'contacted',
  'replied',
  'interested',
  'started_listing',
  'published',
  'live_inquiry',
  'lost',
]

export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const stage = String(req.nextUrl.searchParams.get('stage') || '').trim()
    const city = String(req.nextUrl.searchParams.get('city') || '').trim()

    const supabase = getSupabaseServerClient()

    let query = supabase
      .from('growth_pipeline_leads')
      .select('*')
      .eq('owner_id', userId)
      .order('created_at', { ascending: false })

    if (stage && VALID_STAGES.includes(stage as PipelineStage)) {
      query = query.eq('stage', stage)
    }

    if (city) {
      query = query.eq('city', city)
    }

    const { data, error } = await query

    if (error) {
      console.error('[growth/pipeline.GET] error:', error)
      return NextResponse.json({ error: 'Failed to load pipeline' }, { status: 500 })
    }

    return NextResponse.json({ success: true, leads: data || [] })
  } catch (error: any) {
    console.error('[growth/pipeline.GET] error:', error)
    return NextResponse.json({ error: error?.message || 'Internal server error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await req.json()
    const city = String(body?.city || 'Austin').trim()
    const fullName = String(body?.fullName || '').trim() || null
    const contactValue = String(body?.contactValue || '').trim()
    const contactType = String(body?.contactType || 'email').trim().toLowerCase()
    const sourceChannel = String(body?.sourceChannel || 'manual').trim()
    const notes = String(body?.notes || '').trim() || null

    if (!contactValue) {
      return NextResponse.json({ error: 'contactValue is required' }, { status: 400 })
    }

    if (!['email', 'phone', 'whatsapp', 'dm'].includes(contactType)) {
      return NextResponse.json({ error: 'Invalid contactType' }, { status: 400 })
    }

    const supabase = getSupabaseServerClient()

    const { data, error } = await supabase
      .from('growth_pipeline_leads')
      .insert({
        owner_id: userId,
        city,
        full_name: fullName,
        contact_value: contactValue,
        contact_type: contactType,
        source_channel: sourceChannel,
        stage: 'lead',
        notes,
      })
      .select('*')
      .single()

    if (error || !data) {
      console.error('[growth/pipeline.POST] insert error:', error)

      const message = String((error as any)?.message || '')
      if (message.includes('relation') && message.includes('growth_pipeline_leads')) {
        return NextResponse.json(
          { error: 'Growth Ops tables are not available yet. Run latest database migrations and retry.' },
          { status: 500 }
        )
      }

      return NextResponse.json({ error: message || 'Failed to create lead' }, { status: 500 })
    }

    await supabase.from('growth_lead_activities').insert({
      lead_id: data.id,
      owner_id: userId,
      actor_id: userId,
      activity_type: 'lead_created',
      summary: `Lead created from ${sourceChannel}`,
      metadata: {
        stage: 'lead',
        city,
      },
    })

    return NextResponse.json({ success: true, lead: data })
  } catch (error: any) {
    console.error('[growth/pipeline.POST] error:', error)
    return NextResponse.json({ error: error?.message || 'Internal server error' }, { status: 500 })
  }
}
