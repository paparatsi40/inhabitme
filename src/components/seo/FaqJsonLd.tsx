import { JsonLd } from './JsonLd'

/**
 * Schema.org FAQPage — gana rich snippets de preguntas en Google.
 *
 * Importante: la respuesta debe ser texto plano sin HTML excesivo.
 * Aquí limpiamos las etiquetas básicas que vienen del CMS.
 */
function stripHtml(html: string): string {
  return html
    .replace(/<br\s*\/?>(\s*)/gi, ' ')
    .replace(/<\/?[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    .replace(/\s+/g, ' ')
    .trim()
}

export function FaqJsonLd({ faqs }: { faqs: Array<{ question: string; answer: string }> }) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: stripHtml(f.question),
      acceptedAnswer: {
        '@type': 'Answer',
        text: stripHtml(f.answer),
      },
    })),
  }
  return <JsonLd data={data} id="ld-faq" />
}
