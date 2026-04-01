import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { getLocale, getTranslations } from 'next-intl/server'
import { getSupabaseServerClient } from '@/lib/supabase/server'
import { Link } from '@/i18n/routing'
import { ArrowLeft, CalendarDays, Target, TrendingUp } from 'lucide-react'
import { GrowthOpsClient } from './GrowthOpsClient'

export const dynamic = 'force-dynamic'

const dayPlan = [
  { day: 1, focus: 'Setup CRM + scripts + first 40 contacts' },
  { day: 2, focus: '40 new contacts + 15 follow-ups + onboarding calls' },
  { day: 3, focus: 'Outbound + publish 3 listings assisted' },
  { day: 4, focus: 'Neighborhood outreach + publish sprint' },
  { day: 5, focus: 'Double down top-performing channel' },
  { day: 6, focus: 'Warm lead reactivation + publish sprint' },
  { day: 7, focus: 'Weekly review + clean pipeline' },
  { day: 8, focus: 'Repeat cadence + objections script v2' },
  { day: 9, focus: 'Repeat cadence + PM outreach block' },
  { day: 10, focus: 'Repeat cadence + listing quality coaching' },
  { day: 11, focus: 'Launch referral loop' },
  { day: 12, focus: 'Property managers micro-segment' },
  { day: 13, focus: 'Onboarding marathon' },
  { day: 14, focus: 'Weekly close + target 50 live' },
  { day: 15, focus: 'Scale Austin outbound intensity' },
  { day: 16, focus: 'Scale + follow-up consistency' },
  { day: 17, focus: 'Scale + publication support' },
  { day: 18, focus: 'Open Miami waitlist (light)' },
  { day: 19, focus: 'Miami soft outreach + Austin primary' },
  { day: 20, focus: 'Mass no-response reactivation' },
  { day: 21, focus: 'Weekly close + target 80 live' },
  { day: 22, focus: 'Final push publish 4/day' },
  { day: 23, focus: 'Final push publish 4/day' },
  { day: 24, focus: 'Final push publish 4/day' },
  { day: 25, focus: 'Final push publish 4/day' },
  { day: 26, focus: 'Pipeline cleanup and close loops' },
  { day: 27, focus: 'Rescue blocked deals via 1:1' },
  { day: 28, focus: 'Channel economics and CAC review' },
  { day: 29, focus: 'Close remaining gap to 100' },
  { day: 30, focus: 'Final report + Miami GTM v1' },
]

export default async function GrowthDashboardPage() {
  const { userId } = await auth()
  const locale = await getLocale()
  const t = await getTranslations('dashboard')

  if (!userId) {
    redirect(`/${locale}/sign-in`)
  }

  const supabase = getSupabaseServerClient()
  const today = new Date().toISOString().split('T')[0]

  const [{ data: todayKpi }, { data: summaryRows }] = await Promise.all([
    supabase
      .from('growth_daily_kpis')
      .select('*')
      .eq('owner_id', userId)
      .eq('kpi_date', today)
      .maybeSingle(),
    supabase
      .from('growth_pipeline_leads')
      .select('id, stage')
      .eq('owner_id', userId),
  ])

  const stageCounts = (summaryRows || []).reduce((acc: Record<string, number>, row: any) => {
    const stage = String(row.stage || 'lead')
    acc[stage] = (acc[stage] || 0) + 1
    return acc
  }, {})

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <Link href="/dashboard" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 font-semibold mb-2">
              <ArrowLeft className="h-4 w-4" /> {t('backToDashboard')}
            </Link>
            <h1 className="text-3xl lg:text-4xl font-black text-gray-900">Growth Ops — 100 Listings / 30 Days</h1>
            <p className="text-gray-600 mt-1">Execution board: outreach, follow-ups, pipeline, KPI and daily playbook.</p>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-2xl p-5 border-2 border-blue-100">
            <div className="text-xs uppercase tracking-wide text-gray-500 font-semibold mb-1">Today outbound</div>
            <div className="text-3xl font-black">{todayKpi?.outbound_sent || 0}</div>
          </div>
          <div className="bg-white rounded-2xl p-5 border-2 border-green-100">
            <div className="text-xs uppercase tracking-wide text-gray-500 font-semibold mb-1">Today follow-ups</div>
            <div className="text-3xl font-black">{todayKpi?.followups_done || 0}</div>
          </div>
          <div className="bg-white rounded-2xl p-5 border-2 border-purple-100">
            <div className="text-xs uppercase tracking-wide text-gray-500 font-semibold mb-1">Published total</div>
            <div className="text-3xl font-black">{(stageCounts.published || 0) + (stageCounts.live_inquiry || 0)}</div>
          </div>
          <div className="bg-white rounded-2xl p-5 border-2 border-orange-100">
            <div className="text-xs uppercase tracking-wide text-gray-500 font-semibold mb-1">Interested now</div>
            <div className="text-3xl font-black">{stageCounts.interested || 0}</div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-5 border-2 border-gray-200">
            <div className="flex items-center gap-2 mb-3 text-gray-900 font-black"><Target className="h-5 w-5 text-red-500" /> Non-negotiables</div>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>• 40 new outbound / day</li>
              <li>• 15 follow-ups / day</li>
              <li>• 3 assisted publishes / day</li>
              <li>• Daily KPI close before EOD</li>
            </ul>
          </div>
          <div className="bg-white rounded-2xl p-5 border-2 border-gray-200">
            <div className="flex items-center gap-2 mb-3 text-gray-900 font-black"><CalendarDays className="h-5 w-5 text-blue-500" /> Sprint targets</div>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>• Week 1: 25 live listings</li>
              <li>• Week 2: 50 live listings</li>
              <li>• Week 3: 80 live listings</li>
              <li>• Week 4: 100 live listings</li>
            </ul>
          </div>
          <div className="bg-white rounded-2xl p-5 border-2 border-gray-200">
            <div className="flex items-center gap-2 mb-3 text-gray-900 font-black"><TrendingUp className="h-5 w-5 text-green-500" /> Funnel objective</div>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>• 1,000 contacts</li>
              <li>• 200 replies</li>
              <li>• 100 interested</li>
              <li>• 100 published (with assisted ops)</li>
            </ul>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border-2 border-gray-200 mb-8">
          <h2 className="text-xl font-black text-gray-900 mb-3">Playbook D1–D30</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {dayPlan.map((item) => (
              <div key={item.day} className="rounded-xl border border-gray-200 p-3 text-sm">
                <div className="font-bold text-gray-900">Day {item.day}</div>
                <div className="text-gray-600 mt-1">{item.focus}</div>
              </div>
            ))}
          </div>
        </div>

        <GrowthOpsClient />
      </main>
    </div>
  )
}
