import { NextResponse } from 'next/server'

// Endpoint desactivado temporalmente mientras migramos de Prisma a Drizzle
export async function POST() {
  return NextResponse.json(
    {
      error: 'Endpoint temporarily disabled (migrating database layer)'
    },
    { status: 503 }
  )
}
