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

  const bookingId = params?.id as string;

  useEffect(() => {
    if (bookingId) {
      fetchBooking();
    }
  }, [bookingId]);

  const fetchBooking = async () => {
    if (!bookingId) return;
    try {
      const res = await fetch(`/api/bookings/${bookingId}`);
      if (res.ok) {
        const data = await res.json();
        setBooking(data.booking || data);
      }
    } catch (error) {
      console.error('Error fetching booking:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    if (!bookingId) return;
    setPaying(true);
    try {
      const res = await fetch(`/api/bookings/${bookingId}/create-checkout`, {
        method: 'POST',
      });

      if (res.ok) {
        const data = await res.json();
        if (data.url) {
          window.location.href = data.url;
        } else {
          alert('Error: No se recibió URL de pago');
          setPaying(false);
        }
      } else {
        alert('Error al iniciar el pago');
        setPaying(false);
      }
    } catch (error) {
      console.error('Error creating checkout:', error);
      alert('Error al procesar el pago');
      setPaying(false);
    }
  };

  // ... rest of component
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8">
      {/* Placeholder - full implementation needed */}
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-2xl font-bold">Booking Detail</h1>
        <p className="text-gray-600">ID: {bookingId}</p>
      </div>
    </div>
  );
}
