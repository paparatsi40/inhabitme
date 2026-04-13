import { Metadata } from 'next';
import { Link } from '@/i18n/routing';
import { ArrowLeft, Heart, Target, Users, Zap } from 'lucide-react';
import { getTranslations } from 'next-intl/server';

type AboutPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: AboutPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'about' });
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://www.inhabitme.com';

  return {
    title: t('metadataTitle'),
    description: t('metadataDescription'),
    alternates: {
      canonical: `${baseUrl}/${locale}/about`,
      languages: {
        en: `${baseUrl}/en/about`,
        es: `${baseUrl}/es/about`,
      },
    },
    robots: { index: true, follow: true },
  };
}

export default async function AboutPage() {
  const t = await getTranslations('about');

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30">
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link href="/" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium transition mb-4">
            <ArrowLeft className="h-4 w-4" />
            {t('backHome')}
          </Link>
          <h1 className="text-3xl lg:text-4xl font-black text-gray-900">{t('pageTitle')}</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="prose prose-lg max-w-none">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-8 rounded-2xl mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mt-0">{t('missionTitle')}</h2>
            <p className="text-gray-700 text-lg mb-0">{t('missionText')}</p>
          </div>

          <h2>{t('problemTitle')}</h2>
          <p>{t('problemText')}</p>

          <div className="grid md:grid-cols-2 gap-6 my-8">
            <div className="bg-white p-6 rounded-xl border-2 border-gray-200">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Zap className="h-5 w-5 text-blue-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 m-0">{t('wifiTitle')}</h3>
              </div>
              <p className="text-sm text-gray-600 m-0">{t('wifiText')}</p>
            </div>

            <div className="bg-white p-6 rounded-xl border-2 border-gray-200">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Target className="h-5 w-5 text-green-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 m-0">{t('midStaysTitle')}</h3>
              </div>
              <p className="text-sm text-gray-600 m-0">{t('midStaysText')}</p>
            </div>

            <div className="bg-white p-6 rounded-xl border-2 border-gray-200">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Users className="h-5 w-5 text-purple-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 m-0">{t('communityTitle')}</h3>
              </div>
              <p className="text-sm text-gray-600 m-0">{t('communityText')}</p>
            </div>

            <div className="bg-white p-6 rounded-xl border-2 border-gray-200">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Heart className="h-5 w-5 text-orange-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 m-0">{t('noSurprisesTitle')}</h3>
              </div>
              <p className="text-sm text-gray-600 m-0">{t('noSurprisesText')}</p>
            </div>
          </div>

          <h2>{t('howTitle')}</h2>
          <ol>
            <li><strong>{t('howStep1Strong')}</strong> {t('howStep1Text')}</li>
            <li><strong>{t('howStep2Strong')}</strong> {t('howStep2Text')}</li>
            <li><strong>{t('howStep3Strong')}</strong> {t('howStep3Text')}</li>
            <li><strong>{t('howStep4Strong')}</strong> {t('howStep4Text')}</li>
          </ol>

          <h2>{t('whyTitle')}</h2>
          <ul>
            <li>✅ <strong>{t('why1Strong')}</strong> {t('why1Text')}</li>
            <li>✅ <strong>{t('why2Strong')}</strong> {t('why2Text')}</li>
            <li>✅ <strong>{t('why3Strong')}</strong> {t('why3Text')}</li>
            <li>✅ <strong>{t('why4Strong')}</strong> {t('why4Text')}</li>
          </ul>

          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8 rounded-2xl mt-10">
            <h2 className="text-white mt-0">{t('ctaTitle')}</h2>
            <p className="text-blue-100 mb-6">{t('ctaSubtitle')}</p>
            <Link href="/search">
              <button className="bg-white text-blue-600 hover:bg-gray-100 font-bold py-3 px-6 rounded-xl transition">
                {t('ctaButton')}
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
