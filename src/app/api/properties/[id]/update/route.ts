import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const listingId = params.id
    const body = await request.json()

    // Verify ownership
    const { data: listing, error: fetchError } = await supabase
      .from('listings')
      .select('owner_id')
      .eq('id', listingId)
      .single()

    if (fetchError || !listing) {
      return NextResponse.json({ error: 'Listing not found' }, { status: 404 })
    }

    if (listing.owner_id !== userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    // Update listing
    const { data, error } = await supabase
      .from('listings')
      .update({
        title: body.title,
        description: body.description,
        bedrooms: body.bedrooms,
        bathrooms: body.bathrooms,
        city_name: body.city,
        neighborhood: body.neighborhood || null,
        has_desk: body.hasDesk,
        wifi_speed_mbps: body.wifiSpeed,
        has_second_monitor: body.hasSecondMonitor,
        furnished: body.furnished,
        // Amenities
        has_heating: body.hasHeating,
        has_ac: body.hasAc,
        has_balcony: body.hasBalcony,
        has_terrace: body.hasTerrace,
        has_washing_machine: body.hasWashingMachine,
        has_dryer: body.hasDryer,
        has_dishwasher: body.hasDishwasher,
        has_kitchen: body.hasKitchen,
        has_elevator: body.hasElevator,
        has_parking: body.hasParking,
        has_doorman: body.hasDoorman,
        floor_number: body.floorNumber || null,
        pets_allowed: body.petsAllowed,
        smoking_allowed: body.smokingAllowed,
        has_security_system: body.hasSecuritySystem,
        has_safe: body.hasSafe,
        // Pricing
        monthly_price: body.monthlyPrice,
        min_months: body.minStayMonths,
        max_months: body.maxStayMonths,
        updated_at: new Date().toISOString(),
      })
      .eq('id', listingId)
      .select()
      .single()

    if (error) {
      console.error('Update error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, data })
  } catch (error: any) {
    console.error('Server error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
