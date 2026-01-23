import dynamic from 'next/dynamic';

// Importar dinámicamente para evitar SSR
const OnboardingClient = dynamic(
  () => import('@/components/onboarding/OnboardingClient'),
  { ssr: false }
);

export default function OnboardingPage() {
  return <OnboardingClient />;
}
