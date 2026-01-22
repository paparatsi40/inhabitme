import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { getSupabaseServerClient } from '@/lib/supabase/server';

/**
 * GET /api/user/preferences
 * Obtiene las preferencias del usuario actual
 */
export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const supabase = getSupabaseServerClient();

    // Obtener o crear preferencias
    const { data, error } = await supabase
      .rpc('get_or_create_user_preferences', { p_user_id: userId })
      .single();

    if (error) {
      console.error('[Preferences API] Error fetching preferences:', error);
      return NextResponse.json(
        { error: 'Failed to fetch preferences' },
        { status: 500 }
      );
    }

    return NextResponse.json(data);

  } catch (error) {
    console.error('[Preferences API] Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/user/preferences
 * Actualiza una preferencia específica del usuario
 */
export async function PATCH(req: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { key, value } = body;

    if (!key || typeof value !== 'boolean') {
      return NextResponse.json(
        { error: 'Invalid request. Expected { key: string, value: boolean }' },
        { status: 400 }
      );
    }

    // Validar que la key es una preferencia válida
    const validKeys = [
      'email_new_leads',
      'email_new_bookings',
      'email_booking_updates',
      'email_messages',
      'email_marketing',
      'push_notifications',
      'newsletter_subscribed',
      'product_updates',
      'tips_and_guides',
    ];

    if (!validKeys.includes(key)) {
      return NextResponse.json(
        { error: `Invalid preference key: ${key}` },
        { status: 400 }
      );
    }

    const supabase = getSupabaseServerClient();

    // Actualizar la preferencia
    const { data, error } = await supabase
      .rpc('update_user_preference', {
        p_user_id: userId,
        p_preference_key: key,
        p_value: value,
      })
      .single();

    if (error) {
      console.error('[Preferences API] Error updating preference:', error);
      return NextResponse.json(
        { error: 'Failed to update preference' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      preferences: data,
    });

  } catch (error) {
    console.error('[Preferences API] Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
