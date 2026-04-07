import { auth, currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { getHostLeads } from '@/lib/hosts/getHostLeads'
import { HostDashboardClient } from './HostDashboardClient'

export const dynamic = 'force-dynamic'

type Params = Promise<{ locale: string }>
type SearchParams = Promise<{ unlocked?: string }>

export default async function HostDashboardPage({
  params,
  searchParams,
}: {
  params: Params
  searchParams: SearchParams
}) {
  const { locale } = await params
  const { unlocked } = await searchParams

  const { userId } = await auth()
  if (!userId) {
    redirect(`/${locale}/sign-in`)
  }

  const user = await currentUser()
  const hostEmail = user?.primaryEmailAddress?.emailAddress

  if (!hostEmail) {
    return (
      <main className="max-w-3xl mx-auto px-6 py-16 text-center">
        <p className="text-gray-500">No email associated with this account.</p>
      </main>
    )
  }

  const leads = await getHostLeads(hostEmail)

  return (
    <HostDashboardClient
      leads={leads as any}
      hostEmail={hostEmail}
      justUnlocked={unlocked ?? null}
      locale={locale}
    />
  )
}
