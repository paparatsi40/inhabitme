'use client';

import { useParams, useRouter } from 'next/navigation';
import { CheckCircle, Mail, Phone } from 'lucide-react';
import { useEffect } from 'react';

export default function BookingConfirmedPage() {
  const params = useParams();
  const router = useRouter();

  useEffect(() => {
    // Redirect to booking detail after 5 seconds
    const timer = setTimeout(() => {
      router.push(`/en/bookings/${params.id}`);
    }, 5000);

    return () => clearTimeout(timer);
  }, [params.id, router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-50 flex items-center justify-center px-4">
      <div className="max-w-2xl mx-auto text-center">
        <div className="bg-white rounded-3xl p-12 shadow-2xl">
          <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-white" />
          </div>
          
          <h1 className="text-4xl font-black mb-4">
            ¡Reserva Confirmada! 💰
          </h1>
          
          <p className="text-xl text-gray-600 mb-8">
            Tu pago ha sido procesado. La reserva está 100% confirmada.
          </p>
          
          <div className="bg-green-50 rounded-2xl p-6 mb-8 text-left">
            <h2 className="font-bold text-lg mb-3">💸 ¿Cuándo recibiré el dinero?</h2>
            <p className="text-gray-700 mb-4">
              Recibirás el pago (primer mes + depósito - fees) en <strong>1-3 días hábiles</strong> 
              en tu cuenta bancaria.
            </p>
            
            <h2 className="font-bold text-lg mb-3 mt-6">📧 Información del Inquilino</h2>
            <p className="text-gray-700">
              Los datos de contacto del inquilino han sido enviados a tu email.
              También los verás en los detalles de la reserva.
            </p>
          </div>
          
          <p className="text-gray-600 mb-8">
            Redirigiendo a los detalles de la reserva en 5 segundos...
          </p>
          
          <button
            onClick={() => router.push(`/en/bookings/${params.id}`)}
            className="bg-gradient-to-r from-green-600 to-teal-600 text-white px-8 py-3 rounded-full font-bold hover:scale-105 transition"
          >
            Ver Detalles de la Reserva
          </button>
        </div>
      </div>
    </div>
  );
}
