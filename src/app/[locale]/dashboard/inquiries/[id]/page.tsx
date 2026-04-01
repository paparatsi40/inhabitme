import { auth, currentUser, clerkClient } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { Link } from '@/i18n/routing'
import { getSupabaseServerClient } from '@/lib/supabase/server'
import { getLocale, getTranslations } from 'next-intl/server'
import { ArrowLeft, Mail, Unlock, MessageSquare, Sparkles, CheckCircle2, ArrowRightCircle } from 'lucide-react'
import Stripe from 'stripe'

export const dynamic = 'force-dynamic'

const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2026-02-25.clover' })
  : null

function parseInquiryMessage(source: string | null | undefined, fallback: string) {
  if (!source) return fallback
  return source.includes('inquiry_form:') ? source.replace('inquiry_form:', '') : fallback
}

export default async function InquiryDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string; locale: string }>
  searchParams: Promise<{ session_id?: string; proceeded?: string }>
}) {
  const { userId } = await auth()
  const user = await currentUser()
  const userEmail = user?.primaryEmailAddress?.emailAddress?.toLowerCase() ?? null
  const locale = await getLocale()
  const t = await getTranslations({ locale, namespace: 'dashboard' })
  const { id } = await params
  const query = await searchParams

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

    emailLinkedLegacyIds = (legacyUsersByEmail || []).map((u: any) => String(u?.id)).filter(Boolean)
    emailLinkedCanonicalClerkIds = (legacyUsersByEmail || []).map((u: any) => String(u?.clerkId)).filter(Boolean)
  }

  let emailLinkedClerkIds: string[] = []
  if (userEmail) {
    try {
      const client = await clerkClient()
      const users = await client.users.getUserList({ emailAddress: [userEmail], limit: 10 })
      emailLinkedClerkIds = (users.data || []).map((u: any) => String(u.id))
    } catch {}
  }

  const ownerIds = Array.from(new Set([
    userId,
    canonicalClerkId,
    legacyUserId,
    ...emailLinkedLegacyIds,
    ...emailLinkedCanonicalClerkIds,
    ...emailLinkedClerkIds,
  ].filter(Boolean) as string[]))

  const { data: inquiry } = await supabase
    .from('availability_leads')
    .select('id, listing_id, city, neighborhood, start_date, duration_months, email, score_label, paid, created_at, source, stripe_session_id')
    .eq('id', id)
    .single()

  if (!inquiry) {
    redirect('/dashboard/inquiries')
  }

  const { data: listing } = await supabase
    .from('listings')
    .select('id, title, owner_id, city_name')
    .eq('id', inquiry.listing_id)
    .single()

  if (!listing || !ownerIds.includes(String(listing.owner_id))) {
    redirect('/dashboard/inquiries')
  }

  const quickReplies = [
    t('quickReply1'),
    t('quickReply2'),
    t('quickReply3'),
  ]

  if (!inquiry.paid && query?.session_id && stripe) {
    try {
      const session = await stripe.checkout.sessions.retrieve(String(query.session_id))
      if (session.payment_status === 'paid' && session.client_reference_id === inquiry.id) {
        const { data: paidInquiry } = await supabase
          .from('availability_leads')
          .update({ paid: true, stripe_session_id: session.id })
          .eq('id', inquiry.id)
          .select('id, listing_id, city, neighborhood, start_date, duration_months, email, score_label, paid, created_at, source, stripe_session_id')
          .single()

        if (paidInquiry) {
          Object.assign(inquiry, paidInquiry)
        }
      }
    } catch (error) {
      console.error('[InquiryDetail] fallback proceed error:', error)
    }
  }

  const isRecentlyProceeded = Boolean(query?.proceeded === '1' || (query?.session_id && inquiry.paid))
  const inquiryMessage = parseInquiryMessage(inquiry.source, t('inquiryReceived'))

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link href="/dashboard/inquiries" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 font-semibold mb-4">
          <ArrowLeft className="h-4 w-4" /> {t('backToInquiries')}
        </Link>

        {isRecentlyProceeded && (
          <div className="mb-4 rounded-2xl border-2 border-green-200 bg-green-50 p-4 text-green-800 flex items-start gap-3">
            <CheckCircle2 className="h-5 w-5 mt-0.5" />
            <div>
              <p className="font-bold">{t('contactUnlockedTitle')}</p>
              <p className="text-sm">{t('contactUnlockedBody')}</p>
            </div>
          </div>
        )}

        <div className="bg-white rounded-2xl border-2 border-gray-200 p-6 mb-6">
          <h1 className="text-2xl font-black text-gray-900 mb-1">{listing.title}</h1>
          <p className="text-gray-600 mb-4">{listing.city_name || inquiry.city}</p>

          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div className="p-3 rounded-xl bg-gray-50">
              <div className="text-gray-500">{t('start')}</div>
              <div className="font-bold text-gray-900">{inquiry.start_date ? new Date(inquiry.start_date).toLocaleDateString(locale === 'en' ? 'en-US' : 'es-ES') : '-'}</div>
            </div>
            <div className="p-3 rounded-xl bg-gray-50">
              <div className="text-gray-500">{t('lookingFor')}</div>
              <div className="font-bold text-gray-900">{inquiry.duration_months || 1} {t('months')}</div>
            </div>
            <div className="p-3 rounded-xl bg-gray-50">
              <div className="text-gray-500">{t('interestLevel')}</div>
              <div className={`font-bold ${inquiry.score_label === 'HOT' ? 'text-red-600' : inquiry.score_label === 'WARM' ? 'text-yellow-700' : 'text-gray-700'}`}>{inquiry.score_label || 'NEW'}</div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl border-2 border-gray-200 p-6">
              <h2 className="font-bold text-gray-900 mb-3">{t('guestMessage')}</h2>
              <p className="text-gray-700 leading-relaxed">{inquiryMessage}</p>
            </div>

            <div className="bg-white rounded-2xl border-2 border-gray-200 p-6">
              <h2 className="font-bold text-gray-900 mb-3">{t('quickRepliesTitle')}</h2>
              <div className="space-y-2">
                {quickReplies.map((reply) => (
                  inquiry.paid ? (
                    <a
                      key={reply}
                      href={`mailto:${inquiry.email || ''}?subject=${encodeURIComponent(t('replySubject'))}&body=${encodeURIComponent(reply)}`}
                      className="block p-3 rounded-xl border border-gray-200 hover:border-blue-300 hover:bg-blue-50 text-sm text-gray-700"
                    >
                      {reply}
                    </a>
                  ) : (
                    <div key={reply} className="block p-3 rounded-xl border border-dashed border-gray-200 text-sm text-gray-400">
                      {reply}
                    </div>
                  )
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-white rounded-2xl border-2 border-gray-200 p-5">
              <h3 className="font-bold text-gray-900 mb-3">{t('actions')}</h3>
              {inquiry.paid ? (
                <a
                  href={`mailto:${inquiry.email || ''}?subject=${encodeURIComponent(t('replySubject'))}`}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700"
                >
                  <Mail className="h-4 w-4" /> {t('reply')}
                </a>
              ) : (
                <div className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 border-dashed border-gray-300 text-gray-500 font-semibold">
                  <Mail className="h-4 w-4" /> {t('contactLocked')}
                </div>
              )}
            </div>

            {!inquiry.paid && (
              <div className="bg-gradient-to-br from-purple-600 to-blue-700 text-white rounded-2xl p-5">
                <div className="inline-flex items-center gap-2 text-sm mb-2"><Sparkles className="h-4 w-4" /> {t('highIntentTenant')}</div>
                <h3 className="text-lg font-black mb-2">{t('proceedBookingTitle')}</h3>
                <p className="text-sm opacity-90 mb-4">{t('proceedBookingBody')}</p>
                <a href={`/${locale}/api/inquiries/${inquiry.id}/create-checkout?locale=${locale}`} className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white text-purple-700 font-bold hover:bg-purple-50">
                  <ArrowRightCircle className="h-4 w-4" /> {t('proceedBookingButton')}
                </a>
                <p className="text-xs opacity-80 mt-3">{t('proceedNote')}</p>
              </div>
            )}

            <div className="bg-emerald-50 rounded-2xl border-2 border-emerald-200 p-5 text-sm text-emerald-900">
              <h4 className="font-bold mb-2">{t('savingsTitle')}</h4>
              <p>{t('savingsBody')}</p>
            </div>

            <div className="bg-white rounded-2xl border-2 border-gray-200 p-5 text-sm text-gray-600">
              <h4 className="font-bold text-gray-900 mb-2">{t('internalChatNoteTitle')}</h4>
              <p>{t('internalChatNoteBody')}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
