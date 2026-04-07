import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

type Ctx = { params: Promise<{ id: string }> }

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(request: NextRequest, { params }: Ctx) {
  try {
    const { id: listingId } = await params

    if (!listingId) {
      return NextResponse.json({ error: 'Listing ID is required' }, { status: 400 })
    }

    // Fetch listing from Supabase
    const { data: listing, error } = await supabase
      .from('listings')
      .select(`
        id,
        title,
        description,
        city_name,
        city_country,
        neighborhood,
        monthly_price,
        currency,
        images,
        featured,
        owner_id,
        status,
        created_at,
        bedrooms,
        bathrooms,
        wifi_speed_mbps,
        has_desk,
        has_second_monitor,
        furnished,
        min_months,
        max_months,
        has_heating,
        has_ac,
        has_balcony,
        has_terrace,
        has_washing_machine,
        has_dryer,
        has_dishwasher,
        has_kitchen,
        has_elevator,
        has_parking,
        has_doorman,
        floor_number,
        pets_allowed,
        smoking_allowed,
        has_security_system,
        has_safe
      `)
      .eq('id', listingId)
      .single()

    if (error || !listing) {
      console.error('❌ Listing not found:', listingId, error?.message)
      return NextResponse.json({ error: 'Listing not found' }, { status: 404 })
    }

    return NextResponse.json(listing)
  } catch (error: any) {
    console.error('Error fetching listing:', error)
    return NextResponse.json(
      { error: error?.message || 'Internal server error' },
      { status: 500 }
    )
  }
}