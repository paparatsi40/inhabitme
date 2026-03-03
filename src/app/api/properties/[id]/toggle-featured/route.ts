import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { getSupabaseServerClient } from '@/lib/supabase/server'

type Ctx = { params: Promise<{ id: string }> }

export async function POST(request: NextRequest, { params }: Ctx) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id: propertyId } = await params
    if (!propertyId) {
      return NextResponse.json({ error: 'Property ID is required' }, { status: 400 })
    }

    const supabase = getSupabaseServerClient()

    // ✅ aquí va tu lógica actual para alternar featured
    // por ejemplo:
    // 1) verificar owner
    // 2) leer featured
    // 3) actualizar featured = !featured
    // 4) return NextResponse.json({ success: true, featured: newValue })

    return NextResponse.json({ success: true, featured: true })
  } catch (error: any) {
    return NextResponse.json({ error: error?.message ?? 'Internal server error' }, { status: 500 })
  }
}