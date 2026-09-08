'use client'

import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { LanguageSwitcher } from '@/components/LanguageSwitcher'
import { Link } from '@/i18n/routing'

export function ClientNav({
  signIn,
  signUp,
  dashboard = 'Dashboard',
  openMenu = 'Open menu',
  closeMenu = 'Close menu',
}: {
  signIn: string
  signUp: string
  dashboard?: string
  openMenu?: string
  closeMenu?: string
  locale?: 'en' | 'es'
}) {
  const [open, setOpen] = useState(false)

  return (
    <>
      {/* Desktop / tablet */}
      <div className="hidden md:flex items-center gap-3">
        <LanguageSwitcher />
        <Link href="/dashboard">
          <Button variant="ghost" className="font-semibold">
            {dashboard}
          </Button>
        </Link>
        <Link href="/sign-in">
          <Button variant="ghost" className="font-semibold">{signIn}</Button>
        </Link>
        <Link href="/sign-up">
          <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 font-bold shadow-md">
            {signUp}
          </Button>
        </Link>
      </div>

      {/* Mobile: hamburger */}
      <div className="flex md:hidden items-center gap-2">
        <LanguageSwitcher />
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? closeMenu : openMenu}
          className="inline-flex h-11 w-11 items-center justify-center rounded-xl text-gray-700 hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <div
          id="mobile-nav"
          className="md:hidden absolute inset-x-0 top-full z-50 border-b bg-white shadow-lg"
        >
          <nav className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-3">
            <Link
              href="/dashboard"
              onClick={() => setOpen(false)}
              className="rounded-lg px-3 py-3 text-base font-semibold text-gray-800 hover:bg-gray-50"
            >
              {dashboard}
            </Link>
            <Link
              href="/sign-in"
              onClick={() => setOpen(false)}
              className="rounded-lg px-3 py-3 text-base font-semibold text-gray-800 hover:bg-gray-50"
            >
              {signIn}
            </Link>
            <Link href="/sign-up" onClick={() => setOpen(false)} className="mt-1">
              <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 font-bold shadow-md">
                {signUp}
              </Button>
            </Link>
          </nav>
        </div>
      )}
    </>
  )
}
