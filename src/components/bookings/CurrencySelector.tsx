'use client'

/**
 * CurrencySelector — InhabitMe
 *
 * Toggle EUR / USD que el usuario ve antes de ir al checkout de Stripe.
 * Muestra el fee en ambas monedas para que el usuario elija con información.
 *
 * Uso:
 *   <CurrencySelector
 *     months={booking.months_duration}
 *     userRole="guest"          // 'guest' | 'host'
 *     defaultCurrency="usd"     // detectado por ubicación
 *     onCheckout={(currency) => handleCheckout(currency)}
 *   />
 */

import { useState } from 'react'
import { calculateDurationFees, formatFee, type SupportedCurrency } from '@/lib/pricing/duration-fees'
import { Loader2 } from 'lucide-react'

interface CurrencySelectorProps {
  months: number
  userRole: 'guest' | 'host'
  defaultCurrency?: SupportedCurrency
  onCheckout: (currency: SupportedCurrency) => Promise<void>
  loading?: boolean
}

export function CurrencySelector({
  months,
  userRole,
  defaultCurrency = 'eur',
  onCheckout,
  loading = false,
}: CurrencySelectorProps) {
  const [selected, setSelected] = useState<SupportedCurrency>(defaultCurrency)
  const [isLoading, setIsLoading] = useState(false)

  const feesEur = calculateDurationFees(months, 'eur')
  const feesUsd = calculateDurationFees(months, 'usd')

  const feeEur = userRole === 'guest' ? feesEur.guestFee : feesEur.hostFee
  const feeUsd = userRole === 'guest' ? feesUsd.guestFee : feesUsd.hostFee

  const handlePay = async () => {
    setIsLoading(true)
    try {
      await onCheckout(selected)
    } finally {
      setIsLoading(false)
    }
  }

  const busy = loading || isLoading

  return (
    <div className="space-y-4">
      {/* Toggle de moneda */}
      <div>
        <p className="text-sm font-medium text-gray-700 mb-2">Elige tu moneda de pago</p>
        <div className="flex rounded-xl border border-gray-200 overflow-hidden">
          <button
            type="button"
            onClick={() => setSelected('eur')}
            className={`flex-1 flex flex-col items-center py-3 px-4 transition-all text-sm font-semibold ${
              selected === 'eur'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            <span className="text-lg font-bold">{formatFee(feeEur, 'eur')}</span>
            <span className={`text-xs mt-0.5 ${selected === 'eur' ? 'text-blue-100' : 'text-gray-400'}`}>
              Euros · EUR
            </span>
          </button>

          <div className="w-px bg-gray-200" />

          <button
            type="button"
            onClick={() => setSelected('usd')}
            className={`flex-1 flex flex-col items-center py-3 px-4 transition-all text-sm font-semibold ${
              selected === 'usd'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            <span className="text-lg font-bold">{formatFee(feeUsd, 'usd')}</span>
            <span className={`text-xs mt-0.5 ${selected === 'usd' ? 'text-blue-100' : 'text-gray-400'}`}>
              Dólares · USD
            </span>
          </button>
        </div>

        {/* Nota de transparencia */}
        {selected === 'usd' && (
          <p className="text-xs text-gray-400 mt-1.5">
            💡 El EUR puede resultar más económico según el tipo de cambio de tu banco.
          </p>
        )}
        {selected === 'eur' && defaultCurrency === 'usd' && (
          <p className="text-xs text-gray-400 mt-1.5">
            💡 Pagando en EUR tu banco aplicará el tipo de cambio del día.
          </p>
        )}
      </div>

      {/* Botón de pago */}
      <button
        type="button"
        onClick={handlePay}
        disabled={busy}
        className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-bold text-base transition-colors"
      >
        {busy ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Preparando pago...
          </>
        ) : (
          <>
            Pagar {formatFee(selected === 'eur' ? feeEur : feeUsd, selected)} →
          </>
        )}
      </button>
    </div>
  )
}
