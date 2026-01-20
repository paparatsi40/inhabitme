'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { AvailabilityCalendar } from './AvailabilityCalendar'
import { PeriodList } from './PeriodList'
import { PeriodFormModal } from './PeriodFormModal'
import type { AvailabilityPeriod } from '@/lib/repositories/availability.repository'

interface AvailabilityManagerProps {
  listingId: string
  initialPeriods: AvailabilityPeriod[]
}

export function AvailabilityManager({ listingId, initialPeriods }: AvailabilityManagerProps) {
  const [periods, setPeriods] = useState<AvailabilityPeriod[]>(initialPeriods)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingPeriod, setEditingPeriod] = useState<AvailabilityPeriod | null>(null)
  const [currentMonth, setCurrentMonth] = useState(new Date())

  const handlePeriodCreated = (newPeriod: AvailabilityPeriod) => {
    setPeriods(prev => [...prev, newPeriod].sort((a, b) => 
      new Date(a.start_date).getTime() - new Date(b.start_date).getTime()
    ))
    setIsModalOpen(false)
  }

  const handlePeriodUpdated = (updatedPeriod: AvailabilityPeriod) => {
    setPeriods(prev => 
      prev.map(p => p.id === updatedPeriod.id ? updatedPeriod : p)
        .sort((a, b) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime())
    )
    setEditingPeriod(null)
    setIsModalOpen(false)
  }

  const handlePeriodDeleted = (deletedId: string) => {
    setPeriods(prev => prev.filter(p => p.id !== deletedId))
  }

  const handleEdit = (period: AvailabilityPeriod) => {
    setEditingPeriod(period)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingPeriod(null)
  }

  return (
    <div className="space-y-8">
      {/* Calendario Visual */}
      <div className="bg-white border-2 border-gray-200 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            Calendario de Disponibilidad
          </h2>
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl active:scale-95"
          >
            <Plus className="h-5 w-5" />
            Añadir Periodo
          </button>
        </div>

        <AvailabilityCalendar
          periods={periods}
          currentMonth={currentMonth}
          onMonthChange={setCurrentMonth}
          onPeriodClick={handleEdit}
        />
      </div>

      {/* Lista de Periodos */}
      <div className="bg-white border-2 border-gray-200 rounded-2xl p-6 shadow-sm">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Periodos Registrados
        </h2>

        <PeriodList
          periods={periods}
          onEdit={handleEdit}
          onDelete={handlePeriodDeleted}
        />
      </div>

      {/* Modal de Form */}
      {isModalOpen && (
        <PeriodFormModal
          listingId={listingId}
          period={editingPeriod}
          onClose={handleCloseModal}
          onSuccess={editingPeriod ? handlePeriodUpdated : handlePeriodCreated}
        />
      )}
    </div>
  )
}
