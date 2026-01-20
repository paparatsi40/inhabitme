import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { clerkClient } from '@clerk/nextjs/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const bookingId = params.id;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get booking with all details
    const { data: booking, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('id', bookingId)
      .single();

    if (error || !booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    // Verify user is either host or guest
    if (booking.host_id !== userId && booking.guest_id !== userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Enrich with guest info from Clerk
    let guestInfo = null;
    try {
      const client = await clerkClient();
      const guestUser = await client.users.getUser(booking.guest_id);
      guestInfo = {
        name: `${guestUser.firstName || ''} ${guestUser.lastName || ''}`.trim() || 'Usuario',
        email: guestUser.emailAddresses[0]?.emailAddress,
        imageUrl: guestUser.imageUrl
      };
    } catch (error) {
      console.error('Error fetching guest info:', error);
    }

    // Enrich with host info from Clerk (if user is guest)
    let hostInfo = null;
    if (userId === booking.guest_id) {
      try {
        const client = await clerkClient();
        const hostUser = await client.users.getUser(booking.host_id);
        hostInfo = {
          name: `${hostUser.firstName || ''} ${hostUser.lastName || ''}`.trim() || 'Anfitrión',
          email: hostUser.emailAddresses[0]?.emailAddress,
          imageUrl: hostUser.imageUrl
        };
      } catch (error) {
        console.error('Error fetching host info:', error);
      }
    }

    return NextResponse.json({
      ...booking,
      guest: guestInfo,
      host: hostInfo
    });

  } catch (error) {
    console.error('Get booking error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
