import { Suspense } from 'react'
import LeadSuccessPageClient from './LeadSuccessPageClient'

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Cargando...</p>
      </div>
    </div>
  )
}

export default function LeadSuccessPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <LeadSuccessPageClient />
    </Suspense>
  )
}