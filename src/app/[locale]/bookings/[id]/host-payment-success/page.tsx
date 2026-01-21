'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { CheckCircle, Loader2, ArrowRight, Home, Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function HostPaymentSuccessPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const router = useRouter()
  const bookingId = params.id as string
  const sessionId = searchParams.get('session_id')

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const verifyPayment = async () => {
      if (!sessionId) {
        setError('No session ID provided')
        setLoading(false)
        return
      }

      try {
        // Verify payment with backend
        const res = await fetch(`/api/bookings/${bookingId}/verify-host-payment`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionId }),
        })

        if (!res.ok) {
          throw new Error('Failed to verify payment')
        }

        setLoading(false)
      } catch (err: any) {
        console.error('Verification error:', err)
        setError(err.message)
        setLoading(false)
      }
    }

    verifyPayment()
  }, [bookingId, sessionId])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-16 w-16 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Verificando pago...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-red-50 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">❌</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Error</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link href="/host/bookings">
            <Button>Volver a Reservas</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center p-6">
      <div className="max-w-2xl w-full">
        {/* Success Card */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Header with gradient */}
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-8 text-center text-white">
            <div className="inline-flex p-4 bg-white/20 backdrop-blur-sm rounded-full mb-4">
              <CheckCircle className="h-16 w-16" />
            </div>
            <h1 className="text-3xl font-black mb-2">¡Pago Completado!</h1>
            <p className="text-green-50 text-lg">
              Tu fee de host ha sido procesado exitosamente
            </p>
          </div>

          {/* Content */}
          <div className="p-8">
            {/* What's Next */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="text-2xl">🎉</span>
                ¿Qué Sigue?
              </h2>
              <div className="space-y-3">
                <div className="flex gap-3 p-4 bg-blue-50 rounded-xl">
                  <span className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                    1
                  </span>
                  <div>
                    <p className="font-semibold text-gray-900">Guest Recibe Notificación</p>
                    <p className="text-sm text-gray-600">
                      El guest ha recibido un email para completar su pago
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 p-4 bg-purple-50 rounded-xl">
                  <span className="flex-shrink-0 w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                    2
                  </span>
                  <div>
                    <p className="font-semibold text-gray-900">Guest Paga su Fee</p>
                    <p className="text-sm text-gray-600">
                      Cuando el guest complete su pago, la reserva se confirmará
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 p-4 bg-green-50 rounded-xl">
                  <span className="flex-shrink-0 w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                    3
                  </span>
                  <div>
                    <p className="font-semibold text-gray-900">Contactos Liberados</p>
                    <p className="text-sm text-gray-600">
                      Ambos recibirán los contactos completos por email
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Summary Card */}
            <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl p-6 mb-6">
              <h3 className="font-semibold text-gray-900 mb-3">📊 Resumen de tu Pago</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Fee de host:</span>
                  <span className="font-semibold text-gray-900">Según duración</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Estado:</span>
                  <span className="font-semibold text-green-600">✅ Pagado</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-gray-200">
                  <span className="text-gray-600">Booking ID:</span>
                  <span className="font-mono text-xs text-gray-500">{bookingId.substring(0, 8)}...</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href={`/host/bookings/${bookingId}`} className="flex-1">
                <Button variant="outline" className="w-full">
                  <Eye className="h-4 w-4 mr-2" />
                  Ver Detalles de la Reserva
                </Button>
              </Link>
              <Link href="/host/bookings" className="flex-1">
                <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  <Home className="h-4 w-4 mr-2" />
                  Todas las Reservas
                </Button>
              </Link>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-8 py-4 text-center text-sm text-gray-600 border-t border-gray-100">
            Powered by <span className="font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">inhabitme</span>
          </div>
        </div>

        {/* Tips */}
        <div className="mt-6 bg-white/60 backdrop-blur-sm rounded-2xl p-6">
          <h3 className="font-semibold text-gray-900 mb-3">💡 Consejos</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>• El guest tiene hasta 48 horas para completar su pago</li>
            <li>• Recibirás un email cuando el guest pague</li>
            <li>• Podrás contactar al guest una vez confirmada la reserva</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
