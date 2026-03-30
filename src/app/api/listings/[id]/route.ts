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
        created_at
      `)
      .eq('id', listingId)
      .single()

    if (error || !listing) {
      console.log('❌ Listing not found:', error?.message || 'No data')
      return NextResponse.json({ error: 'Listing not found' }, { status: 404 })
    }

    console.log('✅ Listing found:', listing.title)
    return NextResponse.json(listing)
  } catch (error: any) {
    console.error('Error fetching listing:', error)
    return NextResponse.json(
      { error: error?.message || 'Internal server error' },
      { status: 500 }
    )
  }
}