import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { featured } = await request.json();
    const propertyId = params.id;

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Verify property belongs to user
    const { data: property, error: fetchError } = await supabase
      .from('listings')
      .select('owner_id')
      .eq('id', propertyId)
      .single();

    if (fetchError || !property) {
      return NextResponse.json({ error: 'Property not found' }, { status: 404 });
    }

    if (property.owner_id !== userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Update featured status
    const { error: updateError } = await supabase
      .from('listings')
      .update({ featured })
      .eq('id', propertyId);

    if (updateError) {
      console.error('Error updating featured:', updateError);
      return NextResponse.json({ error: 'Error updating featured' }, { status: 500 });
    }

    return NextResponse.json({ success: true, featured });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
