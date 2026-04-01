import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

type HostInquiryNotificationInput = {
  hostEmail: string
  hostName?: string
  listingTitle: string
  listingId: string
  city: string
  moveInDate: string
  durationMonths: number
  guestEmail?: string
  guestMessage: string
  inquiryId: string
}

export async function sendHostInquiryNotification(input: HostInquiryNotificationInput) {
  if (!process.env.RESEND_API_KEY || !process.env.EMAIL_FROM) {
    console.warn('[sendHostInquiryNotification] Missing RESEND_API_KEY or EMAIL_FROM')
    return
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://inhabitme.com'
  const inboxUrl = `${appUrl}/en/dashboard/inquiries/${input.inquiryId}`

  const text = `
You have a new inquiry for ${input.listingTitle} (${input.city}).

Move-in date: ${input.moveInDate}
Duration: ${input.durationMonths} month(s)
Guest email: ${input.guestEmail || 'not provided'}

Message:
"${input.guestMessage}"

View inquiry and reply:
${inboxUrl}

Respond quickly to increase your chances of closing.

— inhabitme
  `.trim()

  await resend.emails.send({
    from: process.env.EMAIL_FROM,
    to: input.hostEmail,
    subject: `📩 New inquiry for ${input.listingTitle}`,
    text,
  })
}
