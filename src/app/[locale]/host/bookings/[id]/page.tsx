'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { CheckCircle, XCircle, Calendar, Euro, User, MessageSquare, Loader2, ArrowLeft } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { normalizeCurrency } from '@/lib/currency';

// Helper function to format dates without timezone issues
const formatDateSafe = (dateString: string, options: Intl.DateTimeFormatOptions) => {
  // Parse date as local date to avoid timezone shifts
  const [year, month, day] = dateString.split('T')[0].split('-');
  const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
  return date.toLocaleDateString('es-ES', options);
};

export default function HostBookingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const bookingId = params.id as string;
  const action = searchParams?.get('action');

  const [booking, setBooking] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [responding, setResponding] = useState(false);
  const [responseMessage, setResponseMessage] = useState('');
  const [showRejectForm, setShowRejectForm] = useState(action === 'reject');

  useEffect(() => {
    fetchBooking();
  }, [bookingId]);

  useEffect(() => {
    if (action === 'accept') {
      handleAccept();
    }
  }, [action]);

  const fetchBooking = async () => {
    try {
      const res = await fetch(`/api/bookings/${bookingId}`);
      if (res.ok) {
        const data = await res.json();
        setBooking(data);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async () => {
    setResponding(true);
    try {
      console.log('🔵 Starting host acceptance flow...')
      
      // Step 1: Create host checkout session
      const checkoutRes = await fetch(`/api/bookings/${bookingId}/host-checkout`, {
        method: 'POST',
      });

      if (!checkoutRes.ok) {
        const errorData = await checkoutRes.json()
        console.error('Checkout error:', errorData)
        alert('Error al crear el checkout: ' + (errorData.error || 'Unknown error'));
        setResponding(false);
        return;
      }

      const checkoutData = await checkoutRes.json();
      console.log('Checkout response:', checkoutData)

      // Redirect to Stripe for host fee payment
      if (checkoutData.url) {
        console.log('💳 Redirecting to Stripe checkout:', checkoutData.url)
        window.location.href = checkoutData.url;
      } else {
        alert('Error: No se pudo crear el checkout de Stripe');
        setResponding(false);
      }

    } catch (error) {
      console.error('❌ Accept error:', error);
      alert('Error al procesar la aceptación');
      setResponding(false);
    }
  };

  const handleReject = async () => {
    if (!responseMessage.trim()) {
      alert('Por favor proporciona un mensaje explicando por qué rechazas la solicitud');
      return;
    }

    setResponding(true);
    try {
      const res = await fetch(`/api/bookings/${bookingId}/respond`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'reject',
          message: responseMessage
        })
      });

      if (res.ok) {
        alert('Solicitud rechazada. El huésped recibirá tu mensaje.');
        router.push('/host/bookings');
      } else {
        alert('Error al rechazar la solicitud');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al rechazar la solicitud');
    } finally {
      setResponding(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600 font-semibold">Cargando detalles...</p>
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-black mb-2 text-gray-900">Reserva no encontrada</h1>
          <Link href="/host/bookings" className="text-blue-600 hover:underline font-semibold">
            Volver a reservas
          </Link>
        </div>
      </div>
    );
  }

  const monthlyPrice = booking.monthly_price / 100;
  const depositAmount = booking.deposit_amount / 100;
  const totalRent = monthlyPrice * booking.months_duration;
  const hostFee = booking.host_fee / 100;
  const currency = normalizeCurrency(booking.currency)
  const moneyLocale = currency === 'EUR' ? 'es-ES' : 'en-US'
  const formatMajor = (amount: number) => new Intl.NumberFormat(moneyLocale, { style: 'currency', currency }).format(amount || 0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30">
      {/* Navigation Bar */}
      <nav className="bg-white/95 backdrop-blur-lg border-b-2 border-gray-200 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/dashboard" className="flex items-center gap-2.5 group">
              <div className="p-1.5 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl group-hover:scale-110 transition-transform">
                <svg width="24" height="24" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M 30 45 L 50 30 L 70 45 L 70 70 L 30 70 Z" fill="white"/>
                  <path d="M 25 45 L 50 25 L 75 45" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                  <rect x="44" y="55" width="12" height="15" fill="#2563eb" rx="1"/>
                </svg>
              </div>
              <span className="font-black text-xl bg-gradient-to-r from-gray-900 to-blue-900 bg-clip-text text-transparent">
                inhabitme
              </span>
            </Link>
            <Link href="/host/bookings">
              <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl font-semibold text-gray-700 transition">
                <ArrowLeft className="w-4 h-4" />
                Reservas
              </button>
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">

        {/* Status Banner */}
        <div className="mb-6">
          {booking.status === 'pending_host_approval' && (
            <div className="bg-yellow-50 border-2 border-yellow-400 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse"></div>
                <h2 className="text-2xl font-black text-yellow-900">Esperando tu respuesta</h2>
              </div>
              <p className="text-yellow-800">
                Revisa los detalles y decide si aceptas o rechazas esta solicitud.
              </p>
            </div>
          )}

          {booking.status === 'pending_guest_payment' && (
            <div className="bg-blue-50 border-2 border-blue-400 rounded-xl p-6">
              <h2 className="text-2xl font-black text-blue-900 mb-2">Esperando pago del huésped</h2>
              <p className="text-blue-800">
                Has aceptado la solicitud. El huésped tiene 3 días para pagar.
              </p>
            </div>
          )}

          {booking.status === 'pending_host_payment' && (
            <div className="bg-purple-50 border-2 border-purple-400 rounded-xl p-6">
              <h2 className="text-2xl font-black text-purple-900 mb-2">Es tu turno de pagar</h2>
              <p className="text-purple-800">
                El huésped ya pagó. Ahora paga tu fee de {formatMajor(hostFee)} para confirmar.
              </p>
              <button className="mt-4 bg-purple-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-purple-700">
                Pagar {formatMajor(hostFee)}
              </button>
            </div>
          )}

          {booking.status === 'confirmed' && (
            <div className="bg-green-50 border-2 border-green-400 rounded-xl p-6">
              <h2 className="text-2xl font-black text-green-900 mb-2">✅ Reserva confirmada</h2>
              <p className="text-green-800">
                Ambos pagaron. Contactos liberados. Revisa tu email.
              </p>
            </div>
          )}
        </div>

        {/* Guest Profile */}
        <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <User className="w-5 h-5 text-blue-600" />
            Información del Huésped
          </h3>
          
          <div className="space-y-3">
            <div>
              <span className="text-sm text-gray-600">Nombre:</span>
              <p className="font-bold">{booking.guest?.name || 'No disponible'}</p>
            </div>
            
            {booking.contacts_released && (
              <>
                <div>
                  <span className="text-sm text-gray-600">Email:</span>
                  <p className="font-bold">{booking.guest_email}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Teléfono:</span>
                  <p className="font-bold">{booking.guest_phone || 'No proporcionado'}</p>
                </div>
              </>
            )}

            {booking.guest_message && (
              <div>
                <span className="text-sm text-gray-600 flex items-center gap-1 mb-1">
                  <MessageSquare className="w-4 h-4" />
                  Mensaje del huésped:
                </span>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-700 italic">"{booking.guest_message}"</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Booking Details */}
        <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-600" />
            Detalles de la Reserva
          </h3>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <span className="text-sm text-gray-600">Check-in:</span>
              <p className="font-bold text-lg">{formatDateSafe(booking.check_in, { 
                day: 'numeric', 
                month: 'long', 
                year: 'numeric' 
              })}</p>
            </div>
            <div>
              <span className="text-sm text-gray-600">Check-out:</span>
              <p className="font-bold text-lg">{formatDateSafe(booking.check_out, { 
                day: 'numeric', 
                month: 'long', 
                year: 'numeric' 
              })}</p>
            </div>
            <div>
              <span className="text-sm text-gray-600">Duración:</span>
              <p className="font-bold text-lg">{booking.months_duration} meses</p>
            </div>
            <div>
              <span className="text-sm text-gray-600">Precio mensual:</span>
              <p className="font-bold text-lg text-green-600">{formatMajor(monthlyPrice)}/mes</p>
            </div>
          </div>
        </div>

        {/* Financial Summary */}
        <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Euro className="w-5 h-5 text-green-600" />
            Resumen Financiero
          </h3>

          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-700">Alquiler total ({booking.months_duration} meses):</span>
              <span className="font-bold">{formatMajor(totalRent)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-700">Depósito:</span>
              <span className="font-bold">{formatMajor(depositAmount)}</span>
            </div>
            <div className="flex justify-between pt-3 border-t-2">
              <span className="font-bold">Recibirás (primer pago):</span>
              <span className="font-bold text-green-600 text-xl">{formatMajor(monthlyPrice + depositAmount)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Tu fee de inhabitme:</span>
              <span className="text-gray-600">-{formatMajor(hostFee)}</span>
            </div>
          </div>

          <div className="mt-4 bg-blue-50 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              💡 <strong>Nota:</strong> inhabitme retiene tu fee ({formatMajor(hostFee)}) del primer pago. Los meses restantes los cobra el huésped directamente a ti.
            </p>
          </div>
        </div>

        {/* Actions */}
        {booking.status === 'pending_host_approval' && !showRejectForm && (
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={handleAccept}
              disabled={responding}
              className="flex-1 bg-green-600 text-white py-4 rounded-xl font-bold hover:bg-green-700 transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {responding ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Procesando...
                </>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5" />
                  Aceptar Solicitud
                </>
              )}
            </button>
            <button
              onClick={() => setShowRejectForm(true)}
              className="flex-1 bg-gray-200 text-gray-700 py-4 rounded-xl font-bold hover:bg-gray-300 transition flex items-center justify-center gap-2"
            >
              <XCircle className="w-5 h-5" />
              Rechazar
            </button>
          </div>
        )}

        {showRejectForm && (
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-bold mb-4">¿Por qué rechazas esta solicitud?</h3>
            <textarea
              value={responseMessage}
              onChange={(e) => setResponseMessage(e.target.value)}
              className="w-full border-2 border-gray-300 rounded-lg p-3 mb-4"
              rows={4}
              placeholder="Escribe un mensaje al huésped explicando por qué no puedes aceptar su solicitud..."
            />
            <div className="flex gap-3">
              <button
                onClick={handleReject}
                disabled={responding || !responseMessage.trim()}
                className="flex-1 bg-red-600 text-white py-3 rounded-lg font-bold hover:bg-red-700 transition disabled:opacity-50"
              >
                {responding ? 'Procesando...' : 'Confirmar Rechazo'}
              </button>
              <button
                onClick={() => setShowRejectForm(false)}
                className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-bold hover:bg-gray-300 transition"
              >
                Cancelar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
