import { Link } from '@/i18n/routing';
import { redirect as nextRedirect } from 'next/navigation';
import { auth, currentUser, clerkClient } from '@clerk/nextjs/server';
import { getSupabaseServerClient } from '@/lib/supabase/server';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UserMenu } from '@/components/dashboard/UserMenu';
import Image from 'next/image';
import { getTranslations, getLocale } from 'next-intl/server';
import { 
  Building2, Search, Calendar, Settings, User, ArrowRight, 
  Mail, TrendingUp, Eye, CheckCircle, Plus, Inbox 
} from 'lucide-react';
import { getCurrencyFromLocation, normalizeCurrency } from '@/lib/currency';

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const { userId } = await auth();
  const user = await currentUser()
  const userEmail = user?.primaryEmailAddress?.emailAddress?.toLowerCase() ?? null
  const t = await getTranslations('dashboard');
  const locale = await getLocale();

  if (!userId) {
    nextRedirect(`/${locale}/sign-in`);
  }

  console.log('[Dashboard] userId:', userId);

  // Obtener stats del usuario
  const supabase = getSupabaseServerClient();

  // Compatibilidad legacy: algunos registros guardan owner_id como User.id (tabla legacy "User")
  let legacyUserId: string | null = null
  let canonicalClerkId: string | null = null

  const { data: legacyUserRow } = await supabase
    .from('User')
    .select('id, clerkId, email')
    .eq('clerkId', userId)
    .maybeSingle()

  let emailLinkedLegacyIds: string[] = []
  let emailLinkedCanonicalClerkIds: string[] = []

  if (legacyUserRow) {
    legacyUserId = (legacyUserRow as any)?.id ?? null
    canonicalClerkId = (legacyUserRow as any)?.clerkId ?? null
  }

  if (userEmail) {
    // Tomar TODOS los usuarios legacy con ese email (pueden existir duplicados históricos)
    const { data: legacyUsersByEmail } = await supabase
      .from('User')
      .select('id, clerkId, email')
      .eq('email', userEmail)

    emailLinkedLegacyIds = (legacyUsersByEmail || [])
      .map((u: any) => u?.id)
      .filter(Boolean)
      .map((v: any) => String(v))

    emailLinkedCanonicalClerkIds = (legacyUsersByEmail || [])
      .map((u: any) => u?.clerkId)
      .filter(Boolean)
      .map((v: any) => String(v))
  }

  let emailLinkedClerkIds: string[] = []
  if (userEmail) {
    try {
      const client = await clerkClient()
      const users = await client.users.getUserList({ emailAddress: [userEmail], limit: 10 })
      emailLinkedClerkIds = (users.data || []).map((u: any) => String(u.id))
    } catch (error) {
      console.error('[Dashboard] error resolving email-linked Clerk ids:', error)
    }
  }

  const ownerIds = Array.from(
    new Set([
      userId,
      canonicalClerkId,
      legacyUserId,
      ...emailLinkedLegacyIds,
      ...emailLinkedCanonicalClerkIds,
      ...emailLinkedClerkIds,
    ].filter(Boolean) as string[])
  )
  console.log('[Dashboard] ownerIds used for queries:', ownerIds)
  
  // Obtener propiedades del owner (exact match), con fallback robusto para datos legacy
  let ownedProperties: any[] = []
  const { data: exactProperties, error: exactPropertiesError } = await supabase
    .from('listings')
    .select('*')
    .in('owner_id', ownerIds)
    .order('created_at', { ascending: false })

  if (exactPropertiesError) {
    console.error('[Dashboard] exact owner query error:', exactPropertiesError)
  }

  ownedProperties = exactProperties ?? []

  // Fallback final: reconciliar contra campos legacy comunes
  if (ownedProperties.length === 0) {
    const { data: allListings, error: allListingsError } = await supabase
      .from('listings')
      .select('*')
      .order('created_at', { ascending: false })

    if (allListingsError) {
      console.error('[Dashboard] fallback all listings query error:', allListingsError)
    } else {
      const ownerSet = new Set(ownerIds.map((v) => String(v)))
      ownedProperties = (allListings ?? []).filter((listing: any) => {
        const candidates = [
          listing.owner_id,
          listing.host_user_id,
          listing.created_by,
          listing.user_id,
          listing.clerk_id,
        ]
          .filter(Boolean)
          .map((v: any) => String(v))

        return candidates.some((value) => ownerSet.has(value))
      })

      if (ownedProperties.length > 0) {
        console.log('[Dashboard] recovered properties via legacy field reconciliation:', ownedProperties.length)
      }
    }
  }

  const propertiesCount = ownedProperties.length
  console.log('[Dashboard] propertiesCount:', propertiesCount)

  const ownedListingIds = ownedProperties.map((p: any) => p.id)

  // Count de inquiries (availability_leads)
  let leadsCount = 0
  let newInquiriesCount = 0
  let recentInquiries: any[] = []

  if (ownedListingIds.length > 0) {
    const { count } = await supabase
      .from('availability_leads')
      .select('*', { count: 'exact', head: true })
      .in('listing_id', ownedListingIds)
    leadsCount = count ?? 0

    const { data: inquiriesData } = await supabase
      .from('availability_leads')
      .select('id, listing_id, city, neighborhood, start_date, duration_months, email, score_label, paid, created_at')
      .in('listing_id', ownedListingIds)
      .order('created_at', { ascending: false })
      .limit(6)

    recentInquiries = inquiriesData || []

    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
    newInquiriesCount = recentInquiries.filter((item: any) => new Date(item.created_at) >= sevenDaysAgo).length
  }
  
  // Count de bookings pendientes como host
  const { count: bookingsCount } = await supabase
    .from('bookings')
    .select('*', { count: 'exact', head: true })
    .eq('host_id', userId)
    .eq('status', 'pending_host_approval');
  
  // Stats de vistas
  const viewsOwnerIds = Array.from(new Set([...ownerIds, ...ownedProperties.map((p: any) => p.owner_id).filter(Boolean)]))
  const viewsStatsResults = await Promise.all(
    viewsOwnerIds.map((ownerId) =>
      supabase
        .rpc('get_owner_views_stats', { p_owner_id: ownerId })
        .single()
    )
  )
  const totalViews = viewsStatsResults.reduce((sum, result) => {
    const views = Number((result.data as any)?.total_views || 0)
    return sum + (Number.isFinite(views) ? views : 0)
  }, 0)
  
  const viewsStats = {
    total_views: totalViews
  };
  
  // Obtener propiedades para mostrar
  const properties = ownedProperties.slice(0, 3)

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
          <Link href="/dashboard/properties">
            <div className="bg-white rounded-2xl p-6 shadow-sm border-2 border-blue-100 hover:shadow-lg hover:border-blue-400 transition-all cursor-pointer">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl">
                  <Building2 className="h-6 w-6 text-blue-600" />
                </div>
                <TrendingUp className="h-5 w-5 text-green-600" />
              </div>
              <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-1">{t('properties')}</p>
              <p className="text-4xl font-black text-gray-900">{propertiesCount ?? 0}</p>
            </div>
          </Link>

          {/* New inquiries */}
          <Link href="/dashboard/properties">
            <div className="bg-white rounded-2xl p-6 shadow-sm border-2 border-green-100 hover:shadow-lg hover:border-green-400 transition-all cursor-pointer">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-green-100 to-emerald-200 rounded-xl">
                  <Inbox className="h-6 w-6 text-green-600" />
                </div>
                {newInquiriesCount > 0 ? (
                  <div className="bg-green-500 text-white text-xs font-bold rounded-full px-2 h-6 min-w-6 flex items-center justify-center animate-pulse">
                    {newInquiriesCount}
                  </div>
                ) : null}
              </div>
              <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-1">{t('newInquiries')}</p>
              <p className="text-4xl font-black text-gray-900">{newInquiriesCount}</p>
            </div>
          </Link>

          {/* Leads */}
          <Link href="/dashboard/properties">
            <div className="bg-white rounded-2xl p-6 shadow-sm border-2 border-purple-100 hover:shadow-lg hover:border-purple-400 transition-all cursor-pointer">
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
          </Link>

          {/* Vistas */}
          <Link href="/dashboard/analytics">
            <div className="bg-white rounded-2xl p-6 shadow-sm border-2 border-orange-100 hover:shadow-lg hover:border-orange-400 transition-all cursor-pointer">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-orange-100 to-orange-200 rounded-xl">
                  <Eye className="h-6 w-6 text-orange-600" />
                </div>
                {viewsStats.total_views > 0 ? (
                  <TrendingUp className="h-5 w-5 text-orange-600" />
                ) : null}
              </div>
              <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-1">{t('views')}</p>
              <p className="text-4xl font-black text-gray-900">{viewsStats.total_views?.toLocaleString() || 0}</p>
            </div>
          </Link>
          
        </div>

        {/* New inquiries block */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl lg:text-3xl font-black text-gray-900">{t('newInquiries')}</h2>
              <p className="text-gray-600 mt-1">{t('inquiriesSubtitle')}</p>
            </div>
          </div>

          {recentInquiries.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {recentInquiries.map((inquiry: any) => {
                const listing = ownedProperties.find((p: any) => p.id === inquiry.listing_id)
                return (
                  <div key={inquiry.id} className="bg-white rounded-2xl p-5 shadow-sm border-2 border-gray-200 hover:border-blue-300 transition-all">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">{t('inquiry')}</span>
                      <span className={`text-xs font-bold px-2 py-1 rounded-full ${inquiry.score_label === 'HOT' ? 'bg-red-100 text-red-700' : inquiry.score_label === 'WARM' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-700'}`}>
                        {inquiry.score_label || 'NEW'}
                      </span>
                    </div>
                    <h3 className="font-bold text-gray-900 line-clamp-1 mb-1">{listing?.title || t('property')}</h3>
                    <p className="text-sm text-gray-600 mb-1">{t('lookingFor')}: {inquiry.duration_months || 1} {t('months')}</p>
                    <p className="text-sm text-gray-600 mb-3">{t('start')}: {inquiry.start_date ? new Date(inquiry.start_date).toLocaleDateString(locale === 'en' ? 'en-US' : 'es-ES', { month: 'short', day: 'numeric' }) : '-'}</p>
                    <p className="text-xs text-gray-500 line-clamp-2 mb-3">
                      {String(inquiry.source || '').includes('inquiry_form:')
                        ? String(inquiry.source).replace('inquiry_form:', '')
                        : t('inquiryReceived')}
                    </p>
                    <div className="flex items-center justify-between gap-2">
                      <a href={`mailto:${inquiry.email || ''}`} className="text-sm font-semibold text-blue-600 hover:text-blue-700">
                        {t('reply')}
                      </a>
                      <Link href="/dashboard/properties" className="text-sm font-semibold text-gray-700 hover:text-gray-900">
                        {t('viewProfile')}
                      </Link>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-8 border-2 border-dashed border-gray-300">
              <h3 className="text-xl font-bold text-gray-900 mb-2">{t('noInquiriesYet')}</h3>
              <p className="text-gray-600 mb-4">{t('noInquiriesHelp')}</p>
              <Link href="/dashboard/properties">
                <Button variant="outline" className="font-semibold">{t('improveListing')}</Button>
              </Link>
            </div>
          )}
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
                const currency = normalizeCurrency((property as any).currency ?? getCurrencyFromLocation((property as any).city_country, (property as any).city_name))
                const moneyLocale = currency === 'EUR' ? 'es-ES' : 'en-US'
                const monthlyPriceFormatted = new Intl.NumberFormat(moneyLocale, { style: 'currency', currency }).format(Number((property as any).monthly_price || 0))

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
                          {monthlyPriceFormatted}
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
                        <Link href={`/dashboard/properties/${property.id}` as any} className="flex-1">
                          <Button size="sm" variant="secondary" className="w-full">
                            📣 {t('promoteListing')}
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

        {/* Trust block */}
        <div className="mb-10 bg-white rounded-2xl border-2 border-blue-100 p-6">
          <h3 className="text-xl font-black text-gray-900 mb-4">{t('howItWorksTitle')}</h3>
          <div className="grid md:grid-cols-3 gap-3 text-sm font-semibold text-gray-700">
            <div>✔ {t('howItWorksFree')}</div>
            <div>✔ {t('howItWorksPayOnTenant')}</div>
            <div>✔ {t('howItWorksStayTerms')}</div>
          </div>
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
                {t('bookingRequests')}
              </h3>
              <p className="text-sm text-gray-600">
                {t('manageBookingRequests')}
              </p>
            </div>
          </Link>

        </div>

      </main>
    </div>
  );
}