import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { getSupabaseServerClient } from '@/lib/supabase/server'

type Ctx = { params: Promise<{ id: string }> }

export async function POST(request: NextRequest, { params }: Ctx) {
  try {
    const { userId, sessionClaims } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Solo admin puede activar/desactivar featured
    const publicMetadata =
      (sessionClaims as any)?.public_metadata ||
      (sessionClaims as any)?.publicMetadata ||
      (sessionClaims as any)?.metadata
    const isAdmin =
      publicMetadata?.role === 'admin' || userId === process.env.ADMIN_USER_ID

    if (!isAdmin) {
      return NextResponse.json(
        { error: 'Only admins can toggle featured listings' },
        { status: 403 }
      )
    }

    const { id: propertyId } = await params
    if (!propertyId) {
      return NextResponse.json({ error: 'Property ID is required' }, { status: 400 })
    }

    const supabase = getSupabaseServerClient()

    // Leer valor actual
    const { data: listing, error: fetchError } = await supabase
      .from('listings')
      .select('id, featured')
      .eq('id', propertyId)
      .single()

    if (fetchError || !listing) {
      return NextResponse.json({ error: 'Listing not found' }, { status: 404 })
    }

    const newFeatured = !listing.featured

    // Actualizar en DB
    const { error: updateError } = await supabase
      .from('listings')
      .update({ featured: newFeatured })
      .eq('id', propertyId)

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, featured: newFeatured })
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message ?? 'Internal server error' },
      { status: 500 }
    )
  }
}
