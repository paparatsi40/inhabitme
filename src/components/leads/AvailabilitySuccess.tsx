type AvailabilitySuccessProps = {
  onClose: () => void
}

export function AvailabilitySuccess({ onClose }: AvailabilitySuccessProps) {
  return (
    <div className="space-y-4 text-center">
      <h2 className="text-lg font-semibold">
        Thanks — we’re checking availability.
      </h2>

      <p className="text-sm text-gray-600">
        We’ll get back to you shortly with details.
        Most responses arrive within 24 hours.
      </p>

      <button
        onClick={onClose}
        className="mt-4 text-sm text-blue-600 hover:underline"
      >
        Continue browsing apartments
      </button>
    </div>
  )
}
