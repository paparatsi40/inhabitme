'use client';

import { useEffect, useState } from 'react';
import { useLocale } from 'next-intl'
import { useParams, useRouter } from 'next/navigation';
import { CheckCircle, Home, Eye, Search, Sparkles } from 'lucide-react';
import { normalizeCurrency } from '@/lib/currency';

export default function PaymentSuccessPage() {
  const params = useParams();
  const router = useRouter();
  const locale = useLocale()
  const [booking, setBooking] = useState<any>(null);

  useEffect(() => {
    fetchBooking();
  }, []);

  const fetchBooking = async () => {
    try {
      const res = await fetch(`/api/bookings/${params.id}`);
      if (res.ok) {
        const data = await res.json();
        setBooking(data.booking || data);
      }
    } catch (error) {
      console.error('Error fetching booking:', error);
    }
  };

  const currency = normalizeCurrency(booking?.currency)
  const numberLocale = currency === 'EUR' ? 'es-ES' : 'en-US'
  const formatMinor = (amountMinor: number) => new Intl.NumberFormat(numberLocale, { style: 'currency', currency }).format((amountMinor || 0) / 100)

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Success Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 text-center">
          {/* Success Icon */}
          <div className="flex justify-center mb-6">
            <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-full p-6 animate-bounce">
              <CheckCircle className="w-16 h-16 text-white" />
            </div>
          </div>

          {/* Title */}
          <h1 className="text-4xl font-black bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-4">
            ¡Pago Completado!
          </h1>

          <p className="text-xl text-gray-700 mb-8">
            Tu pago ha sido procesado exitosamente
          </p>

          {/* What's Next */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 mb-8 text-left">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-purple-600" />
              <h2 className="text-lg font-bold text-gray-900">¿Qué Sigue?</h2>
            </div>
            
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold">
                  1
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Host Completa su Pago</p>
                  <p className="text-sm text-gray-600">El host debe pagar su service fee según duración</p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold">
                  2
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Contactos Liberados</p>
                  <p className="text-sm text-gray-600">Una vez que el host pague, recibirás sus datos de contacto por email</p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold">
                  3
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Coordinación Directa</p>
                  <p className="text-sm text-gray-600">Contacta al host para coordinar la llegada y detalles de tu estancia</p>
                </div>
              </div>
            </div>
          </div>

          {/* Info Card */}
          {booking && (
            <div className="bg-gray-50 rounded-2xl p-6 mb-8 text-left">
              <h3 className="font-bold text-gray-900 mb-3">Resumen de tu Pago</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Primer mes</span>
                  <span className="font-semibold">{formatMinor(booking.monthly_price)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Depósito (reembolsable)</span>
                  <span className="font-semibold">{formatMinor(booking.deposit_amount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">inhabitme service fee</span>
                  <span className="font-semibold">{formatMinor(booking.guest_fee)}</span>
                </div>
                <div className="border-t pt-2 flex justify-between text-lg">
                  <span className="font-bold text-gray-900">Total Pagado</span>
                  <span className="font-bold text-green-600">
                    {formatMinor((booking.monthly_price || 0) + (booking.deposit_amount || 0) + (booking.guest_fee || 0))}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={() => router.push(`/${locale}/dashboard`)}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-full font-bold text-lg hover:scale-105 transition flex items-center justify-center gap-2"
            >
              <Home className="w-5 h-5" />
              Ir a Mi Dashboard
            </button>

            <button
              onClick={() => router.push(`/${locale}/bookings/${params.id}`)}
              className="w-full bg-white border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-full font-bold hover:border-gray-400 transition flex items-center justify-center gap-2"
            >
              <Eye className="w-5 h-5" />
              Ver Detalles de la Reserva
            </button>

            <button
              onClick={() => router.push(`/${locale}/search`)}
              className="w-full bg-white border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-full font-bold hover:border-gray-400 transition flex items-center justify-center gap-2"
            >
              <Search className="w-5 h-5" />
              Seguir Buscando Propiedades
            </button>
          </div>

          {/* Footer */}
          <p className="text-sm text-gray-500 mt-8">
            Revisa tu email regularmente. Te notificaremos cuando el host complete su proceso.
          </p>

          <div className="mt-6 pt-6 border-t">
            <p className="text-xs text-gray-400">
              Powered by <span className="font-bold text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text">inhabitme</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
