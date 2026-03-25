import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

type HostLeadEmailInput = {
  hostEmail: string
  listingId: string
  city: string
  neighborhood?: string
  startDate: string
  score: number
  label: 'HOT' | 'WARM' | 'COLD'
}

function getLeadPrice(label: HostLeadEmailInput['label']) {
  if (label === 'HOT') return 25
  if (label === 'WARM') return 10
  return 0
}

export async function sendHostLeadEmail(input: HostLeadEmailInput) {
  const price = getLeadPrice(input.label)

  // ❄️ Do not charge cold leads
  if (price === 0) return

  const text = `
You have a new ${input.label} availability request for your apartment.

City: ${input.city}
Neighborhood: ${input.neighborhood ?? '-'}
Move-in date: ${input.startDate}

Lead quality score: ${input.score}
Price to receive the guest’s contact details: ${price}

To proceed, simply reply to this email or complete the payment here:
👉 [STRIPE PAYMENT LINK]

Once payment is confirmed, we’ll immediately share the guest’s email
so you can contact them directly.

— inhabitme
  `.trim()

  await resend.emails.send({
    from: process.env.EMAIL_FROM!,
    to: input.hostEmail,
    subject: `💰 New ${input.label} lead — ${input.city}`,
    text,
  })
}
