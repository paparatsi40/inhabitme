import { NextResponse } from 'next/server'

// Endpoint desactivado temporalmente (migración Prisma → Drizzle)
export async function POST() {
  return NextResponse.json(
    {
      error: 'Endpoint temporarily disabled (database migration in progress)'
    },
    { status: 503 }
  )
}
