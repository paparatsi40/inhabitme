'use client'

import NextLink from 'next/link'
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs'
import { Button } from '@/components/ui/button'
import { LanguageSwitcher } from '@/components/LanguageSwitcher'

export function ClientNav({ signIn, signUp }: { signIn: string; signUp: string }) {
  return (
    <div className="flex items-center gap-3">
      <LanguageSwitcher />
      <SignedIn>
        <NextLink href="/en/dashboard">
          <Button variant="ghost" className="font-semibold">Dashboard</Button>
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
