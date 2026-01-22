import createMiddleware from 'next-intl/middleware';
import { routing } from './src/i18n/routing';

export default createMiddleware(routing);

export const config = {
  // Match all pathnames except for
  // - API routes (/api)
  // - Next.js internals (_next, _vercel)
  // - Static files (with extensions)
  // - Auth routes (sign-in, sign-up, auth)
  // - Sitemap and robots
  matcher: ['/((?!api|_next|_vercel|sign-in|sign-up|auth|sitemap\\.xml|robots\\.txt|.*\\..*).*)']
};
