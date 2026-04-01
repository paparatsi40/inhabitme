import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

type ProceededLeadEmailInput = {
  hostEmail: string
  guestEmail: string
  city: string
  neighborhood?: string
  startDate: string
}

export async function sendUnlockedLeadEmail(input: ProceededLeadEmailInput) {
  const text = `
Booking intent confirmed 🎉

City: ${input.city}
Neighborhood: ${input.neighborhood ?? '-'}
Move-in date: ${input.startDate}

Guest contact:
${input.guestEmail}

You can now contact the guest directly to proceed.

— inhabitme
  `.trim()

  await resend.emails.send({
    from: process.env.EMAIL_FROM!,
    to: input.hostEmail,
    subject: 'Booking intent confirmed — guest contact inside',
    text,
  })
}
