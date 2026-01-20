/**
 * Availability Repository
 * Gestión de periodos de disponibilidad de propiedades
 */

import { getSupabaseServerClient } from '@/lib/supabase/server'

export interface AvailabilityPeriod {
  id: string
  listing_id: string
  start_date: string
  end_date: string
  status: 'available' | 'rented' | 'blocked' | 'maintenance'
  notes?: string
  tenant_reference?: string
  created_at: string
  updated_at: string
}

export interface CreatePeriodInput {
  listingId: string
  startDate: string
  endDate: string
  status: 'available' | 'rented' | 'blocked' | 'maintenance'
  notes?: string
  tenantReference?: string
  createdBy?: string
}

/**
 * Obtiene todos los periodos de una propiedad
 */
export async function getListingPeriods(listingId: string): Promise<AvailabilityPeriod[]> {
  const supabase = getSupabaseServerClient()

  const { data, error } = await supabase
    .from('property_availability_periods')
    .select('*')
    .eq('listing_id', listingId)
    .order('start_date', { ascending: true })

  if (error) {
    console.error('[AvailabilityRepo] Error fetching periods:', error)
    throw new Error('Error al cargar periodos de disponibilidad')
  }

  return data || []
}

/**
 * Obtiene periodos en un rango de fechas
 */
export async function getPeriodsInRange(
  listingId: string,
  startDate: string,
  endDate: string
): Promise<AvailabilityPeriod[]> {
  const supabase = getSupabaseServerClient()

  const { data, error } = await supabase
    .from('property_availability_periods')
    .select('*')
    .eq('listing_id', listingId)
    .lte('start_date', endDate)
    .gte('end_date', startDate)
    .order('start_date', { ascending: true })

  if (error) {
    console.error('[AvailabilityRepo] Error fetching range:', error)
    return []
  }

  return data || []
}

/**
 * Crea un nuevo periodo (con validación de overlap en backend)
 */
export async function createPeriod(input: CreatePeriodInput): Promise<AvailabilityPeriod> {
  const supabase = getSupabaseServerClient()

  // Validar overlap usando la función PostgreSQL
  const { data: hasOverlap, error: overlapError } = await supabase
    .rpc('check_availability_overlap', {
      p_listing_id: input.listingId,
      p_start_date: input.startDate,
      p_end_date: input.endDate,
      p_exclude_id: null
    })

  if (overlapError) {
    console.error('[AvailabilityRepo] Error checking overlap:', overlapError)
    throw new Error('Error al validar disponibilidad')
  }

  if (hasOverlap) {
    throw new Error('Este periodo se solapa con otro existente')
  }

  // Crear el periodo
  const { data, error } = await supabase
    .from('property_availability_periods')
    .insert({
      listing_id: input.listingId,
      start_date: input.startDate,
      end_date: input.endDate,
      status: input.status,
      notes: input.notes,
      tenant_reference: input.tenantReference,
      created_by: input.createdBy
    })
    .select()
    .single()

  if (error) {
    console.error('[AvailabilityRepo] Error creating period:', error)
    throw new Error('Error al crear periodo')
  }

  return data
}

/**
 * Actualiza un periodo existente
 */
export async function updatePeriod(
  id: string,
  updates: Partial<CreatePeriodInput>
): Promise<AvailabilityPeriod> {
  const supabase = getSupabaseServerClient()

  // Si está actualizando fechas, validar overlap
  if (updates.startDate || updates.endDate) {
    // Primero obtener el periodo actual para tener todas las fechas
    const { data: currentPeriod } = await supabase
      .from('property_availability_periods')
      .select('*')
      .eq('id', id)
      .single()

    if (currentPeriod) {
      const { data: hasOverlap } = await supabase
        .rpc('check_availability_overlap', {
          p_listing_id: currentPeriod.listing_id,
          p_start_date: updates.startDate || currentPeriod.start_date,
          p_end_date: updates.endDate || currentPeriod.end_date,
          p_exclude_id: id
        })

      if (hasOverlap) {
        throw new Error('Las nuevas fechas se solapan con otro periodo existente')
      }
    }
  }

  const { data, error } = await supabase
    .from('property_availability_periods')
    .update({
      ...(updates.startDate && { start_date: updates.startDate }),
      ...(updates.endDate && { end_date: updates.endDate }),
      ...(updates.status && { status: updates.status }),
      ...(updates.notes !== undefined && { notes: updates.notes }),
      ...(updates.tenantReference !== undefined && { tenant_reference: updates.tenantReference }),
    })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('[AvailabilityRepo] Error updating period:', error)
    throw new Error('Error al actualizar periodo')
  }

  return data
}

/**
 * Elimina un periodo
 */
export async function deletePeriod(id: string): Promise<void> {
  const supabase = getSupabaseServerClient()

  const { error } = await supabase
    .from('property_availability_periods')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('[AvailabilityRepo] Error deleting period:', error)
    throw new Error('Error al eliminar periodo')
  }
}

/**
 * Obtiene la próxima fecha disponible de una propiedad
 */
export async function getNextAvailableDate(listingId: string): Promise<string | null> {
  const supabase = getSupabaseServerClient()

  const { data, error } = await supabase
    .rpc('get_next_available_date', {
      p_listing_id: listingId
    })

  if (error) {
    console.error('[AvailabilityRepo] Error getting next date:', error)
    return null
  }

  return data
}

/**
 * Verifica si una propiedad está disponible en un rango
 */
export async function isAvailableInRange(
  listingId: string,
  startDate: string,
  endDate: string
): Promise<boolean> {
  const supabase = getSupabaseServerClient()

  const { data, error } = await supabase
    .rpc('is_available_in_range', {
      p_listing_id: listingId,
      p_start_date: startDate,
      p_end_date: endDate
    })

  if (error) {
    console.error('[AvailabilityRepo] Error checking availability:', error)
    return false
  }

  return data === true
}

/**
 * Obtiene estadísticas de ocupación
 */
export async function getOccupancyStats(listingId: string) {
  const supabase = getSupabaseServerClient()

  const { data, error } = await supabase
    .from('property_availability_periods')
    .select('*')
    .eq('listing_id', listingId)

  if (error) {
    console.error('[AvailabilityRepo] Error getting stats:', error)
    return {
      totalPeriods: 0,
      rentedPeriods: 0,
      blockedPeriods: 0,
      totalDaysRented: 0,
      occupancyRate: 0
    }
  }

  const totalPeriods = data.length
  const rentedPeriods = data.filter(p => p.status === 'rented').length
  const blockedPeriods = data.filter(p => p.status === 'blocked').length

  // Calcular días rentados
  const totalDaysRented = data
    .filter(p => p.status === 'rented')
    .reduce((sum, period) => {
      const start = new Date(period.start_date)
      const end = new Date(period.end_date)
      const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
      return sum + days
    }, 0)

  // Tasa de ocupación simple (periodos rentados / total periodos)
  const occupancyRate = totalPeriods > 0 ? (rentedPeriods / totalPeriods) * 100 : 0

  return {
    totalPeriods,
    rentedPeriods,
    blockedPeriods,
    totalDaysRented,
    occupancyRate: Math.round(occupancyRate)
  }
}
