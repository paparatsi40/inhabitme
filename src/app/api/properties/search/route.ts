import { NextResponse } from 'next/server';
import { getSupabaseServerClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    console.log('[API /api/properties/search] Request received');
    
    const { searchParams } = new URL(request.url);
    
    const country = searchParams.get('country');
    const city = searchParams.get('city');
    const neighborhood = searchParams.get('neighborhood');
    const minPrice = searchParams.get('minPrice') ? parseFloat(searchParams.get('minPrice')!) : undefined;
    const maxPrice = searchParams.get('maxPrice') ? parseFloat(searchParams.get('maxPrice')!) : undefined;
    const bedrooms = searchParams.get('bedrooms') ? parseInt(searchParams.get('bedrooms')!) : undefined;
    const minWifiSpeed = searchParams.get('minWifiSpeed') ? parseInt(searchParams.get('minWifiSpeed')!) : undefined;

    console.log('[API /api/properties/search] Filters:', { country, city, neighborhood, minPrice, maxPrice, bedrooms, minWifiSpeed });

    console.log('[API /api/properties/search] Creating Supabase client...');
    const supabase = getSupabaseServerClient();
    console.log('[API /api/properties/search] Supabase client created');
    
    // Start query
    console.log('[API /api/properties/search] Starting query...');
    let query = supabase.from('listings').select('*');

    // Apply filters
    if (country) {
      query = query.ilike('city_country', `%${country}%`);
    }

    if (city) {
      query = query.ilike('city_name', `%${city}%`);
    }

    if (neighborhood) {
      query = query.ilike('neighborhood', `%${neighborhood}%`);
    }

    console.log('[API /api/properties/search] Query with neighborhood:', neighborhood);

    if (minPrice) {
      query = query.gte('monthly_price', minPrice);
    }

    if (maxPrice) {
      query = query.lte('monthly_price', maxPrice);
    }

    if (bedrooms) {
      query = query.gte('bedrooms', bedrooms);
    }

    if (minWifiSpeed) {
      query = query.gte('wifi_speed_mbps', minWifiSpeed);
    }

    // Execute query
    console.log('[API /api/properties/search] Executing query...');
    const { data, error } = await query
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[API /api/properties/search] Supabase error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    console.log('[API /api/properties/search] Query successful, rows:', data?.length || 0);
    
    // Debug: Log neighborhoods found
    if (data && data.length > 0) {
      const neighborhoods = data.map((l: any) => ({ 
        id: l.id, 
        neighborhood: l.neighborhood, 
        city: l.city_name 
      }));
      console.log('[API /api/properties/search] Neighborhoods in results:', neighborhoods);
    }

    // Filter active listings in memory (case-insensitive)
    const activeListings = (data || []).filter((listing: any) => 
      listing.status?.toLowerCase() === 'active'
    );

    console.log('[API /api/properties/search] Active listings:', activeListings.length);

    // Mapear al formato esperado por el frontend
    const listings = activeListings.map((listing: any) => ({
      id: listing.id,
      title: listing.title,
      description: listing.description,
      city: { name: listing.city_name, country: listing.city_country },
      neighborhood: listing.neighborhood ? { name: listing.neighborhood } : undefined,
      bedrooms: listing.bedrooms,
      bathrooms: listing.bathrooms,
      amenities: {
        wifiSpeedMbps: listing.wifi_speed_mbps,
        hasDesk: listing.has_desk,
        hasSecondMonitor: listing.has_second_monitor,
        furnished: listing.furnished
      },
      price: { monthly: listing.monthly_price, currency: listing.currency },
      images: listing.images || [],
      ownerId: listing.owner_id,
      status: listing.status,
      createdAt: listing.created_at
    }));

    // Retornar en formato {data: ...} como espera el cliente
    return NextResponse.json({ data: listings });
  } catch (error: any) {
    console.error('[API /api/properties/search] Caught error:', error);
    console.error('[API /api/properties/search] Error stack:', error?.stack);
    return NextResponse.json({ 
      error: error.message || 'Failed to search properties',
      stack: process.env.NODE_ENV === 'development' ? error?.stack : undefined 
    }, { status: 500 });
  }
}
