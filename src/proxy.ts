import { clerkMiddleware } from "@clerk/nextjs/server";
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

function internalMiddleware(req: NextRequest) {
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

  if (pathname === '/sign-in' || pathname.startsWith('/sign-in/')) {
    const url = req.nextUrl.clone();
    url.pathname = '/en/sign-in';
    return NextResponse.redirect(url, 307);
  }

  if (pathname === '/sign-up' || pathname.startsWith('/sign-up/')) {
    const url = req.nextUrl.clone();
    url.pathname = '/en/sign-up';
    return NextResponse.redirect(url, 307);
  }

  if (pathname === '/dashboard' || pathname.startsWith('/dashboard/')) {
    const url = req.nextUrl.clone();
    url.pathname = `/en${pathname}`;
    return NextResponse.redirect(url, 307);
  }


  const isLocaleRoot = /^\/(en|es)\/?$/.test(pathname);
  if (isLocaleRoot) {
    const response = NextResponse.next();
    response.headers.set("Cache-Control", "public, max-age=0, must-revalidate");
    response.headers.set("Vary", "Accept-Encoding");
    return response;
  }

  try {
    const response = intlMiddleware(req);

    return response;
  } catch (error) {
    console.error("[Proxy] intlMiddleware error:", error);
    return NextResponse.next();
  }
}

export default clerkMiddleware((_auth, req) => {
  return internalMiddleware(req);
});

export const config = {
  matcher: [
    "/((?!_next|static|.*\\..*).*)",
    "/(api|trpc)(.*)",
  ],
};
