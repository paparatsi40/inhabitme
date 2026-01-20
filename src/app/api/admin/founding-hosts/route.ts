import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { auth } from '@clerk/nextjs/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function GET(request: NextRequest) {
  try {
    // Verify admin
    const { userId, sessionClaims } = await auth();
    const publicMetadata = (sessionClaims as any)?.public_metadata || (sessionClaims as any)?.publicMetadata || (sessionClaims as any)?.metadata;
    const role = publicMetadata?.role;
    
    // TEMPORARY: Hardcode your user ID as admin until Clerk token is configured
    const TEMP_ADMIN_USER_ID = 'user_37XxJQhGu4KbCylCP8ra8P8Nt0i';
    const isAdmin = role === 'admin' || userId === TEMP_ADMIN_USER_ID;
    
    if (!userId || !isAdmin) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    const { data, error } = await supabase
      .from('founding_host_applications')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Error al obtener aplicaciones' },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
