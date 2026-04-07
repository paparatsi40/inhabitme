'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Link } from '@/i18n/routing'
import {
  MapPin, Calendar, Star, Lock, Unlock, CheckCircle2,
  Loader2, TrendingUp, Building2, Plus, Mail, ArrowLeft,
} from 'lucide-react'
import { Button } from '@/components/ui/button'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
type Lead = {
  id: string
  listing_id: string
  city: string
  neighborhood: string | null
  start_date: string
  email: string
  score: number
  score_label: 'HOT' | 'WARM' | 'COLD'
  paid: boolean
  created_at: string
}

type HostDashboardClientProps = {
  leads: Lead[]
  hostEmail: string
  justUnlocked: string | null
  locale: string
}

// ---------------------------------------------------------------------------
// Config per label
// ---------------------------------------------------------------------------
const LABEL_CONFIG = {
  HOT: {
    color: 'bg-red-100 text-red-700 border-red-200',
    dot: 'bg-red-500',
    price: '€25',
    description: 'High intent — ready to move',
  },
  WARM: {
    color: 'bg-amber-100 text-amber-700 border-amber-200',
    dot: 'bg-amber-400',
    price: '€10',
    description: 'Planning ahead',
  },
  COLD: {
    color: 'bg-gray-100 text-gray-500 border-gray-200',
    dot: 'bg-gray-300',
    price: null,
    description: 'Low intent — free',
  },
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

// ---------------------------------------------------------------------------
// LeadCard
// ---------------------------------------------------------------------------
function LeadCard({
  lead,
  isJustUnlocked,
  onUnlock,
}: {
  lead: Lead
  isJustUnlocked: boolean
  onUnlock: (leadId: string) => void
}) {
  const config = LABEL_CONFIG[lead.score_label]
  const billable = lead.score_label !== 'COLD'

  return (
    <div
      className={`bg-white rounded-2xl border-2 p-5 transition-all ${
        isJustUnlocked
          ? 'border-green-400 shadow-lg shadow-green-100'
          : 'border-gray-200 hover:border-blue-300 hover:shadow-md'
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <MapPin className="h-4 w-4 text-gray-400" />
            <span className="font-semibold text-gray-900">
              {lead.neighborhood ? `${lead.neighborhood} · ` : ''}{lead.city}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Calendar className="h-3.5 w-3.5" />
            <span>Move-in: {formatDate(lead.start_date)}</span>
          </div>
        </div>
        <span
          className={`text-xs font-bold px-2.5 py-1 rounded-full border ${config.color}`}
        >
          {lead.score_label}
        </span>
      </div>

      {/* Score bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
          <span>Lead score</span>
          <span className="font-semibold">{lead.score}/100</span>
        </div>
        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full ${config.dot}`}
            style={{ width: `${lead.score}%` }}
          />
        </div>
        <p className="text-xs text-gray-400 mt-1">{config.description}</p>
      </div>

      {/* Contact / unlock */}
      {lead.paid || lead.score_label === 'COLD' ? (
        <div className="bg-green-50 border border-green-200 rounded-xl p-3 flex items-center gap-2">
          {lead.score_label === 'COLD' ? (
            <>
              <Mail className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-500">Free lead — contact support to get email</span>
            </>
          ) : (
            <>
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <div>
                <p className="text-xs text-green-600 font-semibold uppercase tracking-wide">Unlocked</p>
                <a
                  href={`mailto:${lead.email}`}
                  className="text-sm font-bold text-green-700 hover:underline"
                >
                  {lead.email}
                </a>
              </div>
            </>
          )}
        </div>
      ) : (
        <div className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-xl p-3">
          <div className="flex items-center gap-2">
            <Lock className="h-4 w-4 text-gray-400" />
            <span className="text-sm text-gray-500">Guest contact locked</span>
          </div>
          {billable && (
            <Button
              size="sm"
              onClick={() => onUnlock(lead.id)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold"
            >
              <Unlock className="h-3.5 w-3.5 mr-1.5" />
              Unlock · {config.price}
            </Button>
          )}
        </div>
      )}

      {isJustUnlocked && (
        <p className="text-xs text-green-600 font-semibold mt-2 flex items-center gap-1">
          <CheckCircle2 className="h-3.5 w-3.5" />
          Just unlocked — contact them now!
        </p>
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------
export function HostDashboardClient({
  leads,
  hostEmail,
  justUnlocked,
  locale,
}: HostDashboardClientProps) {
  const router = useRouter()
  const [unlocking, setUnlocking] = useState<string | null>(null)
  const [showBanner, setShowBanner] = useState(!!justUnlocked)

  // Auto-hide success banner after 5s
  useEffect(() => {
    if (!justUnlocked) return
    const timer = setTimeout(() => {
      setShowBanner(false)
      // Clean URL param
      router.replace(`/${locale}/host/dashboard`, { scroll: false })
    }, 5000)
    return () => clearTimeout(timer)
  }, [justUnlocked, locale, router])

  // NOTE: El sistema de leads (HOT/WARM/COLD) fue reemplazado por el flujo de bookings.
  // Los hosts ahora pagan directamente desde la página del booking aprobado.
  // Esta función redirige al host a sus bookings en lugar de usar un checkout de lead.
  const handleUnlock = async (leadId: string) => {
    router.push(`/${locale}/host/bookings`)
  }

  // Stats
  const hotCount = leads.filter((l) => l.score_label === 'HOT').length
  const warmCount = leads.filter((l) => l.score_label === 'WARM').length
  const unlockedCount = leads.filter((l) => l.paid).length

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30">
      {/* Nav */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <Link href="/" className="font-black text-lg text-gray-900">
            inhabitme
          </Link>
          <Link
            href={`/${locale}/dashboard`}
            className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Dashboard
          </Link>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {/* Success banner */}
        {showBanner && justUnlocked && (
          <div className="mb-6 bg-green-50 border-2 border-green-400 rounded-2xl p-4 flex items-center gap-3">
            <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0" />
            <div>
              <p className="font-bold text-green-800">Lead unlocked successfully!</p>
              <p className="text-sm text-green-700">The guest's contact info is now visible below.</p>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-black text-gray-900">Lead Inbox</h1>
          <p className="text-gray-500 mt-1">{hostEmail}</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white border-2 border-red-100 rounded-2xl p-4 text-center">
            <p className="text-3xl font-black text-gray-900">{hotCount}</p>
            <p className="text-xs font-semibold text-red-600 uppercase tracking-wide mt-1">🔥 HOT</p>
          </div>
          <div className="bg-white border-2 border-amber-100 rounded-2xl p-4 text-center">
            <p className="text-3xl font-black text-gray-900">{warmCount}</p>
            <p className="text-xs font-semibold text-amber-600 uppercase tracking-wide mt-1">🌤 WARM</p>
          </div>
          <div className="bg-white border-2 border-green-100 rounded-2xl p-4 text-center">
            <p className="text-3xl font-black text-gray-900">{unlockedCount}</p>
            <p className="text-xs font-semibold text-green-600 uppercase tracking-wide mt-1">✅ Unlocked</p>
          </div>
        </div>

        {/* Leads list */}
        {leads.length === 0 ? (
          <div className="bg-white border-2 border-dashed border-gray-300 rounded-3xl p-12 text-center">
            <Building2 className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">No leads yet</h3>
            <p className="text-gray-500 mb-6">
              When guests express interest in your properties, they'll appear here.
            </p>
            <Link href={`/${locale}/dashboard/properties`}>
              <Button variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Manage properties
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-4">
            {leads.map((lead) => (
              <div key={lead.id} className="relative">
                {unlocking === lead.id && (
                  <div className="absolute inset-0 bg-white/70 backdrop-blur-sm rounded-2xl flex items-center justify-center z-10">
                    <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
                  </div>
                )}
                <LeadCard
                  lead={lead}
                  isJustUnlocked={lead.id === justUnlocked}
                  onUnlock={handleUnlock}
                />
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
