import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { NextResponse } from "next/server";
import {
  normalizePathname,
  hasMixedCase,
  shouldRemoveTrailingSlash,
  getRedirectDestination,
} from "./lib/seo/url-utils";

const intlMiddleware = createMiddleware(routing);

const isProtectedRoute = createRouteMatcher([
  "/:locale/dashboard(.*)",
  "/:locale/properties/new(.*)",
  "/:locale/bookings(.*)",
  "/:locale/host/bookings(.*)",
  "/onboarding(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  const pathname = req.nextUrl.pathname;

  // Handle root path - redirect to default locale
  if (pathname === "/") {
    const url = req.nextUrl.clone();
    url.pathname = "/en";
    return NextResponse.redirect(url, 302);
  }

  // SEO files
  if (pathname === "/robots.txt" || pathname === "/sitemap.xml") {
    return NextResponse.next();
  }

  // API routes
  if (pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  // Legacy redirects
  const redirectDestination = getRedirectDestination(pathname);
  if (redirectDestination) {
    const url = req.nextUrl.clone();
    url.pathname = redirectDestination;
    return NextResponse.redirect(url, 301);
  }

  // Normalize URLs
  const needsNormalization =
    hasMixedCase(pathname) ||
    (shouldRemoveTrailingSlash(pathname) && pathname !== "/");

  if (needsNormalization) {
    const normalizedPath = normalizePathname(pathname);
    if (normalizedPath !== pathname) {
      const url = req.nextUrl.clone();
      url.pathname = normalizedPath;
      return NextResponse.redirect(url, 301);
    }
  }

  // Non-locale auth routes pass-through
  if (
    pathname === "/onboarding" ||
    pathname.startsWith("/onboarding/") ||
    pathname === "/founding-host" ||
    pathname.startsWith("/founding-host/")
  ) {
    return NextResponse.next();
  }

  // Static/assets
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/static") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // Protect routes
  if (isProtectedRoute(req)) {
    const { userId } = await auth();
    if (!userId) {
      const locale = req.cookies.get("NEXT_LOCALE")?.value || "en";
      return NextResponse.redirect(new URL(`/${locale}/sign-in`, req.url));
    }
  }

  // next-intl
  try {
    return intlMiddleware(req);
  } catch (error) {
    console.error("[Middleware] intlMiddleware error:", error);
    return NextResponse.next();
  }
});

export const config = {
  matcher: [
    "/",
    "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
  ],
};
