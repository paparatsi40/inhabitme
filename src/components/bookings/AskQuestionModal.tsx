'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { X, MessageSquare, Send } from 'lucide-react'

interface AskQuestionModalProps {
  isOpen: boolean
  onClose: () => void
  property: any
}

export function AskQuestionModal({ isOpen, onClose, property }: AskQuestionModalProps) {
  const t = useTranslations('askQuestionModal')
  const [message, setMessage] = useState('')
  const [moveInDate, setMoveInDate] = useState('')
  const [durationMonths, setDurationMonths] = useState(3)
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!message.trim()) {
      setError(t('writeQuestionError'))
      return
    }

    setSubmitting(true)
    setError('')

    try {
      const response = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          listingId: property.id,
          moveInDate,
          durationMonths,
          message: message.trim(),
        }),
      })

      const payload = await response.json()
      if (!response.ok) {
        throw new Error(payload?.error || t('genericError'))
      }

      setSuccess(true)
      setTimeout(() => {
        onClose()
        setMessage('')
        setMoveInDate('')
        setDurationMonths(3)
        setSuccess(false)
      }, 1800)
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
              <span className="text-white text-sm font-medium">{t('title')}</span>
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
              <h3 className="text-lg font-bold text-green-900 mb-2">{t('sentTitle')}</h3>
              <p className="text-sm text-green-700">
                {t('sentDescription')}
              </p>
            </div>
          ) : (
            <>
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <p className="text-sm text-blue-800">
                  {t('helperText')}
                  <strong> {t('helperBold')}</strong>
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('moveInDate')}
                  </label>
                  <input
                    type="date"
                    required
                    value={moveInDate}
                    onChange={(e) => setMoveInDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 focus:border-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('durationMonths')}
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    max={12}
                    value={durationMonths}
                    onChange={(e) => setDurationMonths(parseInt(e.target.value) || 1)}
                    className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 focus:border-blue-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('yourQuestion')}
                </label>
                <textarea
                  rows={6}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={t('placeholder')}
                  className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 focus:border-blue-500 outline-none resize-none"
                />
                <p className="text-xs text-gray-500 mt-1">
                  {t('characters', { count: message.length })}
                </p>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-800">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={submitting || !message.trim() || !moveInDate || durationMonths < 1 || durationMonths > 12}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-full font-bold hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-[1.02] active:scale-[0.98]"
              >
                {submitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="animate-spin h-5 w-5 border-3 border-white border-t-transparent rounded-full" />
                    {t('sending')}
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <Send className="h-5 w-5" />
                    Enviar Pregunta
                  </span>
                )}
              </button>

              <p className="text-xs text-gray-500 text-center">
                {t('emailNotice')}
              </p>
            </>
          )}
        </form>
      </div>
    </div>
  )
}
