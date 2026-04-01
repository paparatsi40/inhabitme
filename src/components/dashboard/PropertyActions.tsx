'use client'

import { useState } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Eye, Calendar, Pencil, Trash2, Loader2, Palette, UploadCloud, PauseCircle } from 'lucide-react'
import { Link } from '@/i18n/routing'

interface PropertyActionsProps {
  propertyId: string
  propertyTitle: string
  propertyStatus?: 'active' | 'inactive' | string
}

export function PropertyActions({ propertyId, propertyTitle, propertyStatus }: PropertyActionsProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false)
  const router = useRouter()
  const t = useTranslations('dashboard')
  const locale = useLocale()
  const isActive = propertyStatus === 'active'

  const handleDelete = async () => {
    const confirmed = confirm(
      t('deleteConfirm', { title: propertyTitle })
    )

    if (!confirmed) return

    setIsDeleting(true)

    try {
      const res = await fetch(`/api/properties/${propertyId}`, {
        method: 'DELETE'
      })

      if (!res.ok) {
        throw new Error(t('deleteFailed'))
      }

      router.refresh()
    } catch (error) {
      alert(t('deleteErrorAlert'))
      console.error(error)
      setIsDeleting(false)
    }
  }

  const handleTogglePublish = async () => {
    const nextStatus = isActive ? 'inactive' : 'active'
    setIsUpdatingStatus(true)

    try {
      const res = await fetch(`/api/properties/${propertyId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus }),
      })

      if (!res.ok) {
        throw new Error('Failed to update property status')
      }

      router.refresh()
    } catch (error) {
      alert(t('statusUpdateError'))
      console.error(error)
    } finally {
      setIsUpdatingStatus(false)
    }
  }

  return (
    <div className="flex flex-wrap gap-2">
      {/* View Public */}
      <Button 
        variant="outline" 
        size="sm" 
        className="border-2"
        onClick={() => window.open(`/${locale}/properties/${propertyId}?v=${Date.now()}`, '_blank')}
      >
        <Eye className="h-4 w-4 mr-2" />
        {t('viewPublic')}
      </Button>

      {/* Availability */}
      <Link href={`/dashboard/properties/${propertyId}/availability`}>
        <Button variant="outline" size="sm" className="border-2 border-blue-300 text-blue-700 hover:bg-blue-50">
          <Calendar className="h-4 w-4 mr-2" />
          {t('availability')}
        </Button>
      </Link>

      {/* Edit */}
      <Link href={`/dashboard/properties/${propertyId}/edit`}>
        <Button variant="outline" size="sm" className="border-2 border-green-300 text-green-700 hover:bg-green-50">
          <Pencil className="h-4 w-4 mr-2" />
          {t('edit')}
        </Button>
      </Link>

      {/* Customize Design */}
      <Link href={`/dashboard/properties/${propertyId}/customize`}>
        <Button 
          size="sm" 
          className="border-0 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-sm"
        >
          <Palette className="h-4 w-4 mr-2" />
          🎨 {t('customize')}
        </Button>
      </Link>

      {/* Publish / Unpublish */}
      <Button
        onClick={handleTogglePublish}
        disabled={isUpdatingStatus}
        variant="outline"
        size="sm"
        className={isActive
          ? 'border-2 border-amber-300 text-amber-700 hover:bg-amber-50 disabled:opacity-50'
          : 'border-2 border-emerald-300 text-emerald-700 hover:bg-emerald-50 disabled:opacity-50'}
      >
        {isUpdatingStatus ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            {t('updatingStatus')}
          </>
        ) : isActive ? (
          <>
            <PauseCircle className="h-4 w-4 mr-2" />
            {t('unpublish')}
          </>
        ) : (
          <>
            <UploadCloud className="h-4 w-4 mr-2" />
            {t('publish')}
          </>
        )}
      </Button>

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
            {t('deleting')}
          </>
        ) : (
          <>
            <Trash2 className="h-4 w-4 mr-2" />
            {t('delete')}
          </>
        )}
      </Button>
    </div>
  )
}
