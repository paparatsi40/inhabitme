'use client'

import { useState } from 'react'
import { X, MessageSquare, Send } from 'lucide-react'

interface AskQuestionModalProps {
  isOpen: boolean
  onClose: () => void
  property: any
}

export function AskQuestionModal({ isOpen, onClose, property }: AskQuestionModalProps) {
  const [message, setMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!message.trim()) {
      setError('Por favor escribe tu pregunta')
      return
    }

    setSubmitting(true)
    setError('')

    try {
      // Simulamos el envío (endpoint pendiente de implementar)
      console.log('[AskQuestion] Enviando pregunta:', {
        propertyId: property.id,
        message: message.trim(),
        type: 'question',
      })
      
      // Simulamos un delay de red
      await new Promise(resolve => setTimeout(resolve, 1000))

      setSuccess(true)
      setTimeout(() => {
        onClose()
        setMessage('')
        setSuccess(false)
      }, 2000)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full animate-in slide-in-from-bottom duration-300">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 flex items-center justify-between rounded-t-3xl">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <MessageSquare className="h-5 w-5 text-white" />
              <span className="text-white text-sm font-medium">Pregunta al Anfitrión</span>
            </div>
            <h2 className="text-xl font-bold text-white">{property?.title}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-full transition text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {success ? (
            <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                <Send className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-lg font-bold text-green-900 mb-2">¡Mensaje Enviado!</h3>
              <p className="text-sm text-green-700">
                El anfitrión recibirá tu pregunta y te responderá pronto.
              </p>
            </div>
          ) : (
            <>
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <p className="text-sm text-blue-800">
                  💬 Haz cualquier pregunta sobre la propiedad, disponibilidad, o términos de alquiler.
                  <strong> Sin compromiso.</strong>
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tu pregunta
                </label>
                <textarea
                  rows={6}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Ej: ¿Está disponible desde marzo? ¿Se pueden hacer videollamadas con la conexión WiFi? ¿Incluye gastos?"
                  className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 focus:border-blue-500 outline-none resize-none"
                />
                <p className="text-xs text-gray-500 mt-1">
                  {message.length} caracteres
                </p>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-800">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={submitting || !message.trim()}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-full font-bold hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-[1.02] active:scale-[0.98]"
              >
                {submitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="animate-spin h-5 w-5 border-3 border-white border-t-transparent rounded-full" />
                    Enviando...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <Send className="h-5 w-5" />
                    Enviar Pregunta
                  </span>
                )}
              </button>

              <p className="text-xs text-gray-500 text-center">
                El anfitrión recibirá tu mensaje por email
              </p>
            </>
          )}
        </form>
      </div>
    </div>
  )
}
