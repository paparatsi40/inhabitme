import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import createMiddleware from 'next-intl/middleware';
import { routing } from '@/i18n/routing';
import { NextResponse } from 'next/server';

// next-intl middleware for locale handling
const intlMiddleware = createMiddleware(routing);

// Routes that require authentication
const isProtectedRoute = createRouteMatcher([
  '/:locale/dashboard(.*)',
  '/:locale/properties/new(.*)',
  '/:locale/bookings(.*)',
  '/:locale/host/bookings(.*)',
  '/onboarding(.*)',
]);

// Admin-only routes
const isAdminRoute = createRouteMatcher([
  '/admin(.*)',
]);

// Routes that bypass intl middleware (auth + API)
const isAuthRoute = createRouteMatcher([
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/api/(.*)',
  '/admin(.*)',
  '/founding-host/join/(.*)',
]);

export default clerkMiddleware(async (auth, req) => {
  // Admin routes — check auth + role first
  if (isAdminRoute(req)) {
    const { userId, sessionClaims } = await auth();

    if (!userId) {
      const signInUrl = new URL('/sign-in', req.url);
      signInUrl.searchParams.set('redirect_url', req.url);
      return NextResponse.redirect(signInUrl);
    }

    const publicMetadata =
      (sessionClaims as any)?.public_metadata ||
      (sessionClaims as any)?.publicMetadata ||
      (sessionClaims as any)?.metadata;

    const isAdmin = publicMetadata?.role === 'admin' || userId === process.env.ADMIN_USER_ID;

    if (!isAdmin) {
      return NextResponse.redirect(new URL('/', req.url));
    }

    return NextResponse.next();
  }

  // Auth / API routes — skip intl
  if (isAuthRoute(req)) {
    return NextResponse.next();
  }

  // Founding-host join — skip intl
  if (req.nextUrl.pathname.includes('/founding-host/join/')) {
    return NextResponse.next();
  }

  // Sentry tunnel route — skip intl (no debe llevar prefijo /en o /es)
  if (req.nextUrl.pathname.startsWith('/monitoring')) {
    return NextResponse.next();
  }

  // Protected routes — require Clerk session
  if (isProtectedRoute(req)) {
    const { userId } = await auth();

    if (!userId) {
      const locale = req.nextUrl.pathname.split('/')[1] || 'en';
      const signInUrl = new URL(`/${locale}/sign-in`, req.url);
      signInUrl.searchParams.set('redirect_url', req.url);
      return NextResponse.redirect(signInUrl);
    }
  }

  // All other routes — apply i18n middleware
  return intlMiddleware(req);
});

export const config = {
  matcher: [
    // Skip Next.js internals and static files
    // NOTE: incluimos `json` para que /manifest.json y otros static JSON
    // se sirvan desde /public sin pasar por el redirect de next-intl
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|json|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest|xml|txt)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
