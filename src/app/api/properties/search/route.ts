import { NextResponse } from 'next/server';
import { getSupabaseServerClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const country = searchParams.get('country');
    const city = searchParams.get('city');
    const neighborhood = searchParams.get('neighborhood');
    const minPrice = searchParams.get('minPrice') ? parseFloat(searchParams.get('minPrice')!) : undefined;
    const maxPrice = searchParams.get('maxPrice') ? parseFloat(searchParams.get('maxPrice')!) : undefined;
    const bedrooms = searchParams.get('bedrooms') ? parseInt(searchParams.get('bedrooms')!) : undefined;
    const minWifiSpeed = searchParams.get('minWifiSpeed') ? parseInt(searchParams.get('minWifiSpeed')!) : undefined;

    const supabase = getSupabaseServerClient();

    let query = supabase.from('listings').select('*');

    if (country)      query = query.ilike('city_country', `%${country}%`);
    if (city)         query = query.ilike('city_name', `%${city}%`);
    if (neighborhood) query = query.ilike('neighborhood', `%${neighborhood}%`);
    if (minPrice)     query = query.gte('monthly_price', minPrice);
    if (maxPrice)     query = query.lte('monthly_price', maxPrice);
    if (bedrooms)     query = query.gte('bedrooms', bedrooms);
    if (minWifiSpeed) query = query.gte('wifi_speed_mbps', minWifiSpeed);

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) {
      console.error('[properties/search] Supabase error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Filter active listings in memory (case-insensitive)
    const activeListings = (data || []).filter((listing: any) =>
      listing.status?.toLowerCase() === 'active'
    );

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

    return NextResponse.json(
      { data: listings },
      { headers: { 'Cache-Control': 's-maxage=30, stale-while-revalidate=60' } }
    );
  } catch (error: any) {
    console.error('[properties/search] Unexpected error:', error?.message);
    return NextResponse.json({
      error: error.message || 'Failed to search properties',
      stack: process.env.NODE_ENV === 'development' ? error?.stack : undefined
    }, { status: 500 });
  }
}
