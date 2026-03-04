/**
 * URL Utilities for SEO
 *
 * Helper functions for URL normalization, validation, and SEO best practices
 */

/**
 * Internal: ensure a value is a string
 */
function asString(value: unknown): string | undefined {
  return typeof value === "string" ? value : undefined;
}

/**
 * Normalize a URL slug to lowercase with hyphens
 * Safe: returns empty string for non-string input
 */
export function normalizeSlug(slug: unknown): string {
  const s = asString(slug);
  if (!s) return "";

  return s
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-") // spaces to hyphens
    .replace(/[^\w\-]+/g, "") // remove special chars
    .replace(/\-\-+/g, "-") // multiple hyphens to single
    .replace(/^-+/, "") // trim start hyphen
    .replace(/-+$/, ""); // trim end hyphen
}

/**
 * Check if a URL should have trailing slash removed
 * Safe: returns false for non-string input
 */
export function shouldRemoveTrailingSlash(pathname: unknown): boolean {
  const p = asString(pathname);
  if (!p) return false;

  // Don't remove trailing slash from root paths
  if (p === "/" || p === "") return false;

  // Remove trailing slash from all other paths
  return p.endsWith("/");
}

/**
 * Normalize pathname (remove trailing slash, lowercase)
 * Safe: returns "/" for non-string input
 */
export function normalizePathname(pathname: unknown): string {
  const p = asString(pathname);
  if (!p || p === "/") return "/";

  // Remove trailing slash (except for root)
  let normalized = p.endsWith("/") ? p.slice(0, -1) : p;

  // Convert to lowercase for consistency
  normalized = normalized.toLowerCase();

  return normalized;
}

/**
 * Check if URL has mixed case (bad for SEO)
 * Safe: returns false for non-string input
 */
export function hasMixedCase(pathname: unknown): boolean {
  const p = asString(pathname);
  if (!p) return false;

  return p !== p.toLowerCase();
}

/**
 * Build a clean URL with proper locale and path
 */
export function buildCleanUrl({
  locale,
  path,
  baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://www.inhabitme.com",
  includeTrailingSlash = false,
}: {
  locale: "en" | "es";
  path: string;
  baseUrl?: string;
  includeTrailingSlash?: boolean;
}): string {
  // Ensure path starts with /
  const cleanPath = path.startsWith("/") ? path : `/${path}`;

  // Normalize the path
  const normalizedPath = normalizePathname(cleanPath);

  // Build URL
  const url = `${baseUrl}/${locale}${normalizedPath === "/" ? "" : normalizedPath}`;

  // Add trailing slash if requested
  return includeTrailingSlash && !url.endsWith("/") ? `${url}/` : url;
}

/**
 * Validate if a slug is SEO-friendly
 * Safe: returns false for non-string input
 */
export function isValidSlug(slug: unknown): boolean {
  const s = asString(slug);
  if (!s) return false;

  // Must be lowercase
  if (s !== s.toLowerCase()) return false;

  // Must only contain alphanumeric and hyphens
  if (!/^[a-z0-9-]+$/.test(s)) return false;

  // Must not start or end with hyphen
  if (s.startsWith("-") || s.endsWith("-")) return false;

  // Must not have consecutive hyphens
  if (s.includes("--")) return false;

  return true;
}

/**
 * Extract city and neighborhood from pathname
 * Safe: returns null for non-string input
 */
export function parseCityPath(
  pathname: unknown
): {
  locale?: string;
  city?: string;
  neighborhood?: string;
} | null {
  const p = asString(pathname);
  if (!p) return null;

  // Remove leading slash
  const path = p.startsWith("/") ? p.slice(1) : p;

  // Split path
  const segments = path.split("/").filter(Boolean);

  if (segments.length === 0) return null;

  // Check if first segment is a locale
  const possibleLocale = segments[0];
  const isLocale = possibleLocale === "en" || possibleLocale === "es";

  if (isLocale) {
    // Format: /en/madrid or /en/madrid/malasana
    return {
      locale: segments[0],
      city: segments[1],
      neighborhood: segments[2],
    };
  }

  // Format without locale: /madrid or /madrid/malasana
  return {
    city: segments[0],
    neighborhood: segments[1],
  };
}

/**
 * Generate SEO-friendly breadcrumbs from URL
 * Safe: returns Home only for non-string input
 */
export function generateBreadcrumbs(
  pathname: unknown,
  baseUrl?: string
): Array<{
  name: string;
  url: string;
}> {
  const url = baseUrl || process.env.NEXT_PUBLIC_APP_URL || "https://www.inhabitme.com";
  const p = asString(pathname) ?? "";

  const segments = p.split("/").filter(Boolean);

  const breadcrumbs = [{ name: "Home", url }];

  let currentPath = "";

  for (const segment of segments) {
    currentPath += `/${segment}`;

    const name = segment
      .split("-")
      .map((word) => (word ? word.charAt(0).toUpperCase() + word.slice(1) : ""))
      .join(" ");

    breadcrumbs.push({
      name,
      url: `${url}${currentPath}`,
    });
  }

  return breadcrumbs;
}

/**
 * Check if pathname matches a known city
 * Safe: handles non-string pathname and non-string cities
 */
export function isCityPath(
  pathname: unknown,
  cities: string[] = ["madrid", "barcelona", "valencia"]
): boolean {
  const parsed = parseCityPath(pathname);
  if (!parsed?.city) return false;

  const city = parsed.city.toLowerCase();
  return cities
    .filter((c) => typeof c === "string")
    .map((c) => c.toLowerCase())
    .includes(city);
}

/**
 * Redirect map for old URLs to new ones
 */
export const URL_REDIRECTS: Record<string, string> = {
  // Old listing URLs to new property URLs
  "/listings": "/properties",
};

/**
 * Get redirect destination for a given path
 * Safe: returns null for non-string pathname
 */
export function getRedirectDestination(pathname: unknown): string | null {
  const p = asString(pathname);
  if (!p) return null;

  // Check exact matches first
  if (URL_REDIRECTS[p]) {
    return URL_REDIRECTS[p];
  }

  // Check if path starts with any redirect source
  for (const [source, destination] of Object.entries(URL_REDIRECTS)) {
    if (p.startsWith(source + "/")) {
      return p.replace(source, destination);
    }
  }

  return null;
}