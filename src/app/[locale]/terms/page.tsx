import { Metadata } from 'next'
import { Link } from '@/i18n/routing'
import { ArrowLeft, FileText, Mail } from 'lucide-react'
import { getTranslations } from 'next-intl/server'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'termsPage' })
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://www.inhabitme.com'

  return {
    title: t('metadataTitle'),
    description: t('metadataDescription'),
    alternates: {
      canonical: `${baseUrl}/${locale}/terms`,
      languages: {
        en: `${baseUrl}/en/terms`,
        es: `${baseUrl}/es/terms`,
      },
    },
    robots: { index: true, follow: true },
  }
}

export default async function TermsPage({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'termsPage' })

  // sections is now an array in JSON (supports optional `points` list per section)
  const sections = t.raw('sections') as Array<{ title: string; body: string; points?: string[] }>

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
          <p className="text-sm text-gray-500">{t('lastUpdated')}</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Intro */}
        <div className="bg-purple-50 border-l-4 border-purple-600 p-6 rounded-r-xl mb-10">
          <p className="text-gray-800 leading-relaxed">{t('intro')}</p>
        </div>

        {/* Sections */}
        <div className="space-y-6">
          {sections.map((section) => (
            <section key={section.title} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-3">{section.title}</h2>
              <p className="text-gray-700 leading-relaxed">{section.body}</p>
              {section.points && section.points.length > 0 && (
                <ul className="mt-3 space-y-2">
                  {section.points.map((point, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-gray-700 text-sm leading-relaxed">
                      <span className="mt-2 h-1.5 w-1.5 rounded-full bg-purple-500 shrink-0" />
                      {point}
                    </li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </div>

        {/* Contact block */}
        <div className="mt-10 bg-gradient-to-r from-purple-50 to-blue-50 border-l-4 border-purple-600 p-6 rounded-r-xl">
          <div className="flex items-start gap-3">
            <Mail className="h-6 w-6 text-purple-600 shrink-0 mt-0.5" />
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">{t('contactTitle')}</h3>
              <p className="text-gray-700 mb-3 text-sm">{t('contactBody')}</p>
              <p className="text-sm">
                <strong>Email:</strong>{' '}
                <a href="mailto:legal@inhabitme.com" className="text-purple-600 hover:text-purple-700">
                  legal@inhabitme.com
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
