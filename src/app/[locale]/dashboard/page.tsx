import { Link } from '@/i18n/routing';
import { redirect as nextRedirect } from 'next/navigation';
import { auth } from '@clerk/nextjs/server';
import { getSupabaseServerClient } from '@/lib/supabase/server';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UserMenu } from '@/components/dashboard/UserMenu';
import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import { 
  Building2, Search, Calendar, Settings, User, ArrowRight, 
  Mail, TrendingUp, Eye, CheckCircle, Plus, Inbox 
} from 'lucide-react';

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const { userId } = await auth();
  const t = await getTranslations('dashboard');

  if (!userId) {
    nextRedirect('/sign-in');
  }

  // Obtener stats del usuario
  const supabase = getSupabaseServerClient();
  
  // Count de propiedades
  const { count: propertiesCount } = await supabase
    .from('listings')
    .select('*', { count: 'exact', head: true })
    .eq('owner_id', userId);
  
  // Count de leads recibidos
  const { count: leadsCount } = await supabase
    .from('property_leads')
    .select('*, listings!inner(*)', { count: 'exact', head: true })
    .eq('listings.owner_id', userId);
  
  // Count de bookings pendientes como host
  const { count: bookingsCount } = await supabase
    .from('bookings')
    .select('*', { count: 'exact', head: true })
    .eq('host_id', userId)
    .eq('status', 'pending_host_approval');
  
  // Obtener propiedades para mostrar
  const { data: properties } = await supabase
    .from('listings')
    .select('*')
    .eq('owner_id', userId)
    .order('created_at', { ascending: false })
    .limit(3);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30">
      {/* Navigation PREMIUM */}
      <nav className="bg-white/95 backdrop-blur-lg border-b-2 border-gray-200 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="p-1.5 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl group-hover:scale-110 transition-transform">
                <svg width="24" height="24" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                  {/* House shape */}
                  <path d="M 30 45 L 50 30 L 70 45 L 70 70 L 30 70 Z" fill="white"/>
                  {/* Roof */}
                  <path d="M 25 45 L 50 25 L 75 45" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                  {/* Door */}
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
                  Buscar
                </Button>
              </Link>
              <UserMenu />
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        
        {/* Hero Welcome */}
        <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-blue-700 rounded-3xl p-8 lg:p-12 mb-8 text-white shadow-2xl">
          <h1 className="text-3xl lg:text-5xl font-black mb-3">
            {t('hello')}
          </h1>
          <p className="text-lg lg:text-xl opacity-90 mb-6">
            {t('subtitle')}
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/dashboard/properties">
              <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white/10 font-semibold">
                {t('viewProperties')}
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Cards PREMIUM */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          
          {/* Propiedades */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border-2 border-blue-100 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl">
                <Building2 className="h-6 w-6 text-blue-600" />
              </div>
              <TrendingUp className="h-5 w-5 text-green-600" />
            </div>
            <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-1">{t('properties')}</p>
            <p className="text-4xl font-black text-gray-900">{propertiesCount ?? 0}</p>
          </div>

          {/* Solicitudes de Reserva Pendientes */}
          <Link href="/host/bookings">
            <div className="bg-white rounded-2xl p-6 shadow-sm border-2 border-green-100 hover:shadow-lg hover:border-green-400 transition-all cursor-pointer">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-green-100 to-emerald-200 rounded-xl">
                  <Inbox className="h-6 w-6 text-green-600" />
                </div>
                {bookingsCount && bookingsCount > 0 ? (
                  <div className="bg-green-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center animate-pulse">
                    {bookingsCount}
                  </div>
                ) : null}
              </div>
              <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-1">Reservas Pendientes</p>
              <p className="text-4xl font-black text-gray-900">{bookingsCount ?? 0}</p>
            </div>
          </Link>

          {/* Leads */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border-2 border-purple-100 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl">
                <Mail className="h-6 w-6 text-purple-600" />
              </div>
              {leadsCount && leadsCount > 0 ? (
                <CheckCircle className="h-5 w-5 text-purple-600" />
              ) : null}
            </div>
            <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-1">{t('leadsReceived')}</p>
            <p className="text-4xl font-black text-gray-900">{leadsCount ?? 0}</p>
          </div>

          {/* Vistas (placeholder) */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border-2 border-orange-100 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-orange-100 to-orange-200 rounded-xl">
                <Eye className="h-6 w-6 text-orange-600" />
              </div>
            </div>
            <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-1">{t('views')}</p>
            <p className="text-4xl font-black text-gray-900">—</p>
            <p className="text-xs text-gray-500 mt-1">{t('comingSoon')}</p>
          </div>
          
        </div>

        {/* Tus Propiedades */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl lg:text-3xl font-black text-gray-900">{t('yourProperties')}</h2>
              <p className="text-gray-600 mt-1">{t('manageListings')}</p>
            </div>
            <Link href="/dashboard/properties">
              <Button variant="outline" className="border-2 border-gray-300 hover:border-blue-500 font-semibold">
                {t('viewAll')}
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </div>

          {properties && properties.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {properties.map((property) => {
                const mainImage = property.images && property.images.length > 0 
                  ? property.images[0] 
                  : null;
                
                return (
                  <div key={property.id} className="group bg-white rounded-2xl overflow-hidden shadow-sm border-2 border-gray-200 hover:border-blue-400 hover:shadow-xl transition-all">
                    {/* Image */}
                    <Link href={`/dashboard/properties/${property.id}` as any}>
                      <div className="aspect-video bg-gradient-to-br from-blue-100 to-purple-100 relative overflow-hidden cursor-pointer">
                        {mainImage ? (
                          <Image
                            src={mainImage}
                            alt={property.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Building2 className="h-12 w-12 text-blue-400" />
                          </div>
                        )}
                      </div>
                    </Link>
                    
                    {/* Content */}
                    <div className="p-5">
                      <Link href={`/dashboard/properties/${property.id}` as any}>
                        <h3 className="font-bold text-lg text-gray-900 mb-2 hover:text-blue-600 transition line-clamp-1 cursor-pointer">
                          {property.title}
                        </h3>
                      </Link>
                      <p className="text-sm text-gray-600 mb-4 line-clamp-1">
                        📍 {property.city_name}
                      </p>
                      
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-2xl font-black text-gray-900">
                          €{property.monthly_price}
                          <span className="text-sm font-medium text-gray-600">{t('perMonth')}</span>
                        </span>
                      </div>
                      
                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        <Link href={`/dashboard/properties/${property.id}/edit` as any} className="flex-1">
                          <Button size="sm" variant="outline" className="w-full">
                            ✏️ Edit
                          </Button>
                        </Link>
                        <Link href={`/dashboard/properties/${property.id}/customize` as any} className="flex-1">
                          <Button 
                            size="sm" 
                            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                          >
                            🎨 Design
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* Empty State */
            <div className="bg-gradient-to-br from-gray-50 to-blue-50/30 rounded-3xl border-2 border-dashed border-gray-300 p-12 text-center">
              <div className="inline-flex p-6 bg-white rounded-3xl shadow-lg mb-6">
                <Building2 className="h-16 w-16 text-gray-400" />
              </div>
              <h3 className="text-2xl font-black mb-3 text-gray-900">
                {t('noProperties')}
              </h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                {t('noPropertiesDesc')}
              </p>
            </div>
          )}
        </div>

        {/* Quick Links */}
        <div className="grid md:grid-cols-3 gap-6">
          
          <Link href="/search" className="group">
            <div className="bg-white rounded-2xl p-6 shadow-sm border-2 border-gray-200 hover:border-blue-400 hover:shadow-lg transition-all">
              <div className="inline-flex p-3 bg-blue-100 rounded-xl mb-4 group-hover:scale-110 transition-transform">
                <Search className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-bold text-lg mb-2 group-hover:text-blue-600 transition">
                {t('searchAccommodation')}
              </h3>
              <p className="text-sm text-gray-600">
                {t('findNextHome')}
              </p>
            </div>
          </Link>

          <Link href="/dashboard/properties" className="group">
            <div className="bg-white rounded-2xl p-6 shadow-sm border-2 border-gray-200 hover:border-purple-400 hover:shadow-lg transition-all">
              <div className="inline-flex p-3 bg-purple-100 rounded-xl mb-4 group-hover:scale-110 transition-transform">
                <Building2 className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-bold text-lg mb-2 group-hover:text-purple-600 transition">
                {t('myProperties')}
              </h3>
              <p className="text-sm text-gray-600">
                {t('manageLeads')}
              </p>
            </div>
          </Link>

          <Link href="/host/bookings" className="group">
            <div className="bg-white rounded-2xl p-6 shadow-sm border-2 border-gray-200 hover:border-green-400 hover:shadow-lg transition-all">
              <div className="inline-flex p-3 bg-green-100 rounded-xl mb-4 group-hover:scale-110 transition-transform">
                <Calendar className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-bold text-lg mb-2 group-hover:text-green-600 transition">
                Solicitudes de Reserva
              </h3>
              <p className="text-sm text-gray-600">
                Gestiona las solicitudes de tus propiedades
              </p>
            </div>
          </Link>

        </div>

      </main>
    </div>
  );
}