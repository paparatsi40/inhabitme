import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseServerClient } from '@/lib/supabase/server'
import { auth, currentUser } from '@clerk/nextjs/server'
import { revalidatePath } from 'next/cache'
import { notifyWaitlist, getWaitlistCount } from '@/lib/email/send-waitlist-notification'

export async function POST(req: NextRequest) {
  let userId: string | null = null

  try {
    const authResult = await auth()
    userId = authResult.userId
    console.log('[API] auth() result:', userId)
  } catch (error) {
    console.error('[API] Error with auth():', error)
  }

  if (!userId) {
    try {
      const user = await currentUser()
      userId = user?.id || null
      console.log('[API] currentUser() result:', userId)
    } catch (error) {
      console.error('[API] Error with currentUser():', error)
    }
  }

  const clerkAuthStatus = req.headers.get('x-clerk-auth-status')
  const clerkAuthReason = req.headers.get('x-clerk-auth-reason')
  console.log('[API] Clerk status:', clerkAuthStatus, 'reason:', clerkAuthReason)

  if (!userId) {
    console.error('[API] No userId found')
    return NextResponse.json(
      {
        error: 'Unauthorized',
        debug: {
          clerkStatus: clerkAuthStatus,
          clerkReason: clerkAuthReason,
        },
      },
      { status: 401 }
    )
  }

  console.log('[API] ✅ User authenticated:', userId)

  let body: any
  try {
    body = await req.json()
  } catch (error) {
    console.error('[API] ❌ Error parsing JSON body:', error)
    return NextResponse.json(
      { error: 'Invalid JSON body' },
      { status: 400 }
    )
  }

  const {
    title,
    description,
    bedrooms,
    bathrooms,

    country,
    city,
    address,

    hasDesk,
    hasSecondMonitor,
    wifiSpeed,

    furnished,

    monthlyPrice,
    minStayMonths,
    maxStayMonths,

    images,
  } = body

  const supabase = getSupabaseServerClient()

  const { data, error } = await supabase
    .from('listings')
    .insert({
      title,
      description,

      city_name: city,
      city_country: country,
      neighborhood: null,

      bedrooms,
      bathrooms,
      images,

      has_desk: hasDesk,
      has_second_monitor: hasSecondMonitor,
      wifi_speed_mbps: wifiSpeed ?? null,
      furnished: furnished ?? true,

      available_from: new Date().toISOString(),
      available_to: null,

      min_months: minStayMonths,
      max_months: maxStayMonths,

      monthly_price: monthlyPrice,
      currency: 'EUR',

      owner_id: userId,
      status: 'active',
    })
    .select('id')
    .single()

  if (error) {
    console.error('[API] ❌ Supabase insert error:', error)
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }

  // 🔁 Revalidar DESPUÉS del insert exitoso
  revalidatePath('/dashboard')

  console.log('[API] ✅ Property created successfully:', data.id)

  // 🔔 Check if there are users waiting for this city
  try {
    if (city) {
      const waitingCount = await getWaitlistCount(city)
      
      if (waitingCount > 0) {
        console.log(`[API] 📧 Found ${waitingCount} users waiting for ${city}`)
        
        // Notify waitlist asynchronously (don't block response)
        notifyWaitlist({
          propertyId: data.id,
          propertyTitle: title,
          cityName: city,
          citySlug: city,
          propertyUrl: `https://inhabitme.com/properties/${data.id}`,
          imageUrl: images && images.length > 0 ? images[0] : undefined,
        }).catch(error => {
          console.error('[API] Error notifying waitlist:', error)
        })
      }
    }
  } catch (waitlistError) {
    // Non-critical - don't fail property creation
    console.error('[API] Error checking waitlist:', waitlistError)
  }

  return NextResponse.json({
    success: true,
    id: data.id,
  })
}
