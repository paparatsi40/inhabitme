'use client'

import { ArrowLeft, Share2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Link } from '@/i18n/routing'
import { ListingTheme } from '@/lib/domain/listing-theme'

interface ThemedListingWrapperProps {
  children: React.ReactNode
  theme: ListingTheme
}

export function ThemedListingWrapper({ children, theme }: ThemedListingWrapperProps) {
  const router = useRouter()
  
  // Valores por defecto si el tema no tiene colors
  const primaryColor = theme?.colors?.primary || '#667eea'
  const customLogo = theme?.customLogo

  const handleBack = () => {
    // Intentar volver al historial anterior
    if (typeof window !== 'undefined' && window.history.length > 1) {
      router.back()
      return true
    }
    return false
  }

  return (
    <div className="min-h-screen">
      {/* Minimal Header - Floating y semi-transparente */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          {/* Back Button - Intenta historial primero, si falla usa Link */}
          <Link
            href="/dashboard"
            onClick={(e) => {
              const wentBack = handleBack()
              if (wentBack) {
                e.preventDefault() // Cancelar navegación si router.back() funcionó
              }
              // Si no fue atrás, dejar que Link navegue a /dashboard
            }}
            className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:text-gray-900 hover:bg-white/80 rounded-lg transition-all"
            style={{ color: primaryColor }}
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline font-medium">Volver</span>
          </Link>

          {/* Logo/Brand - Centro (personalizado o default) */}
          <div className="absolute left-1/2 transform -translate-x-1/2">
            {customLogo ? (
              <img 
                src={customLogo} 
                alt="Logo" 
                className="h-8 w-auto object-contain"
              />
            ) : (
              <span className="text-lg font-bold" style={{ color: primaryColor }}>
                inhabitme
              </span>
            )}
          </div>

          {/* Share Button */}
          <button
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: 'Check out this property',
                  url: window.location.href,
                })
              } else {
                navigator.clipboard.writeText(window.location.href)
                alert('Link copied to clipboard!')
              }
            }}
            className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:text-gray-900 hover:bg-white/80 rounded-lg transition-all"
          >
            <Share2 className="w-4 h-4" />
            <span className="hidden sm:inline font-medium">Compartir</span>
          </button>
        </div>
      </header>

      {/* Spacer para el header fixed */}
      <div className="h-16"></div>

      {/* Main Content */}
      {children}

      {/* Minimal Footer */}
      <footer className="bg-gray-50 border-t border-gray-200 py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm text-gray-600">
            © 2026 <span className="font-semibold">inhabitme</span>. Encuentra tu hogar perfecto para trabajar remoto.
          </p>
          <div className="mt-2 flex items-center justify-center gap-4 text-xs text-gray-500">
            <a href="/terms" className="hover:text-gray-900">Términos</a>
            <span>•</span>
            <a href="/privacy" className="hover:text-gray-900">Privacidad</a>
            <span>•</span>
            <a href="/cookies" className="hover:text-gray-900">Cookies</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
