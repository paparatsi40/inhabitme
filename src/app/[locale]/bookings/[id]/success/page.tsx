'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { CheckCircle, Home, Eye, Search, Clock, Mail } from 'lucide-react';
import Link from 'next/link';
import { normalizeCurrency } from '@/lib/currency';

export default function BookingSuccessPage() {
  const params = useParams();
  const router = useRouter();
  const [booking, setBooking] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBooking();
  }, []);

  const fetchBooking = async () => {
    try {
      const res = await fetch(`/api/bookings/${params.id}`);
      if (res.ok) {
        const data = await res.json();
        setBooking(data.booking);
      }
    } catch (error) {
      console.error('Error fetching booking:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const currency = normalizeCurrency(booking?.currency)
  const locale = currency === 'EUR' ? 'es-ES' : 'en-US'
  const formatMinor = (amountMinor: number) => new Intl.NumberFormat(locale, { style: 'currency', currency }).format((amountMinor || 0) / 100)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Success Card */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Header con gradiente inhabitme */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-8 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full mb-4 animate-bounce">
              <CheckCircle className="h-12 w-12 text-green-500" />
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-white mb-2">
              ¡Solicitud Enviada!
            </h1>
            <p className="text-white/90 text-lg">
              Tu solicitud ha sido enviada correctamente
            </p>
          </div>

          {/* Content */}
          <div className="p-8 space-y-6">
            {/* Información principal */}
            <div className="text-center">
              <p className="text-gray-700 text-lg mb-6">
                El anfitrión ha recibido tu solicitud y tiene{' '}
                <strong className="text-purple-600">48 horas</strong> para responder.
              </p>
            </div>

            {/* Pasos siguientes */}
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6 border-2 border-purple-200">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Clock className="h-5 w-5 text-purple-600" />
                ¿Qué Sigue?
              </h3>
              
              <div className="space-y-3">
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center text-sm font-bold">
                    1
                  </div>
                  <div>
                    <p className="text-gray-700">
                      <strong>Te avisaremos por email</strong> cuando el anfitrión responda
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center text-sm font-bold">
                    2
                  </div>
                  <div>
                    <p className="text-gray-700">
                      Si acepta, <strong>recibirás un link para pagar</strong>
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center text-sm font-bold">
                    3
                  </div>
                  <div>
                    <p className="text-gray-700">
                      Después del pago, <strong>recibirás los datos de contacto</strong>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Info adicional */}
            <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
              <div className="flex gap-3">
                <Mail className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-700">
                    <strong>Revisa tu email</strong> regularmente. Te mantendremos informado de cada paso del proceso.
                  </p>
                </div>
              </div>
            </div>

            {/* Detalles de la reserva */}
            {booking && (
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                <h4 className="font-bold text-gray-900 mb-3">📋 Resumen de tu Solicitud</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Check-in:</span>
                    <span className="font-semibold text-gray-900">{booking.check_in}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Check-out:</span>
                    <span className="font-semibold text-gray-900">{booking.check_out}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Duración:</span>
                    <span className="font-semibold text-gray-900">
                      {booking.months_duration} {booking.months_duration === 1 ? 'mes' : 'meses'}
                    </span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-gray-300">
                    <span className="text-gray-600">Total (si se acepta):</span>
                    <span className="font-bold text-lg text-purple-600">
                      {formatMinor(booking.total_first_payment)}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Botones de acción */}
            <div className="space-y-3 pt-4">
              {/* Dashboard - Primario */}
              <Link href="/en/dashboard" className="block">
                <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-full font-bold text-lg hover:from-blue-700 hover:to-purple-700 hover:shadow-lg transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2">
                  <Home className="h-5 w-5" />
                  Ir a Mi Dashboard
                </button>
              </Link>

              {/* Ver esta reserva */}
              <Link href={`/en/bookings/${params.id}`} className="block">
                <button className="w-full bg-white text-purple-600 border-2 border-purple-600 py-3 rounded-full font-semibold hover:bg-purple-50 transition flex items-center justify-center gap-2">
                  <Eye className="h-5 w-5" />
                  Ver Esta Reserva
                </button>
              </Link>

              {/* Buscar más propiedades */}
              <Link href="/en/search" className="block">
                <button className="w-full bg-white text-gray-700 border-2 border-gray-300 py-3 rounded-full font-semibold hover:bg-gray-50 transition flex items-center justify-center gap-2">
                  <Search className="h-5 w-5" />
                  Seguir Buscando Propiedades
                </button>
              </Link>
            </div>

            {/* Footer con branding */}
            <div className="text-center pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-500 mb-2">
                ¿Tienes dudas? Escríbenos a{' '}
                <a href="mailto:contact@inhabitme.com" className="text-purple-600 hover:underline">
                  contact@inhabitme.com
                </a>
              </p>
              <p className="text-xs text-gray-400 flex items-center justify-center gap-1">
                <span>Powered by</span>
                <span className="font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  inhabitme
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Tips adicionales */}
        <div className="mt-6 bg-white/80 backdrop-blur rounded-2xl p-6 shadow-lg">
          <h3 className="font-bold text-gray-900 mb-3">💡 Tips Mientras Esperas</h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex gap-2">
              <span>✓</span>
              <span>Revisa otras propiedades similares por si esta no está disponible</span>
            </li>
            <li className="flex gap-2">
              <span>✓</span>
              <span>Completa tu perfil en el dashboard para inspirar confianza</span>
            </li>
            <li className="flex gap-2">
              <span>✓</span>
              <span>Prepara tus preguntas para cuando el anfitrión acepte</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
