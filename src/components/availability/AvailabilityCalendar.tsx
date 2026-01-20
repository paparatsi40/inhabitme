'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { AvailabilityPeriod } from '@/lib/repositories/availability.repository'

interface AvailabilityCalendarProps {
  periods: AvailabilityPeriod[]
  currentMonth: Date
  onMonthChange: (date: Date) => void
  onPeriodClick?: (period: AvailabilityPeriod) => void
}

const DAYS = ['L', 'M', 'M', 'J', 'V', 'S', 'D']
const MONTHS = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
]

export function AvailabilityCalendar({
  periods,
  currentMonth,
  onMonthChange,
  onPeriodClick
}: AvailabilityCalendarProps) {
  const year = currentMonth.getFullYear()
  const month = currentMonth.getMonth()

  // Obtener días del mes
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const daysInMonth = lastDay.getDate()
  const startingDayOfWeek = (firstDay.getDay() + 6) % 7 // Lunes = 0

  // Crear array de días
  const days: (number | null)[] = []
  
  // Días vacíos al inicio
  for (let i = 0; i < startingDayOfWeek; i++) {
    days.push(null)
  }
  
  // Días del mes
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i)
  }

  // Función para obtener el estado de un día
  const getDayStatus = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    const date = new Date(dateStr)

    // Buscar periodo que contenga esta fecha
    const period = periods.find(p => {
      const start = new Date(p.start_date)
      const end = new Date(p.end_date)
      return date >= start && date <= end
    })

    return period
  }

  // Estilos por estado
  const getStatusStyles = (status: string | undefined) => {
    if (!status) return 'bg-green-50 border-green-200 text-green-700 hover:bg-green-100'
    
    switch (status) {
      case 'rented':
        return 'bg-red-100 border-red-300 text-red-800 cursor-pointer hover:bg-red-200'
      case 'blocked':
        return 'bg-yellow-100 border-yellow-300 text-yellow-800 cursor-pointer hover:bg-yellow-200'
      case 'maintenance':
        return 'bg-orange-100 border-orange-300 text-orange-800 cursor-pointer hover:bg-orange-200'
      default:
        return 'bg-green-50 border-green-200 text-green-700 hover:bg-green-100'
    }
  }

  const prevMonth = () => {
    const newDate = new Date(year, month - 1, 1)
    onMonthChange(newDate)
  }

  const nextMonth = () => {
    const newDate = new Date(year, month + 1, 1)
    onMonthChange(newDate)
  }

  const today = new Date()
  const isToday = (day: number) => {
    return today.getDate() === day && 
           today.getMonth() === month && 
           today.getFullYear() === year
  }

  return (
    <div>
      {/* Navigation */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={prevMonth}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          aria-label="Mes anterior"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        <h3 className="text-xl font-bold text-gray-900">
          {MONTHS[month]} {year}
        </h3>

        <button
          onClick={nextMonth}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          aria-label="Mes siguiente"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      {/* Días de la semana */}
      <div className="grid grid-cols-7 gap-2 mb-2">
        {DAYS.map(day => (
          <div
            key={day}
            className="text-center text-sm font-semibold text-gray-600 py-2"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendario */}
      <div className="grid grid-cols-7 gap-2">
        {days.map((day, index) => {
          if (day === null) {
            return <div key={`empty-${index}`} />
          }

          const period = getDayStatus(day)
          const statusStyles = getStatusStyles(period?.status)
          const isTodayDate = isToday(day)

          return (
            <button
              key={day}
              onClick={() => period && onPeriodClick?.(period)}
              className={`
                relative aspect-square border-2 rounded-lg font-medium text-sm
                transition-all
                ${statusStyles}
                ${isTodayDate ? 'ring-2 ring-blue-500 ring-offset-2' : ''}
              `}
            >
              {day}
              {isTodayDate && (
                <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-blue-600 rounded-full" />
              )}
            </button>
          )
        })}
      </div>

      {/* Leyenda */}
      <div className="mt-6 flex flex-wrap gap-4 justify-center text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-100 border-2 border-green-300 rounded" />
          <span className="text-gray-700">Disponible</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-100 border-2 border-red-300 rounded" />
          <span className="text-gray-700">Rentado</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-yellow-100 border-2 border-yellow-300 rounded" />
          <span className="text-gray-700">Bloqueado</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-orange-100 border-2 border-orange-300 rounded" />
          <span className="text-gray-700">Mantenimiento</span>
        </div>
      </div>

      {/* Hint */}
      <p className="text-sm text-gray-500 text-center mt-4">
        💡 Click en un día ocupado para ver o editar el periodo
      </p>
    </div>
  )
}
