'use client'

import { CheckCircle, X, Wifi, Home, Calendar, Euro, MapPin } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ContactConfirmModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  property: {
    title: string
    city: string
    monthlyPrice: number
    wifiSpeed?: number
    bedrooms?: number
    minStayMonths?: number
    maxStayMonths?: number
  }
  leadPrice: string
  isProcessing?: boolean
}

export function ContactConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  property,
  leadPrice,
  isProcessing = false
}: ContactConfirmModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center lg:p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
      {/* MOBILE: fullscreen | DESKTOP: modal centrado con animación */}
      <div className="bg-white lg:rounded-3xl shadow-2xl max-w-lg w-full h-full lg:h-auto lg:max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom-4 lg:slide-in-from-bottom-0 lg:zoom-in-95 duration-300">
        {/* Header PREMIUM */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-50 to-purple-50 border-b-2 border-blue-100 px-4 sm:px-6 py-4 sm:py-5 flex items-center justify-between backdrop-blur-sm z-10">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Confirmar contacto
            </h2>
            <p className="text-sm text-gray-600 mt-0.5">Un paso más para contactar al anfitrión</p>
          </div>
          {/* Touch target optimizado: min 44x44px */}
          <button 
            onClick={onClose}
            className="p-3 sm:p-2 hover:bg-white/80 rounded-full transition-all touch-manipulation shadow-sm hover:shadow"
            disabled={isProcessing}
            aria-label="Cerrar modal"
          >
            <X className="h-6 w-6 sm:h-5 sm:w-5 text-gray-600" />
          </button>
        </div>

        {/* Content PREMIUM */}
        <div className="px-4 sm:px-6 py-6 sm:py-8 space-y-5 sm:space-y-6">
          {/* Propiedad info - Más destacada */}
          <div className="bg-gradient-to-br from-gray-50 to-blue-50/30 rounded-xl p-4 border border-gray-200">
            <p className="text-xs uppercase tracking-wide text-gray-500 font-semibold mb-2">Propiedad seleccionada</p>
            <p className="text-xl font-bold text-gray-900 leading-tight mb-1">{property.title}</p>
            <p className="text-sm text-gray-600 flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              {property.city}
            </p>
          </div>

          {/* Características destacadas - Diseño más atractivo */}
          <div className="bg-gradient-to-br from-blue-50 via-purple-50 to-blue-50 rounded-xl p-5 space-y-4 border border-blue-200">
            <p className="text-sm font-bold text-gray-900 flex items-center gap-2">
              <span className="text-lg">✨</span>
              Características verificadas
            </p>
            
            <div className="grid grid-cols-2 gap-3">
              {property.monthlyPrice && (
                <div className="flex items-center gap-2.5 bg-white rounded-lg p-2.5 shadow-sm border border-blue-100">
                  <div className="p-1.5 bg-blue-100 rounded-lg">
                    <Euro className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="flex flex-col leading-tight">
                    <span className="text-xs text-gray-500">Precio</span>
                    <span className="font-bold text-gray-900">€{property.monthlyPrice.toLocaleString()}</span>
                  </div>
                </div>
              )}
              
              {property.wifiSpeed && (
                <div className="flex items-center gap-2.5 bg-white rounded-lg p-2.5 shadow-sm border border-green-100">
                  <div className="p-1.5 bg-green-100 rounded-lg">
                    <Wifi className="h-4 w-4 text-green-600" />
                  </div>
                  <div className="flex flex-col leading-tight">
                    <span className="text-xs text-gray-500">WiFi</span>
                    <span className="font-bold text-gray-900">{property.wifiSpeed} Mbps</span>
                  </div>
                </div>
              )}
              
              {property.bedrooms && (
                <div className="flex items-center gap-2.5 bg-white rounded-lg p-2.5 shadow-sm border border-purple-100">
                  <div className="p-1.5 bg-purple-100 rounded-lg">
                    <Home className="h-4 w-4 text-purple-600" />
                  </div>
                  <div className="flex flex-col leading-tight">
                    <span className="text-xs text-gray-500">Habitaciones</span>
                    <span className="font-bold text-gray-900">{property.bedrooms}</span>
                  </div>
                </div>
              )}
              
              {property.minStayMonths && (
                <div className="flex items-center gap-2.5 bg-white rounded-lg p-2.5 shadow-sm border border-orange-100">
                  <div className="p-1.5 bg-orange-100 rounded-lg">
                    <Calendar className="h-4 w-4 text-orange-600" />
                  </div>
                  <div className="flex flex-col leading-tight">
                    <span className="text-xs text-gray-500">Estancia</span>
                    <span className="font-bold text-gray-900">{property.minStayMonths}-{property.maxStayMonths}m</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Qué obtienes - Diseño mejorado */}
          <div className="border-2 border-green-300 rounded-xl p-5 bg-gradient-to-br from-green-50 to-emerald-50">
            <p className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              Incluido en el pago de {leadPrice}
            </p>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3 p-2 bg-white rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700"><strong className="text-gray-900">Email directo</strong> del anfitrión</span>
              </li>
              <li className="flex items-start gap-3 p-2 bg-white rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">Coordina <strong className="text-gray-900">visita y fechas</strong> directamente</span>
              </li>
              <li className="flex items-start gap-3 p-2 bg-white rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700"><strong className="text-gray-900">Sin intermediarios</strong> ni comisiones extra</span>
              </li>
            </ul>
          </div>

          {/* Precio destacado - MÁS PROMINENTE */}
          <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl p-6 text-center text-white shadow-lg">
            <p className="text-sm font-medium mb-2 opacity-90">Precio total</p>
            <p className="text-6xl font-black mb-2">{leadPrice}</p>
            <div className="flex items-center justify-center gap-2 text-sm opacity-90">
              <CheckCircle className="h-4 w-4" />
              <span>Pago único · Sin suscripciones</span>
            </div>
          </div>

          {/* Garantía */}
          <div className="text-center bg-gray-50 rounded-lg p-3">
            <p className="text-xs text-gray-600 flex items-center justify-center gap-1.5">
              🔒 <strong>Pago 100% seguro</strong> con Stripe · Cancelación sencilla
            </p>
          </div>
        </div>

        {/* Footer - CTAs MEJORADOS */}
        <div className="sticky bottom-0 bg-gradient-to-t from-gray-50 to-white border-t-2 border-gray-200 px-4 sm:px-6 py-4 flex gap-3">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isProcessing}
            className="flex-1 border-2 border-gray-300 hover:bg-gray-50 font-semibold"
            size="lg"
          >
            Volver
          </Button>
          <Button
            onClick={onConfirm}
            disabled={isProcessing}
            className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold shadow-lg hover:shadow-xl transition-all"
            size="lg"
          >
            {isProcessing ? (
              <span className="flex items-center justify-center gap-2">
                <div className="animate-spin rounded-full h-5 w-5 border-3 border-white border-t-transparent"></div>
                Redirigiendo...
              </span>
            ) : (
              <>Continuar al pago →</>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
