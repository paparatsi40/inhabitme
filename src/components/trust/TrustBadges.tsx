import { Shield, Lock, CheckCircle, Clock, Eye } from 'lucide-react'

interface TrustBadgesProps {
  daysAgo?: number
  isVerified?: boolean
  showActivity?: boolean
}

export function TrustBadges({ daysAgo, isVerified, showActivity = true }: TrustBadgesProps) {
  return (
    <div className="space-y-3">
      {/* Badges principales */}
      <div className="flex flex-wrap gap-2">
        {/* Verificado */}
        {isVerified && (
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-50 border border-green-200 rounded-full text-sm text-green-700">
            <CheckCircle className="h-4 w-4" />
            <span className="font-medium">Verificado</span>
          </div>
        )}
        
        {/* Nuevo */}
        {daysAgo !== undefined && daysAgo <= 7 && (
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 border border-blue-200 rounded-full text-sm text-blue-700">
            <Clock className="h-4 w-4" />
            <span className="font-medium">Nuevo</span>
          </div>
        )}
        
        {/* Reciente */}
        {daysAgo !== undefined && daysAgo > 7 && daysAgo <= 30 && (
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-50 border border-purple-200 rounded-full text-sm text-purple-700">
            <Clock className="h-4 w-4" />
            <span className="font-medium">Publicado hace {daysAgo} días</span>
          </div>
        )}
      </div>
      
      {/* Trust signals institucionales */}
      <div className="border-t pt-3 space-y-2 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <Lock className="h-4 w-4 text-blue-600" />
          <span>Pago seguro con Stripe</span>
        </div>
        
        <div className="flex items-center gap-2">
          <Shield className="h-4 w-4 text-green-600" />
          <span>Protección de datos GDPR</span>
        </div>
        
        <div className="flex items-center gap-2">
          <CheckCircle className="h-4 w-4 text-purple-600" />
          <span>Anfitrión verificado</span>
        </div>
      </div>
    </div>
  )
}

interface ActivityIndicatorProps {
  viewsToday?: number
  showOnlyIfActive?: boolean
}

export function ActivityIndicator({ viewsToday = 0, showOnlyIfActive = true }: ActivityIndicatorProps) {
  // Si no hay vistas y solo mostramos cuando hay actividad, no renderizar
  if (showOnlyIfActive && viewsToday === 0) {
    return null
  }
  
  return (
    <div className="inline-flex items-center gap-2 px-3 py-2 bg-orange-50 border border-orange-200 rounded-lg text-sm">
      <Eye className="h-4 w-4 text-orange-600" />
      <span className="text-orange-700">
        {viewsToday === 0 ? (
          'Sé el primero en ver esta propiedad'
        ) : viewsToday === 1 ? (
          '1 persona vio esta propiedad hoy'
        ) : (
          `${viewsToday} personas vieron esta propiedad hoy`
        )}
      </span>
    </div>
  )
}
