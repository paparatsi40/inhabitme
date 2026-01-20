export type SearchFilters = {
  // Ubicación
  country?: string
  city?: string
  neighborhood?: string
  
  // Precio y espacio
  minPrice?: number
  maxPrice?: number
  bedrooms?: number
  bathrooms?: number
  
  // Trabajo remoto
  minWifiSpeed?: number
  hasDesk?: boolean
  hasSecondMonitor?: boolean
  
  // Clima y confort
  hasHeating?: boolean
  hasAc?: boolean
  hasBalcony?: boolean
  hasTerrace?: boolean
  
  // Hogar y comodidades
  hasWashingMachine?: boolean
  hasDryer?: boolean
  hasDishwasher?: boolean
  hasKitchen?: boolean
  
  // Edificio y accesibilidad
  hasElevator?: boolean
  hasParking?: boolean
  hasDoorman?: boolean
  maxFloor?: number  // Si no quieres piso alto sin ascensor
  
  // Mascotas y estilo de vida
  petsAllowed?: boolean
  smokingAllowed?: boolean
  
  // Seguridad
  hasSecuritySystem?: boolean
  hasSafe?: boolean
  
  // Otros
  furnished?: boolean
  featured?: boolean  // Mostrar solo Featured
}
