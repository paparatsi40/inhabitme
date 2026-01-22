import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import createMiddleware from 'next-intl/middleware';
import { routing } from './src/i18n/routing';
import { NextResponse } from 'next/server';

// Create next-intl middleware
const intlMiddleware = createMiddleware(routing);

// Define protected routes that require authentication
const isProtectedRoute = createRouteMatcher([
  '/:locale/dashboard(.*)',
  '/:locale/properties/new(.*)',
  '/:locale/bookings(.*)',
  '/:locale/host/bookings(.*)',
  '/onboarding(.*)',
]);

// Define admin routes that require admin role
const isAdminRoute = createRouteMatcher([
  '/admin(.*)',
]);

// Define auth routes that should bypass intl middleware
const isAuthRoute = createRouteMatcher([
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/api/(.*)',
  '/admin(.*)',
  '/founding-host/join/(.*)',
]);

export default clerkMiddleware(async (auth, req) => {
  // FIRST: Skip middleware entirely for sitemap and robots
  const pathname = req.nextUrl.pathname;
  if (pathname === '/sitemap.xml' || pathname === '/robots.txt') {
    return NextResponse.next();
  }

  // Check admin routes first (before any other middleware)
  if (isAdminRoute(req)) {
    console.log('[Middleware] Admin route detected:', req.url);
    const { userId, sessionClaims } = await auth();
    console.log('[Middleware] User ID:', userId);
    console.log('[Middleware] Metadata:', sessionClaims?.metadata);
    
    if (!userId) {
      console.log('[Middleware] No user, redirecting to sign-in');
      // Redirect to sign-in if not authenticated
      const signInUrl = new URL('/sign-in', req.url);
      signInUrl.searchParams.set('redirect_url', req.url);
      return NextResponse.redirect(signInUrl);
    }
    
    // Check if user has admin role
    // Try different possible locations for metadata
    const publicMetadata = (sessionClaims as any)?.public_metadata || (sessionClaims as any)?.publicMetadata || (sessionClaims as any)?.metadata;
    const role = publicMetadata?.role;
    console.log('[Middleware] Public Metadata:', publicMetadata);
    console.log('[Middleware] Role:', role);
    
    // TEMPORARY: Hardcode your user ID as admin until Clerk token is configured
    const TEMP_ADMIN_USER_ID = 'user_37XxJQhGu4KbCylCP8ra8P8Nt0i';
    const isAdmin = role === 'admin' || userId === TEMP_ADMIN_USER_ID;
    
    if (!isAdmin) {
      console.log('[Middleware] Not admin, redirecting to home');
      // Redirect to home if not admin
      return NextResponse.redirect(new URL('/', req.url));
    }
    
    console.log('[Middleware] Admin authenticated, allowing access');
    // Admin authenticated, allow access without intl
    return NextResponse.next();
  }
  
  // Skip intl middleware for auth/API routes
  if (isAuthRoute(req)) {
    return NextResponse.next();
  }
  
  // Skip intl middleware for founding-host join routes (like admin)
  if (req.nextUrl.pathname.includes('/founding-host/join/')) {
    return NextResponse.next();
  }

  // Check if user is authenticated for protected routes
  if (isProtectedRoute(req)) {
    const { userId } = await auth();
    
    if (!userId) {
      // Redirect to sign-in if not authenticated
      const signInUrl = new URL('/sign-in', req.url);
      signInUrl.searchParams.set('redirect_url', req.url);
      return NextResponse.redirect(signInUrl);
    }
  }
  
  // Apply next-intl middleware for locale handling
  return intlMiddleware(req);
});

export const config = {
  matcher: [
    // Skip Next.js internals, static files, sitemap, and robots
    '/((?!_next|sitemap\\.xml|robots\\.txt|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest|xml|txt)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
  // Exclude admin routes from locale detection
  // but still run for auth check
};