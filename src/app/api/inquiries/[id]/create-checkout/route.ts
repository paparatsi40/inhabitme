import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import Stripe from 'stripe'
import { getSupabaseServerClient } from '@/lib/supabase/server'
import { getLeadPrice, getLeadPriceInCents } from '@/lib/pricing/lead-pricing'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-02-25.clover',
})

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

type Ctx = { params: Promise<{ id: string }> }

export async function GET(req: NextRequest, { params }: Ctx) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.redirect(new URL('/en/sign-in', req.url))
    }

    const { id } = await params
    const locale = req.nextUrl.searchParams.get('locale') || 'en'

    const supabase = getSupabaseServerClient()

    const { data: inquiry, error: inquiryError } = await supabase
      .from('availability_leads')
      .select('id, listing_id, city, duration_months, paid, email')
      .eq('id', id)
      .single()

    if (inquiryError || !inquiry) {
      return NextResponse.redirect(new URL(`/${locale}/dashboard/inquiries`, req.url))
    }

    if (inquiry.paid) {
      return NextResponse.redirect(new URL(`/${locale}/dashboard/inquiries/${id}?proceeded=1`, req.url))
    }

    const { data: listing, error: listingError } = await supabase
      .from('listings')
      .select('id, title, owner_id, city_name')
      .eq('id', inquiry.listing_id)
      .single()

    if (listingError || !listing || String(listing.owner_id) !== String(userId)) {
      return NextResponse.redirect(new URL(`/${locale}/dashboard/inquiries`, req.url))
    }

    const durationMonths = Number(inquiry.duration_months || 3)
    const pricing = getLeadPrice(durationMonths)
    const priceInCents = getLeadPriceInCents(durationMonths)

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: 'Proceed with booking intent',
              description: `Intent fee for ${durationMonths}-month stay on ${listing.title}`,
            },
            unit_amount: priceInCents,
          },
          quantity: 1,
        },
      ],
      success_url: `${BASE_URL}/${locale}/dashboard/inquiries/${id}?proceeded=1&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${BASE_URL}/${locale}/dashboard/inquiries/${id}?canceled=1`,
      client_reference_id: inquiry.id,
      metadata: {
        type: 'availability_inquiry_booking_intent',
        inquiryId: inquiry.id,
        listingId: listing.id,
        listingTitle: listing.title || '',
        durationMonths: String(durationMonths),
        tier: pricing.tier,
      },
      payment_method_types: ['card'],
    })

    if (!session.url) {
      return NextResponse.redirect(new URL(`/${locale}/dashboard/inquiries/${id}?error=checkout`, req.url))
    }

    return NextResponse.redirect(session.url)
  } catch (error) {
    console.error('[inquiries/create-checkout] error:', error)
    return NextResponse.redirect(new URL('/en/dashboard/inquiries?error=checkout', req.url))
  }
}
