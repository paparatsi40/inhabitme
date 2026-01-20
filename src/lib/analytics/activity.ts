/**
 * Sistema de tracking de actividad real
 * 
 * NO usa fake data - todo es real desde property data
 */

/**
 * Calcula estadísticas basadas en la propiedad cargada
 * (compatible con client components)
 */
export function getPropertyStats(property: any) {
  if (!property?.created_at) {
    return null
  }
  
  try {
    // Calcular días desde publicación
    const createdAt = new Date(property.created_at)
    const now = new Date()
    const daysAgo = Math.floor((now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24))
    
    return {
      daysAgo,
      isNew: daysAgo <= 7,
      isRecent: daysAgo <= 30,
    }
  } catch (err) {
    console.error('[Analytics] Error calculating stats:', err)
    return null
  }
}

/**
 * Verifica si una propiedad está "verificada"
 * Criterios: tiene fotos + WiFi speed confirmado + descripción mínima
 */
export function isPropertyVerified(property: any): boolean {
  return !!(
    property.images?.length >= 3 &&
    property.wifi_speed_mbps >= 10 &&
    property.description?.length >= 100
  )
}
