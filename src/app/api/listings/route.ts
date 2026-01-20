// src/app/api/listings/route.ts

import { NextResponse } from 'next/server'
import { listingRepository } from '@/lib/repositories/listing.repository'
import { SearchFilters } from '@/lib/domain/search-filters'

export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)

    const filters: SearchFilters = {
      city: searchParams.get('city') || undefined,
      minPrice: searchParams.get('minPrice')
        ? Number(searchParams.get('minPrice'))
        : undefined,
      maxPrice: searchParams.get('maxPrice')
        ? Number(searchParams.get('maxPrice'))
        : undefined,
      bedrooms: searchParams.get('bedrooms')
        ? Number(searchParams.get('bedrooms'))
        : undefined
    }

    const listings = await listingRepository.search(filters)

    return NextResponse.json(listings)
  } catch (error) {
    console.error('[GET /api/listings]', error)
    return NextResponse.json(
      { error: 'Failed to fetch listings' },
      { status: 500 }
    )
  }
}
