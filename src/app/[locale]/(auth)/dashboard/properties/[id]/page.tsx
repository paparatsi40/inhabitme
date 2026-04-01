import { redirect as nextRedirect } from 'next/navigation';

type PageProps = {
  params: Promise<{ id: string; locale: string }>
}

export default async function PropertyDetailPage({ 
  params 
}: PageProps) {
  const { id, locale } = await params
  
  // Validar que tenemos los valores necesarios
  if (!id || !locale) {
    console.error('[DashboardProperty] Missing params:', { id, locale })
    nextRedirect('/en/dashboard')
  }
  
  // Redirigir a la página pública de la propiedad con locale
  nextRedirect(`/${locale}/properties/${id}`);
}
