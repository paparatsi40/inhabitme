import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import createMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'
import { NextResponse } from 'next/server'
import { 
  normalizePathname, 
  hasMixedCase, 
  shouldRemoveTrailingSlash,
  getRedirectDestination 
} from './lib/seo/url-utils'

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

  // ✅ SEO: Check for legacy URL redirects
  const redirectDestination = getRedirectDestination(pathname)
  if (redirectDestination) {
    const url = req.nextUrl.clone()
    url.pathname = redirectDestination
    return NextResponse.redirect(url, 301) // Permanent redirect
  }

  // ✅ SEO: Normalize URLs (lowercase + trailing slash)
  const needsNormalization = hasMixedCase(pathname) || 
                             (shouldRemoveTrailingSlash(pathname) && pathname !== '/')
  
  if (needsNormalization) {
    const normalizedPath = normalizePathname(pathname)
    if (normalizedPath !== pathname) {
      const url = req.nextUrl.clone()
      url.pathname = normalizedPath
      return NextResponse.redirect(url, 301) // Permanent redirect
    }
  }

  // ✅ NON-LOCALE AUTH ROUTES — Redirect old routes to new locale-prefixed ones
  if (
    pathname === '/onboarding' ||
    pathname.startsWith('/onboarding/') ||
    pathname === '/founding-host' ||
    pathname.startsWith('/founding-host/')
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
      // Redirect to sign-in with locale prefix
      const locale = req.cookies.get('NEXT_LOCALE')?.value || 'en'
      return NextResponse.redirect(new URL(`/${locale}/sign-in`, req.url))
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
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)  
     * - favicon.ico (favicon file)
     * - onboarding and founding-host (auth related, still outside [locale])
     * - api routes
     * - files with extensions (.png, .jpg, etc)
     */
    '/((?!_next/static|_next/image|favicon.ico|onboarding|founding-host|api/|.*\\..*).*)' 
  ],
}
