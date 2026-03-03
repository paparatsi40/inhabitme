import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { listingRepository } from '@/lib/repositories/listing.repository'

// DELETE /api/admin/listings/[id] - Delete a listing (admin only)
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    if (!id) {
      return NextResponse.json(
        { error: 'Listing ID is required' },
        { status: 400 }
      )
    }

    await listingRepository.delete(id)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[API] Error deleting listing:', error)
    return NextResponse.json(
      { error: 'Failed to delete listing' },
      { status: 500 }
    )
  }
}