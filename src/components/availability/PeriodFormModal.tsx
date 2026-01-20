'use client'

import { useState, FormEvent } from 'react'
import { X, Calendar, AlertCircle } from 'lucide-react'
import type { AvailabilityPeriod } from '@/lib/repositories/availability.repository'

interface PeriodFormModalProps {
  listingId: string
  period?: AvailabilityPeriod | null
  onClose: () => void
  onSuccess: (period: AvailabilityPeriod) => void
}

export function PeriodFormModal({ listingId, period, onClose, onSuccess }: PeriodFormModalProps) {
  const [formData, setFormData] = useState({
    startDate: period?.start_date.split('T')[0] || '',
    endDate: period?.end_date.split('T')[0] || '',
    status: period?.status || 'rented',
    notes: period?.notes || ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    // Validación básica
    if (!formData.startDate || !formData.endDate) {
      setError('Las fechas son obligatorias')
      setLoading(false)
      return
    }

    if (new Date(formData.startDate) >= new Date(formData.endDate)) {
      setError('La fecha de fin debe ser posterior a la de inicio')
      setLoading(false)
      return
    }

    try {
      const url = period 
        ? `/api/availability/periods/${period.id}`
        : '/api/availability/periods'
      
      const method = period ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          listingId,
          startDate: formData.startDate,
          endDate: formData.endDate,
          status: formData.status,
          notes: formData.notes || undefined
        })
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Error al guardar')
      }

      const savedPeriod = await res.json()
      onSuccess(savedPeriod)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar el periodo')
    } finally {
      setLoading(false)
    }
  }

  const getDuration = () => {
    if (!formData.startDate || !formData.endDate) return null
    const start = new Date(formData.startDate)
    const end = new Date(formData.endDate)
    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
    
    if (days <= 0) return null
    if (days < 30) return `${days} días`
    
    const months = Math.floor(days / 30)
    const remainingDays = days % 30
    return remainingDays > 0 
      ? `${months} mes${months > 1 ? 'es' : ''}, ${remainingDays} días`
      : `${months} mes${months > 1 ? 'es' : ''}`
  }

  const duration = getDuration()

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
              <Calendar className="h-5 w-5 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">
              {period ? 'Editar Periodo' : 'Nuevo Periodo'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Error Alert */}
          {error && (
            <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          {/* Status */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Estado del periodo
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as any }))}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
              required
            >
              <option value="rented">Rentado</option>
              <option value="blocked">Bloqueado</option>
              <option value="maintenance">Mantenimiento</option>
            </select>
          </div>

          {/* Start Date */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Fecha de inicio
            </label>
            <input
              type="date"
              value={formData.startDate}
              onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
              required
            />
          </div>

          {/* End Date */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Fecha de fin
            </label>
            <input
              type="date"
              value={formData.endDate}
              onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
              required
            />
          </div>

          {/* Duration Display */}
          {duration && (
            <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
              <p className="text-sm text-blue-800">
                <strong>Duración:</strong> {duration}
              </p>
            </div>
          )}

          {/* Notes */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Notas (opcional)
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Ej: Inquilino confirmado, contrato firmado..."
              rows={3}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all resize-none"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
            >
              {loading ? 'Guardando...' : period ? 'Actualizar' : 'Crear Periodo'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
