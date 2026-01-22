import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import createMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'
import { NextResponse } from 'next/server'

const intlMiddleware = createMiddleware(routing)

const isProtectedRoute = createRouteMatcher([
  '/:locale/dashboard(.*)',
  '/:locale/properties/new(.*)',
  '/:locale/bookings(.*)',
  '/:locale/host/bookings(.*)',
  '/onboarding(.*)',
])

export default clerkMiddleware(async (auth, req) => {
  const pathname = req.nextUrl.pathname

  // ✅ SEO FILES — SALIDA TOTAL
  if (pathname === '/robots.txt' || pathname === '/sitemap.xml') {
    return NextResponse.next()
  }

  // ✅ API ROUTES — Skip i18n middleware for API routes
  if (pathname.startsWith('/api')) {
    return NextResponse.next()
  }

  // ✅ CLERK AUTH ROUTES — Skip i18n middleware for Clerk routes  
  if (
    pathname.startsWith('/sign-in') || 
    pathname.startsWith('/sign-up') ||
    pathname.startsWith('/onboarding') ||
    pathname.startsWith('/founding-host')
  ) {
    return NextResponse.next()
  }
  
  // ✅ ASSETS y archivos estáticos
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/static') ||
    pathname.includes('.') // archivos con extensión
  ) {
    return NextResponse.next()
  }

  // ✅ AUTH CHECK (antes de aplicar i18n middleware)
  if (isProtectedRoute(req)) {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.redirect(new URL('/sign-in', req.url))
    }
  }

  // ✅ LOCALE - Envolver en try/catch para evitar errores
  try {
    return intlMiddleware(req)
  } catch (error) {
    console.error('[Middleware] Error en intlMiddleware:', error)
    // Si falla, pasar al siguiente middleware
    return NextResponse.next()
  }
})

export const config = {
  matcher: [
    '/((?!_next|robots\\.txt|sitemap\\.xml|.*\\..*).*)',
  ],
}
