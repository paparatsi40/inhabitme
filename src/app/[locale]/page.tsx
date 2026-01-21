import { Link } from '@/i18n/routing'
import { useTranslations } from 'next-intl'
import { ArrowRight, Zap, Euro, MapPin, CheckCircle, Wifi, Monitor } from 'lucide-react'
import dynamic from 'next/dynamic'
import { Button } from '@/components/ui/button'
import { ClientNav } from '@/components/home/ClientNav'
import { WhyInhabitmeSection, PricingComparisonSection } from '@/components/home/StaticSections'

const CityCarousel = dynamic(() => import('@/components/hero/CityCarousel'), {
  loading: () => (
    <div className="w-full h-[500px] bg-gradient-to-br from-gray-200 to-gray-300 rounded-2xl animate-pulse flex items-center justify-center">
      <MapPin className="h-16 w-16 text-gray-400" />
    </div>
  ),
  ssr: false
})

export default function HomePage() {
  const t = useTranslations('home');
  const tCommon = useTranslations('common');
  const tHow = useTranslations('home.howItWorks');
  const tFaq = useTranslations('home.faq');
  const tFaqSection = useTranslations('home.faqSection');
  const tCities = useTranslations('home.citiesSection');
  const tFinalCta = useTranslations('home.finalCtaSection');

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30">
      <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-lg z-50 border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 lg:h-18">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="p-1.5 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl group-hover:scale-110 transition-transform">
                <svg width="28" height="28" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M 30 45 L 50 30 L 70 45 L 70 70 L 30 70 Z" fill="white"/>
                  <path d="M 25 45 L 50 25 L 75 45" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                  <rect x="44" y="55" width="12" height="15" fill="#2563eb" rx="1"/>
                </svg>
              </div>
              <span className="font-black text-xl lg:text-2xl bg-gradient-to-r from-gray-900 to-blue-900 bg-clip-text text-transparent">
                inhabitme
              </span>
            </Link>
            <ClientNav signIn={tCommon('signIn')} signUp={tCommon('signUp')} />
          </div>
        </div>
      </nav>

      <section className="pt-24 lg:pt-32 pb-16 lg:pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-100 via-purple-100 to-blue-100 border-2 border-blue-200 text-blue-700 rounded-2xl text-sm font-bold mb-6 shadow-sm">
                <Zap className="h-4 w-4" />
                {t('hero.badge')}
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black mb-6 lg:mb-8 leading-[1.1]">
                {t('hero.title')}
                <br />
                <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
                  {t('hero.titleHighlight')}
                </span>
              </h1>
              <p className="text-xl lg:text-2xl text-gray-700 mb-8 lg:mb-10 leading-relaxed font-medium" dangerouslySetInnerHTML={{__html: t.raw('hero.subtitle')}} />
              <div className="flex flex-wrap gap-3 mb-8 lg:mb-10">
                <div className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl">
                  <Wifi className="h-5 w-5 text-green-600" />
                  <span className="text-sm font-bold text-gray-900">{t('hero.features.wifi')}</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-50 to-blue-100 border-2 border-blue-200 rounded-xl">
                  <Monitor className="h-5 w-5 text-blue-600" />
                  <span className="text-sm font-bold text-gray-900">{t('hero.features.workspace')}</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-50 to-purple-100 border-2 border-purple-200 rounded-xl">
                  <Euro className="h-5 w-5 text-purple-600" />
                  <span className="text-sm font-bold text-gray-900">{t('hero.features.transparent')}</span>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <a href="#ciudades" className="flex-1 sm:flex-initial">
                  <Button size="lg" className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold shadow-lg hover:shadow-xl transition-all px-8 py-6 text-lg">
                    {t('hero.cta.primary')}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </a>
                <Link href="/properties/new" className="flex-1 sm:flex-initial">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto border-2 border-gray-300 hover:border-blue-500 hover:bg-blue-50 font-semibold px-8 py-6 text-lg">
                    {t('hero.cta.secondary')}
                  </Button>
                </Link>
              </div>
              <div className="mt-8 p-5 bg-gradient-to-r from-blue-50 via-purple-50 to-blue-50 border-2 border-blue-300 rounded-2xl">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <Euro className="h-5 w-5 text-white" />
                  </div>
                  <p className="text-xl font-black text-gray-900">{t('hero.pricingBadge')}</p>
                </div>
                <p className="text-base text-gray-700 ml-13">{t('hero.pricingSubtitle')}</p>
              </div>
              <p className="text-sm text-gray-600 mt-6 flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                {t('hero.joinMessage')}
              </p>
            </div>
            <CityCarousel />
          </div>
        </div>
      </section>

      <WhyInhabitmeSection t={t} />
      <PricingComparisonSection tHow={tHow} />

      <section id="ciudades" className="py-16 lg:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-blue-50/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-black mb-4">{tCities('title')}</h2>
            <p className="text-lg text-gray-600">{tCities('subtitle')}</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <CityCard slug="madrid" name="Madrid" subtitle="Capital de Espana" price="800 EUR" gradient="from-blue-600 to-blue-800" hoverBorder="hover:border-blue-400" textColor="text-blue-600" />
            <CityCard slug="barcelona" name="Barcelona" subtitle="Mar y Modernismo" price="900 EUR" gradient="from-purple-600 to-purple-800" hoverBorder="hover:border-purple-400" textColor="text-purple-600" />
            <CityCard slug="valencia" name="Valencia" subtitle="Playa y calidad de vida" price="700 EUR" gradient="from-green-600 to-emerald-800" hoverBorder="hover:border-green-400" textColor="text-green-600" />
            <CityCard slug="lisboa" name="Lisboa" subtitle="Fiscalidad favorable" price="750 EUR" gradient="from-yellow-600 to-orange-700" hoverBorder="hover:border-orange-400" textColor="text-orange-600" />
            <CityCard slug="ciudad-de-mexico" name="Ciudad de Mexico" subtitle="Capital digital de LatAm" price="500 EUR" gradient="from-pink-600 to-red-700" hoverBorder="hover:border-pink-400" textColor="text-pink-600" />
            <CityCard slug="buenos-aires" name="Buenos Aires" subtitle="Cultura y tango" price="400 EUR" gradient="from-cyan-600 to-blue-700" hoverBorder="hover:border-cyan-400" textColor="text-cyan-600" />
            <CityCard slug="medellin" name="Medellin" subtitle="Eterna primavera" price="450 EUR" gradient="from-emerald-600 to-green-700" hoverBorder="hover:border-emerald-400" textColor="text-emerald-600" />
            <CityCard slug="porto" name="Porto" subtitle="Vino y autenticidad" price="650 EUR" gradient="from-indigo-600 to-purple-700" hoverBorder="hover:border-indigo-400" textColor="text-indigo-600" />
            <CityCard slug="sevilla" name="Sevilla" subtitle="Sol y flamenco" price="600 EUR" gradient="from-amber-600 to-orange-700" hoverBorder="hover:border-amber-400" textColor="text-amber-600" />
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12 lg:mb-16">
            <h2 className="text-3xl lg:text-5xl font-black mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {tFaqSection('title')}
            </h2>
            <p className="text-lg text-gray-600">{tFaqSection('subtitle')}</p>
          </div>
          <div className="space-y-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
              <FAQItem key={num} num={num} tFaq={tFaq} />
            ))}
          </div>
          <div className="mt-12 text-center">
            <p className="text-gray-600 mb-6">{tFaqSection('moreQuestions')}</p>
            <a href="mailto:hola@inhabitme.com" className="inline-block">
              <Button size="lg" variant="outline" className="border-2 border-gray-300 hover:border-blue-500 hover:bg-blue-50 font-semibold">
                {tFaqSection('contactSupport')}
              </Button>
            </a>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-600 via-purple-600 to-blue-700">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-3xl lg:text-5xl font-black mb-6">{tFinalCta('title')}</h2>
          <p className="text-xl lg:text-2xl mb-10 opacity-90">{tFinalCta('subtitle')}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/madrid">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 font-bold shadow-xl px-10 py-6 text-lg">
                {tFinalCta('viewProperties')}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/properties/new">
              <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white/10 font-semibold px-10 py-6 text-lg">
                {tFinalCta('listSpace')}
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

function FAQItem({ num, tFaq }: { num: number; tFaq: any }) {
  const colors = [
    { bg: 'from-blue-50 to-indigo-50', border: 'border-blue-200', badge: 'bg-blue-600' },
    { bg: 'from-green-50 to-emerald-50', border: 'border-green-200', badge: 'bg-green-600' },
    { bg: 'from-purple-50 to-pink-50', border: 'border-purple-200', badge: 'bg-purple-600' },
    { bg: 'from-orange-50 to-yellow-50', border: 'border-orange-200', badge: 'bg-orange-600' },
    { bg: 'from-teal-50 to-cyan-50', border: 'border-teal-200', badge: 'bg-teal-600' },
    { bg: 'from-rose-50 to-red-50', border: 'border-rose-200', badge: 'bg-rose-600' },
    { bg: 'from-violet-50 to-purple-50', border: 'border-violet-200', badge: 'bg-violet-600' },
    { bg: 'from-amber-50 to-orange-50', border: 'border-amber-200', badge: 'bg-amber-600' },
  ]
  const color = colors[num - 1]
  return (
    <div className={`bg-gradient-to-br ${color.bg} border-2 ${color.border} rounded-2xl p-6 lg:p-8`}>
      <h3 className="text-xl lg:text-2xl font-black text-gray-900 mb-4 flex items-center gap-3">
        <div className={`w-8 h-8 ${color.badge} rounded-full flex items-center justify-center flex-shrink-0`}>
          <span className="text-white text-sm font-bold">{num}</span>
        </div>
        {tFaq(`q${num}.question`)}
      </h3>
      <p className="text-gray-700 leading-relaxed ml-11" dangerouslySetInnerHTML={{ __html: tFaq.raw(`q${num}.answer`) }} />
    </div>
  )
}

const CITY_IMAGES: Record<string, string> = {
  'madrid': 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=800&h=600&fit=crop&q=80',
  'barcelona': 'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=800&h=600&fit=crop&q=80',
  'valencia': 'https://images.unsplash.com/photo-1523531294919-4bcd7c65e216?w=800&h=600&fit=crop&q=80',
  'lisboa': 'https://images.unsplash.com/photo-1585208798174-6cedd86e019a?w=800&h=600&fit=crop&q=80',
  'ciudad-de-mexico': 'https://images.unsplash.com/photo-1585464231875-d9ef1f5ad396?w=800&h=600&fit=crop&q=80',
  'buenos-aires': 'https://images.unsplash.com/photo-1589909202802-8f4aadce1849?w=800&h=600&fit=crop&q=80',
  'medellin': 'https://images.unsplash.com/photo-1568632234157-ce7aecd03d0d?w=800&h=600&fit=crop&q=80',
  'porto': 'https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=800&h=600&fit=crop&q=80',
  'sevilla': 'https://images.unsplash.com/photo-1543783207-ec64e4d95325?w=800&h=600&fit=crop&q=80',
}

function CityCard({ slug, name, subtitle, price, gradient, hoverBorder, textColor }: { slug: string; name: string; subtitle: string; price: string; gradient: string; hoverBorder: string; textColor: string }) {
  const imageUrl = CITY_IMAGES[slug]
  return (
    <Link href={`/${slug}`} className={`group relative bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 border-2 border-gray-200 ${hoverBorder}`}>
      <div className="aspect-[4/3] relative overflow-hidden">
        {imageUrl ? (
          <>
            <img src={imageUrl} alt={`${name} cityscape`} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition"></div>
          </>
        ) : (
          <>
            <div className={`absolute inset-0 bg-gradient-to-br ${gradient}`}></div>
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <MapPin className="h-16 w-16 text-white opacity-90" />
            </div>
          </>
        )}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-6">
          <h3 className="text-2xl font-black text-white mb-1">{name}</h3>
          <p className="text-sm text-white/90">{subtitle}</p>
        </div>
      </div>
      <div className="p-5">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-gray-600">From {price}/month</span>
          <span className={`text-sm font-bold ${textColor} group-hover:translate-x-1 transition-transform inline-flex items-center gap-1`}>
            View properties <ArrowRight className="h-4 w-4" />
          </span>
        </div>
      </div>
    </Link>
  )
}
