import Link from 'next/link'
import { Home, ChevronRight } from 'lucide-react'

export interface BreadcrumbItem {
  name: string
  href: string
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[]
  current: string
  className?: string
}

export function Breadcrumbs({ items, current, className = '' }: BreadcrumbsProps) {
  return (
    <nav
      className={`flex items-center gap-2 text-sm text-gray-600 ${className}`}
      aria-label="Breadcrumb"
    >
      {/* Home */}
      <Link
        href="/"
        className="hover:text-blue-600 transition flex items-center gap-1"
        aria-label="Inicio"
      >
        <Home className="h-4 w-4" />
        <span className="sr-only">Inicio</span>
      </Link>

      {/* Items intermedios */}
      {items.map((item) => (
        <div key={item.href} className="flex items-center gap-2">
          <ChevronRight className="h-4 w-4 text-gray-400" />
          <Link
            href={item.href}
            className="hover:text-blue-600 transition"
          >
            {item.name}
          </Link>
        </div>
      ))}

      {/* Current page */}
      <div className="flex items-center gap-2">
        <ChevronRight className="h-4 w-4 text-gray-400" />
        <span className="text-gray-900 font-medium truncate max-w-[200px] sm:max-w-none">
          {current}
        </span>
      </div>
    </nav>
  )
}

/**
 * Genera el Schema.org BreadcrumbList para SEO
 */
export function generateBreadcrumbSchema(
  items: BreadcrumbItem[],
  current: string,
  currentUrl: string,
  baseUrl: string = 'https://inhabitme.com'
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      // Home
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Inicio',
        item: baseUrl,
      },
      // Items intermedios
      ...items.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 2,
        name: item.name,
        item: `${baseUrl}${item.href}`,
      })),
      // Current
      {
        '@type': 'ListItem',
        position: items.length + 2,
        name: current,
        item: `${baseUrl}${currentUrl}`,
      },
    ],
  }
}
