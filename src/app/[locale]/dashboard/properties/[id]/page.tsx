import { redirect as nextRedirect } from 'next/navigation';

export default function PropertyDetailPage({ 
  params 
}: { 
  params: { id: string; locale: string } 
}) {
  // Redirigir a la página pública de la propiedad con locale
  nextRedirect(`/${params.locale}/properties/${params.id}`);
}
