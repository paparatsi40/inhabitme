import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { NextResponse, type NextRequest } from "next/server";
import {
  normalizePathname,
  hasMixedCase,
  shouldRemoveTrailingSlash,
  getRedirectDestination,
} from "./lib/seo/url-utils";

const intlMiddleware = createMiddleware(routing);

const isProtectedRoute = createRouteMatcher([
  "/(en|es)/dashboard(.*)",
  "/(en|es)/properties/new(.*)",
  "/(en|es)/bookings(.*)",
  "/(en|es)/host/bookings(.*)",
  "/onboarding(.*)",
]);

function shouldBypass(pathname: string): boolean {
  return (
    pathname === "/robots.txt" ||
    pathname === "/sitemap.xml" ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/static") ||
    pathname.includes(".")
  );
}

function applySeoRedirects(req: NextRequest): NextResponse | null {
  const pathname = req.nextUrl.pathname;

  const redirectDestination = getRedirectDestination(pathname);
  if (redirectDestination) {
    const url = req.nextUrl.clone();
    url.pathname = redirectDestination;
    return NextResponse.redirect(url, 301);
  }

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

  return null;
}

function setLocaleRootCaching(pathname: string, response: NextResponse): NextResponse {
  const isLocaleRoot = /^\/(en|es)\/?$/.test(pathname);
  if (isLocaleRoot) {
    response.headers.set("Cache-Control", "public, max-age=0, must-revalidate");
    response.headers.set("Vary", "Accept-Encoding");
  }

  return response;
}

export default clerkMiddleware(async (auth, req) => {
  const pathname = req.nextUrl.pathname;

  if (shouldBypass(pathname)) {
    return NextResponse.next();
  }

  const seoRedirect = applySeoRedirects(req);
  if (seoRedirect) {
    return seoRedirect;
  }

  if (isProtectedRoute(req)) {
    const { userId } = await auth();
    if (!userId) {
      const locale = pathname.startsWith("/es") ? "es" : "en";
      return NextResponse.redirect(new URL(`/${locale}/sign-in`, req.url));
    }
  }

  try {
    const response = intlMiddleware(req);
    return setLocaleRootCaching(pathname, response);
  } catch (error) {
    console.error("[Middleware] intlMiddleware error:", error);
    return NextResponse.next();
  }
});

export const config = {
  matcher: ["/", "/api/:path*", "/((?!trpc|_next|_vercel|.*\\..*).*)"],
};
