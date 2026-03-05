import { Wifi, Euro, Clock, CheckCircle, X } from 'lucide-react'

export function TrustItem({ 
  icon, 
  title, 
  text, 
  gradient = 'from-gray-50 to-gray-100', 
  borderColor = 'border-gray-200' 
}: { 
  icon: React.ReactNode
  title: string
  text: string
  gradient?: string
  borderColor?: string 
}) {
  return (
    <div className={`group relative bg-white p-6 lg:p-8 rounded-2xl shadow-sm border-2 ${borderColor} hover:shadow-xl transition-all duration-300`}>
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl`}></div>
      <div className="relative">
        <div className={`inline-flex p-4 bg-gradient-to-br ${gradient} rounded-2xl mb-5 group-hover:scale-110 transition-transform shadow-sm`}>
          {icon}
        </div>
        <h3 className="font-black text-xl lg:text-2xl mb-3 text-gray-900">{title}</h3>
        <p className="text-gray-600 leading-relaxed text-base">{text}</p>
      </div>
    </div>
  )
}

export function WhyInhabitmeSection({ t }: { t: any }) {
  return (
    <section className="py-16 lg:py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 lg:mb-16">
          <h2 className="text-3xl lg:text-5xl font-black mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {t('whyInhabitme.title')}
          </h2>
          <p className="text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto" dangerouslySetInnerHTML={{__html: t.raw('whyInhabitme.subtitle')}} />
        </div>
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          <TrustItem 
            icon={<Wifi className="h-8 w-8 text-green-600" />} 
            title={t('whyInhabitme.verified.title')} 
            text={t('whyInhabitme.verified.description')} 
            gradient="from-green-50 to-emerald-50" 
            borderColor="border-green-200" 
          />
          <TrustItem 
            icon={<Euro className="h-8 w-8 text-blue-600" />} 
            title={t('whyInhabitme.transparent.title')} 
            text={t('whyInhabitme.transparent.description')} 
            gradient="from-blue-50 to-blue-100" 
            borderColor="border-blue-200" 
          />
          <TrustItem 
            icon={<Clock className="h-8 w-8 text-purple-600" />} 
            title={t('whyInhabitme.flexible.title')} 
            text={t('whyInhabitme.flexible.description')} 
            gradient="from-purple-50 to-purple-100" 
            borderColor="border-purple-200" 
          />
        </div>
      </div>
    </section>
  )
}

export function PricingComparisonSection({ tHow }: { tHow: any }) {
  return (
    <section className="py-16 lg:py-24 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12 lg:mb-16">
          <h2 className="text-3xl lg:text-5xl font-black mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {tHow('title')}
          </h2>
          <p className="text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto">{tHow('subtitle')}</p>
        </div>
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-gradient-to-br from-red-50 to-orange-50 border-2 border-red-200 rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <X className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-2xl font-black text-gray-900">{tHow('otherPlatforms.title')}</h3>
            </div>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <X className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-lg font-semibold text-gray-900">{tHow('otherPlatforms.commission')}</p>
                  <p className="text-base text-gray-600">{tHow('otherPlatforms.commissionDesc')}</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <X className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-lg font-semibold text-gray-900">{tHow('otherPlatforms.fees')}</p>
                  <p className="text-base text-gray-600">{tHow('otherPlatforms.feesDesc')}</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <X className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-lg font-semibold text-gray-900">{tHow('otherPlatforms.host')}</p>
                  <p className="text-base text-gray-600">{tHow('otherPlatforms.hostDesc')}</p>
                </div>
              </li>
            </ul>
            <div className="mt-6 pt-6 border-t-2 border-red-200">
              <p className="text-base text-gray-600 mb-2">{tHow('example.title')}</p>
              <p className="text-2xl font-black text-red-600">3600 + 540 = 4140 EUR</p>
              <p className="text-sm text-gray-500 mt-1">{tHow('example.otherPlatform')}</p>
            </div>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-300 rounded-2xl p-8 relative overflow-hidden">
            <div className="absolute top-4 right-4 bg-green-700 text-white px-3 py-1 rounded-full text-xs font-bold">
              {tHow('inhabitme.badge')}
            </div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-2xl font-black text-gray-900">{tHow('inhabitme.title')}</h3>
            </div>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-lg font-semibold text-gray-900">{tHow('inhabitme.oneFee')}</p>
                  <p className="text-base text-gray-600">{tHow('inhabitme.oneFeeDesc')}</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-lg font-semibold text-gray-900">{tHow('inhabitme.zeroCommission')}</p>
                  <p className="text-base text-gray-600">{tHow('inhabitme.zeroCommissionDesc')}</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-lg font-semibold text-gray-900">{tHow('inhabitme.host')}</p>
                  <p className="text-base text-gray-600">{tHow('inhabitme.hostDesc')}</p>
                </div>
              </li>
            </ul>
            <div className="mt-6 pt-6 border-t-2 border-green-200">
              <p className="text-base text-gray-600 mb-2">{tHow('example.title')}</p>
              <p className="text-2xl font-black text-green-600">3600 + 218 = 3818 EUR</p>
              <p className="text-sm text-gray-500 mt-1">{tHow('example.inhabitme')}</p>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-center text-white">
          <p className="text-lg font-semibold mb-2">{tHow('savings.badge')}</p>
          <p className="text-5xl font-black mb-2">{tHow('savings.amount')}</p>
          <p className="text-blue-100">{tHow('savings.description')}</p>
        </div>
        <div className="mt-12 grid md:grid-cols-2 gap-8">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
            <h4 className="text-xl font-bold text-gray-900 mb-4">{tHow('benefits.guest.title')}</h4>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <span dangerouslySetInnerHTML={{ __html: tHow('benefits.guest.point1') }} />
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <span dangerouslySetInnerHTML={{ __html: tHow('benefits.guest.point2') }} />
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <span dangerouslySetInnerHTML={{ __html: tHow('benefits.guest.point3') }} />
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <span dangerouslySetInnerHTML={{ __html: tHow('benefits.guest.point4') }} />
              </li>
            </ul>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-teal-50 border border-green-200 rounded-xl p-6">
            <h4 className="text-xl font-bold text-gray-900 mb-4">{tHow('benefits.host.title')}</h4>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span dangerouslySetInnerHTML={{ __html: tHow('benefits.host.point1') }} />
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span dangerouslySetInnerHTML={{ __html: tHow('benefits.host.point2') }} />
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span dangerouslySetInnerHTML={{ __html: tHow('benefits.host.point3') }} />
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span dangerouslySetInnerHTML={{ __html: tHow('benefits.host.point4') }} />
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
