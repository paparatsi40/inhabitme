import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '../globals.css'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages, getTranslations } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { routing } from '@/i18n/routing'
import { Footer } from '@/components/Footer'
import { SEO_CONFIG, getLocalizedUrl } from '@/lib/seo/config'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

type LocaleParams = Promise<{ locale: string }>

export async function generateMetadata({
  params,
}: {
  params: LocaleParams
}): Promise<Metadata> {
  const { locale } = await params

  const t = await getTranslations({ locale, namespace: 'metadata' })
  const localeUrl = getLocalizedUrl('', locale as 'en' | 'es')

  return {
    title: t('title'),
    description: t('description'),
    keywords:
      'medium-term rentals, coliving, digital nomads, furnished apartments, Madrid, Barcelona, Valencia, remote work',
    authors: [{ name: SEO_CONFIG.siteName }],
    creator: SEO_CONFIG.siteName,
    publisher: SEO_CONFIG.siteName,
    metadataBase: new URL(SEO_CONFIG.baseUrl),
    alternates: {
      canonical: localeUrl,
      languages: {
        en: getLocalizedUrl('', 'en'),
        es: getLocalizedUrl('', 'es'),
      },
    },
    openGraph: {
      title: t('title'),
      description: t('description'),
      url: localeUrl,
      siteName: SEO_CONFIG.siteName,
      locale: locale === 'en' ? 'en_US' : 'es_ES',
      type: 'website',
      images: [
        {
          url: `${SEO_CONFIG.baseUrl}${SEO_CONFIG.openGraph.defaultImage}`,
          width: SEO_CONFIG.openGraph.imageWidth,
          height: SEO_CONFIG.openGraph.imageHeight,
          alt: 'InhabitMe - Medium-term stays',
        },
      ],
    },
    twitter: {
      card: SEO_CONFIG.twitter.card,
      title: t('title'),
      description: t('description'),
      images: [`${SEO_CONFIG.baseUrl}${SEO_CONFIG.openGraph.defaultImage}`],
      site: SEO_CONFIG.twitter.site,
      creator: SEO_CONFIG.twitter.creator,
    },
    robots: SEO_CONFIG.robots,
    icons: {
      icon: '/favicon.svg',
      apple: '/favicon.svg',
    },
    ...(SEO_CONFIG.verification.google && {
      verification: {
        google: SEO_CONFIG.verification.google,
      },
    }),
  }
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: LocaleParams
}) {
  const { locale } = await params

  // Ensure that the incoming `locale` is valid
  if (!routing.locales.includes(locale as any)) {
    notFound()
  }

  // Providing all messages to the client
  const messages = await getMessages()

  return (
    <NextIntlClientProvider messages={messages}>
      <div className="flex flex-col min-h-screen">
        <main className="flex-grow">{children}</main>
        <Footer />
      </div>
    </NextIntlClientProvider>
  )
}