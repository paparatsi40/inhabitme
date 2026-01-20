import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

export async function GET() {
  try {
    const { userId, sessionClaims } = await auth();
    
    return NextResponse.json({
      userId,
      sessionClaims,
      fullClaims: JSON.stringify(sessionClaims, null, 2),
    });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
