'use client'

import NextLink from 'next/link'
import { useLocale } from 'next-intl'
import { usePathname } from 'next/navigation'
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs'
import { Button } from '@/components/ui/button'
import { LanguageSwitcher } from '@/components/LanguageSwitcher'

export function ClientNav({ signIn, signUp }: { signIn: string; signUp: string }) {
  const pathname = usePathname()
  
  // Detectar locale de la URL actual
  const currentLocale = pathname.startsWith('/es') ? 'es' : 'en'
  
  // Construir URL del dashboard basado en el locale actual de la página
  const dashboardUrl = `/${currentLocale}/dashboard`
  
  return (
    <div className="flex items-center gap-3">
      <LanguageSwitcher />
      <SignedIn>
        <NextLink href={dashboardUrl}>
          <Button variant="ghost" className="font-semibold">
            Dashboard
          </Button>
        </NextLink>
        <UserButton afterSignOutUrl="/" />
      </SignedIn>
      <SignedOut>
        <NextLink href="/sign-in">
          <Button variant="ghost" className="font-semibold">{signIn}</Button>
        </NextLink>
        <NextLink href="/sign-up">
          <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 font-bold shadow-md">
            {signUp}
          </Button>
        </NextLink>
      </SignedOut>
    </div>
  )
}
