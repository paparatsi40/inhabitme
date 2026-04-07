'use client'

// FaqSection — componente separado para permitir dynamic import (lazy load)
// Se importa con next/dynamic en page.tsx y solo se carga cuando el browser lo necesita

interface FaqItem {
  key: string
  question: string
  answer: string
  colors: {
    bg: string
    border: string
    numBg: string
  }
}

interface FaqSectionProps {
  tFaqSection: {
    title: string
    subtitle: string
    moreQuestions: string
    contactSupport: string
  }
  faqs: FaqItem[]
}

export default function FaqSection({ tFaqSection, faqs }: FaqSectionProps) {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-12 lg:mb-16">
        <h2 className="text-3xl lg:text-5xl font-black mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          {tFaqSection.title}
        </h2>
        <p className="text-lg text-gray-700">{tFaqSection.subtitle}</p>
      </div>

      <div className="space-y-6">
        {faqs.map((faq, index) => (
          <div
            key={faq.key}
            className={`bg-gradient-to-br ${faq.colors.bg} border-2 ${faq.colors.border} rounded-2xl p-6 lg:p-8`}
          >
            <h3 className="text-xl lg:text-2xl font-black text-gray-900 mb-4 flex items-center gap-3">
              <div className={`w-8 h-8 ${faq.colors.numBg} rounded-full flex items-center justify-center flex-shrink-0`}>
                <span className="text-white text-sm font-bold">{index + 1}</span>
              </div>
              {faq.question}
            </h3>
            <p
              className="text-gray-700 leading-relaxed ml-11"
              dangerouslySetInnerHTML={{ __html: faq.answer }}
            />
          </div>
        ))}
      </div>

      <div className="mt-12 text-center">
        <p className="text-gray-700 mb-6">{tFaqSection.moreQuestions}</p>
        <a
          href="mailto:hola@inhabitme.com"
          className="inline-flex min-h-11 items-center px-6 py-3 border-2 border-gray-300 hover:border-blue-500 hover:bg-blue-50 font-semibold rounded-lg transition-colors"
        >
          {tFaqSection.contactSupport}
        </a>
      </div>
    </div>
  )
}
