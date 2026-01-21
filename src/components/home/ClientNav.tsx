'use client'

import { useState, useEffect } from 'react'
import NextLink from 'next/link'
import { SignedIn, SignedOut, UserButton, useAuth } from '@clerk/nextjs'
import { Button } from '@/components/ui/button'
import { LanguageSwitcher } from '@/components/LanguageSwitcher'

export function ClientNav({ signIn, signUp }: { signIn: string; signUp: string }) {
  const { isLoaded } = useAuth()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div className="flex items-center gap-3">
      <LanguageSwitcher />
      
      {/* Show skeleton while loading */}
      {!mounted || !isLoaded ? (
        <div className="flex items-center gap-3">
          <div className="w-20 h-10 bg-gray-200 rounded-md animate-pulse" />
          <div className="w-24 h-10 bg-gray-200 rounded-md animate-pulse" />
        </div>
      ) : (
        <>
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
        </>
      )}
    </div>
  )
}
