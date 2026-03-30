'use client'

import { useState } from 'react'
import { Edit2, Trash2, Calendar, Clock } from 'lucide-react'
import type { AvailabilityPeriod } from '@/lib/repositories/availability.repository'

interface PeriodListProps {
  periods: AvailabilityPeriod[]
  onEdit: (period: AvailabilityPeriod) => void
  onDelete: (id: string) => void
}

const STATUS_CONFIG = {
  available: { label: 'Disponible', color: 'green', bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-300' },
  rented: { label: 'Rentado', color: 'red', bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-300' },
  blocked: { label: 'Bloqueado', color: 'yellow', bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-300' },
  maintenance: { label: 'Mantenimiento', color: 'orange', bg: 'bg-orange-100', text: 'text-orange-800', border: 'border-orange-300' }
}

export function PeriodList({ periods, onEdit, onDelete }: PeriodListProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })
  }

  const getDuration = (start: string, end: string) => {
    const startDate = new Date(start)
    const endDate = new Date(end)
    const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
    
    if (days < 30) return `${days} días`
    const months = Math.floor(days / 30)
    const remainingDays = days % 30
    return remainingDays > 0 ? `${months} mes${months > 1 ? 'es' : ''}, ${remainingDays} días` : `${months} mes${months > 1 ? 'es' : ''}`
  }

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar este periodo?')) return

    setDeletingId(id)
    try {
      const res = await fetch(`/api/availability/periods/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Error al eliminar')
      onDelete(id)
    } catch (error) {
      alert('Error al eliminar el periodo')
      console.error(error)
    } finally {
      setDeletingId(null)
    }
  }

  if (periods.length === 0) {
    return (
      <div className="text-center py-12">
        <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500 text-lg">No hay periodos registrados</p>
        <p className="text-gray-400 text-sm mt-2">
          Añade el primer periodo para empezar a gestionar la disponibilidad
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {periods.map(period => {
        const config = STATUS_CONFIG[period.status]
        const isDeleting = deletingId === period.id

        return (
          <div
            key={period.id}
            className={`border-2 ${config.border} ${config.bg} rounded-xl p-4 transition-all hover:shadow-md`}
          >
            <div className="flex items-start justify-between gap-4">
              {/* Info */}
              <div className="flex-1">
                {/* Status Badge */}
                <span className={`inline-block px-3 py-1 ${config.bg} ${config.text} text-xs font-bold rounded-full border ${config.border} mb-3`}>
                  {config.label}
                </span>

                {/* Dates */}
                <div className="flex items-center gap-2 text-gray-700 mb-2">
                  <Calendar className="h-4 w-4" />
                  <span className="font-semibold">
                    {formatDate(period.start_date)} → {formatDate(period.end_date)}
                  </span>
                </div>

                {/* Duration */}
                <div className="flex items-center gap-2 text-gray-600 text-sm mb-2">
                  <Clock className="h-4 w-4" />
                  <span>Duración: {getDuration(period.start_date, period.end_date)}</span>
                </div>

                {/* Notes */}
                {period.notes && (
                  <p className="text-sm text-gray-600 mt-2 italic">
                    &quot;{period.notes}&quot;
                  </p>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={() => onEdit(period)}
                  className="p-2 hover:bg-white rounded-lg transition-colors"
                  title="Editar"
                >
                  <Edit2 className="h-5 w-5 text-gray-600" />
                </button>
                <button
                  onClick={() => handleDelete(period.id)}
                  disabled={isDeleting}
                  className="p-2 hover:bg-white rounded-lg transition-colors disabled:opacity-50"
                  title="Eliminar"
                >
                  <Trash2 className="h-5 w-5 text-red-600" />
                </button>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
