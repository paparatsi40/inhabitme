import { Link } from '@/i18n/routing';
import { Button } from '@/components/ui/button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { getTranslations } from 'next-intl/server';
import {
  ArrowLeft, HelpCircle, Home, Search,
  Shield, MessageCircle
} from 'lucide-react';

export default async function FAQPage() {
  const t = await getTranslations('faqPage');

  const sections = [
    {
      key: 'general',
      icon: Home,
      iconClass: 'text-blue-600',
      iconBg: 'bg-blue-100',
      items: ['q1', 'q2', 'q3'],
    },
    {
      key: 'guests',
      icon: Search,
      iconClass: 'text-green-600',
      iconBg: 'bg-green-100',
      items: ['g1', 'g2', 'g3', 'g4'],
    },
    {
      key: 'hosts',
      icon: Home,
      iconClass: 'text-purple-600',
      iconBg: 'bg-purple-100',
      items: ['h1', 'h2', 'h3', 'h4'],
    },
    {
      key: 'payments',
      icon: Shield,
      iconClass: 'text-orange-600',
      iconBg: 'bg-orange-100',
      items: ['p1', 'p2', 'p3'],
    },
  ] as const;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50/30">
      <nav className="bg-white/95 backdrop-blur-lg border-b-2 border-gray-200 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="p-1.5 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl group-hover:scale-110 transition-transform">
                <svg width="24" height="24" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M 30 45 L 50 30 L 70 45 L 70 70 L 30 70 Z" fill="white"/>
                  <path d="M 25 45 L 50 25 L 75 45" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                  <rect x="44" y="55" width="12" height="15" fill="#2563eb" rx="1"/>
                </svg>
              </div>
              <span className="font-black text-xl bg-gradient-to-r from-gray-900 to-blue-900 bg-clip-text text-transparent">
                inhabitme
              </span>
            </Link>
            <Link href="/">
              <Button variant="ghost">
                <ArrowLeft className="h-4 w-4 mr-2" />
                {t('back')}
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="text-center mb-12">
          <div className="inline-flex p-4 bg-gradient-to-br from-purple-100 to-blue-200 rounded-2xl mb-6">
            <HelpCircle className="h-10 w-10 text-purple-600" />
          </div>
          <h1 className="text-4xl lg:text-5xl font-black text-gray-900 mb-4">
            {t('title')}
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {t('subtitle')}
          </p>
        </div>

        <div className="space-y-8">
          {sections.map((section) => {
            const Icon = section.icon;
            return (
              <div key={section.key}>
                <div className="flex items-center gap-3 mb-4">
                  <div className={`p-2 rounded-lg ${section.iconBg}`}>
                    <Icon className={`h-5 w-5 ${section.iconClass}`} />
                  </div>
                  <h2 className="text-2xl font-black text-gray-900">{t(`sections.${section.key}`)}</h2>
                </div>
                <Accordion type="single" collapsible className="space-y-3">
                  {section.items.map((item) => (
                    <AccordionItem key={item} value={item} className="bg-white border-2 border-gray-200 rounded-xl px-6">
                      <AccordionTrigger className="text-left font-semibold hover:no-underline">
                        {t(`items.${item}.q`)}
                      </AccordionTrigger>
                      <AccordionContent className="text-gray-600">
                        {t(`items.${item}.a`)}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            );
          })}
        </div>

        <div className="mt-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl p-8 lg:p-12 text-white text-center">
          <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-90" />
          <h2 className="text-3xl font-black mb-3">
            {t('cta.title')}
          </h2>
          <p className="text-lg opacity-90 mb-6 max-w-2xl mx-auto">
            {t('cta.subtitle')}
          </p>
          <Link href="/contact">
            <Button size="lg" variant="secondary" className="bg-white text-blue-600 hover:bg-gray-100">
              <MessageCircle className="h-5 w-5 mr-2" />
              {t('cta.button')}
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
}
