import { auth, currentUser, clerkClient } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { Link } from '@/i18n/routing'
import { getSupabaseServerClient } from '@/lib/supabase/server'
import { getLocale, getTranslations } from 'next-intl/server'
import { Inbox, ArrowLeft, Flame, MessageSquare, CircleDollarSign, Mail, CalendarClock } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function HostInquiriesPage() {
  const { userId } = await auth()
  const user = await currentUser()
  const userEmail = user?.primaryEmailAddress?.emailAddress?.toLowerCase() ?? null
  const locale = await getLocale()
  const t = await getTranslations({ locale, namespace: 'dashboard' })

  if (!userId) {
    redirect('/sign-in')
  }

  const supabase = getSupabaseServerClient()

  let legacyUserId: string | null = null
  let canonicalClerkId: string | null = null

  const { data: legacyUserRow } = await supabase
    .from('User')
    .select('id, clerkId, email')
    .eq('clerkId', userId)
    .maybeSingle()

  if (legacyUserRow) {
    legacyUserId = (legacyUserRow as any)?.id ?? null
    canonicalClerkId = (legacyUserRow as any)?.clerkId ?? null
  }

  let emailLinkedLegacyIds: string[] = []
  let emailLinkedCanonicalClerkIds: string[] = []

  if (userEmail) {
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
      console.error('[HostInquiries] error resolving email-linked Clerk ids:', error)
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

  const { data: listings } = await supabase
    .from('listings')
    .select('id, title, city_name')
    .in('owner_id', ownerIds)

  const listingIds = (listings || []).map((l: any) => l.id)

  const { data: inquiries } = listingIds.length > 0
    ? await supabase
        .from('availability_leads')
        .select('id, listing_id, start_date, duration_months, email, score_label, paid, created_at, source')
        .in('listing_id', listingIds)
        .order('created_at', { ascending: false })
    : { data: [] as any[] }

  const listingMap = new Map((listings || []).map((l: any) => [l.id, l]))

  const hot = (inquiries || []).filter((i: any) => i.score_label === 'HOT').length
  const warm = (inquiries || []).filter((i: any) => i.score_label === 'WARM').length
  const paid = (inquiries || []).filter((i: any) => i.paid).length

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <Link href="/dashboard" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 font-semibold mb-3">
              <ArrowLeft className="h-4 w-4" />
              {t('backToDashboard')}
            </Link>
            <h1 className="text-3xl lg:text-4xl font-black text-gray-900">{t('inquiriesInboxTitle')}</h1>
            <p className="text-gray-600 mt-1">{t('inquiriesInboxSubtitle')}</p>
          </div>
          <Link href="/dashboard/properties" className="text-sm font-semibold text-blue-600 hover:text-blue-700">
            {t('viewAll')}
          </Link>
        </div>

        <div className="grid sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-2xl p-5 border-2 border-red-100">
            <div className="flex items-center gap-2 text-red-600 mb-1"><Flame className="h-4 w-4" /> HOT</div>
            <div className="text-3xl font-black">{hot}</div>
          </div>
          <div className="bg-white rounded-2xl p-5 border-2 border-yellow-100">
            <div className="flex items-center gap-2 text-yellow-700 mb-1"><MessageSquare className="h-4 w-4" /> WARM</div>
            <div className="text-3xl font-black">{warm}</div>
          </div>
          <div className="bg-white rounded-2xl p-5 border-2 border-green-100">
            <div className="flex items-center gap-2 text-green-700 mb-1"><CircleDollarSign className="h-4 w-4" /> {t('pipelinePaid')}</div>
            <div className="text-3xl font-black">{paid}</div>
          </div>
        </div>

        {(inquiries || []).length === 0 ? (
          <div className="bg-white rounded-2xl border-2 border-dashed border-gray-300 p-10 text-center">
            <Inbox className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <h2 className="text-xl font-bold mb-2">{t('noInquiriesYet')}</h2>
            <p className="text-gray-600">{t('noInquiriesHelp')}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {(inquiries || []).map((inquiry: any) => {
              const listing = listingMap.get(inquiry.listing_id)
              const sourceMessage = String(inquiry.source || '').includes('inquiry_form:')
                ? String(inquiry.source).replace('inquiry_form:', '')
                : t('inquiryReceived')

              return (
                <div key={inquiry.id} className="bg-white rounded-2xl p-5 border-2 border-gray-200">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <p className="text-sm text-gray-500">{listing?.city_name || '-'}</p>
                      <h3 className="text-lg font-bold text-gray-900">{listing?.title || t('property')}</h3>
                      <p className="text-sm text-gray-600 mt-1">{sourceMessage}</p>

                      <div className="flex flex-wrap items-center gap-3 mt-3 text-sm text-gray-600">
                        <span className="inline-flex items-center gap-1"><CalendarClock className="h-4 w-4" /> {t('start')}: {inquiry.start_date ? new Date(inquiry.start_date).toLocaleDateString(locale === 'en' ? 'en-US' : 'es-ES') : '-'}</span>
                        <span>{t('lookingFor')}: {inquiry.duration_months || 1} {t('months')}</span>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${inquiry.score_label === 'HOT' ? 'bg-red-100 text-red-700' : inquiry.score_label === 'WARM' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-700'}`}>{inquiry.score_label || 'NEW'}</span>
                        {inquiry.paid ? <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-green-100 text-green-700">{t('pipelinePaid')}</span> : null}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Link href={`/dashboard/inquiries/${inquiry.id}`}>
                        <button className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold">{t('viewDetails')}</button>
                      </Link>
                      <a href={`mailto:${inquiry.email || ''}`} className="px-4 py-2 rounded-xl border-2 border-gray-300 text-gray-700 font-semibold inline-flex items-center gap-2">
                        <Mail className="h-4 w-4" /> {t('reply')}
                      </a>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
