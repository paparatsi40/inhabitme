'use client'

import { useState } from 'react'
import { createAvailabilityLead } from '@/app/actions/createAvailabilityLead'

type AvailabilityFormProps = {
  onSuccess: () => void
  listingId: string
  city: string
  neighborhood?: string
}

export function AvailabilityForm({
  onSuccess,
  listingId,
  city,
  neighborhood,
}: AvailabilityFormProps) {
  const [startDate, setStartDate] = useState('')
  const [email, setEmail] = useState('')
  const [relocating, setRelocating] = useState(false)
  const [loading, setLoading] = useState(false)

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault()
        setLoading(true)

        try {
          await createAvailabilityLead({
            listingId,
            city,
            neighborhood,
            startDate,
            email,
            relocating,
          })

          onSuccess()
        } catch (err) {
          console.error(err)
          alert('Something went wrong. Please try again.')
        } finally {
          setLoading(false)
        }
      }}
      className="space-y-5"
    >
      <div>
        <h2 className="text-lg font-semibold">Check availability</h2>
        <p className="text-sm text-gray-600">
          Tell us when you’re planning to stay — we’ll confirm availability and pricing.
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium">
          When would you like to move in?
        </label>
        <input
          type="date"
          required
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="mt-1 w-full rounded-md border px-3 py-2"
        />
        <p className="mt-1 text-xs text-gray-500">
          Most stays on inhabitme are between 1 and 6 months.
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium">
          Where should we send availability details?
        </label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@email.com"
          className="mt-1 w-full rounded-md border px-3 py-2"
        />
      </div>

      <div>
        <label className="inline-flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={relocating}
            onChange={(e) => setRelocating(e.target.checked)}
          />
          I’m relocating for work
        </label>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-black px-4 py-2 text-white hover:bg-gray-900 disabled:opacity-50"
      >
        {loading ? 'Checking availability…' : 'Request availability'}
      </button>
    </form>
  )
}
