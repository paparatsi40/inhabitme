import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Webhook } from 'svix';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const webhookSecret = process.env.CLERK_WEBHOOK_SECRET!;

export async function POST(req: NextRequest) {
  try {
    // Get headers
    const svix_id = req.headers.get('svix-id');
    const svix_timestamp = req.headers.get('svix-timestamp');
    const svix_signature = req.headers.get('svix-signature');

    if (!svix_id || !svix_timestamp || !svix_signature) {
      return NextResponse.json(
        { error: 'Missing svix headers' },
        { status: 400 }
      );
    }

    // Get body
    const payload = await req.json();
    const body = JSON.stringify(payload);

    // Verify webhook
    const wh = new Webhook(webhookSecret);
    let evt: any;

    try {
      evt = wh.verify(body, {
        'svix-id': svix_id,
        'svix-timestamp': svix_timestamp,
        'svix-signature': svix_signature,
      });
    } catch (err) {
      console.error('Webhook verification failed:', err);
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      );
    }

    // Handle user.created event
    if (evt.type === 'user.created') {
      const { id: userId, unsafe_metadata } = evt.data;

      // Check if this is a founding host signup
      if (unsafe_metadata?.role === 'founding_host' && unsafe_metadata?.invitation_token) {
        const supabase = createClient(supabaseUrl, supabaseServiceKey);

        // Mark invitation as accepted
        const { error: updateError } = await supabase
          .from('founding_host_invitations')
          .update({
            status: 'accepted',
            user_id: userId,
            accepted_at: new Date().toISOString()
          })
          .eq('token', unsafe_metadata.invitation_token);

        if (updateError) {
          console.error('Error updating invitation:', updateError);
        } else {
          console.log(`Founding Host invitation accepted for user ${userId}`);
        }
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}
