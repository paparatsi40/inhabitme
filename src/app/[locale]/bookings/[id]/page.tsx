'use client'

import { useEffect, useState } from 'react'
import { useParams, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { MapPin, Calendar, Clock, CheckCircle2, CreditCard, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CurrencySelector } from '@/components/bookings/CurrencySelector'
import { formatFee } from '@/lib/pricing/duration-fees'
import type { SupportedCurrency } from '@/lib/pricing/duration-fees'

function formatDate(dateStr: string | null) {
  if (!dateStr) return 'Por confirmar'
  return new Date(dateStr).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })
}

const STATUS_LABELS: Record<string, { text: string; color: string }> = {
  pending:                { text: 'Solicitud enviada — esperando respuesta del host', color: 'text-amber-700 bg-amber-50 border-amber-200' },
  approved:               { text: 'Aprobada — completa tu pago para desbloquear el contacto del host', color: 'text-blue-700 bg-blue-50 border-blue-200' },
  pending_host_payment:   { text: 'Tu pago completado — esperando que el host pague su fee', color: 'text-purple-700 bg-purple-50 border-purple-200' },
  pending_guest_payment:  { text: 'El host ya pagó — completa tu pago para desbloquear el contacto', color: 'text-blue-700 bg-blue-50 border-blue-200' },
  confirmed:              { text: '¡Reserva confirmada! Revisa tu email para ver los datos de contacto del host', color: 'text-green-700 bg-green-50 border-green-200' },
  cancelled:              { text: 'Reserva cancelada', color: 'text-red-700 bg-red-50 border-red-200' },
  rejected:               { text: 'Solicitud rechazada por el host', color: 'text-red-700 bg-red-50 border-red-200' },
}

export default function BookingDetailPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const bookingId = params?.id as string
  const justPaid = searchParams?.get('payment') === 'success'

  const [booking, setBooking] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [showPayment, setShowPayment] = useState(false)
  const [checkingOut, setCheckingOut] = useState(false)

  useEffect(() => {
    if (!bookingId) return
    fetch(`/api/bookings/${bookingId}`)
      .then(r => r.json())
      .then(d => setBooking(d.booking ?? d))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [bookingId])

  const handleCheckout = async (currency: SupportedCurrency) => {
    setCheckingOut(true)
    try {
      const res = await fetch(`/api/bookings/${bookingId}/create-checkout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currency }),
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
      </div>
    )
  }

  if (!booking) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center px-6">
        <div>
          <p className="text-gray-600 mb-4">Reserva no encontrada.</p>
          <Link href="/dashboard"><Button variant="outline">Volver al dashboard</Button></Link>
        </div>
      </div>
    )
  }

  const months = booking.months_duration ?? 2
  const canPay = ['approved', 'pending_guest_payment'].includes(booking.status) && booking.guest_payment_status !== 'paid'
  const statusInfo = STATUS_LABELS[booking.status] ?? { text: booking.status, color: 'text-gray-700 bg-gray-50 border-gray-200' }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center gap-3">
          <Link href="/dashboard" className="text-gray-500 hover:text-gray-900">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <span className="font-black text-gray-900">inhabitme</span>
        </div>
      </nav>

      <main className="max-w-2xl mx-auto px-4 py-8 space-y-6">
        {/* Banner si acaba de pagar */}
        {justPaid && (
          <div className="bg-green-50 border-2 border-green-400 rounded-2xl p-4 flex items-center gap-3">
            <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0" />
            <div>
              <p className="font-bold text-green-800">¡Pago recibido!</p>
              <p className="text-sm text-green-700">En cuanto el host pague su fee, recibirás sus datos de contacto por email.</p>
            </div>
          </div>
        )}

        {/* Estado */}
        <div className={`border rounded-2xl px-4 py-3 text-sm font-medium ${statusInfo.color}`}>
          {statusInfo.text}
        </div>

        {/* Detalles de la reserva */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
          <h2 className="text-xl font-black text-gray-900">
            {booking.property?.title ?? booking.listings?.title ?? 'Propiedad'}
          </h2>

          <div className="flex flex-wrap gap-4 text-sm text-gray-600">
            {booking.listings?.city && (
              <span className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4 text-gray-400" />
                {booking.listings.city}
              </span>
            )}
            <span className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4 text-gray-400" />
              Check-in: {formatDate(booking.check_in)}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="h-4 w-4 text-gray-400" />
              {months} {months === 1 ? 'mes' : 'meses'}
            </span>
          </div>

          {/* Estado de pagos */}
          {booking.status !== 'confirmed' && (
            <div className="flex gap-2 flex-wrap pt-2 border-t border-gray-100">
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${booking.guest_payment_status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                {booking.guest_payment_status === 'paid' ? '✅ Tu fee pagado' : '⏳ Tu fee pendiente'}
              </span>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${booking.host_payment_status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                {booking.host_payment_status === 'paid' ? '✅ Fee del host pagado' : '⏳ Fee del host pendiente'}
              </span>
            </div>
          )}

          {/* Contacto del host — solo si está confirmado */}
          {booking.status === 'confirmed' && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-sm">
              <p className="font-bold text-green-800 mb-1">🎉 Contacto del host desbloqueado</p>
              <p className="text-green-700">Revisa tu email — te hemos enviado los datos de contacto del host para coordinar directamente.</p>
            </div>
          )}
        </div>

        {/* Sección de pago */}
        {canPay && !showPayment && (
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h3 className="font-bold text-gray-900 mb-1 flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-blue-600" />
              Pagar fee de conexión
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              Pago único para desbloquear los datos de contacto de tu host. Sin comisiones adicionales sobre la renta.
            </p>
            <Button
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold"
              onClick={() => setShowPayment(true)}
            >
              Ver opciones de pago →
            </Button>
          </div>
        )}

        {canPay && showPayment && (
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-blue-600" />
              Elige tu moneda y paga
            </h3>
            <CurrencySelector
              months={months}
              userRole="guest"
              defaultCurrency={booking.currency === 'usd' ? 'usd' : 'eur'}
              onCheckout={handleCheckout}
              loading={checkingOut}
            />
            <button
              className="w-full text-sm text-gray-400 hover:text-gray-600 mt-3"
              onClick={() => setShowPayment(false)}
            >
              Cancelar
            </button>
          </div>
        )}

        {/* Volver */}
        <div className="text-center">
          <Link href="/dashboard" className="text-sm text-gray-500 hover:text-gray-700 underline">
            Volver al dashboard
          </Link>
        </div>
      </main>
    </div>
  )
}
