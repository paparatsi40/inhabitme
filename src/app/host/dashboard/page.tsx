import { auth, clerkClient } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { getHostLeads } from '@/lib/hosts/getHostLeads'

export const dynamic = 'force-dynamic'

function getPaymentLink(
  label: 'HOT' | 'WARM' | 'COLD',
  leadId: string
) {
  if (label === 'HOT') {
    return `${process.env.STRIPE_HOT_PAYMENT_LINK}?client_reference_id=${leadId}`
  }

  if (label === 'WARM') {
    return `${process.env.STRIPE_WARM_PAYMENT_LINK}?client_reference_id=${leadId}`
  }

  return null
}

export default async function HostDashboardPage() {
  const { userId } = await auth()

  if (!userId) {
    redirect('/sign-in')
  }

  // Get user email from Clerk
  let hostEmail = ''
  try {
    const client = await clerkClient()
    const user = await client.users.getUser(userId)
    hostEmail = user.emailAddresses[0]?.emailAddress || ''
  } catch (error) {
    console.error('Error getting user email:', error)
  }

  if (!hostEmail) {
    return <p>No email associated with this account.</p>
  }

  const leads = await getHostLeads(hostEmail)

  return (
    <main className="max-w-6xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-bold mb-6">
        Your availability requests
      </h1>

      {leads.length === 0 && (
        <p className="text-gray-600">
          No leads yet.
        </p>
      )}

      <div className="space-y-4">
        {leads.map((lead) => {
          const billable =
            !lead.paid && lead.score_label !== 'COLD'

          const paymentLink = getPaymentLink(
            lead.score_label,
            lead.id
          )

          return (
            <div
              key={lead.id}
              className="border rounded-lg p-4 flex justify-between items-center"
            >
              <div>
                <p className="font-medium">
                  {lead.city}
                  {lead.neighborhood
                    ? ` · ${lead.neighborhood}`
                    : ''}
                </p>

                <p className="text-sm text-gray-600">
                  Move-in: {lead.start_date}
                </p>

                <p className="text-sm mt-1">
                  Lead quality:{' '}
                  <strong>{lead.score_label}</strong>{' '}
                  ({lead.score})
                </p>

                {lead.paid ? (
                  <p className="text-sm mt-2">
                    Guest email:{' '}
                    <strong>{lead.email}</strong>
                  </p>
                ) : (
                  <p className="text-sm mt-2 text-gray-500">
                    Guest email locked
                  </p>
                )}
              </div>

              <div>
                {lead.paid ? (
                  <span className="text-green-600 font-medium">
                    Unlocked
                  </span>
                ) : billable && paymentLink ? (
                  <a
                    href={paymentLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline"
                  >
                    Pay to unlock
                  </a>
                ) : (
                  <span className="text-gray-400">
                    Not billable
                  </span>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </main>
  )
}
