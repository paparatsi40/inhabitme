'use client'

import { useState } from 'react'
import { Mail, CheckCircle, Loader2 } from 'lucide-react'

interface CityWaitlistFormProps {
  cityName: string
  citySlug: string
  /**
   * Strings localizadas. Pasadas desde un Server Component que tiene acceso a getTranslations.
   */
  labels: {
    title: string          // "Want to live in {city}?"
    description: string    // "Be the first to know when properties go live"
    emailPlaceholder: string
    submit: string
    submitting: string
    successTitle: string
    successDescription: string
    privacyNote: string
    errorGeneric: string
  }
}

/**
 * Form inline para capturar emails de usuarios interesados en una ciudad sin listings disponibles.
 * Usa el endpoint existente /api/waitlist/subscribe.
 */
export function CityWaitlistForm({ cityName, citySlug, labels }: CityWaitlistFormProps) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim()) return

    setStatus('submitting')
    setErrorMsg('')

    try {
      const res = await fetch('/api/waitlist/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), city: cityName, citySlug }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        setErrorMsg(data?.error || labels.errorGeneric)
        setStatus('error')
        return
      }

      setStatus('success')
    } catch {
      setErrorMsg(labels.errorGeneric)
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-300 rounded-2xl p-8 text-center">
        <div className="inline-flex p-3 bg-green-100 rounded-full mb-4">
          <CheckCircle className="h-8 w-8 text-green-600" />
        </div>
        <h3 className="text-2xl font-black text-gray-900 mb-2">{labels.successTitle}</h3>
        <p className="text-gray-700">{labels.successDescription}</p>
      </div>
    )
  }

  return (
    <div className="bg-gradient-to-br from-blue-50 via-purple-50 to-blue-50 border-2 border-blue-200 rounded-2xl p-8">
      <div className="max-w-2xl mx-auto text-center">
        <div className="inline-flex p-3 bg-blue-600 rounded-full mb-4">
          <Mail className="h-6 w-6 text-white" />
        </div>
        <h3 className="text-2xl lg:text-3xl font-black text-gray-900 mb-3">{labels.title}</h3>
        <p className="text-gray-700 mb-6">{labels.description}</p>

        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={labels.emailPlaceholder}
            disabled={status === 'submitting'}
            className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={status === 'submitting'}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-xl shadow-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-60 inline-flex items-center justify-center gap-2"
          >
            {status === 'submitting' ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                {labels.submitting}
              </>
            ) : (
              labels.submit
            )}
          </button>
        </form>

        {errorMsg && <p className="mt-3 text-sm text-red-600">{errorMsg}</p>}

        <p className="mt-4 text-xs text-gray-500">{labels.privacyNote}</p>
      </div>
    </div>
  )
}
