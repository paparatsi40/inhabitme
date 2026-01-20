import { useMemo } from 'react'
import { generateBreadcrumbSchema } from '@/components/ui/breadcrumbs'

interface BreadcrumbItem {
  name: string
  href: string
}

interface BreadcrumbJsonLdProps {
  items: BreadcrumbItem[]
  currentTitle: string
  currentUrl: string
}

export function BreadcrumbJsonLd({ items, currentTitle, currentUrl }: BreadcrumbJsonLdProps) {
  // Memoize el schema para evitar regeneraciones innecesarias
  const schemaMarkup = useMemo(() => {
    return JSON.stringify(generateBreadcrumbSchema(items, currentTitle, currentUrl))
  }, [items, currentTitle, currentUrl])

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: schemaMarkup }}
      suppressHydrationWarning
    />
  )
}
