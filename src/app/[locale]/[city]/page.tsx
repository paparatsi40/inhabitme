import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Link } from '@/i18n/routing'
import { Button } from '@/components/ui/button'

const CITIES_CONFIG: Record<string, { name: string }> = {
  austin: { name: 'Austin' },
  madrid: { name: 'Madrid' },
  barcelona: { name: 'Barcelona' },
}

type PageProps = {
  params: {
    city: string
    locale: string
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const citySlug = params.city.toLowerCase()
  const config = CITIES_CONFIG[citySlug]
  
  if (!config) {
    return { title: 'Ciudad no encontrada' }
  }

  return {
    title: `Vive en ${config.name}`,
    description: `Alojamientos en ${config.name}`,
  }
}

export default async function CityPage({ params }: PageProps) {
  const citySlug = params.city.toLowerCase()
  const config = CITIES_CONFIG[citySlug]

  if (!config) {
    notFound()
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8">
      <h1 className="text-4xl font-bold mb-4">{config.name}</h1>
      <p className="text-gray-600 mb-6">Página de prueba simplificada</p>
      <Link href="/">
        <Button>Volver al inicio</Button>
      </Link>
    </main>
  )
}
