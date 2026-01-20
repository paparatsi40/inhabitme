import { NextResponse } from 'next/server';
import { db } from '@/db';
import { properties, users } from '@/db/schema';
import { eq, and, gte, lte, ilike } from 'drizzle-orm';

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    
    const country = searchParams.get('country');
    const city = searchParams.get('city');
    const minPrice = searchParams.get('minPrice') ? parseFloat(searchParams.get('minPrice')!) : undefined;
    const maxPrice = searchParams.get('maxPrice') ? parseFloat(searchParams.get('maxPrice')!) : undefined;
    const bedrooms = searchParams.get('bedrooms') ? parseInt(searchParams.get('bedrooms')!) : undefined;
    const minWifiSpeed = searchParams.get('minWifiSpeed') ? parseInt(searchParams.get('minWifiSpeed')!) : undefined;

    // Build conditions
    const conditions = [
      eq(properties.status, 'ACTIVE')
    ];

    if (country) {
      conditions.push(ilike(properties.country, `%${country}%`));
    }

    if (city) {
      conditions.push(ilike(properties.city, `%${city}%`));
    }

    if (minPrice) {
      conditions.push(gte(properties.monthlyPrice, minPrice.toString()));
    }

    if (maxPrice) {
      conditions.push(lte(properties.monthlyPrice, maxPrice.toString()));
    }

    if (bedrooms) {
      conditions.push(gte(properties.bedrooms, bedrooms));
    }

    if (minWifiSpeed) {
      conditions.push(gte(properties.wifiSpeed, minWifiSpeed));
    }

    // Query with Drizzle
    const results = await db
      .select({
        id: properties.id,
        title: properties.title,
        description: properties.description,
        city: properties.city,
        country: properties.country,
        address: properties.address,
        monthlyPrice: properties.monthlyPrice,
        depositAmount: properties.depositAmount,
        bedrooms: properties.bedrooms,
        bathrooms: properties.bathrooms,
        hasDesk: properties.hasDesk,
        wifiSpeed: properties.wifiSpeed,
        wifiVerified: properties.wifiVerified,
        hasSecondMonitor: properties.hasSecondMonitor,
        isVerified: properties.isVerified,
        status: properties.status,
        host: {
          id: users.id,
          firstName: users.firstName,
          lastName: users.lastName,
          imageUrl: users.imageUrl,
        }
      })
      .from(properties)
      .leftJoin(users, eq(properties.hostId, users.id))
      .where(and(...conditions))
      .orderBy(properties.createdAt);

    return NextResponse.json(results);
  } catch (error) {
    console.error('Error searching properties:', error);
    return NextResponse.json({ error: 'Failed to search properties' }, { status: 500 });
  }
}