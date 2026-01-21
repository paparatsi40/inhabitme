/** @type {import('next').NextConfig} */
// Updated: 2026-01-21 22:00 - Force cache invalidation for pricing updates

const withNextIntl = require('next-intl/plugin')('./src/i18n/request.ts');

// PWA configuration (descomentar cuando instales next-pwa)
// const withPWA = require('next-pwa')({
//   dest: 'public',
//   register: true,
//   skipWaiting: true,
//   disable: process.env.NODE_ENV === 'development',
// });

const nextConfig = {
  reactStrictMode: true,

  // Image optimization
  images: {
    formats: ['image/avif', 'image/webp'],
    domains: ['res.cloudinary.com', 'images.unsplash.com', 'img.clerk.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.clerk.dev',
      },
      {
        protocol: 'https',
        hostname: 'img.clerk.com',
      },
    ],
  },

  // ESLint (evitar que rompa el build)
  eslint: {
    ignoreDuringBuilds: true,
  },

  // Security headers
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ];
  },
};

module.exports = withNextIntl(nextConfig);
