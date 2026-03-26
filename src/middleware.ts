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

function isProtectedRoute(pathname: string): boolean {
  return (
    /^\/(en|es)\/dashboard(\/.*)?$/.test(pathname) ||
    /^\/(en|es)\/properties\/new(\/.*)?$/.test(pathname) ||
    /^\/(en|es)\/bookings(\/.*)?$/.test(pathname) ||
    /^\/(en|es)\/host\/bookings(\/.*)?$/.test(pathname) ||
    pathname === "/onboarding" ||
    pathname.startsWith("/onboarding/")
  );
}

function hasAuthSession(req: NextRequest): boolean {
  return req.cookies.has("__session") || req.cookies.has("__client_uat");
}

export default function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  if (pathname === "/robots.txt" || pathname === "/sitemap.xml") {
    return NextResponse.next();
  }

  if (pathname.startsWith("/api")) {
    return NextResponse.next();
  }

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

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/static") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  if (isProtectedRoute(pathname) && !hasAuthSession(req)) {
    const locale = req.cookies.get("NEXT_LOCALE")?.value || "en";
    return NextResponse.redirect(new URL(`/${locale}/sign-in`, req.url));
  }

  try {
    const response = intlMiddleware(req);

    const isLocaleRoot = /^\/(en|es)\/?$/.test(pathname);
    if (isLocaleRoot) {
      response.headers.set("Cache-Control", "public, max-age=0, must-revalidate");
      response.headers.set("Vary", "Accept-Encoding");
    }

    return response;
  } catch (error) {
    console.error("[Middleware] intlMiddleware error:", error);
    return NextResponse.next();
  }
}

export const config = {
  matcher: ["/", "/((?!api|trpc|_next|_vercel|.*\\..*).*)"],
};
