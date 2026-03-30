import { Metadata } from 'next'
import { Link } from '@/i18n/routing'
import { ArrowLeft, Shield, Mail } from 'lucide-react'
import { getTranslations } from 'next-intl/server'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'privacyPage' })

  return {
    title: t('metadataTitle'),
    description: t('metadataDescription'),
  }
}

export default async function PrivacyPage({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'privacyPage' })

  const sections = [
    { title: t('sections.dataCollect.title'), body: t('sections.dataCollect.body') },
    { title: t('sections.dataUse.title'), body: t('sections.dataUse.body') },
    { title: t('sections.dataShare.title'), body: t('sections.dataShare.body') },
    { title: t('sections.security.title'), body: t('sections.security.body') },
    { title: t('sections.rights.title'), body: t('sections.rights.body') },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30">
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium transition mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            {t('back')}
          </Link>

          <div className="flex items-center gap-3 mb-3">
            <div className="p-2.5 bg-blue-100 rounded-xl">
              <Shield className="h-6 w-6 text-blue-600" />
            </div>
            <h1 className="text-3xl lg:text-4xl font-black text-gray-900">{t('title')}</h1>
          </div>
          <p className="text-sm text-gray-600">{t('lastUpdated')}</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="prose prose-lg max-w-none">
          <div className="bg-blue-50 border-l-4 border-blue-600 p-6 rounded-r-lg mb-8">
            <p className="text-gray-800 leading-relaxed m-0">{t('intro')}</p>
          </div>

          {sections.map((section) => (
            <section key={section.title} className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-3">{section.title}</h2>
              <p className="text-gray-700">{section.body}</p>
            </section>
          ))}

          <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-l-4 border-blue-600 p-6 rounded-r-xl mt-12">
            <div className="flex items-start gap-3">
              <Mail className="h-6 w-6 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2 m-0">{t('contactTitle')}</h3>
                <p className="text-gray-700 mb-3 text-base">{t('contactBody')}</p>
                <p className="m-0 text-sm">
                  <strong>Email:</strong>{' '}
                  <a href="mailto:privacy@inhabitme.com" className="text-blue-600 hover:text-blue-700">
                    privacy@inhabitme.com
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
