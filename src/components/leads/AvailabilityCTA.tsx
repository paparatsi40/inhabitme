type AvailabilityCTAProps = {
  onClick: () => void
}

export function AvailabilityCTA({ onClick }: AvailabilityCTAProps) {
  return (
    <div className="mt-6">
      <button
        onClick={onClick}
        className="w-full rounded-lg bg-black px-6 py-3 text-white font-medium hover:bg-gray-900 transition"
      >
        Check availability for your dates
      </button>

      <p className="mt-2 text-sm text-gray-500 text-center">
        No commitment · Mid-term stays (1–6 months)
      </p>
    </div>
  )
}
