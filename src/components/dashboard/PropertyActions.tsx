'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Eye, Calendar, Pencil, Trash2, Loader2 } from 'lucide-react'
import Link from 'next/link'

interface PropertyActionsProps {
  propertyId: string
  propertyTitle: string
}

export function PropertyActions({ propertyId, propertyTitle }: PropertyActionsProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const router = useRouter()

  const handleDelete = async () => {
    const confirmed = confirm(
      `¿Estás seguro de eliminar "${propertyTitle}"?\n\nEsta acción no se puede deshacer.`
    )

    if (!confirmed) return

    setIsDeleting(true)

    try {
      const res = await fetch(`/api/properties/${propertyId}`, {
        method: 'DELETE'
      })

      if (!res.ok) {
        throw new Error('Failed to delete')
      }

      // Refresh the page to show updated list
      router.refresh()
    } catch (error) {
      alert('Error al eliminar la propiedad')
      console.error(error)
      setIsDeleting(false)
    }
  }

  return (
    <div className="flex flex-wrap gap-2">
      {/* View Public */}
      <Link href={`/properties/${propertyId}`}>
        <Button variant="outline" size="sm" className="border-2">
          <Eye className="h-4 w-4 mr-2" />
          Ver Pública
        </Button>
      </Link>

      {/* Availability */}
      <Link href={`/dashboard/properties/${propertyId}/availability`}>
        <Button variant="outline" size="sm" className="border-2 border-blue-300 text-blue-700 hover:bg-blue-50">
          <Calendar className="h-4 w-4 mr-2" />
          Disponibilidad
        </Button>
      </Link>

      {/* Edit */}
      <Link href={`/properties/${propertyId}/edit`}>
        <Button variant="outline" size="sm" className="border-2 border-green-300 text-green-700 hover:bg-green-50">
          <Pencil className="h-4 w-4 mr-2" />
          Editar
        </Button>
      </Link>

      {/* Delete */}
      <Button
        onClick={handleDelete}
        disabled={isDeleting}
        variant="outline"
        size="sm"
        className="border-2 border-red-300 text-red-700 hover:bg-red-50 disabled:opacity-50"
      >
        {isDeleting ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Eliminando...
          </>
        ) : (
          <>
            <Trash2 className="h-4 w-4 mr-2" />
            Eliminar
          </>
        )}
      </Button>
    </div>
  )
}
