'use client'

import dynamic from 'next/dynamic'

const OnboardingClient = dynamic(
  () => import('@/components/onboarding/OnboardingClient'),
  { ssr: false }
)

export default function OnboardingClientPage() {
  return <OnboardingClient />
}