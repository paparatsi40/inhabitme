import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { getSupabaseServerClient } from '@/lib/supabase/server'

// Mapear los datos de la DB al formato del dominio
function mapRowToListing(row: any) {
  return {
    id: row.id,
    title: row.title,
    description: row.description,

    city: {
      name: row.city_name,
      country: row.city_country
    },

    neighborhood: row.neighborhood
      ? {
          name: row.neighborhood,
          city: {
            name: row.city_name,
            country: row.city_country
          }
        }
      : undefined,

    bedrooms: row.bedrooms,
    bathrooms: row.bathrooms,

    amenities: {
      wifiSpeedMbps: row.wifi_speed_mbps ?? undefined,
      hasDesk: row.has_desk,
      hasSecondMonitor: row.has_second_monitor,
      furnished: row.furnished
    },

    availability: {
      availableFrom: row.available_from,
      availableTo: row.available_to || undefined,
      minMonths: row.min_months,
      maxMonths: row.max_months
    },

    price: {
      monthly: row.monthly_price,
      currency: row.currency
    },

    images: row.images || [],
    ownerId: row.owner_id,
    status: row.status,

    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

/**
 * GET /api/properties/[id]
 * Get a single property by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = getSupabaseServerClient()

    const { data: listing, error } = await supabase
      .from('listings')
      .select('*')
      .eq('id', params.id)
      .single()

    if (error || !listing) {
      return NextResponse.json({ error: 'Property not found' }, { status: 404 })
    }

    // Transformar al formato del dominio
    const transformedListing = mapRowToListing(listing);

    return NextResponse.json({ success: true, data: transformedListing })

  } catch (error) {
    console.error('[API] Error in GET /api/properties/[id]:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/properties/[id]
 * Update a property (only owner can update)
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabase = getSupabaseServerClient()

    // Verify property exists and user is owner
    const { data: listing, error: fetchError } = await supabase
      .from('listings')
      .select('owner_id')
      .eq('id', params.id)
      .single()

    if (fetchError || !listing) {
      return NextResponse.json({ error: 'Property not found' }, { status: 404 })
    }

    if (listing.owner_id !== userId) {
      return NextResponse.json(
        { error: 'You do not have permission to update this property' },
        { status: 403 }
      )
    }

    // Get updated data
    const body = await request.json()
    
    console.log('[API PUT] Received body:', JSON.stringify(body, null, 2))

    // Update the property - solo campos que existen en la tabla
    const { data: updated, error: updateError } = await supabase
      .from('listings')
      .update({
        title: body.title,
        description: body.description,
        city_name: body.city_name,
        city_country: body.country || body.city_country,
        neighborhood: body.neighborhood,
        wifi_speed_mbps: body.wifi_speed_mbps ? parseInt(body.wifi_speed_mbps) : null,
        has_desk: body.has_dedicated_workspace,
        has_second_monitor: body.has_monitor,
        bedrooms: body.bedrooms,
        bathrooms: body.bathrooms,
        furnished: body.is_furnished,
        monthly_price: body.monthly_price ? parseFloat(body.monthly_price) : null,
        currency: body.currency || 'EUR',
        min_months: body.min_months,
        max_months: body.max_months,
        images: body.images,
        updated_at: new Date().toISOString(),
      })
      .eq('id', params.id)
      .select()
      .single()

    if (updateError) {
      console.error('[API PUT] Error updating property:', updateError)
      console.error('[API PUT] Update error details:', JSON.stringify(updateError, null, 2))
      return NextResponse.json(
        { error: 'Failed to update property', details: updateError.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, data: updated })

  } catch (error) {
    console.error('[API] Error in PUT /api/properties/[id]:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/properties/[id]
 * Delete a property (only owner can delete)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabase = getSupabaseServerClient()

    // Verify property exists and user is owner
    const { data: listing, error: fetchError } = await supabase
      .from('listings')
      .select('owner_id')
      .eq('id', params.id)
      .single()

    if (fetchError || !listing) {
      return NextResponse.json({ error: 'Property not found' }, { status: 404 })
    }

    if (listing.owner_id !== userId) {
      return NextResponse.json(
        { error: 'You do not have permission to delete this property' },
        { status: 403 }
      )
    }

    // Delete the property (cascade will handle related records)
    const { error: deleteError } = await supabase
      .from('listings')
      .delete()
      .eq('id', params.id)

    if (deleteError) {
      console.error('[API] Error deleting property:', deleteError)
      return NextResponse.json(
        { error: 'Failed to delete property' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('[API] Error in DELETE /api/properties/[id]:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
