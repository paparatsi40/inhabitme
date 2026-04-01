import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { getSupabaseServerClient } from '@/lib/supabase/server'

export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const listingId = String(req.nextUrl.searchParams.get('listingId') || '').trim()
    const role = String(req.nextUrl.searchParams.get('role') || '').trim().toLowerCase()

    const supabase = getSupabaseServerClient()

    let query = supabase
      .from('conversations')
      .select('id, listing_id, inquiry_id, booking_id, host_id, guest_id, guest_email, status, intent_score, message_count, last_message_at, created_at')
      .order('last_message_at', { ascending: false })
      .order('created_at', { ascending: false })

    if (listingId) {
      query = query.eq('listing_id', listingId)
    }

    if (role === 'host') {
      query = query.eq('host_id', userId)
    } else if (role === 'guest') {
      query = query.eq('guest_id', userId)
    } else {
      query = query.or(`host_id.eq.${userId},guest_id.eq.${userId}`)
    }

    const { data, error } = await query

    if (error) {
      console.error('[conversations.GET] error:', error)
      return NextResponse.json({ error: 'Failed to fetch conversations' }, { status: 500 })
    }

    return NextResponse.json({ success: true, conversations: data || [] })
  } catch (error: any) {
    console.error('[conversations.GET] error:', error)
    return NextResponse.json({ error: error?.message || 'Internal server error' }, { status: 500 })
  }
}
