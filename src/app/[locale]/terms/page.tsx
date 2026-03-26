import { Metadata } from 'next'
import { Link } from '@/i18n/routing'
import { ArrowLeft, FileText, Mail } from 'lucide-react'
import { getTranslations } from 'next-intl/server'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'termsPage' })

  return {
    title: t('metadataTitle'),
    description: t('metadataDescription'),
  }
}

export default async function TermsPage({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'termsPage' })

  const sections = [
    { title: t('sections.acceptance.title'), body: t('sections.acceptance.body') },
    { title: t('sections.service.title'), body: t('sections.service.body') },
    { title: t('sections.accounts.title'), body: t('sections.accounts.body') },
    { title: t('sections.payments.title'), body: t('sections.payments.body') },
    { title: t('sections.liability.title'), body: t('sections.liability.body') },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30">
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link href="/" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium transition mb-4">
            <ArrowLeft className="h-4 w-4" />
            {t('back')}
          </Link>

          <div className="flex items-center gap-3 mb-3">
            <div className="p-2.5 bg-purple-100 rounded-xl">
              <FileText className="h-6 w-6 text-purple-600" />
            </div>
            <h1 className="text-3xl lg:text-4xl font-black text-gray-900">{t('title')}</h1>
          </div>
          <p className="text-sm text-gray-600">{t('lastUpdated')}</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="prose prose-lg max-w-none">
          <div className="bg-purple-50 border-l-4 border-purple-600 p-6 rounded-r-lg mb-8">
            <p className="text-gray-800 leading-relaxed m-0">{t('intro')}</p>
          </div>

          {sections.map((section) => (
            <section key={section.title} className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-3">{section.title}</h2>
              <p className="text-gray-700">{section.body}</p>
            </section>
          ))}

          <div className="bg-gradient-to-r from-purple-50 to-blue-50 border-l-4 border-purple-600 p-6 rounded-r-xl mt-12">
            <div className="flex items-start gap-3">
              <Mail className="h-6 w-6 text-purple-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2 m-0">{t('contactTitle')}</h3>
                <p className="text-gray-700 mb-3 text-base">{t('contactBody')}</p>
                <p className="text-sm m-0">
                  <strong>Email:</strong>{' '}
                  <a href="mailto:legal@inhabitme.com" className="text-purple-600 hover:text-purple-700">legal@inhabitme.com</a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
