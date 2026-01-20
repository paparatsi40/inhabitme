'use client'

import { useEffect, useState } from 'react'
import { AvailabilityForm } from './AvailabilityForm'
import { AvailabilitySuccess } from './AvailabilitySuccess'

type AvailabilityModalProps = {
  open: boolean
  onClose: () => void
  listing: {
    id: string
    city: { name: string }
    neighborhood?: { name: string }
  }
}

export function AvailabilityModal({ open, onClose, listing }: AvailabilityModalProps) {
  const [submitted, setSubmitted] = useState(false)

  // Cada vez que se abre el modal, reseteamos el estado (buena UX)
  useEffect(() => {
    if (open) setSubmitted(false)
  }, [open])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
      role="dialog"
      aria-modal="true"
    >
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-lg">
        {!submitted ? (
          <AvailabilityForm
            onSuccess={() => setSubmitted(true)}
            listingId={listing.id}
            city={listing.city.name}
            neighborhood={listing.neighborhood?.name}
          />
        ) : (
          <AvailabilitySuccess onClose={onClose} />
        )}
      </div>

      {/* click en backdrop para cerrar (opcional pero UX top) */}
      <button
        type="button"
        aria-label="Close"
        className="fixed inset-0 -z-10 cursor-default"
        onClick={onClose}
      />
    </div>
  )
}
