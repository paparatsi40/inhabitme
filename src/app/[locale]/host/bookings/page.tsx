'use client';

import { useEffect, useState } from 'react';
import { Link } from '@/i18n/routing';
import { Calendar, Clock, Euro, Eye, CheckCircle, XCircle, Loader2, Home, ArrowLeft, Inbox } from 'lucide-react';
import { normalizeCurrency } from '@/lib/currency';
import { useLocale, useTranslations } from 'next-intl';

// Helper function to format dates without timezone issues
const formatDateSafe = (dateString: string, locale: string, options: Intl.DateTimeFormatOptions) => {
  // Parse date as local date to avoid timezone shifts
  const [year, month, day] = dateString.split('T')[0].split('-');
  const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
  return date.toLocaleDateString(locale === 'en' ? 'en-US' : 'es-ES', options);
};

interface Booking {
  id: string;
  property_id: string;
  guest_id: string;
  check_in: string;
  check_out: string;
  months_duration: number;
  monthly_price: number;
  deposit_amount: number;
  guest_fee: number;
  status: string;
  guest_message: string;
  created_at: string;
  property?: any;
  guest?: any;
}

export default function HostBookingsPage() {
  const t = useTranslations('hostBookings');
  const locale = useLocale();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'confirmed' | 'completed'>('all');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await fetch('/api/host/bookings');
      if (res.ok) {
        const data = await res.json();
        setBookings(data.bookings || []);
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredBookings = bookings.filter(b => {
    if (filter === 'all') return true;
    if (filter === 'pending') return b.status === 'pending_host_approval';
    if (filter === 'confirmed') return b.status === 'confirmed';
    if (filter === 'completed') return b.status === 'completed';
    return true;
  });

  const pendingCount = bookings.filter(b => b.status === 'pending_host_approval').length;
  const confirmedCount = bookings.filter(b => b.status === 'confirmed').length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600 font-semibold">{t('loading')}</p>
        </div>
      </div>
    );
  }

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
            <Link href="/dashboard">
              <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl font-semibold text-gray-700 transition">
                <ArrowLeft className="w-4 h-4" />
                {t('dashboard')}
              </button>
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        {/* Hero Header */}
        <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-blue-700 rounded-3xl p-8 lg:p-12 mb-8 text-white shadow-2xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl">
              <Inbox className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl lg:text-5xl font-black">{t('title')}</h1>
              <p className="text-lg lg:text-xl opacity-90 mt-2">
                {t('subtitle')}
              </p>
            </div>
          </div>
        </div>

        {/* Stats Cards PREMIUM */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-sm border-2 border-yellow-100 hover:shadow-lg hover:border-yellow-300 transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-yellow-100 to-amber-200 rounded-xl">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
              {pendingCount > 0 && (
                <div className="bg-yellow-500 text-white text-xs font-bold rounded-full w-8 h-8 flex items-center justify-center animate-pulse">
                  {pendingCount}
                </div>
              )}
            </div>
            <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-1">{t('pending')}</p>
            <p className="text-4xl font-black text-gray-900">{pendingCount}</p>
            <p className="text-xs text-gray-500 mt-2">{t('waitingYourResponse')}</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border-2 border-green-100 hover:shadow-lg hover:border-green-300 transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-green-100 to-emerald-200 rounded-xl">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-1">{t('confirmed')}</p>
            <p className="text-4xl font-black text-gray-900">{confirmedCount}</p>
            <p className="text-xs text-gray-500 mt-2">{t('activeBookings')}</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border-2 border-blue-100 hover:shadow-lg hover:border-blue-300 transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-1">{t('total')}</p>
            <p className="text-4xl font-black text-gray-900">{bookings.length}</p>
            <p className="text-xs text-gray-500 mt-2">{t('allRequests')}</p>
          </div>
        </div>

        {/* Filters PREMIUM */}
        <div className="bg-white rounded-2xl p-2 shadow-sm border-2 border-gray-200 mb-8 inline-flex gap-2">
          {(['all', 'pending', 'confirmed', 'completed'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-6 py-3 rounded-xl font-bold whitespace-nowrap transition-all ${
                filter === f
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg scale-105'
                  : 'bg-transparent text-gray-700 hover:bg-gray-100'
              }`}
            >
              {f === 'all' && t('all')}
              {f === 'pending' && `${t('pending')} (${pendingCount})`}
              {f === 'confirmed' && `${t('confirmed')} (${confirmedCount})`}
              {f === 'completed' && t('completed')}
            </button>
          ))}
        </div>

        {/* Bookings List */}
        {filteredBookings.length === 0 ? (
          <div className="bg-gradient-to-br from-gray-50 to-blue-50/30 rounded-3xl border-2 border-dashed border-gray-300 p-12 text-center">
            <div className="inline-flex p-6 bg-white rounded-3xl shadow-lg mb-6">
              <Inbox className="w-16 h-16 text-gray-400" />
            </div>
            <h3 className="text-2xl font-black mb-3 text-gray-900">{t('noBookings')}</h3>
            <p className="text-gray-600 text-lg">
              {filter === 'pending' && t('noPendingRequests')}
              {filter === 'confirmed' && t('noConfirmedBookings')}
              {filter === 'all' && t('noBookingRequestsYet')}
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredBookings.map((booking) => {
              const currency = normalizeCurrency((booking as any).currency)
              const moneyLocale = currency === 'EUR' ? 'es-ES' : 'en-US'
              const formatMinor = (amountMinor: number) => new Intl.NumberFormat(moneyLocale, { style: 'currency', currency }).format((amountMinor || 0) / 100)

              return (
              <div key={booking.id} className="bg-white rounded-2xl p-6 lg:p-8 shadow-sm border-2 border-gray-200 hover:shadow-xl hover:border-blue-300 transition-all">
                <div className="flex flex-col lg:flex-row items-start justify-between gap-6">
                  <div className="flex-1 w-full">
                    {/* Status Badge */}
                    <div className="mb-4">
                      {booking.status === 'pending_host_approval' && (
                        <span className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-100 to-amber-100 text-yellow-800 px-4 py-2 rounded-xl text-sm font-bold border-2 border-yellow-200">
                          <Clock className="w-4 h-4" />
                          {t('waitingYourResponse')}
                        </span>
                      )}
                      {booking.status === 'pending_guest_payment' && (
                        <span className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-800 px-4 py-2 rounded-xl text-sm font-bold border-2 border-blue-200">
                          <Clock className="w-4 h-4" />
                          {t('waitingGuestPayment')}
                        </span>
                      )}
                      {booking.status === 'pending_host_payment' && (
                        <span className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 px-4 py-2 rounded-xl text-sm font-bold border-2 border-purple-200">
                          <Clock className="w-4 h-4" />
                          {t('waitingYourPayment')}
                        </span>
                      )}
                      {booking.status === 'confirmed' && (
                        <span className="inline-flex items-center gap-2 bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 px-4 py-2 rounded-xl text-sm font-bold border-2 border-green-200">
                          <CheckCircle className="w-4 h-4" />
                          {t('confirmedSingle')}
                        </span>
                      )}
                    </div>

                    {/* Guest Info */}
                    <h3 className="text-xl lg:text-2xl font-black mb-4 text-gray-900">
                      {t('guestRequest')}
                    </h3>

                    {/* Booking Details */}
                    <div className="grid md:grid-cols-3 gap-4 mb-4">
                      <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-4 border-2 border-blue-100">
                        <div className="flex items-center gap-2 mb-2">
                          <Calendar className="w-5 h-5 text-blue-600" />
                          <span className="text-xs font-semibold text-gray-600 uppercase">{t('dates')}</span>
                        </div>
                        <p className="text-sm font-bold text-gray-900">
                          {formatDateSafe(booking.check_in, locale, { day: 'numeric', month: 'short' })} - {formatDateSafe(booking.check_out, locale, { day: 'numeric', month: 'short', year: 'numeric' })}
                        </p>
                      </div>
                      <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 border-2 border-purple-100">
                        <div className="flex items-center gap-2 mb-2">
                          <Clock className="w-5 h-5 text-purple-600" />
                          <span className="text-xs font-semibold text-gray-600 uppercase">{t('duration')}</span>
                        </div>
                        <p className="text-sm font-bold text-gray-900">{booking.months_duration} {t('months')}</p>
                      </div>
                      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border-2 border-green-100">
                        <div className="flex items-center gap-2 mb-2">
                          <Euro className="w-5 h-5 text-green-600" />
                          <span className="text-xs font-semibold text-gray-600 uppercase">{t('price')}</span>
                        </div>
                        <p className="text-lg font-black text-green-700">{formatMinor(booking.monthly_price)}<span className="text-sm font-semibold text-gray-600">{t('perMonth')}</span></p>
                      </div>
                    </div>

                    {/* Guest Message */}
                    {booking.guest_message && (
                      <div className="bg-gradient-to-r from-gray-50 to-blue-50/30 rounded-xl p-4 mb-4 border-l-4 border-blue-500">
                        <p className="text-xs font-semibold text-gray-600 uppercase mb-2">{t('guestMessage')}</p>
                        <p className="text-sm text-gray-700 italic">"{booking.guest_message}"</p>
                      </div>
                    )}

                    {/* Created At */}
                    <p className="text-xs text-gray-500 font-medium">
                      📅 {t('requestReceived')}: {formatDateSafe(booking.created_at, locale, { day: 'numeric', month: 'long', year: 'numeric' })} {t('atTime')} {new Date(booking.created_at).toLocaleTimeString(locale === 'en' ? 'en-US' : 'es-ES', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-3 lg:min-w-[200px]">
                    <Link
                      href={`/host/bookings/${booking.id}`}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-bold hover:shadow-lg hover:scale-105 transition-all flex items-center justify-center gap-2 whitespace-nowrap"
                    >
                      <Eye className="w-5 h-5" />
                      {t('viewDetails')}
                    </Link>

                    {booking.status === 'pending_host_approval' && (
                      <div className="flex flex-col gap-3">
                        <Link
                          href={`/host/bookings/${booking.id}?action=accept`}
                          className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-xl font-bold hover:shadow-lg hover:scale-105 transition-all flex items-center justify-center gap-2 whitespace-nowrap"
                        >
                          <CheckCircle className="w-5 h-5" />
                          {t('accept')}
                        </Link>
                        <Link
                          href={`/host/bookings/${booking.id}?action=reject`}
                          className="bg-white border-2 border-gray-300 text-gray-700 px-6 py-3 rounded-xl font-bold hover:bg-gray-50 hover:border-gray-400 transition-all flex items-center justify-center gap-2 whitespace-nowrap"
                        >
                          <XCircle className="w-5 h-5" />
                          {t('reject')}
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )})}
          </div>
        )}
      </div>
    </div>
  );
}
