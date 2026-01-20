'use client'

import { useState } from 'react'
import { X, Mail, CheckCircle, MapPin, ArrowRight, Loader2 } from 'lucide-react'
import Link from 'next/link'

interface AlternativeCity {
  name: string
  slug: string
  distance?: string
  properties: number
  priceFrom: number
  highlight: string
}

interface WaitlistModalProps {
  isOpen: boolean
  onClose: () => void
  cityName: string
  citySlug: string
  alternatives: AlternativeCity[]
}

export function WaitlistModal({ 
  isOpen, 
  onClose, 
  cityName, 
  citySlug,
  alternatives 
}: WaitlistModalProps) {
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState('')

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/waitlist/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email, 
          city: cityName,
          citySlug 
        }),
      })

      if (!response.ok) {
        throw new Error('Error al registrar')
      }

      setIsSuccess(true)
    } catch (err) {
      setError('Hubo un error. Por favor, intenta de nuevo.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg">
              <Mail className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Te avisaremos</h2>
              <p className="text-sm opacity-90">Cuando haya propiedades en {cityName}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6">
          {!isSuccess ? (
            <>
              {/* Form */}
              <form onSubmit={handleSubmit} className="mb-8">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Tu email
                </label>
                <div className="flex gap-3">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="tu@email.com"
                    required
                    className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                  />
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Enviando...
                      </>
                    ) : (
                      'Notificarme'
                    )}
                  </button>
                </div>
                {error && (
                  <p className="text-red-600 text-sm mt-2">{error}</p>
                )}
              </form>

              {/* Alternatives */}
              <div className="border-t-2 border-gray-200 pt-6">
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  Mientras tanto, estas ciudades pueden interesarte:
                </h3>
                <p className="text-sm text-gray-600 mb-6">
                  Tenemos propiedades disponibles <strong>ahora mismo</strong> en ciudades cercanas o similares
                </p>

                <div className="space-y-4">
                  {alternatives.map((city) => (
                    <Link
                      key={city.slug}
                      href={`/${city.slug}`}
                      onClick={onClose}
                      className="block p-4 bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-200 rounded-xl hover:shadow-lg hover:border-blue-400 transition group"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <MapPin className="h-5 w-5 text-blue-600" />
                            <h4 className="text-lg font-bold text-gray-900">
                              {city.name}
                            </h4>
                            {city.distance && (
                              <span className="text-xs bg-white px-2 py-1 rounded-full text-gray-600 font-medium">
                                {city.distance}
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-700 mb-2">{city.highlight}</p>
                          <div className="flex items-center gap-4 text-sm">
                            <span className="font-semibold text-blue-600">
                              {city.properties} {city.properties === 1 ? 'propiedad' : 'propiedades'}
                            </span>
                            <span className="text-gray-600">
                              desde <strong className="text-green-600">€{city.priceFrom}</strong>/mes
                            </span>
                          </div>
                        </div>
                        <ArrowRight className="h-6 w-6 text-blue-600 group-hover:translate-x-1 transition" />
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </>
          ) : (
            /* Success State */
            <div className="text-center py-8">
              <div className="inline-flex p-6 bg-green-100 rounded-full mb-6">
                <CheckCircle className="h-16 w-16 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                ¡Listo! Te avisaremos
              </h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                Recibirás un email en <strong>{email}</strong> tan pronto tengamos propiedades disponibles en {cityName}.
              </p>
              
              <div className="border-t-2 border-gray-200 pt-6 mt-6">
                <p className="text-sm font-semibold text-gray-700 mb-4">
                  Mientras tanto, explora estas opciones:
                </p>
                <div className="flex flex-wrap gap-3 justify-center">
                  {alternatives.map((city) => (
                    <Link
                      key={city.slug}
                      href={`/${city.slug}`}
                      onClick={onClose}
                      className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg transition"
                    >
                      Ver {city.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
