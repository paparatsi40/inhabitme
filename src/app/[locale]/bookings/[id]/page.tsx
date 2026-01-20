'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { CheckCircle, Clock, XCircle, Home, Calendar, Euro, User } from 'lucide-react';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function BookingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [booking, setBooking] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);

  useEffect(() => {
    fetchBooking();
  }, []);

  const fetchBooking = async () => {
    try {
      const res = await fetch(`/api/bookings/${params.id}`);
      if (res.ok) {
        const data = await res.json();
        setBooking(data.booking || data); // Support both formats
      }
    } catch (error) {
      console.error('Error fetching booking:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    setPaying(true);
    try {
      const res = await fetch(`/api/bookings/${params.id}/create-checkout`, {
        method: 'POST',
      });

      if (res.ok) {
        const data = await res.json();
        if (data.url) {
          // Redirect directly to Stripe Checkout URL
          window.location.href = data.url;
        } else {
          alert('Error: No se recibió URL de pago');
          setPaying(false);
        }
      } else {
        const error = await res.json();
        alert(`Error al crear el checkout: ${error.details || error.error}`);
        setPaying(false);
      }
    } catch (error) {
      console.error('Payment error:', error);
      alert('Error al procesar el pago');
      setPaying(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando reserva...</p>
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Reserva no encontrada</h1>
          <button onClick={() => router.push('/en/dashboard')} className="text-blue-600">
            Volver al Dashboard
          </button>
        </div>
      </div>
    );
  }

  const getStatusInfo = () => {
    switch (booking.status) {
      case 'pending_host_approval':
        return {
          icon: <Clock className="w-8 h-8 text-yellow-600" />,
          title: 'Esperando Respuesta del Host',
          description: 'El host tiene 48 horas para responder a tu solicitud.',
          color: 'bg-yellow-50 border-yellow-200',
        };
      case 'pending_guest_payment':
        return {
          icon: <Euro className="w-8 h-8 text-blue-600" />,
          title: '¡El Host Aceptó!',
          description: 'Completa el pago para confirmar tu reserva.',
          color: 'bg-blue-50 border-blue-200',
        };
      case 'pending_host_payment':
        return {
          icon: <Clock className="w-8 h-8 text-purple-600" />,
          title: 'Pago Recibido',
          description: 'Esperando que el host complete su proceso.',
          color: 'bg-purple-50 border-purple-200',
        };
      case 'confirmed':
        return {
          icon: <CheckCircle className="w-8 h-8 text-green-600" />,
          title: '¡Reserva Confirmada!',
          description: 'Tu reserva está confirmada. Contacto liberado.',
          color: 'bg-green-50 border-green-200',
        };
      case 'cancelled':
        return {
          icon: <XCircle className="w-8 h-8 text-red-600" />,
          title: 'Reserva Cancelada',
          description: booking.cancellation_reason || 'Esta reserva fue cancelada.',
          color: 'bg-red-50 border-red-200',
        };
      default:
        return {
          icon: <Clock className="w-8 h-8 text-gray-600" />,
          title: 'En Proceso',
          description: '',
          color: 'bg-gray-50 border-gray-200',
        };
    }
  };

  const statusInfo = getStatusInfo();

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Status Card */}
        <div className={`${statusInfo.color} border-2 rounded-2xl p-8 mb-8`}>
          <div className="flex items-center gap-4 mb-4">
            {statusInfo.icon}
            <div>
              <h1 className="text-3xl font-black">{statusInfo.title}</h1>
              <p className="text-gray-700 mt-2">{statusInfo.description}</p>
            </div>
          </div>

          {booking.status === 'pending_guest_payment' && (
            <button
              onClick={handlePayment}
              disabled={paying}
              className="mt-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-full font-bold text-lg hover:scale-105 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {paying ? 'Procesando...' : `Pagar €${(booking.total_first_payment / 100).toFixed(2)}`}
            </button>
          )}
        </div>

        {/* Booking Details */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold mb-6">Detalles de la Reserva</h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <div className="flex items-center gap-2 text-gray-600 mb-2">
                <Home className="w-5 h-5" />
                <span className="font-bold">Propiedad</span>
              </div>
              <p className="text-lg">{booking.property?.title || 'Sin título'}</p>
            </div>

            <div>
              <div className="flex items-center gap-2 text-gray-600 mb-2">
                <Calendar className="w-5 h-5" />
                <span className="font-bold">Fechas</span>
              </div>
              <p className="text-lg">
                {booking.check_in} → {booking.check_out}
              </p>
              <p className="text-sm text-gray-600">{booking.months_duration} meses</p>
            </div>
          </div>

          <hr className="my-6" />

          <h3 className="font-bold text-lg mb-4">Desglose de Costos</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span>Primer mes</span>
              <span className="font-bold">€{(booking.monthly_price / 100).toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Depósito (reembolsable)</span>
              <span className="font-bold">€{(booking.deposit_amount / 100).toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>inhabitme service fee</span>
              <span className="font-bold">€{(booking.guest_fee / 100).toFixed(2)}</span>
            </div>
            <hr />
            <div className="flex justify-between text-xl font-black">
              <span>Total a pagar HOY</span>
              <span>€{(booking.total_first_payment / 100).toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Contact Info (if released) */}
        {booking.contacts_released && (
          <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-8">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <CheckCircle className="w-6 h-6 text-green-600" />
              Información de Contacto
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-bold mb-2">Host</h3>
                <p>Email: <a href={`mailto:${booking.host_email}`} className="text-blue-600">{booking.host_email}</a></p>
                {booking.host_phone && (
                  <p>Teléfono: <a href={`tel:${booking.host_phone}`} className="text-blue-600">{booking.host_phone}</a></p>
                )}
              </div>
            </div>

            <div className="mt-6 bg-white rounded-xl p-4">
              <p className="text-sm text-gray-600">
                <strong>Próximos pasos:</strong> Contacta al host para coordinar el check-in 
                el {booking.check_in}. Te recomendamos hacerlo al menos 3 días antes.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
