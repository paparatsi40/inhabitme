import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

type InternalLeadAlertInput = {
  listingId: string
  city: string
  neighborhood?: string
  startDate: string
  email: string
  relocating?: boolean
  score: number
  label: 'HOT' | 'WARM' | 'COLD'
}

function getLeadPrice(label: InternalLeadAlertInput['label']) {
  if (label === 'HOT') return 25
  if (label === 'WARM') return 10
  return 0
}

export async function sendInternalLeadAlert(input: InternalLeadAlertInput) {
  if (!process.env.INTERNAL_ALERT_EMAIL) {
    return
  }

  const price = getLeadPrice(input.label)
  const billable = price > 0

  const text = `
NEW AVAILABILITY REQUEST

Lead score: ${input.label} (${input.score})
${billable ? `💰 Billable lead: €${price}` : '❄️ Not billable'}

Listing ID: ${input.listingId}
City: ${input.city}
Neighborhood: ${input.neighborhood ?? '-'}
Move-in date: ${input.startDate}
Relocating for work: ${input.relocating ? 'Yes' : 'No'}

Guest email:
${input.email}

Next step:
${billable ? 'Contact host and charge for this lead.' : 'No charge. Low intent.'}
  `.trim()

  await resend.emails.send({
    from: process.env.EMAIL_FROM!,
    to: process.env.INTERNAL_ALERT_EMAIL,
    subject: `${billable ? '💰' : '❄️'} ${input.label} lead — ${input.city}`,
    text,
  })
}
