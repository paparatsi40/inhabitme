import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServerClient } from '@/lib/supabase/server';

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

const DEFAULT_PAGE_SIZE = 20
const MAX_PAGE_SIZE = 100

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  const page  = Math.max(1, Number(searchParams.get('page')  ?? 1))
  const limit = Math.min(MAX_PAGE_SIZE, Math.max(1, Number(searchParams.get('limit') ?? DEFAULT_PAGE_SIZE)))
  const offset = (page - 1) * limit

  // Helper para parsear boolean
  const parseBoolean = (value: string | null) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return undefined;
  };

  const filters = {
    // Ubicación
    city: searchParams.get('city') || undefined,
    neighborhood: searchParams.get('neighborhood') || undefined,
    
    // Precio y espacio
    minPrice: searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined,
    maxPrice: searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined,
    bedrooms: searchParams.get('bedrooms') ? Number(searchParams.get('bedrooms')) : undefined,
    bathrooms: searchParams.get('bathrooms') ? Number(searchParams.get('bathrooms')) : undefined,
    
    // Trabajo remoto
    minWifiSpeed: searchParams.get('minWifiSpeed') ? Number(searchParams.get('minWifiSpeed')) : undefined,
    hasDesk: parseBoolean(searchParams.get('hasDesk')),
    hasSecondMonitor: parseBoolean(searchParams.get('hasSecondMonitor')),
    
    // Clima y confort
    hasHeating: parseBoolean(searchParams.get('hasHeating')),
    hasAc: parseBoolean(searchParams.get('hasAc')),
    hasBalcony: parseBoolean(searchParams.get('hasBalcony')),
    hasTerrace: parseBoolean(searchParams.get('hasTerrace')),
    
    // Hogar y comodidades
    hasWashingMachine: parseBoolean(searchParams.get('hasWashingMachine')),
    hasDryer: parseBoolean(searchParams.get('hasDryer')),
    hasDishwasher: parseBoolean(searchParams.get('hasDishwasher')),
    hasKitchen: parseBoolean(searchParams.get('hasKitchen')),
    
    // Edificio y accesibilidad
    hasElevator: parseBoolean(searchParams.get('hasElevator')),
    hasParking: parseBoolean(searchParams.get('hasParking')),
    hasDoorman: parseBoolean(searchParams.get('hasDoorman')),
    maxFloor: searchParams.get('maxFloor') ? Number(searchParams.get('maxFloor')) : undefined,
    
    // Mascotas y estilo de vida
    petsAllowed: parseBoolean(searchParams.get('petsAllowed')),
    smokingAllowed: parseBoolean(searchParams.get('smokingAllowed')),
    
    // Seguridad
    hasSecuritySystem: parseBoolean(searchParams.get('hasSecuritySystem')),
    hasSafe: parseBoolean(searchParams.get('hasSafe')),
    
    // Otros
    furnished: parseBoolean(searchParams.get('furnished')),
    featured: parseBoolean(searchParams.get('featured')),
  };

  try {
    const supabase = getSupabaseServerClient();
    // Usar ilike para status (case-insensitive) o filtrar después
    let query = supabase.from('listings').select('*');

    // Aplicar filtros de ubicación
    if (filters.city) {
      query = query.ilike('city_name', filters.city);
    }

    if (filters.neighborhood) {
      query = query.ilike('neighborhood', filters.neighborhood);
    }

    // Aplicar filtros de precio y espacio
    if (filters.minPrice) {
      query = query.gte('monthly_price', filters.minPrice);
    }

    if (filters.maxPrice) {
      query = query.lte('monthly_price', filters.maxPrice);
    }

    if (filters.bedrooms) {
      query = query.gte('bedrooms', filters.bedrooms);
    }

    if (filters.bathrooms) {
      query = query.gte('bathrooms', filters.bathrooms);
    }

    // Filtros de trabajo remoto
    if (filters.minWifiSpeed) {
      query = query.gte('wifi_speed_mbps', filters.minWifiSpeed);
    }

    if (filters.hasDesk === true) {
      query = query.eq('has_desk', true);
    }

    if (filters.hasSecondMonitor === true) {
      query = query.eq('has_second_monitor', true);
    }

    // Filtros de clima y confort
    if (filters.hasHeating === true) {
      query = query.eq('has_heating', true);
    }

    if (filters.hasAc === true) {
      query = query.eq('has_ac', true);
    }

    if (filters.hasBalcony === true) {
      query = query.eq('has_balcony', true);
    }

    if (filters.hasTerrace === true) {
      query = query.eq('has_terrace', true);
    }

    // Filtros de hogar y comodidades
    if (filters.hasWashingMachine === true) {
      query = query.eq('has_washing_machine', true);
    }

    if (filters.hasDryer === true) {
      query = query.eq('has_dryer', true);
    }

    if (filters.hasDishwasher === true) {
      query = query.eq('has_dishwasher', true);
    }

    if (filters.hasKitchen === true) {
      query = query.eq('has_kitchen', true);
    }

    // Filtros de edificio y accesibilidad
    if (filters.hasElevator === true) {
      query = query.eq('has_elevator', true);
    }

    if (filters.hasParking === true) {
      query = query.eq('has_parking', true);
    }

    if (filters.hasDoorman === true) {
      query = query.eq('has_doorman', true);
    }

    if (filters.maxFloor !== undefined) {
      query = query.lte('floor_number', filters.maxFloor);
    }

    // Filtros de mascotas y estilo de vida
    if (filters.petsAllowed === true) {
      query = query.eq('pets_allowed', true);
    }

    if (filters.smokingAllowed === true) {
      query = query.eq('smoking_allowed', true);
    }

    // Filtros de seguridad
    if (filters.hasSecuritySystem === true) {
      query = query.eq('has_security_system', true);
    }

    if (filters.hasSafe === true) {
      query = query.eq('has_safe', true);
    }

    // Otros filtros
    if (filters.furnished === true) {
      query = query.eq('furnished', true);
    }

    if (filters.featured === true) {
      query = query.eq('featured', true);
    }

    // Solo listings activos (filtrado en DB, no en memoria)
    query = query.eq('status', 'active')

    // Contar total para paginación
    const { count } = await (query as any).select('id', { count: 'exact', head: true })

    // Ordenar y paginar: Featured primero, luego por fecha
    const { data, error } = await query
      .order('featured', { ascending: false })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) {
      console.error('[listings/search] Supabase error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const listings = (data || []).map(mapRowToListing);
    const total = count ?? listings.length

    return NextResponse.json({
      data: listings,
      pagination: { page, limit, total, hasMore: offset + listings.length < total },
    });
  } catch (error: any) {
    console.error('[API /api/listings/search] Exception:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
