import { Inter } from 'next/font/google';
import './globals.css';
import { GoogleAnalytics } from '@/components/analytics/GoogleAnalytics';
import { PostHogProvider } from '@/components/analytics/PostHogProvider';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata = {
  title: 'inhabitme',
  description: 'Medium-term stays for digital nomads',
  manifest: '/manifest.json',
  themeColor: '#2563eb',
};

const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || '';

// Root layout for ALL routes (auth + i18n)
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Preconexiones a orígenes críticos para reducir handshake */}
        <link rel="preconnect" href="https://images.unsplash.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://res.cloudinary.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://clerk.inhabitme.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://js.stripe.com" />
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://us.i.posthog.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://api.stripe.com" />
        <link rel="dns-prefetch" href="https://hooks.stripe.com" />
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
        {/* Google Analytics 4 con Consent Mode v2 */}
        {GA_ID && <GoogleAnalytics measurementId={GA_ID} />}

        {/* PostHog provider — opt-out por defecto hasta que el usuario acepte */}
        <PostHogProvider>
          {children}
        </PostHogProvider>
      </body>
    </html>
  );
}
