'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Link } from '@/i18n/routing'
import {
  MapPin, Calendar, Clock, CheckCircle2, AlertCircle,
  Building2, Plus, ArrowLeft, CreditCard, Users,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CurrencySelector } from '@/components/bookings/CurrencySelector'
import type { SupportedCurrency } from '@/lib/pricing/duration-fees'

type Booking = {
  id: string
  status: string
  guest_payment_status: string | null
  host_payment_status: string | null
  months_duration: number | null
  check_in: string | null
  guest_email: string | null
  listings: { title: string; city: string } | null
}

type Props = {
  bookings: Booking[]
  hostEmail: string
  locale: string
  justPaid: boolean
}

// ── Status config ────────────────────────────────────────────────────────────
const STATUS_CONFIG: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  pending: {
    label: 'Solicitud nueva',
    color: 'bg-amber-100 text-amber-700 border-amber-200',
    icon: <Clock className="h-3.5 w-3.5" />,
  },
  approved: {
    label: 'Aprobada — pago pendiente',
    color: 'bg-blue-100 text-blue-700 border-blue-200',
    icon: <CreditCard className="h-3.5 w-3.5" />,
  },
  pending_host_payment: {
    label: 'Tu pago pendiente',
    color: 'bg-orange-100 text-orange-700 border-orange-200',
    icon: <CreditCard className="h-3.5 w-3.5" />,
  },
  pending_guest_payment: {
    label: 'Esperando pago del huésped',
    color: 'bg-purple-100 text-purple-700 border-purple-200',
    icon: <Clock className="h-3.5 w-3.5" />,
  },
  confirmed: {
    label: 'Confirmada',
    color: 'bg-green-100 text-green-700 border-green-200',
    icon: <CheckCircle2 className="h-3.5 w-3.5" />,
  },
}

function getStatusConfig(booking: Booking) {
  // Si el host no ha pagado aún, eso tiene prioridad
  if (
    booking.host_payment_status !== 'paid' &&
    ['approved', 'pending_host_payment', 'pending_guest_payment'].includes(booking.status)
  ) {
    return STATUS_CONFIG['pending_host_payment']
  }
  return STATUS_CONFIG[booking.status] ?? { label: booking.status, color: 'bg-gray-100 text-gray-600 border-gray-200', icon: null }
}

function formatDate(dateStr: string | null) {
  if (!dateStr) return 'Por confirmar'
  return new Date(dateStr).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })
}

// ── BookingCard ──────────────────────────────────────────────────────────────
function BookingCard({ booking, locale }: { booking: Booking; locale: string }) {
  const [showPayment, setShowPayment] = useState(false)
  const [checkingOut, setCheckingOut] = useState(false)
  const router = useRouter()

  const statusCfg = getStatusConfig(booking)
  const needsHostPayment =
    booking.host_payment_status !== 'paid' &&
    ['approved', 'pending_host_payment', 'pending_guest_payment'].includes(booking.status)

  const months = booking.months_duration ?? 2

  const handleCheckout = async (currency: SupportedCurrency) => {
    setCheckingOut(true)
    try {
      const res = await fetch(`/api/bookings/${booking.id}/host-checkout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currency, locale }),
      })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        alert(data.error ?? 'Error al crear el checkout')
        setCheckingOut(false)
      }
    } catch {
      alert('Error de conexión. Inténtalo de nuevo.')
      setCheckingOut(false)
    }
  }

  return (
    <div className="bg-white rounded-2xl border-2 border-gray-200 hover:border-blue-300 hover:shadow-md transition-all p-5">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="font-bold text-gray-900 text-base">
            {booking.listings?.title ?? 'Propiedad'}
          </p>
          <div className="flex items-center gap-1 text-sm text-gray-500 mt-0.5">
            <MapPin className="h-3.5 w-3.5" />
            <span>{booking.listings?.city ?? '—'}</span>
          </div>
        </div>
        <span className={`flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full border ${statusCfg.color}`}>
          {statusCfg.icon}
          {statusCfg.label}
        </span>
      </div>

      {/* Details */}
      <div className="flex flex-wrap gap-3 text-sm text-gray-500 mb-4">
        <span className="flex items-center gap-1">
          <Calendar className="h-3.5 w-3.5" />
          {formatDate(booking.check_in)}
        </span>
        <span className="flex items-center gap-1">
          <Clock className="h-3.5 w-3.5" />
          {months} {months === 1 ? 'mes' : 'meses'}
        </span>
        {booking.status === 'confirmed' && booking.guest_email && (
          <span className="flex items-center gap-1 text-green-600 font-medium">
            <CheckCircle2 className="h-3.5 w-3.5" />
            {booking.guest_email}
          </span>
        )}
      </div>

      {/* Pagos completados */}
      {booking.status !== 'confirmed' && (
        <div className="flex gap-2 mb-4">
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${booking.host_payment_status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
            {booking.host_payment_status === 'paid' ? '✅ Tu fee pagado' : '⏳ Tu fee pendiente'}
          </span>
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${booking.guest_payment_status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
            {booking.guest_payment_status === 'paid' ? '✅ Fee del huésped pagado' : '⏳ Fee del huésped pendiente'}
          </span>
        </div>
      )}

      {/* CTAs */}
      {booking.status === 'pending' && (
        <Link href={`/${locale}/host/bookings/${booking.id}`}>
          <Button className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold">
            Responder solicitud
          </Button>
        </Link>
      )}

      {needsHostPayment && !showPayment && (
        <Button
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold"
          onClick={() => setShowPayment(true)}
        >
          <CreditCard className="h-4 w-4 mr-2" />
          Pagar mi fee para desbloquear contacto
        </Button>
      )}

      {needsHostPayment && showPayment && (
        <CurrencySelector
          months={months}
          userRole="host"
          defaultCurrency="eur"
          onCheckout={handleCheckout}
          loading={checkingOut}
        />
      )}

      {booking.status === 'confirmed' && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-3 text-sm text-green-800 font-medium text-center">
          🎉 Reserva confirmada — datos de contacto enviados por email
        </div>
      )}
    </div>
  )
}

// ── Main ─────────────────────────────────────────────────────────────────────
export function HostDashboardClient({ bookings, hostEmail, locale, justPaid }: Props) {
  const pending   = bookings.filter(b => b.status === 'pending').length
  const active    = bookings.filter(b => ['approved','pending_host_payment','pending_guest_payment'].includes(b.status)).length
  const confirmed = bookings.filter(b => b.status === 'confirmed').length

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30">
      {/* Nav */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <Link href="/" className="font-black text-lg text-gray-900">inhabitme</Link>
          <Link href={`/${locale}/dashboard`} className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-900">
            <ArrowLeft className="h-4 w-4" /> Dashboard
          </Link>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {/* Banner de éxito */}
        {justPaid && (
          <div className="mb-6 bg-green-50 border-2 border-green-400 rounded-2xl p-4 flex items-center gap-3">
            <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0" />
            <div>
              <p className="font-bold text-green-800">¡Pago completado!</p>
              <p className="text-sm text-green-700">En cuanto el huésped pague su fee, recibirás sus datos de contacto por email.</p>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black text-gray-900">Mis Reservas</h1>
            <p className="text-gray-500 mt-1">{hostEmail}</p>
          </div>
          <Link href={`/${locale}/dashboard/properties`}>
            <Button variant="outline" className="flex items-center gap-2">
              <Plus className="h-4 w-4" /> Nueva propiedad
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { count: pending,   label: 'Pendientes', color: 'border-amber-100',  text: 'text-amber-600'  },
            { count: active,    label: 'En proceso',  color: 'border-blue-100',   text: 'text-blue-600'   },
            { count: confirmed, label: 'Confirmadas', color: 'border-green-100',  text: 'text-green-600'  },
          ].map(({ count, label, color, text }) => (
            <div key={label} className={`bg-white border-2 ${color} rounded-2xl p-4 text-center`}>
              <p className="text-3xl font-black text-gray-900">{count}</p>
              <p className={`text-xs font-semibold uppercase tracking-wide mt-1 ${text}`}>{label}</p>
            </div>
          ))}
        </div>

        {/* Bookings */}
        {bookings.length === 0 ? (
          <div className="bg-white border-2 border-dashed border-gray-300 rounded-3xl p-12 text-center">
            <Building2 className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">Sin reservas todavía</h3>
            <p className="text-gray-500 mb-6">
              Cuando un huésped solicite una de tus propiedades, aparecerá aquí.
            </p>
            <Link href={`/${locale}/dashboard/properties`}>
              <Button variant="outline">
                <Plus className="h-4 w-4 mr-2" /> Gestionar propiedades
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-4">
            {bookings.map(b => (
              <BookingCard key={b.id} booking={b} locale={locale} />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
