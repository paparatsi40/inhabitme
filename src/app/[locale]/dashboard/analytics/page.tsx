import { redirect as nextRedirect } from 'next/navigation';
import { auth } from '@clerk/nextjs/server';
import { getSupabaseServerClient } from '@/lib/supabase/server';
import { Link } from '@/i18n/routing';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UserMenu } from '@/components/dashboard/UserMenu';
import { getTranslations, getLocale } from 'next-intl/server';
import { 
  Eye, TrendingUp, Users, Monitor, Smartphone, 
  ArrowLeft, Calendar, BarChart3, Search
} from 'lucide-react';
import Image from 'next/image';

export const dynamic = 'force-dynamic';

interface ViewsStats {
  total_views: number;
  unique_sessions: number;
  views_today: number;
  views_this_week: number;
  views_this_month: number;
  avg_views_per_listing: number;
}

interface PropertyViewsData {
  listing_id: string;
  title: string;
  total_views: number;
  unique_sessions: number;
  views_last_7_days: number;
  views_last_30_days: number;
  mobile_views: number;
  desktop_views: number;
  last_viewed_at: string | null;
}

export default async function AnalyticsPage() {
  const { userId } = await auth();
  const t = await getTranslations('dashboard');
  const locale = await getLocale();

  if (!userId) {
    nextRedirect(`/${locale}/sign-in`);
  }

  const supabase = getSupabaseServerClient();

  // Obtener estadísticas globales del owner
  const { data: statsData } = await supabase
    .rpc('get_owner_views_stats', { p_owner_id: userId })
    .single();

  const defaultStats: ViewsStats = {
    total_views: 0,
    unique_sessions: 0,
    views_today: 0,
    views_this_week: 0,
    views_this_month: 0,
    avg_views_per_listing: 0,
  };

  const stats: ViewsStats = statsData ? (statsData as ViewsStats) : defaultStats;

  // Obtener vistas por propiedad
  const { data: propertiesViews } = await supabase
    .from('listing_views_summary')
    .select('*')
    .eq('owner_id', userId)
    .order('total_views', { ascending: false });

  const properties: PropertyViewsData[] = propertiesViews || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-orange-50/30">
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
            <div className="p-3 bg-gradient-to-br from-orange-100 to-orange-200 rounded-2xl">
              <Eye className="h-8 w-8 text-orange-600" />
            </div>
            <div>
              <h1 className="text-3xl lg:text-4xl font-black text-gray-900">
                Analytics de Vistas
              </h1>
              <p className="text-gray-600 mt-1">
                Monitorea el rendimiento de tus propiedades
              </p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          
          {/* Total Views */}
          <Card className="border-2 border-orange-100 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                Total de Vistas
              </CardTitle>
              <Eye className="h-5 w-5 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-black text-gray-900">
                {stats.total_views.toLocaleString()}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {stats.unique_sessions.toLocaleString()} sesiones únicas
              </p>
            </CardContent>
          </Card>

          {/* This Week */}
          <Card className="border-2 border-blue-100 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                Esta Semana
              </CardTitle>
              <TrendingUp className="h-5 w-5 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-black text-gray-900">
                {stats.views_this_week.toLocaleString()}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {stats.views_today} hoy
              </p>
            </CardContent>
          </Card>

          {/* This Month */}
          <Card className="border-2 border-purple-100 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                Este Mes
              </CardTitle>
              <Calendar className="h-5 w-5 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-black text-gray-900">
                {stats.views_this_month.toLocaleString()}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Promedio: {stats.avg_views_per_listing.toFixed(1)} por propiedad
              </p>
            </CardContent>
          </Card>

        </div>

        {/* Properties Table */}
        <div className="bg-white rounded-2xl shadow-sm border-2 border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <BarChart3 className="h-6 w-6 text-gray-700" />
              <h2 className="text-2xl font-black text-gray-900">
                Vistas por Propiedad
              </h2>
            </div>
            <p className="text-gray-600 mt-1">
              Rendimiento detallado de cada una de tus propiedades
            </p>
          </div>

          {properties.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Propiedad
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">
                      <Eye className="h-4 w-4 inline mr-1" />
                      Total
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">
                      <Users className="h-4 w-4 inline mr-1" />
                      Sesiones
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Últimos 7d
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Últimos 30d
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">
                      <Monitor className="h-4 w-4 inline mr-1" />
                      Desktop
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">
                      <Smartphone className="h-4 w-4 inline mr-1" />
                      Mobile
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {properties.map((property) => (
                    <tr key={property.listing_id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4">
                        <Link href={`/dashboard/properties/${property.listing_id}` as any}>
                          <div className="font-semibold text-gray-900 hover:text-blue-600 transition cursor-pointer">
                            {property.title}
                          </div>
                        </Link>
                        {property.last_viewed_at && (
                          <div className="text-xs text-gray-500 mt-1">
                            Última vista: {new Date(property.last_viewed_at).toLocaleDateString('es-ES')}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="text-lg font-bold text-gray-900">
                          {property.total_views.toLocaleString()}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="text-gray-700">
                          {property.unique_sessions.toLocaleString()}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-sm font-semibold">
                          {property.views_last_7_days}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="inline-flex items-center px-3 py-1 rounded-full bg-purple-100 text-purple-800 text-sm font-semibold">
                          {property.views_last_30_days}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="text-gray-700">
                          {property.desktop_views}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="text-gray-700">
                          {property.mobile_views}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            /* Empty State */
            <div className="p-12 text-center">
              <div className="inline-flex p-6 bg-gray-100 rounded-full mb-4">
                <Eye className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                No hay vistas registradas
              </h3>
              <p className="text-gray-600 mb-6">
                Comparte tus propiedades para empezar a recibir visitas
              </p>
              <Link href="/dashboard/properties">
                <Button>
                  Ver Mis Propiedades
                </Button>
              </Link>
            </div>
          )}
        </div>

      </main>
    </div>
  );
}
