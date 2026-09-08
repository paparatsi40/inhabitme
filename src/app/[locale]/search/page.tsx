import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'pageMetadata.search' });
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://www.inhabitme.com';

  return {
    title: t('title'),
    description: t('description'),
    alternates: {
      canonical: `${baseUrl}/${locale}/search`,
      languages: {
        en: `${baseUrl}/en/search`,
        es: `${baseUrl}/es/search`,
      },
    },
    robots: { index: true, follow: true },
  };
}

import SearchClient from './search-client'

export default function SearchPage() {
  return <SearchClient />
}
