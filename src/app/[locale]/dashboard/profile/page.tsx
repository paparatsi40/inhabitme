import { redirect as nextRedirect } from 'next/navigation';
import { auth } from '@clerk/nextjs/server';
import { Link } from '@/i18n/routing';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Search } from 'lucide-react';
import { UserMenu } from '@/components/dashboard/UserMenu';
import { UserProfile } from '@clerk/nextjs';
import { getLocale, getTranslations } from 'next-intl/server';

export const dynamic = 'force-dynamic';

export default async function ProfilePage() {
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
          <Link href="/dashboard/settings">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver a Configuración
            </Button>
          </Link>

          {/* Info Banner */}
          <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 mb-6">
            <h3 className="font-bold text-blue-900 mb-2">💡 Cómo cambiar tu email o teléfono</h3>
            <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
              <li>Usa el botón <strong>&quot;+ Add email address&quot;</strong> o <strong>&quot;+ Add phone number&quot;</strong></li>
              <li>Verifica el nuevo contacto (recibirás un código)</li>
              <li>Márcalo como <strong>&quot;Primary&quot;</strong> usando el menú (⋮)</li>
              <li>Opcionalmente, elimina el anterior si ya no lo necesitas</li>
            </ol>
            <p className="text-xs text-blue-700 mt-2">
              ℹ️ Por seguridad, no se puede editar directamente. Debes agregar y verificar el nuevo antes de eliminar el anterior.
            </p>
          </div>
        </div>

        {/* Clerk UserProfile Component */}
        <div className="flex justify-center">
          <UserProfile 
            appearance={{
              elements: {
                rootBox: "w-full",
                card: "shadow-lg border-2 border-gray-200",
              }
            }}
          />
        </div>

      </main>
    </div>
  );
}
