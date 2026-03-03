import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { updatePeriod, deletePeriod } from '@/lib/repositories/availability.repository'
import { getSupabaseServerClient } from '@/lib/supabase/server'

/**
 * PUT /api/availability/periods/[id]
 * Actualiza un periodo existente
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  // ... resto igual
}
 {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const body = await request.json()
    const { startDate, endDate, status, notes, tenantReference } = body

    // Verificar que el periodo existe y el usuario es el dueño
    const supabase = getSupabaseServerClient()
    const { data: period } = await supabase
      .from('property_availability_periods')
      .select('listing_id')
      .eq('id', params.id)
      .single()

    if (!period) {
      return NextResponse.json({ error: 'Periodo no encontrado' }, { status: 404 })
    }

    const { data: listing } = await supabase
      .from('listings')
      .select('owner_id')
      .eq('id', period.listing_id)
      .single()

    if (!listing || listing.owner_id !== userId) {
      return NextResponse.json(
        { error: 'No tienes permiso para modificar este periodo' },
        { status: 403 }
      )
    }

    // Actualizar
    const updated = await updatePeriod(params.id, {
      startDate,
      endDate,
      status,
      notes,
      tenantReference
    })

    return NextResponse.json(updated)

  } catch (error) {
    console.error('[API] Error updating period:', error)
    
    if (error instanceof Error && error.message.includes('solapa')) {
      return NextResponse.json(
        { error: error.message },
        { status: 409 }
      )
    }

    return NextResponse.json(
      { error: 'Error al actualizar el periodo' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/availability/periods/[id]
 * Elimina un periodo
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    // Verificar que el periodo existe y el usuario es el dueño
    const supabase = getSupabaseServerClient()
    const { data: period } = await supabase
      .from('property_availability_periods')
      .select('listing_id')
      .eq('id', params.id)
      .single()

    if (!period) {
      return NextResponse.json({ error: 'Periodo no encontrado' }, { status: 404 })
    }

    const { data: listing } = await supabase
      .from('listings')
      .select('owner_id')
      .eq('id', period.listing_id)
      .single()

    if (!listing || listing.owner_id !== userId) {
      return NextResponse.json(
        { error: 'No tienes permiso para eliminar este periodo' },
        { status: 403 }
      )
    }

    // Eliminar
    await deletePeriod(params.id)

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('[API] Error deleting period:', error)
    return NextResponse.json(
      { error: 'Error al eliminar el periodo' },
      { status: 500 }
    )
  }
}
