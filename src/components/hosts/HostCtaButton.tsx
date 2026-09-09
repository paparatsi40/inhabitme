'use client'

import { ArrowRight } from 'lucide-react'
import { Link } from '@/i18n/routing'
import { Button } from '@/components/ui/button'
import { trackHostSignupStarted } from '@/lib/analytics/events'

interface HostCtaButtonProps {
  label: string
  city: string
  /** Identifica el bloque de la landing desde el que se pulsa (hero, final…) */
  source: string
  variant?: 'primary' | 'light'
}

/**
 * CTA de las landings de anfitriones. Registra `host_signup_started` antes de
 * navegar al formulario de publicación.
 */
export function HostCtaButton({ label, city, source, variant = 'primary' }: HostCtaButtonProps) {
  const className =
    variant === 'light'
      ? 'bg-white text-blue-700 hover:bg-gray-100 font-bold shadow-xl px-10 py-6 text-lg'
      : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold shadow-lg px-10 py-6 text-lg'

  return (
    <Button asChild size="lg" className={className}>
      <Link
        href="/properties/new"
        className="inline-flex items-center"
        onClick={() => trackHostSignupStarted({ city, source })}
      >
        {label}
        <ArrowRight className="ml-2 h-5 w-5" />
      </Link>
    </Button>
  )
}
