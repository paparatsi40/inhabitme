import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import '../globals.css'
import { AuthProvider } from '@/contexts/AuthContext'
import { ClerkProvider } from '@clerk/nextjs'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages, getTranslations } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { routing } from '@/i18n/routing'
import { Footer } from '@/components/Footer'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata({
  params: { locale }
}: {
  params: { locale: string }
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'metadata' })
  const baseUrl = 'https://www.inhabitme.com'
  const localeUrl = locale === 'en' ? `${baseUrl}/en` : baseUrl

  return {
    title: t('title'),
    description: t('description'),
    keywords: 'medium-term rentals, coliving, digital nomads, furnished apartments, Madrid, Barcelona, Valencia, remote work',
    authors: [{ name: 'InhabitMe' }],
    creator: 'InhabitMe',
    publisher: 'InhabitMe',
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: localeUrl,
      languages: {
        'en': `${baseUrl}/en`,
        'es': baseUrl,
      },
    },
    openGraph: {
      title: t('title'),
      description: t('description'),
      url: localeUrl,
      siteName: 'InhabitMe',
      locale: locale === 'en' ? 'en_US' : 'es_ES',
      type: 'website',
      images: [
        {
          url: `${baseUrl}/og-image.png`,
          width: 1200,
          height: 630,
          alt: 'InhabitMe - Medium-term stays',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: t('title'),
      description: t('description'),
      images: [`${baseUrl}/og-image.png`],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    icons: {
      icon: '/favicon.svg',
      apple: '/favicon.svg',
    },
    verification: {
      google: 'your-google-verification-code', // Replace with actual code from Google Search Console
    },
  }
}

export default async function LocaleLayout({
  children,
  params: { locale }
}: {
  children: React.ReactNode
  params: { locale: string }
}) {
  // Ensure that the incoming `locale` is valid
  if (!routing.locales.includes(locale as any)) {
    notFound()
  }

  // Providing all messages to the client
  const messages = await getMessages()

  return (
    <NextIntlClientProvider messages={messages}>
      <AuthProvider>
        <div className="flex flex-col min-h-screen">
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
        </div>
      </AuthProvider>
    </NextIntlClientProvider>
  )
}
