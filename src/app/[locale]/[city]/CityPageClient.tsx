'use client'

import { useState } from 'react'
import { Building2 } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { WaitlistModal } from '@/components/waitlist/WaitlistModal'

interface AlternativeCity {
  name: string
  slug: string
  distance?: string
  properties: number
  priceFrom: number
  highlight: string
}

interface CityPageClientProps {
  cityName: string
  citySlug: string
  neighborhoods: Array<{ name: string; slug: string }>
  alternatives: AlternativeCity[]
}

export function CityPageClient({ cityName, citySlug, neighborhoods, alternatives }: CityPageClientProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <>
      <section className="text-center py-16 lg:py-24 bg-gradient-to-br from-blue-50 via-purple-50 to-blue-50 rounded-3xl border-2 border-dashed border-blue-300 shadow-inner">
        <div className="inline-flex p-8 bg-white rounded-3xl shadow-xl mb-8">
          <Building2 className="h-16 w-16 text-blue-600" />
        </div>

        <h2 className="text-3xl lg:text-4xl font-black mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Próximamente en {cityName}
        </h2>

        <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
          Estamos seleccionando cuidadosamente las <strong>mejores opciones de alquiler mensual</strong> en {cityName}. 
          <br className="hidden sm:block" />
          Sé el primero en descubrirlas 👇
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold shadow-lg px-8 py-6 text-lg rounded-lg transition-all hover:shadow-xl"
          >
            📧 Avísame cuando haya en {cityName}
          </button>
          <Link href="/">
            <Button variant="outline" size="lg" className="border-2 border-gray-300 hover:border-blue-500 hover:bg-blue-50 font-semibold px-8 py-6 text-lg">
              Explorar otras ciudades →
            </Button>
          </Link>
        </div>

        {/* Mientras tanto, explora barrios */}
        <div className="mt-16 pt-10 border-t-2 border-gray-200">
          <p className="text-base font-semibold text-gray-700 mb-6">
            Mientras tanto, explora los barrios de {cityName}:
          </p>
          <div className="flex flex-wrap gap-3 justify-center max-w-3xl mx-auto">
            {neighborhoods.slice(0, 8).map(({ name, slug }) => (
              <Link
                key={slug}
                href={`/${citySlug}/${slug}`}
                className="px-4 py-2 bg-white border-2 border-gray-200 hover:border-blue-500 hover:bg-blue-50 rounded-xl font-medium text-gray-700 hover:text-blue-700 transition shadow-sm hover:shadow-md"
              >
                {name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <WaitlistModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        cityName={cityName}
        citySlug={citySlug}
        alternatives={alternatives}
      />
    </>
  )
}
