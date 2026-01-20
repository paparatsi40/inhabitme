'use client'

import {
  createContext,
  useContext,
  ReactNode,
} from 'react'
import { useUser } from '@clerk/nextjs'

interface AuthContextType {
  userId: string | null
  email: string | null
  isLoaded: boolean
}

const AuthContext = createContext<AuthContextType | null>(
  null
)

export function AuthProvider({
  children,
}: {
  children: ReactNode
}) {
  const { user, isLoaded } = useUser()

  const value: AuthContextType = {
    userId: user?.id ?? null,
    email:
      user?.primaryEmailAddress?.emailAddress ??
      null,
    isLoaded,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuthContext() {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error(
      'useAuthContext must be used within AuthProvider'
    )
  }
  return ctx
}
