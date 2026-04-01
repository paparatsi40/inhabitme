'use client'

import { useEffect, useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

type Lead = {
  id: string
  city: string
  full_name: string | null
  contact_value: string
  contact_type: string
  source_channel: string
  stage: string
  quality_score: number
  next_follow_up_at: string | null
  notes: string | null
}

type Kpi = {
  kpi_date: string
  outbound_sent: number
  contacted_count: number
  replies_count: number
  interested_count: number
  listings_started: number
  listings_published: number
  followups_done: number
  onboarding_calls: number
  inquiries_generated: number
  notes: string | null
}

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

export function GrowthOpsClient() {
  const [loading, setLoading] = useState(true)
  const [leads, setLeads] = useState<Lead[]>([])
  const [kpi, setKpi] = useState<Kpi | null>(null)

  const [fullName, setFullName] = useState('')
  const [contactValue, setContactValue] = useState('')
  const [contactType, setContactType] = useState('email')
  const [sourceChannel, setSourceChannel] = useState('manual')
  const [city, setCity] = useState('Austin')

  const [savingKpi, setSavingKpi] = useState(false)

  const today = useMemo(() => new Date().toISOString().split('T')[0], [])

  async function loadAll() {
    setLoading(true)
    try {
      const [pipelineRes, kpiRes] = await Promise.all([
        fetch('/api/growth/pipeline', { cache: 'no-store' }),
        fetch(`/api/growth/kpis?date=${today}`, { cache: 'no-store' }),
      ])

      const pipelineData = await pipelineRes.json()
      const kpiData = await kpiRes.json()

      setLeads(pipelineData.leads || [])
      setKpi(kpiData.kpi || null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadAll()
  }, [])

  async function createLead() {
    if (!contactValue.trim()) return

    const res = await fetch('/api/growth/pipeline', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fullName,
        contactValue,
        contactType,
        sourceChannel,
        city,
      }),
    })

    if (res.ok) {
      setFullName('')
      setContactValue('')
      await loadAll()
    }
  }

  async function updateStage(leadId: string, stage: string) {
    const res = await fetch(`/api/growth/pipeline/${leadId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ stage }),
    })

    if (res.ok) {
      await loadAll()
    }
  }

  async function saveKpi() {
    if (!kpi) return
    setSavingKpi(true)
    try {
      const res = await fetch('/api/growth/kpis', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          kpiDate: kpi.kpi_date,
          outboundSent: kpi.outbound_sent,
          contactedCount: kpi.contacted_count,
          repliesCount: kpi.replies_count,
          interestedCount: kpi.interested_count,
          listingsStarted: kpi.listings_started,
          listingsPublished: kpi.listings_published,
          followupsDone: kpi.followups_done,
          onboardingCalls: kpi.onboarding_calls,
          inquiriesGenerated: kpi.inquiries_generated,
          notes: kpi.notes,
        }),
      })

      if (res.ok) {
        await loadAll()
      }
    } finally {
      setSavingKpi(false)
    }
  }

  const stageCounts = useMemo(() => {
    return STAGES.reduce((acc, stage) => {
      acc[stage] = leads.filter((lead) => lead.stage === stage).length
      return acc
    }, {} as Record<string, number>)
  }, [leads])

  if (loading) {
    return <div className="text-sm text-gray-600">Loading growth ops...</div>
  }

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-2xl p-5 border-2 border-gray-200">
        <h3 className="text-lg font-black mb-4">Add lead</h3>
        <div className="grid md:grid-cols-6 gap-2">
          <Input placeholder="Name" value={fullName} onChange={(e) => setFullName(e.target.value)} />
          <Input placeholder="Contact" value={contactValue} onChange={(e) => setContactValue(e.target.value)} />
          <Input placeholder="Type (email/phone/whatsapp/dm)" value={contactType} onChange={(e) => setContactType(e.target.value)} />
          <Input placeholder="Source (facebook/craigslist/whatsapp)" value={sourceChannel} onChange={(e) => setSourceChannel(e.target.value)} />
          <Input placeholder="City" value={city} onChange={(e) => setCity(e.target.value)} />
          <Button onClick={createLead}>Add</Button>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-5 border-2 border-gray-200">
        <h3 className="text-lg font-black mb-4">Pipeline board</h3>
        <div className="grid md:grid-cols-4 lg:grid-cols-8 gap-3 mb-4">
          {STAGES.map((stage) => (
            <div key={stage} className="rounded-xl border border-gray-200 p-3">
              <div className="text-xs uppercase text-gray-500 font-semibold">{stage}</div>
              <div className="text-2xl font-black">{stageCounts[stage] || 0}</div>
            </div>
          ))}
        </div>

        <div className="space-y-2 max-h-[420px] overflow-y-auto">
          {leads.map((lead) => (
            <div key={lead.id} className="rounded-xl border border-gray-200 p-3 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-2">
              <div>
                <div className="font-semibold text-gray-900">{lead.full_name || 'Unnamed lead'}</div>
                <div className="text-sm text-gray-600">{lead.contact_value} · {lead.source_channel} · {lead.city}</div>
              </div>
              <div className="flex gap-2 items-center">
                <select
                  className="border border-gray-300 rounded-lg px-2 py-1 text-sm"
                  value={lead.stage}
                  onChange={(e) => updateStage(lead.id, e.target.value)}
                >
                  {STAGES.map((stage) => (
                    <option key={stage} value={stage}>{stage}</option>
                  ))}
                </select>
              </div>
            </div>
          ))}
          {leads.length === 0 ? (
            <div className="text-sm text-gray-500">No leads yet. Add your first one above.</div>
          ) : null}
        </div>
      </div>

      {kpi && (
        <div className="bg-white rounded-2xl p-5 border-2 border-gray-200">
          <h3 className="text-lg font-black mb-4">Daily KPI — {kpi.kpi_date}</h3>
          <div className="grid md:grid-cols-5 gap-3">
            <Input type="number" placeholder="Outbound" value={kpi.outbound_sent} onChange={(e) => setKpi({ ...kpi, outbound_sent: Number(e.target.value) || 0 })} />
            <Input type="number" placeholder="Contacted" value={kpi.contacted_count} onChange={(e) => setKpi({ ...kpi, contacted_count: Number(e.target.value) || 0 })} />
            <Input type="number" placeholder="Replies" value={kpi.replies_count} onChange={(e) => setKpi({ ...kpi, replies_count: Number(e.target.value) || 0 })} />
            <Input type="number" placeholder="Interested" value={kpi.interested_count} onChange={(e) => setKpi({ ...kpi, interested_count: Number(e.target.value) || 0 })} />
            <Input type="number" placeholder="Started" value={kpi.listings_started} onChange={(e) => setKpi({ ...kpi, listings_started: Number(e.target.value) || 0 })} />
            <Input type="number" placeholder="Published" value={kpi.listings_published} onChange={(e) => setKpi({ ...kpi, listings_published: Number(e.target.value) || 0 })} />
            <Input type="number" placeholder="Followups" value={kpi.followups_done} onChange={(e) => setKpi({ ...kpi, followups_done: Number(e.target.value) || 0 })} />
            <Input type="number" placeholder="Calls" value={kpi.onboarding_calls} onChange={(e) => setKpi({ ...kpi, onboarding_calls: Number(e.target.value) || 0 })} />
            <Input type="number" placeholder="Inquiries" value={kpi.inquiries_generated} onChange={(e) => setKpi({ ...kpi, inquiries_generated: Number(e.target.value) || 0 })} />
            <Input placeholder="Notes" value={kpi.notes || ''} onChange={(e) => setKpi({ ...kpi, notes: e.target.value })} />
          </div>

          <div className="mt-4">
            <Button onClick={saveKpi} disabled={savingKpi}>{savingKpi ? 'Saving...' : 'Save KPI'}</Button>
          </div>
        </div>
      )}
    </div>
  )
}
