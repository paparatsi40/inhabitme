import { auth, currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'
import { HostDashboardClient } from './HostDashboardClient'

export const dynamic = 'force-dynamic'

type Params = Promise<{ locale: string }>
type SearchParams = Promise<{ payment?: string }>

export default async function HostDashboardPage({
  params,
  searchParams,
}: {
  params: Params
  searchParams: SearchParams
}) {
  const { locale } = await params
  const { payment } = await searchParams

  const { userId } = await auth()
  if (!userId) redirect(`/${locale}/sign-in`)

  const user = await currentUser()
  const hostEmail = user?.primaryEmailAddress?.emailAddress ?? ''

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { data: rawBookings } = await supabase
    .from('bookings')
    .select('id, status, guest_payment_status, host_payment_status, months_duration, check_in, guest_email, property_id, listings(title, city)')
    .eq('host_id', userId)
    .not('status', 'in', '("cancelled","rejected")')
    .order('created_at', { ascending: false })

  // Supabase returns joined relations as arrays; normalize to single object
  const bookings = rawBookings?.map(b => ({
    ...b,
    listings: Array.isArray(b.listings) ? (b.listings[0] ?? null) : b.listings,
  })) ?? []

  return (
    <HostDashboardClient
      bookings={bookings}
      hostEmail={hostEmail}
      locale={locale}
      justPaid={payment === 'success'}
    />
  )
}
