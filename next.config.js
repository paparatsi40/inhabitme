/** @type {import('next').NextConfig} */
// Updated: 2026-03-03 - Next.js 16.1.x compatible config (Performance & SEO)

const withNextIntl = require("next-intl/plugin")("./src/i18n/request.ts");

const allowVercelLive = process.env.VERCEL === "1";

const scriptSrc = [
  "'self'",
  "'unsafe-eval'",
  "'unsafe-inline'",
  "https://clerk.accounts.dev",
  "https://clerk.inhabitme.com",
  "https://*.clerk.accounts.dev",
  "https://*.clerk.dev",
  "https://cdn.jsdelivr.net",
  "https://js.stripe.com",
  "https://maps.googleapis.com",
  ...(allowVercelLive ? ["https://vercel.live"] : []),
].join(" ");

const styleSrc = [
  "'self'",
  "'unsafe-inline'",
  "https://fonts.googleapis.com",
  "https://*.clerk.accounts.dev",
  "https://*.clerk.dev",
].join(" ");

const connectSrc = [
  "'self'",
  "https://clerk.inhabitme.com",
  "https://*.clerk.accounts.dev",
  "https://*.clerk.dev",
  "https://*.clerk.com",
  "https://api.stripe.com",
  "https://*.supabase.co",
  "https://*.cloudinary.com",
  ...(allowVercelLive ? ["https://vercel.live"] : []),
].join(" ");

const frameSrc = [
  "'self'",
  "https://js.stripe.com",
  "https://hooks.stripe.com",
  "https://clerk.inhabitme.com",
  "https://*.clerk.accounts.dev",
  "https://*.clerk.dev",
  "https://*.clerk.com",
].join(" ");

const imgSrc = [
  "'self'",
  "blob:",
  "data:",
  "https://img.clerk.com",
  "https://images.clerk.dev",
  "https://*.clerk.accounts.dev",
  "https://*.clerk.dev",
  "https://res.cloudinary.com",
  "https://images.unsplash.com",
  "https://agjntynuysvwgzlcdmiq.supabase.co",
].join(" ");

const nextConfig = {
  reactStrictMode: true,
  compress: true,

  // Image optimization (secure + compatible)
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "img.clerk.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.clerk.dev",
        pathname: "/**",
      },
      // Supabase (use your exact project hostname; wildcards are not reliable here)
      {
        protocol: "https",
        hostname: "agjntynuysvwgzlcdmiq.supabase.co",
        pathname: "/**",
      },
    ],
  },

  // Security headers + optional CSP
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-DNS-Prefetch-Control", value: "on" },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "origin-when-cross-origin" },

          // Permissions Policy for better security
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
          },

          // Content Security Policy - enabled for Best Practices score
          {
            key: "Content-Security-Policy",
            value: `default-src 'self'; script-src ${scriptSrc}; style-src ${styleSrc}; img-src ${imgSrc}; font-src 'self' https://fonts.gstatic.com data:; connect-src ${connectSrc}; frame-src ${frameSrc}; object-src 'none'; media-src 'self'; worker-src 'self' blob:; frame-ancestors 'self'; upgrade-insecure-requests;`,
          },
        ],
      },
    ];
  },

  // Rewrites to bypass i18n for SEO files
  async rewrites() {
    return [
      {
        source: "/robots.txt",
        destination: "/robots.txt",
        locale: false,
      },
      {
        source: "/sitemap.xml",
        destination: "/sitemap.xml",
        locale: false,
      },
    ];
  },

  // SEO redirects
  async redirects() {
    return [
      // Legacy /listings to /properties redirect
      {
        source: "/:locale/listings/:id",
        destination: "/:locale/properties/:id",
        permanent: true,
      },
      {
        source: "/listings/:id",
        destination: "/properties/:id",
        permanent: true,
      },

      // Remove trailing slashes (SEO consistency) — EXCLUDE "/"
      {
        source: "/:path+/",
        destination: "/:path*",
        permanent: true,
      },
    ];
  },
};

module.exports = withNextIntl(nextConfig);
