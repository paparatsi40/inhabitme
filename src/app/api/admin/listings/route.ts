import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { listingRepository } from '@/lib/repositories/listing.repository'

// GET /api/admin/listings - List all listings (admin only)
export async function GET() {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const listings = await listingRepository.getAll()
    
    return NextResponse.json({ listings })
  } catch (error) {
    console.error('[API] Error fetching listings:', error)
    return NextResponse.json(
      { error: 'Failed to fetch listings' },
      { status: 500 }
    )
  }
}
