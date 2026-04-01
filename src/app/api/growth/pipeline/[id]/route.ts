import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { getSupabaseServerClient } from '@/lib/supabase/server'

type Ctx = { params: Promise<{ id: string }> }

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

export async function PATCH(req: NextRequest, { params }: Ctx) {
  try {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { id } = await params
    const body = await req.json()

    const stage = body?.stage ? String(body.stage).trim() : null
    const notes = body?.notes !== undefined ? String(body.notes || '').trim() : undefined
    const qualityScore = body?.qualityScore !== undefined ? Math.max(0, Math.min(100, Number(body.qualityScore) || 0)) : undefined
    const nextFollowUpAt = body?.nextFollowUpAt ? String(body.nextFollowUpAt) : undefined

    if (stage && !VALID_STAGES.includes(stage as PipelineStage)) {
      return NextResponse.json({ error: 'Invalid stage' }, { status: 400 })
    }

    const supabase = getSupabaseServerClient()

    const { data: existing, error: existingError } = await supabase
      .from('growth_pipeline_leads')
      .select('id, owner_id, stage')
      .eq('id', id)
      .single()

    if (existingError || !existing) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 })
    }

    if (String(existing.owner_id) !== String(userId)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const patch: any = {}
    if (stage) patch.stage = stage
    if (notes !== undefined) patch.notes = notes || null
    if (qualityScore !== undefined) patch.quality_score = qualityScore
    if (nextFollowUpAt !== undefined) patch.next_follow_up_at = nextFollowUpAt || null
    patch.last_contact_at = new Date().toISOString()

    const { data, error } = await supabase
      .from('growth_pipeline_leads')
      .update(patch)
      .eq('id', id)
      .select('*')
      .single()

    if (error || !data) {
      console.error('[growth/pipeline/:id.PATCH] update error:', error)
      return NextResponse.json({ error: 'Failed to update lead' }, { status: 500 })
    }

    await supabase.from('growth_lead_activities').insert({
      lead_id: id,
      owner_id: userId,
      actor_id: userId,
      activity_type: stage ? 'stage_change' : 'lead_update',
      summary: stage ? `Stage updated: ${existing.stage} -> ${stage}` : 'Lead updated',
      metadata: {
        fromStage: existing.stage,
        toStage: stage,
        qualityScore,
      },
    })

    return NextResponse.json({ success: true, lead: data })
  } catch (error: any) {
    console.error('[growth/pipeline/:id.PATCH] error:', error)
    return NextResponse.json({ error: error?.message || 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(_: NextRequest, { params }: Ctx) {
  try {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { id } = await params
    const supabase = getSupabaseServerClient()

    const { data: existing, error: existingError } = await supabase
      .from('growth_pipeline_leads')
      .select('id, owner_id')
      .eq('id', id)
      .single()

    if (existingError || !existing) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 })
    }

    if (String(existing.owner_id) !== String(userId)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const { error } = await supabase
      .from('growth_pipeline_leads')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('[growth/pipeline/:id.DELETE] error:', error)
      return NextResponse.json({ error: 'Failed to delete lead' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('[growth/pipeline/:id.DELETE] error:', error)
    return NextResponse.json({ error: error?.message || 'Internal server error' }, { status: 500 })
  }
}
