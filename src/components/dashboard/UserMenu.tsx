'use client'

import { useState, useRef, useEffect } from 'react'
import { useClerk, useUser } from '@clerk/nextjs'
import { useRouter } from '@/i18n/routing'
import { useLocale } from 'next-intl'
import { User, LogOut, Settings, ChevronDown } from 'lucide-react'
import Image from 'next/image'

export function UserMenu() {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const { signOut } = useClerk()
  const { user } = useUser()
  const router = useRouter()
  const locale = useLocale()

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSignOut = async () => {
    await signOut()
    router.push('/')
  }

  if (!user) return null

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-gray-100 transition-colors"
      >
        {user.imageUrl ? (
          <Image
            src={user.imageUrl}
            alt={user.firstName || 'User'}
            width={32}
            height={32}
            className="rounded-full"
          />
        ) : (
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <User className="h-4 w-4 text-white" />
          </div>
        )}
        <span className="font-semibold text-gray-700 hidden sm:block">
          {user.firstName || 'User'}
        </span>
        <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl border-2 border-gray-200 overflow-hidden z-50">
          {/* User Info */}
          <div className="px-4 py-3 border-b border-gray-200 bg-gradient-to-br from-blue-50 to-purple-50">
            <p className="text-sm font-bold text-gray-900">
              {user.firstName} {user.lastName}
            </p>
            <p className="text-xs text-gray-600 truncate">
              {user.primaryEmailAddress?.emailAddress}
            </p>
          </div>

          {/* Menu Items */}
          <div className="py-2">
            <button
              onClick={() => {
                setIsOpen(false)
                router.push('/dashboard/settings')
              }}
              className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors text-left"
            >
              <Settings className="h-4 w-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">Configuración</span>
            </button>

            <button
              onClick={handleSignOut}
              className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-red-50 transition-colors text-left border-t border-gray-100"
            >
              <LogOut className="h-4 w-4 text-red-600" />
              <span className="text-sm font-medium text-red-600">Cerrar sesión</span>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
