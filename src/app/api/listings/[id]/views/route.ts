import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServerClient } from '@/lib/supabase/server';
import { auth } from '@clerk/nextjs/server';
import { headers } from 'next/headers';

type Ctx = { params: Promise<{ id: string }> };

/**
 * POST /api/listings/[id]/views
 * Registra una vista de un listing
 */
export async function POST(req: NextRequest, { params }: Ctx) {
  try {
    const { id: listingId } = await params;

    // Obtener información de la request
    const body = await req.json().catch(() => ({}));
    const { sessionId, referrer } = body as { sessionId?: string; referrer?: string };

    // Obtener user ID si está autenticado
    const { userId } = await auth();

    // Obtener headers
    const headersList = await headers();
    const userAgent = headersList.get('user-agent') || 'unknown';
    const forwarded = headersList.get('x-forwarded-for');
    const realIp = headersList.get('x-real-ip');
    const visitorIp = forwarded?.split(',')[0] || realIp || 'unknown';

    // Detectar tipo de dispositivo basado en user agent
    const deviceType = detectDeviceType(userAgent);

    // Registrar la vista en Supabase
    const supabase = getSupabaseServerClient();

    const { data, error } = await supabase.rpc('record_listing_view', {
      p_listing_id: listingId,
      p_viewer_id: userId || null,
      p_session_id: sessionId || generateSessionId(),
      p_visitor_ip: visitorIp,
      p_user_agent: userAgent,
      p_referrer_url: referrer || null,
      p_device_type: deviceType,
    });

    if (error) {
      console.error('[Views API] Error recording view:', error);
      // No fallar la request si el tracking falla
      return NextResponse.json(
        { success: false, error: 'Failed to record view' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      viewId: data,
      message: 'View recorded successfully',
    });
  } catch (error) {
    console.error('[Views API] Unexpected error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * Detecta el tipo de dispositivo basado en el user agent
 */
function detectDeviceType(userAgent: string): 'mobile' | 'tablet' | 'desktop' | 'unknown' {
  const ua = userAgent.toLowerCase();

  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobile))/i.test(ua)) {
    return 'tablet';
  }

  if (/mobile|iphone|ipod|android|blackberry|opera mini|opera mobi|iemobile|windows phone/i.test(ua)) {
    return 'mobile';
  }

  if (/mozilla|chrome|safari|firefox|opera|msie|trident/i.test(ua)) {
    return 'desktop';
  }

  return 'unknown';
}

/**
 * Genera un ID de sesión simple
 */
function generateSessionId(): string {
  return `session_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
}