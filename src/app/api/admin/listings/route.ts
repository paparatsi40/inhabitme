import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { listingRepository } from '@/lib/repositories/listing.repository'

// GET /api/admin/listings - List all listings (admin only)
export async function GET() {
  try {
    const { userId } = await auth()
    
    console.log('[API /admin/listings] userId:', userId)
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    console.log('[API /admin/listings] Calling listingRepository.getAll()...')
    const listings = await listingRepository.getAll()
    console.log('[API /admin/listings] Got listings:', listings?.length || 0)
    
    return NextResponse.json({ listings })
  } catch (error: any) {
    console.error('[API /admin/listings] Error:', error)
    console.error('[API /admin/listings] Error message:', error?.message)
    console.error('[API /admin/listings] Error stack:', error?.stack)
    return NextResponse.json(
      { error: 'Failed to fetch listings', details: error?.message },
      { status: 500 }
    )
  }
}
