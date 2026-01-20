import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { createPeriod } from '@/lib/repositories/availability.repository'
import { getSupabaseServerClient } from '@/lib/supabase/server'

/**
 * POST /api/availability/periods
 * Crea un nuevo periodo de disponibilidad
 */
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const body = await request.json()
    const { listingId, startDate, endDate, status, notes, tenantReference } = body

    // Validar campos requeridos
    if (!listingId || !startDate || !endDate || !status) {
      return NextResponse.json(
        { error: 'Faltan campos requeridos' },
        { status: 400 }
      )
    }

    // Verificar que el usuario es el dueño de la propiedad
    const supabase = getSupabaseServerClient()
    const { data: listing } = await supabase
      .from('listings')
      .select('owner_id')
      .eq('id', listingId)
      .single()

    if (!listing || listing.owner_id !== userId) {
      return NextResponse.json(
        { error: 'No tienes permiso para modificar esta propiedad' },
        { status: 403 }
      )
    }

    // Crear el periodo
    const period = await createPeriod({
      listingId,
      startDate,
      endDate,
      status,
      notes,
      tenantReference,
      createdBy: userId
    })

    return NextResponse.json(period, { status: 201 })

  } catch (error) {
    console.error('[API] Error creating period:', error)
    
    if (error instanceof Error && error.message.includes('solapa')) {
      return NextResponse.json(
        { error: error.message },
        { status: 409 }
      )
    }

    return NextResponse.json(
      { error: 'Error al crear el periodo' },
      { status: 500 }
    )
  }
}
