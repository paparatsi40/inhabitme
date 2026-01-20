'use client'

import { ArrowRight, Calendar, Euro, MessageSquare } from 'lucide-react'
import { useState } from 'react'

interface CTASectionProps {
  variant: 'fixed' | 'floating' | 'inline'
  colors: {
    primary: string
    secondary: string
    accent: string
  }
  monthlyPrice: number
  onBooking: () => void
}

export function CTASection({ variant, colors, monthlyPrice, onBooking }: CTASectionProps) {
  switch (variant) {
    case 'fixed':
      return <FixedCTA colors={colors} monthlyPrice={monthlyPrice} onBooking={onBooking} />
    case 'floating':
      return <FloatingCTA colors={colors} monthlyPrice={monthlyPrice} onBooking={onBooking} />
    case 'inline':
      return <InlineCTA colors={colors} monthlyPrice={monthlyPrice} onBooking={onBooking} />
    default:
      return <FixedCTA colors={colors} monthlyPrice={monthlyPrice} onBooking={onBooking} />
  }
}

// Fixed Bottom CTA
function FixedCTA({ colors, monthlyPrice, onBooking }: any) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-2xl z-40 py-4 px-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div>
            <p className="text-xs text-gray-500">Precio por mes</p>
            <p className="text-2xl font-black text-gray-900 flex items-center gap-1">
              <Euro className="w-5 h-5" />
              {monthlyPrice.toLocaleString()}
            </p>
          </div>
        </div>

        <button
          onClick={onBooking}
          className="px-8 py-4 rounded-xl text-white font-bold text-lg shadow-lg hover:shadow-xl hover:scale-105 transition flex items-center gap-2"
          style={{
            background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`,
          }}
        >
          <Calendar className="w-5 h-5" />
          Solicitar Reserva
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  )
}

// Floating FAB CTA
function FloatingCTA({ colors, monthlyPrice, onBooking }: any) {
  const [expanded, setExpanded] = useState(false)

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="fixed bottom-6 right-6 w-16 h-16 rounded-full shadow-2xl z-40 flex items-center justify-center hover:scale-110 transition"
        style={{
          background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`,
        }}
      >
        <Calendar className="w-7 h-7 text-white" />
      </button>

      {/* Expanded Card */}
      {expanded && (
        <>
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30"
            onClick={() => setExpanded(false)}
          />
          
          <div className="fixed bottom-24 right-6 w-80 bg-white rounded-2xl shadow-2xl z-40 p-6">
            <div className="mb-4">
              <p className="text-sm text-gray-500 mb-1">Precio por mes</p>
              <p className="text-3xl font-black text-gray-900 flex items-center gap-2">
                <Euro className="w-6 h-6" />
                {monthlyPrice.toLocaleString()}
              </p>
            </div>

            <button
              onClick={onBooking}
              className="w-full py-4 rounded-xl text-white font-bold text-lg shadow-lg hover:shadow-xl hover:scale-105 transition flex items-center justify-center gap-2"
              style={{
                background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`,
              }}
            >
              <Calendar className="w-5 h-5" />
              Solicitar Reserva
            </button>

            <button
              onClick={() => setExpanded(false)}
              className="w-full mt-3 py-3 rounded-xl border-2 font-semibold hover:bg-gray-50 transition"
              style={{ borderColor: colors.primary, color: colors.primary }}
            >
              Cerrar
            </button>
          </div>
        </>
      )}
    </>
  )
}

// Inline CTA (dentro del contenido)
function InlineCTA({ colors, monthlyPrice, onBooking }: any) {
  return (
    <div
      className="rounded-2xl p-8 shadow-xl border-2 my-8"
      style={{
        background: `linear-gradient(135deg, ${colors.primary}10 0%, ${colors.secondary}10 100%)`,
        borderColor: `${colors.primary}40`,
      }}
    >
      <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
        <div>
          <h3 className="text-2xl font-black text-gray-900 mb-2">
            ¿Listo para reservar?
          </h3>
          <p className="text-gray-600 mb-3">
            Solicita tu reserva ahora y el host responderá en 48 horas
          </p>
          <div className="flex items-center gap-2">
            <Euro className="w-6 h-6" style={{ color: colors.primary }} />
            <span className="text-3xl font-black text-gray-900">
              {monthlyPrice.toLocaleString()}
            </span>
            <span className="text-gray-500">/mes</span>
          </div>
        </div>

        <div className="flex flex-col gap-3 w-full lg:w-auto">
          <button
            onClick={onBooking}
            className="px-8 py-4 rounded-xl text-white font-bold text-lg shadow-lg hover:shadow-xl hover:scale-105 transition flex items-center justify-center gap-2 whitespace-nowrap"
            style={{
              background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`,
            }}
          >
            <Calendar className="w-5 h-5" />
            Solicitar Reserva
            <ArrowRight className="w-5 h-5" />
          </button>

          <button
            className="px-8 py-3 rounded-xl border-2 font-semibold hover:bg-white/50 transition flex items-center justify-center gap-2"
            style={{ borderColor: colors.primary, color: colors.primary }}
          >
            <MessageSquare className="w-5 h-5" />
            Hacer Pregunta
          </button>
        </div>
      </div>
    </div>
  )
}
