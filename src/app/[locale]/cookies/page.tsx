import { Metadata } from 'next'
import { Link } from '@/i18n/routing'
import { ArrowLeft, Cookie } from 'lucide-react'
import { getTranslations } from 'next-intl/server'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'cookiesPage' })
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://www.inhabitme.com'

  return {
    title: t('metadataTitle'),
    description: t('metadataDescription'),
    alternates: {
      canonical: `${baseUrl}/${locale}/cookies`,
      languages: {
        en: `${baseUrl}/en/cookies`,
        es: `${baseUrl}/es/cookies`,
      },
    },
    robots: { index: true, follow: true },
  }
}

export default async function CookiesPage({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'cookiesPage' })

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30">
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link href="/" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium transition mb-4">
            <ArrowLeft className="h-4 w-4" />
            {t('back')}
          </Link>
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2.5 bg-orange-100 rounded-xl">
              <Cookie className="h-6 w-6 text-orange-600" />
            </div>
            <h1 className="text-3xl lg:text-4xl font-black text-gray-900">{t('title')}</h1>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="prose prose-lg max-w-none">
          <p className="text-gray-700 lead">{t('intro')}</p>

          <h2>{t('whatAreTitle')}</h2>
          <p>{t('whatAreBody')}</p>

          <h2>{t('typesTitle')}</h2>

          <h3>{t('essentialTitle')}</h3>
          <ul>
            <li><strong>{t('authLabel')}</strong> {t('authBody')}</li>
            <li><strong>{t('securityLabel')}</strong> {t('securityBody')}</li>
          </ul>

          <h3>{t('functionalTitle')}</h3>
          <ul>
            <li><strong>{t('preferencesLabel')}</strong> {t('preferencesBody')}</li>
            <li><strong>{t('searchLabel')}</strong> {t('searchBody')}</li>
          </ul>

          <h3>{t('analyticsTitle')}</h3>
          <ul>
            <li><strong>{t('analyticsLabel')}</strong> {t('analyticsBody')}</li>
          </ul>

          <h2>{t('manageTitle')}</h2>
          <p>{t('manageBody')}</p>

          <div className="bg-orange-50 border-l-4 border-orange-600 p-6 rounded-r-lg">
            <p className="m-0">
              <strong>{t('questionsPrefix')}</strong>{' '}
              <a href="mailto:privacy@inhabitme.com" className="text-orange-600 hover:text-orange-700">
                privacy@inhabitme.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
