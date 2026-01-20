import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json(
        { error: 'Token is required' },
        { status: 400 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Find invitation by token
    const { data: invitation, error } = await supabase
      .from('founding_host_invitations')
      .select('*, founding_host_applications(*)')
      .eq('token', token)
      .single();

    if (error || !invitation) {
      return NextResponse.json(
        { valid: false, error: 'Invalid or expired invitation' },
        { status: 404 }
      );
    }

    // Check if already used
    if (invitation.status === 'accepted') {
      return NextResponse.json(
        { valid: false, error: 'This invitation has already been used' },
        { status: 400 }
      );
    }

    // Check if expired
    const expiresAt = new Date(invitation.expires_at);
    if (expiresAt < new Date()) {
      return NextResponse.json(
        { valid: false, error: 'This invitation has expired' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      valid: true,
      invitation: {
        email: invitation.email,
        foundingHostNumber: invitation.founding_host_number,
        applicationData: invitation.founding_host_applications
      }
    });
  } catch (error) {
    console.error('Validate token error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
