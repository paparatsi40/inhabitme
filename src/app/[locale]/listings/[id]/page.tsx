import { redirect as nextRedirect } from 'next/navigation'

type PageProps = {
  params: { id: string; locale?: string }
}

// Redirect de /listings/[id] a /properties/[id]
// Esto mantiene compatibilidad con links viejos
export default function ListingRedirectPage({ params }: PageProps) {
  // Si hay locale, incluirlo. Si no (default), no incluirlo
  const targetPath = params.locale && params.locale !== 'en' 
    ? `/${params.locale}/properties/${params.id}`
    : `/properties/${params.id}`
  
  nextRedirect(targetPath)
}
