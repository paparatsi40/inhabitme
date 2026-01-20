import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

export async function GET(request: NextRequest) {
  try {
    const { userId, sessionClaims } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is Founding Host with 2026 benefits
    const publicMetadata = (sessionClaims as any)?.public_metadata || {};
    const unsafeMetadata = (sessionClaims as any)?.unsafe_metadata || {};
    const metadata = { ...publicMetadata, ...unsafeMetadata };
    
    const isFoundingHost = metadata.role === 'founding_host' && 
                          metadata.founding_host_year === 2026;
    
    return NextResponse.json({
      isFoundingHost,
      foundingHostNumber: metadata.founding_host_number || null,
      foundingHostYear: metadata.founding_host_year || null
    });
  } catch (error) {
    console.error('Error checking founding host:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
