import { redirect as nextRedirect } from 'next/navigation';
import { auth } from '@clerk/nextjs/server';
import { Link } from '@/i18n/routing';
import { Button } from '@/components/ui/button';
import { UserMenu } from '@/components/dashboard/UserMenu';
import { SettingsContent } from '@/components/settings/SettingsContent';
import { getTranslations, getLocale } from 'next-intl/server';
import { 
  ArrowLeft, Settings, Search
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function SettingsPage() {
  const { userId } = await auth();
  const t = await getTranslations('dashboard');
  const locale = await getLocale();

  if (!userId) {
    nextRedirect(`/${locale}/sign-in`);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30">
      {/* Navigation */}
      <nav className="bg-white/95 backdrop-blur-lg border-b-2 border-gray-200 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="p-1.5 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl group-hover:scale-110 transition-transform">
                <svg width="24" height="24" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M 30 45 L 50 30 L 70 45 L 70 70 L 30 70 Z" fill="white"/>
                  <path d="M 25 45 L 50 25 L 75 45" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                  <rect x="44" y="55" width="12" height="15" fill="#2563eb" rx="1"/>
                </svg>
              </div>
              <span className="font-black text-xl bg-gradient-to-r from-gray-900 to-blue-900 bg-clip-text text-transparent">
                inhabitme
              </span>
            </Link>
            <div className="flex items-center gap-3">
              <Link href="/search">
                <Button variant="ghost" className="font-semibold">
                  <Search className="h-4 w-4 mr-2" />
                  {t('searchButton')}
                </Button>
              </Link>
              <UserMenu />
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        
        {/* Header */}
        <div className="mb-8">
          <Link href="/dashboard">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver al Dashboard
            </Button>
          </Link>
          
          <div className="flex items-center gap-4 mb-3">
            <div className="p-3 bg-gradient-to-br from-blue-100 to-purple-200 rounded-2xl">
              <Settings className="h-8 w-8 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl lg:text-4xl font-black text-gray-900">
                Configuración
              </h1>
              <p className="text-gray-600 mt-1">
                Administra tu cuenta y preferencias
              </p>
            </div>
          </div>
        </div>

        {/* Settings Content */}
        <SettingsContent />

        {/* Help Section */}
        <div className="mt-12 bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8 text-center border-2 border-blue-200">
          <h3 className="text-2xl font-black text-gray-900 mb-2">
            ¿Necesitas ayuda?
          </h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Si tienes preguntas o necesitas asistencia, nuestro equipo está aquí para ayudarte
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button variant="outline" className="border-2">
              Centro de Ayuda
            </Button>
            <Button variant="outline" className="border-2">
              Contactar Soporte
            </Button>
          </div>
        </div>

      </main>
    </div>
  );
}
