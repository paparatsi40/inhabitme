import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { getSupabaseServerClient } from '@/lib/supabase/server'
import { sendLeadNotificationEmails } from '@/lib/email/send-lead-notification'
import { getHostInfo } from '@/lib/clerk/getHostInfo'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-12-15.clover',
})

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const sessionId = searchParams.get('session_id')
    const propertyId = searchParams.get('property_id')

    if (!sessionId || !propertyId) {
      return NextResponse.json(
        { error: 'Missing parameters' },
        { status: 400 }
      )
    }

    console.log('[Verify Payment] Session:', sessionId, 'Property:', propertyId)

    // 1. Verificar sesión de Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId)

    if (session.payment_status !== 'paid') {
      return NextResponse.json(
        { error: 'Payment not completed' },
        { status: 400 }
      )
    }

    console.log('[Verify Payment] Payment verified for session:', sessionId)

    // 2. Obtener datos de la propiedad y owner_id
    const supabase = getSupabaseServerClient()
    
    const { data: listing, error: listingError } = await supabase
      .from('listings')
      .select('id, title, owner_id, city_name, city_slug')
      .eq('id', propertyId)
      .single()

    if (listingError || !listing) {
      console.error('[Verify Payment] Error fetching listing:', listingError)
      return NextResponse.json(
        { error: 'Property not found' },
        { status: 404 }
      )
    }

    // 3. Get real host email and name from Clerk
    const hostInfo = await getHostInfo(listing.owner_id)
    
    if (!hostInfo) {
      console.error('[Verify Payment] Could not fetch host info for:', listing.owner_id)
      return NextResponse.json(
        { error: 'Host not found' },
        { status: 404 }
      )
    }

    console.log('[Verify Payment] Host info retrieved:', { email: hostInfo.email, name: hostInfo.name })

    // 4. (Opcional) Guardar el lead en la base de datos
    try {
      await supabase.from('property_leads').insert({
        property_id: propertyId,
        guest_email: session.customer_details?.email || session.customer_email,
        stripe_session_id: sessionId,
        amount_paid: session.amount_total ? session.amount_total / 100 : 15,
        status: 'paid',
        created_at: new Date().toISOString(),
      })
      console.log('[Verify Payment] Lead saved to database')
    } catch (dbError) {
      // No crítico si falla, el usuario ya pagó
      console.error('[Verify Payment] Error saving lead:', dbError)
    }

    // 5. 🔥 SEND EMAILS AUTOMATICALLY
    try {
      const guestEmail = session.customer_details?.email || session.customer_email || ''
      const guestName = session.customer_details?.name || undefined
      const amountPaid = session.amount_total ? session.amount_total / 100 : 15
      
      console.log('[Verify Payment] 📧 Sending email notifications...')
      
      const emailResults = await sendLeadNotificationEmails({
        // Property
        propertyId: listing.id,
        propertyTitle: listing.title,
        propertyCity: listing.city_name || listing.city_slug,
        
        // Host (from Clerk)
        hostEmail: hostInfo.email,
        hostName: hostInfo.name,
        
        // Guest (from Stripe session)
        guestEmail,
        guestName,
        
        // Payment
        amountPaid,
        stripeSessionId: sessionId,
        paidAt: new Date(),
      })
      
      console.log('[Verify Payment] ✅ Email results:', {
        hostSent: emailResults.host.success,
        guestSent: emailResults.guest.success,
      })
    } catch (emailError) {
      // Not critical, user can still see email in UI
      console.error('[Verify Payment] ❌ Error sending emails:', emailError)
    }

    return NextResponse.json({
      success: true,
      hostEmail: hostInfo.email,
      propertyTitle: listing.title,
      propertyId: listing.id,
    })
  } catch (error: any) {
    console.error('[Verify Payment] Error:', error)
    return NextResponse.json(
      { error: error.message || 'Error verifying payment' },
      { status: 500 }
    )
  }
}
