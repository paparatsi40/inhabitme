import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseServerClient } from '@/lib/supabase/server'
import { auth, currentUser } from '@clerk/nextjs/server'
import { revalidatePath } from 'next/cache'
import { notifyWaitlist, getWaitlistCount } from '@/lib/email/send-waitlist-notification'
import { resolveCanonicalUserIdentity } from '@/lib/user-identity'

export async function POST(req: NextRequest) {
  try {
    return await handleCreateProperty(req)
  } catch (error: any) {
    console.error('[API] 🔥 Uncaught error in POST handler:', error)
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: error?.message || 'Unknown error',
        stack: process.env.NODE_ENV === 'development' ? error?.stack : undefined,
      },
      { status: 500 }
    )
  }
}

async function handleCreateProperty(req: NextRequest) {
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

  const user = await currentUser()
  const userEmail = user?.primaryEmailAddress?.emailAddress?.toLowerCase() ?? null
  const identity = await resolveCanonicalUserIdentity({
    supabase: getSupabaseServerClient(),
    runtimeClerkId: userId,
    email: userEmail,
  })
  const ownerId = identity.canonicalClerkId

  console.log('[API] Canonical identity resolved:', identity)
  console.log('[API] Will create property with owner_id:', ownerId)

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
    neighborhood,
    address,

    hasDesk,
    hasSecondMonitor,
    wifiSpeed,

    furnished,

    // Amenities - Clima y Confort
    hasHeating,
    hasAc,
    hasBalcony,
    hasTerrace,

    // Amenities - Hogar
    hasWashingMachine,
    hasDryer,
    hasDishwasher,
    hasKitchen,

    // Amenities - Edificio
    hasElevator,
    hasParking,
    hasDoorman,
    floorNumber,

    // Amenities - Estilo de vida
    petsAllowed,
    smokingAllowed,

    // Amenities - Seguridad
    hasSecuritySystem,
    hasSafe,

    monthlyPrice,
    minStayMonths,
    maxStayMonths,

    images,
  } = body

  console.log('[API] 📸 Images recibidas:', images);
  console.log('[API] 📸 Images es array?', Array.isArray(images));
  console.log('[API] 📸 Images length:', images?.length);

  const supabase = getSupabaseServerClient()

  // 🔍 Preparar el payload de inserción
  const insertPayload = {
    title,
    description,

    city_name: city,
    city_country: country,
    neighborhood: neighborhood || null,

    bedrooms,
    bathrooms,
    images,

    has_desk: hasDesk,
    has_second_monitor: hasSecondMonitor,
    wifi_speed_mbps: wifiSpeed ?? null,
    furnished: furnished ?? true,

    // Amenities - Clima y Confort
    has_heating: hasHeating ?? false,
    has_ac: hasAc ?? false,
    has_balcony: hasBalcony ?? false,
    has_terrace: hasTerrace ?? false,

    // Amenities - Hogar
    has_washing_machine: hasWashingMachine ?? false,
    has_dryer: hasDryer ?? false,
    has_dishwasher: hasDishwasher ?? false,
    has_kitchen: hasKitchen ?? false,

    // Amenities - Edificio
    has_elevator: hasElevator ?? false,
    has_parking: hasParking ?? false,
    has_doorman: hasDoorman ?? false,
    floor_number: floorNumber ?? null,

    // Amenities - Estilo de vida
    pets_allowed: petsAllowed ?? false,
    smoking_allowed: smokingAllowed ?? false,

    // Amenities - Seguridad
    has_security_system: hasSecuritySystem ?? false,
    has_safe: hasSafe ?? false,

    available_from: new Date().toISOString().split('T')[0], // Solo fecha: YYYY-MM-DD
    available_to: null,

    min_months: minStayMonths,
    max_months: maxStayMonths,

    monthly_price: monthlyPrice,
    currency: 'EUR',

    owner_id: ownerId,
    status: 'active',
  }

  console.log('[API] 🔍 INSERT PAYLOAD:', JSON.stringify(insertPayload, null, 2))

  const { data, error } = await supabase
    .from('listings')
    .insert(insertPayload)
    .select('id')
    .single()

  if (error) {
    console.error('[API] ❌ Supabase insert error:', error)
    console.error('[API] ❌ Error code:', error.code)
    console.error('[API] ❌ Error details:', error.details)
    console.error('[API] ❌ Error hint:', error.hint)
    console.error('[API] ❌ Error message:', error.message)
    return NextResponse.json(
      { 
        error: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint,
      },
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
    ownerId,
    debug: { ownerId, runtimeUserId: userId }
  })
}
