import { NextRequest, NextResponse } from 'next/server'

// Endpoint ultra-simple de prueba
export async function POST(req: NextRequest) {
  console.log('[API DEBUG] Request received')
  
  try {
    const body = await req.json()
    console.log('[API DEBUG] Body parsed:', body)
    
    return NextResponse.json({ 
      success: true, 
      message: 'Debug endpoint working',
      received: body,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.log('[API DEBUG] Error parsing body, returning empty test')
    return NextResponse.json({ 
      success: true, 
      message: 'Debug endpoint working (no body parsed)',
      timestamp: new Date().toISOString()
    })
  }
}
