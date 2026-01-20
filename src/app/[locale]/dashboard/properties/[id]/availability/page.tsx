import { Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'
import { auth } from '@clerk/nextjs/server'
import Link from 'next/link'
import { ArrowLeft, Calendar } from 'lucide-react'
import { getSupabaseServerClient } from '@/lib/supabase/server'
import { getListingPeriods, getOccupancyStats } from '@/lib/repositories/availability.repository'
import { AvailabilityManager } from '@/components/availability/AvailabilityManager'

export const metadata: Metadata = {
  title: 'Gestión de Disponibilidad',
  description: 'Gestiona la disponibilidad de tu propiedad'
}

interface PageProps {
  params: {
    id: string
  }
}

export default async function PropertyAvailabilityPage({ params }: PageProps) {
  const { userId } = await auth()
  
  if (!userId) {
    redirect('/sign-in')
  }

  const supabase = getSupabaseServerClient()

  // Obtener la propiedad
  const { data: listing, error } = await supabase
    .from('listings')
    .select('*')
    .eq('id', params.id)
    .single()

  if (error || !listing) {
    notFound()
  }

  // Verificar que el usuario es el dueño
  if (listing.owner_id !== userId) {
    redirect('/dashboard')
  }

  // Obtener periodos y estadísticas
  const periods = await getListingPeriods(params.id)
  const stats = await getOccupancyStats(params.id)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      {/* Navigation */}
      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link 
            href={`/dashboard/properties`}
            className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver a Mis Propiedades
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl">
              <Calendar className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-gray-900">
                Gestión de Disponibilidad
              </h1>
              <p className="text-gray-600 mt-1">
                {listing.title}
              </p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
            {/* Total Periodos */}
            <div className="bg-white border-2 border-gray-200 rounded-xl p-4">
              <p className="text-sm text-gray-600">Total Periodos</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">
                {stats.totalPeriods}
              </p>
            </div>

            {/* Rentados */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-300 rounded-xl p-4">
              <p className="text-sm text-green-700">Rentados</p>
              <p className="text-3xl font-bold text-green-900 mt-1">
                {stats.rentedPeriods}
              </p>
            </div>

            {/* Días Rentados */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-300 rounded-xl p-4">
              <p className="text-sm text-blue-700">Días Rentados</p>
              <p className="text-3xl font-bold text-blue-900 mt-1">
                {stats.totalDaysRented}
              </p>
            </div>

            {/* Tasa de Ocupación */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-300 rounded-xl p-4">
              <p className="text-sm text-purple-700">Ocupación</p>
              <p className="text-3xl font-bold text-purple-900 mt-1">
                {stats.occupancyRate}%
              </p>
            </div>
          </div>
        </div>

        {/* Availability Manager Component */}
        <AvailabilityManager
          listingId={params.id}
          initialPeriods={periods}
        />
      </main>
    </div>
  )
}
