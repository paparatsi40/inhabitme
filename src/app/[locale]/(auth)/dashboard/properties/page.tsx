import { auth, currentUser, clerkClient } from '@clerk/nextjs/server'
import { Link } from '@/i18n/routing'
import { redirect } from 'next/navigation'
import Image from 'next/image'
import { getSupabaseServerClient } from '@/lib/supabase/server'
import { 
  Building2, ArrowLeft, Plus, Eye, Pencil, Mail, TrendingUp, 
  CheckCircle, Clock, Calendar, Trash2 
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { UserMenu } from '@/components/dashboard/UserMenu'
import { PropertyActions } from '@/components/dashboard/PropertyActions'
import { FeaturedToggle } from '@/components/dashboard/FeaturedToggle'
import { getTranslations } from 'next-intl/server'
import { getLocale } from 'next-intl/server'
import { getCurrencyFromLocation, normalizeCurrency } from '@/lib/currency'

export default async function MyPropertiesPage() {
  const { userId } = await auth()
  const user = await currentUser()
  const userEmail = user?.primaryEmailAddress?.emailAddress?.toLowerCase() ?? null
  const locale = await getLocale()
  const t = await getTranslations({ locale, namespace: 'dashboard' })

  if (!userId) {
    redirect('/sign-in')
  }

  // Obtener propiedades del usuario con leads
  const supabase = getSupabaseServerClient()

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
      console.error('[MyProperties] error resolving email-linked Clerk ids:', error)
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
  console.log('[MyProperties] ownerIds used for queries:', ownerIds)
  
  // Primero obtener solo las propiedades (sin joins)
  let properties: any[] = []

  const { data: exactProperties, error: propertiesError } = await supabase
    .from('listings')
    .select('*')
    .in('owner_id', ownerIds)
    .order('created_at', { ascending: false })

  properties = exactProperties ?? []

  // Fallback final: reconciliar contra campos legacy comunes
  if (properties.length === 0) {
    const { data: allListings, error: allListingsError } = await supabase
      .from('listings')
      .select('*')
      .order('created_at', { ascending: false })

    if (allListingsError) {
      console.error('[MyProperties] fallback all listings query error:', allListingsError)
    } else {
      const ownerSet = new Set(ownerIds.map((v) => String(v)))
      properties = (allListings ?? []).filter((listing: any) => {
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

      if (properties.length > 0) {
        console.log('[MyProperties] recovered properties via legacy field reconciliation:', properties.length)
      }
    }
  }

  // DEBUG: Logging para ver qué está pasando
  console.log('[MyProperties] userId:', userId)
  console.log('[MyProperties] properties count:', properties?.length)
  console.log('[MyProperties] error:', propertiesError)
  if (properties && properties.length > 0) {
    console.log('[MyProperties] First property:', properties[0])
  }

  if (propertiesError) {
    console.error('[MyProperties] Error loading properties:', propertiesError)
  }

  // Ahora obtener leads para cada propiedad (sin relación)
  const propertiesWithLeads = properties ? await Promise.all(
    properties.map(async (property) => {
      const { data: leads } = await supabase
        .from('property_leads')
        .select('id, guest_email, amount_paid, status, created_at')
        .eq('listing_id', property.id)
        .order('created_at', { ascending: false })
      
      return {
        ...property,
        property_leads: leads || []
      }
    })
  ) : []

  const propertiesCount = propertiesWithLeads?.length ?? 0
  const totalLeads = propertiesWithLeads?.reduce((sum, p) => sum + (p.property_leads?.length || 0), 0) || 0

  const defaultCurrency = locale === 'en' ? 'USD' : 'EUR'
  const defaultMoneyLocale = locale === 'en' ? 'en-US' : 'es-ES'
  const totalRevenue = totalLeads * 15
  const totalRevenueFormatted = new Intl.NumberFormat(defaultMoneyLocale, {
    style: 'currency',
    currency: defaultCurrency,
  }).format(totalRevenue)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30">
      {/* Header PREMIUM */}
      <div className="bg-white/95 backdrop-blur-lg border-b-2 border-gray-200 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/dashboard" className="flex items-center gap-2 text-gray-600 hover:text-gray-900 font-semibold transition">
              <ArrowLeft className="h-4 w-4" />
              {t('backToDashboard')}
            </Link>
            
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl">
                <Building2 className="h-6 w-6 text-blue-600" />
              </div>
              <h1 className="text-xl font-black">{t('myPropertiesTitle')}</h1>
            </div>

            <div className="flex items-center gap-3">
              <Link href="/properties/new">
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 font-bold">
                  <Plus className="h-4 w-4 mr-2" />
                  {t('newProperty')}
                </Button>
              </Link>
              <UserMenu />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Stats Hero */}
        <div className="grid sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-sm border-2 border-blue-100">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Building2 className="h-5 w-5 text-blue-600" />
              </div>
              <span className="text-sm font-semibold text-gray-600 uppercase tracking-wide">{t('propertiesCount')}</span>
            </div>
            <p className="text-3xl font-black text-gray-900">{propertiesCount}</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border-2 border-green-100">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-green-100 rounded-lg">
                <Mail className="h-5 w-5 text-green-600" />
              </div>
              <span className="text-sm font-semibold text-gray-600 uppercase tracking-wide">{t('totalLeads')}</span>
            </div>
            <p className="text-3xl font-black text-gray-900">{totalLeads}</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border-2 border-purple-100">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-purple-100 rounded-lg">
                <TrendingUp className="h-5 w-5 text-purple-600" />
              </div>
              <span className="text-sm font-semibold text-gray-600 uppercase tracking-wide">{t('income')}</span>
            </div>
            <p className="text-3xl font-black text-gray-900">{totalRevenueFormatted}</p>
          </div>
        </div>

        {/* Properties List PREMIUM */}
        {propertiesCount === 0 ? (
          /* Empty State */
          <div className="bg-gradient-to-br from-gray-50 to-blue-50/30 rounded-3xl border-2 border-dashed border-gray-300 p-12 text-center">
            <div className="inline-flex p-6 bg-white rounded-3xl shadow-lg mb-6">
              <Building2 className="h-16 w-16 text-gray-400" />
            </div>
            <h3 className="text-2xl font-black mb-3 text-gray-900">
              {t('noPropertiesYet')}
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              {t('publishFirstProperty')}
            </p>
            <Link href="/properties/new">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 font-bold shadow-lg">
                <Plus className="h-5 w-5 mr-2" />
                {t('publishFirstButton')}
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {propertiesWithLeads?.map((property) => {
              const mainImage = property.images && property.images.length > 0 
                ? property.images[0] 
                : null
              const leadsCount = property.property_leads?.length || 0
              const currency = normalizeCurrency((property as any).currency ?? getCurrencyFromLocation((property as any).city_country, (property as any).city_name))
              const moneyLocale = currency === 'EUR' ? 'es-ES' : 'en-US'
              const monthlyPriceFormatted = new Intl.NumberFormat(moneyLocale, { style: 'currency', currency }).format(Number((property as any).monthly_price || 0))

              return (
                <div key={property.id} className="bg-white rounded-2xl shadow-sm border-2 border-gray-200 hover:shadow-lg transition-shadow overflow-hidden">
                  <div className="grid lg:grid-cols-3 gap-0">
                    
                    {/* Property Info */}
                    <div className="lg:col-span-2 p-6">
                      <div className="flex gap-6">
                        {/* Image */}
                        <div className="flex-shrink-0">
                          <div className="w-32 h-32 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl overflow-hidden relative">
                            {mainImage ? (
                              <Image
                                src={mainImage}
                                alt={property.title}
                                fill
                                className="object-cover"
                                sizes="128px"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Building2 className="h-12 w-12 text-blue-400" />
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1 min-w-0 pr-4">
                              <h3 className="font-black text-xl text-gray-900 mb-2 line-clamp-1">
                                {property.title}
                              </h3>
                              <p className="text-sm text-gray-600 mb-2">
                                📍 {property.city_name}, {property.city_country}
                              </p>
                              <p className="text-sm text-gray-600">
                                🛏️ {property.bedrooms} {t('bedroomsAbbr')} • 🚿 {property.bathrooms} {t('bathroomsLabel', { count: property.bathrooms })}
                              </p>
                            </div>
                            
                            <div className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap ${
                              property.status === 'active' 
                                ? 'bg-green-100 text-green-700 border-2 border-green-200' 
                                : 'bg-gray-100 text-gray-600 border-2 border-gray-200'
                            }`}>
                              {property.status === 'active' ? t('active') : t('inactive')}
                            </div>

                            {property.status !== 'active' && (
                              <div className="ml-2 px-2 py-1 rounded-full text-[10px] font-semibold bg-amber-100 text-amber-700 border border-amber-200 whitespace-nowrap">
                                {t('notLive')}
                              </div>
                            )}
                          </div>

                          {/* Featured Toggle */}
                          <div className="mt-3">
                            <FeaturedToggle 
                              propertyId={property.id}
                              initialFeatured={property.featured || false}
                            />
                          </div>

                          {/* Stats mini */}
                          <div className="flex items-center gap-4 mt-4">
                            <div className="flex items-center gap-2">
                              <TrendingUp className="h-4 w-4 text-gray-400" />
                              <span className="text-lg font-bold text-gray-900">{monthlyPriceFormatted}</span>
                              <span className="text-sm text-gray-500">{t('perMonth')}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Mail className="h-4 w-4 text-gray-400" />
                              <span className="text-sm font-semibold text-gray-900">{leadsCount}</span>
                              <span className="text-sm text-gray-500">{leadsCount === 1 ? t('leads') : t('leadsPlural')}</span>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="mt-4">
                            <PropertyActions 
                              propertyId={property.id} 
                              propertyTitle={property.title}
                              propertyStatus={property.status}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Leads Section */}
                    <div className="lg:col-span-1 bg-gradient-to-br from-gray-50 to-blue-50/30 p-6 border-l-2 border-gray-200">
                      <h4 className="font-bold text-sm text-gray-600 uppercase tracking-wide mb-4 flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        {t('leadsSection')} ({leadsCount})
                      </h4>

                      {leadsCount === 0 ? (
                        <div className="text-center py-6">
                          <div className="inline-flex p-3 bg-white rounded-xl mb-3 shadow-sm">
                            <Mail className="h-8 w-8 text-gray-300" />
                          </div>
                          <p className="text-sm text-gray-500">{t('noLeads')}</p>
                        </div>
                      ) : (
                        <div className="space-y-3 max-h-48 overflow-y-auto">
                          {property.property_leads?.map((lead: any) => (
                            <div key={lead.id} className="bg-white rounded-xl p-3 shadow-sm border border-gray-200">
                              <div className="flex items-start gap-2 mb-2">
                                <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-semibold text-gray-900 truncate">
                                    {lead.guest_email}
                                  </p>
                                  <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                                    <Clock className="h-3 w-3" />
                                    {new Date(lead.created_at).toLocaleDateString(locale === 'en' ? 'en-US' : 'es-ES', { 
                                      day: 'numeric', 
                                      month: 'short' 
                                    })}
                                  </p>
                                </div>
                              </div>
                              <a 
                                href={`mailto:${lead.guest_email}`}
                                className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
                              >
                                <Mail className="h-3 w-3" />
                                {t('contactLead')}
                              </a>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                  </div>
                </div>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}
