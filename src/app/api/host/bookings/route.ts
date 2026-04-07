import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const DEFAULT_PAGE_SIZE = 20

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url)
    const page  = Math.max(1, Number(searchParams.get('page')  ?? 1))
    const limit = Math.min(100, Math.max(1, Number(searchParams.get('limit') ?? DEFAULT_PAGE_SIZE)))
    const offset = (page - 1) * limit

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { data: bookings, error, count } = await supabase
      .from('bookings')
      .select('*', { count: 'exact' })
      .eq('host_id', userId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) {
      console.error('[host/bookings] Error fetching bookings:', error);
      return NextResponse.json({ error: 'Error fetching bookings' }, { status: 500 });
    }

    const total = count ?? 0
    return NextResponse.json({
      bookings,
      pagination: { page, limit, total, hasMore: offset + (bookings?.length ?? 0) < total },
    });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
