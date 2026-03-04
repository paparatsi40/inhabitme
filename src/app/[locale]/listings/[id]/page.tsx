import { redirect as nextRedirect } from 'next/navigation'

type PageProps = {
  params: Promise<{ id: string; locale?: string }>
}

// Redirect de /listings/[id] a /properties/[id]
// Esto mantiene compatibilidad con links viejos
export default async function ListingRedirectPage({ params }: PageProps) {
  const { id, locale } = await params
  
  // Si hay locale, incluirlo. Si no (default), no incluirlo
  const targetPath = locale && locale !== 'en' 
    ? `/${locale}/properties/${id}`
    : `/properties/${id}`
  
  nextRedirect(targetPath)
}
