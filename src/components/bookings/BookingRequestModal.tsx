'use client';

import { useState } from 'react';
import { X, Calendar, Euro, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { useUser } from '@clerk/nextjs';
import { useLocale, useTranslations } from 'next-intl';
import { getCurrencyFromLocation, normalizeCurrency } from '@/lib/currency';

interface BookingRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  property: any;
}

export function BookingRequestModal({ isOpen, onClose, property }: BookingRequestModalProps) {
  const { user } = useUser();
  const locale = useLocale();
  const t = useTranslations('bookingModal');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const calculateMonths = () => {
    if (!checkIn || !checkOut) return 0;
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.ceil(diffDays / 30);
  };

  const months = calculateMonths();
  const monthlyPrice = property?.monthly_price || property?.price?.monthly || 1000;
  const totalRent = monthlyPrice * months;
  const deposit = property?.depositAmount || monthlyPrice;
  const currency = normalizeCurrency(
    property?.currency ??
    property?.price?.currency ??
    getCurrencyFromLocation(property?.country, property?.city)
  );
  const locale = currency === 'EUR' ? 'es-ES' : 'en-US';
  const formatMoney = (amount: number) => new Intl.NumberFormat(locale, { style: 'currency', currency }).format(amount);
  
  // Calculate guest fee based on duration
  const { calculateDurationFees } = require('@/lib/pricing/duration-fees')
  const fees = calculateDurationFees(months)
  const guestFee = fees.guestFee / 100 // Convert from cents to euros for display
  
  const totalFirstPayment = totalRent + deposit + guestFee;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (months < 1) {
      setError(t('minStayError'));
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch('/api/bookings/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          propertyId: property.id,
          checkIn,
          checkOut,
          message,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || t('createRequestError'));
      }

      // Redirigir a la página de éxito
      window.location.href = `/${locale}/bookings/${data.bookingId}/success`;
    } catch (err: any) {
      setError(err.message);
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom duration-300">
        {/* Header con Gradiente inhabitme */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-purple-600 p-6 flex items-center justify-between rounded-t-3xl">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-white text-xl font-black">inhabitme</span>
              <span className="text-white/80 text-xs">•</span>
              <span className="text-white/80 text-xs font-medium">{t('bookingRequest')}</span>
            </div>
            <h2 className="text-2xl font-bold text-white">{property?.title}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-full transition text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Fechas */}
          <div className="space-y-4">
            <h3 className="font-bold text-gray-900 flex items-center gap-2">
              <Calendar className="h-5 w-5 text-blue-600" />
              {t('stayDates')}
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('checkIn')}
                </label>
                <input
                  type="date"
                  required
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 focus:border-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('checkOut')}
                </label>
                <input
                  type="date"
                  required
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  min={checkIn || new Date().toISOString().split('T')[0]}
                  className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 focus:border-blue-500 outline-none"
                />
              </div>
            </div>

            {months > 0 && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  <Clock className="h-4 w-4 inline mr-1" />
                  Duración: <strong>{months} {months === 1 ? 'mes' : 'meses'}</strong>
                </p>
              </div>
            )}
          </div>

          {/* Mensaje */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('messageToHost')
            </label>
            <textarea
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={t('messagePlaceholder')}
              className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 focus:border-blue-500 outline-none resize-none"
            />
          </div>

          {/* Desglose de costos */}
          {months > 0 && (
            <div className="bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 rounded-2xl p-6 border-2 border-purple-200 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <Euro className="h-5 w-5 text-purple-600" />
                <h3 className="font-bold text-gray-900">Desglose de Costos</h3>
              </div>
              
              <div className="space-y-3 mb-4 bg-white/70 rounded-xl p-4">
                <div className="flex justify-between text-gray-700">
                  <span className="text-sm">€{monthlyPrice.toLocaleString()} × {months} {months === 1 ? 'mes' : 'meses'}</span>
                  <span className="font-semibold">{formatMoney(totalRent)}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span className="text-sm">Depósito (reembolsable)</span>
                  <span className="font-semibold">{formatMoney(deposit)}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span className="text-sm flex items-center gap-1">
                    <span className="font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent text-xs">inhabitme</span>
                    service fee
                  </span>
                  <span className="font-semibold">{formatMoney(guestFee)}</span>
                </div>
                <div className="border-t-2 border-purple-300 pt-3 flex justify-between text-xl font-bold">
                  <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Total a Pagar HOY</span>
                  <span className="text-gray-900">{formatMoney(totalFirstPayment)}</span>
                </div>
              </div>

              <div className="bg-white rounded-lg p-4 space-y-2">
                <p className="text-sm text-gray-600 flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>{t('payAfterHostAccepts')}</span>
                </p>
                <p className="text-sm text-gray-600 flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>{t('nextMonthsPayHost', { amount: formatMoney(monthlyPrice) })}</span>
                </p>
              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-2">
              <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={submitting || months < 1}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-full font-bold text-lg hover:from-blue-700 hover:to-purple-700 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-[1.02] active:scale-[0.98]"
          >
            {submitting ? (
              <span className="flex items-center justify-center gap-2">
                <div className="animate-spin h-5 w-5 border-3 border-white border-t-transparent rounded-full" />
                Enviando solicitud...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <Calendar className="h-5 w-5" />
                Enviar Solicitud de Reserva
              </span>
            )}
          </button>

          <div className="text-center space-y-2">
            <p className="text-xs text-gray-500">
              Al enviar, aceptas que el anfitrión vea tu perfil completo
            </p>
            <p className="text-xs text-gray-400 flex items-center justify-center gap-1">
              <span>Powered by</span>
              <span className="font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">inhabitme</span>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
