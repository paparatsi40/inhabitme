import { getSupabaseServerClient } from '@/lib/supabase/server'
import { Listing } from '../domain/listing'
import { SearchFilters } from '../domain/search-filters'

function mapRowToListing(row: any): Listing {
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
      availableFrom: new Date(row.available_from),
      availableTo: row.available_to
        ? new Date(row.available_to)
        : undefined,
      minMonths: row.min_months,
      maxMonths: row.max_months
    },

    price: {
      monthly: row.monthly_price,
      currency: row.currency
    },

    images: row.images,

    ownerId: row.owner_id,
    status: row.status,

    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at)
  }
}

export const listingRepository = {
  async search(filters: SearchFilters): Promise<Listing[]> {
    const supabase = getSupabaseServerClient()

    let query = supabase.from('listings').select('*')

    // Case-insensitive search para ciudad
    if (filters.city) {
      query = query.ilike('city_name', filters.city)
    }

    // Case-insensitive search para barrio
    if (filters.neighborhood) {
      query = query.ilike('neighborhood', filters.neighborhood)
    }

    if (filters.minPrice) {
      query = query.gte('monthly_price', filters.minPrice)
    }

    if (filters.maxPrice) {
      query = query.lte('monthly_price', filters.maxPrice)
    }

    if (filters.bedrooms) {
      query = query.gte('bedrooms', filters.bedrooms)
    }

    const { data, error } = await query

    if (error) {
      console.error('[listingRepository.search] Error:', error)
      console.error('[listingRepository.search] Filters:', filters)
      // Return empty array instead of throwing to prevent page crashes
      return []
    }

    return (data ?? []).map(mapRowToListing)
  },

  async getById(id: string): Promise<Listing | null> {
    const supabase = getSupabaseServerClient()

    const { data, error } = await supabase
      .from('listings')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') return null
      throw error
    }

    return mapRowToListing(data)
  },

  async getAll(): Promise<Listing[]> {
    const supabase = getSupabaseServerClient()

    const { data, error } = await supabase
      .from('listings')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('[listingRepository.getAll] Error:', error)
      throw error
    }

    return (data ?? []).map(mapRowToListing)
  },

  async delete(id: string): Promise<void> {
    const supabase = getSupabaseServerClient()

    const { error } = await supabase
      .from('listings')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('[listingRepository.delete] Error:', error)
      throw error
    }
  }
}
