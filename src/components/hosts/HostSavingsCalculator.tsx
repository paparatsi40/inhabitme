'use client'

import { useState, useMemo } from 'react'
import { Calculator, TrendingUp, ArrowRight } from 'lucide-react'
import { useDisplayCurrency } from '@/lib/currency/useDisplayCurrency'

/**
 * Tabla de tarifas del host (sincronizar con messages/{en,es}.json y backend).
 * Es la tarifa que el HOST paga a InhabitMe cuando confirma una reserva.
 */
const HOST_FEE_BY_MONTHS: Record<number, number> = {
  1: 49,
  2: 79,
  3: 79,
  4: 99,
  5: 99,
  6: 99,
  7: 119,
  8: 119,
  9: 119,
  10: 119,
  11: 119,
  12: 119,
}

/** Comisión típica de Airbnb sobre el monto total del alquiler (3% host + 14% guest = host paga ~3% pero el rent efectivo sube). Para simplificar usamos 15% que es el efecto neto en el host margin. */
const AIRBNB_HOST_FEE_PCT = 0.15

interface CalculatorLabels {
  title: string
  description: string
  monthlyRentLabel: string
  monthlyRentPlaceholder: string
  durationLabel: string
  durationUnitSingular: string
  durationUnitPlural: string
  results: {
    totalRevenue: string
    airbnbFee: string
    inhabitmeFee: string
    yourSavings: string
    perStay: string
  }
  cta: string
  disclaimer: string
}

interface HostSavingsCalculatorProps {
  labels: CalculatorLabels
}

export function HostSavingsCalculator({ labels }: HostSavingsCalculatorProps) {
  const currency = useDisplayCurrency('USD')
  const symbol = currency === 'EUR' ? '€' : '$'

  // Defaults razonables para una propiedad media
  const [monthlyRent, setMonthlyRent] = useState<number>(1200)
  const [months, setMonths] = useState<number>(3)

  const calc = useMemo(() => {
    const totalRevenue = monthlyRent * months
    const airbnbFee = Math.round(totalRevenue * AIRBNB_HOST_FEE_PCT)
    const inhabitmeFee = HOST_FEE_BY_MONTHS[Math.min(months, 12)] ?? 119
    const savings = airbnbFee - inhabitmeFee
    return { totalRevenue, airbnbFee, inhabitmeFee, savings }
  }, [monthlyRent, months])

  const fmt = (n: number) =>
    new Intl.NumberFormat(currency === 'EUR' ? 'es-ES' : 'en-US', {
      style: 'currency',
      currency,
      maximumFractionDigits: 0,
    }).format(n)

  return (
    <div className="bg-gradient-to-br from-blue-50 via-purple-50 to-blue-50 border-2 border-blue-200 rounded-3xl p-8 lg:p-12">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex p-3 bg-white rounded-2xl shadow-md mb-4">
            <Calculator className="h-8 w-8 text-blue-600" />
          </div>
          <h2 className="text-3xl lg:text-4xl font-black text-gray-900 mb-3">{labels.title}</h2>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">{labels.description}</p>
        </div>

        {/* Inputs */}
        <div className="bg-white rounded-2xl p-6 lg:p-8 shadow-sm border border-gray-200 mb-6">
          <div className="grid sm:grid-cols-2 gap-6">
            {/* Monthly rent */}
            <div>
              <label htmlFor="monthly-rent" className="block text-sm font-bold text-gray-900 mb-2">
                {labels.monthlyRentLabel}
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-black text-gray-400 pointer-events-none">
                  {symbol}
                </span>
                <input
                  id="monthly-rent"
                  type="number"
                  min={100}
                  step={50}
                  value={monthlyRent}
                  onChange={(e) => setMonthlyRent(Math.max(100, Number(e.target.value) || 0))}
                  placeholder={labels.monthlyRentPlaceholder}
                  className="w-full pl-12 pr-4 py-3 text-2xl font-black border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Duration slider */}
            <div>
              <label htmlFor="duration" className="block text-sm font-bold text-gray-900 mb-2">
                {labels.durationLabel}: <span className="text-blue-600">{months} {months === 1 ? labels.durationUnitSingular : labels.durationUnitPlural}</span>
              </label>
              <input
                id="duration"
                type="range"
                min={1}
                max={12}
                step={1}
                value={months}
                onChange={(e) => setMonths(Number(e.target.value))}
                className="w-full h-3 bg-gray-200 rounded-full appearance-none cursor-pointer accent-blue-600"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>1</span>
                <span>3</span>
                <span>6</span>
                <span>12</span>
              </div>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          {/* Total revenue */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200">
            <p className="text-sm text-gray-600 mb-1">{labels.results.totalRevenue}</p>
            <p className="text-3xl font-black text-gray-900">{fmt(calc.totalRevenue)}</p>
          </div>

          {/* Airbnb fee */}
          <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-6">
            <p className="text-sm text-red-700 font-semibold mb-1">{labels.results.airbnbFee}</p>
            <p className="text-3xl font-black text-red-600 line-through decoration-2">{fmt(calc.airbnbFee)}</p>
          </div>

          {/* InhabitMe fee */}
          <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-6">
            <p className="text-sm text-green-700 font-semibold mb-1">{labels.results.inhabitmeFee}</p>
            <p className="text-3xl font-black text-green-600">{fmt(calc.inhabitmeFee)}</p>
          </div>
        </div>

        {/* Savings highlight */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-8 text-white text-center shadow-xl">
          <div className="inline-flex items-center gap-2 mb-3 opacity-90">
            <TrendingUp className="h-5 w-5" />
            <span className="font-semibold uppercase tracking-wider text-sm">{labels.results.yourSavings}</span>
          </div>
          <p className="text-5xl lg:text-7xl font-black mb-2">
            {calc.savings > 0 ? '+' : ''}{fmt(calc.savings)}
          </p>
          <p className="text-blue-100 text-lg">{labels.results.perStay}</p>

          <a
            href="#cta-create-listing"
            className="inline-flex items-center gap-2 mt-6 px-8 py-3 bg-white text-blue-600 rounded-xl font-bold shadow-lg hover:bg-gray-50 transition"
          >
            {labels.cta}
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>

        <p className="text-xs text-gray-500 text-center mt-4 max-w-2xl mx-auto">
          {labels.disclaimer}
        </p>
      </div>
    </div>
  )
}
