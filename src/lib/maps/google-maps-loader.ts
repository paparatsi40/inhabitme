// Global Google Maps loader - singleton pattern
let isLoading = false
let isLoaded = false
const callbacks: Array<() => void> = []

export function loadGoogleMaps(apiKey: string): Promise<void> {
  return new Promise((resolve, reject) => {
    // Ya está cargado
    if (isLoaded || window.google?.maps) {
      isLoaded = true
      resolve()
      return
    }

    // Ya se está cargando, agregar a la cola
    if (isLoading) {
      callbacks.push(() => resolve())
      return
    }

    // Verificar si ya existe el script
    const existingScript = document.querySelector('script[src*="maps.googleapis.com"]')
    if (existingScript) {
      existingScript.addEventListener('load', () => {
        isLoaded = true
        resolve()
        callbacks.forEach(cb => cb())
        callbacks.length = 0
      })
      return
    }

    // Cargar el script
    // - libraries=places,marker: marker es necesario para AdvancedMarkerElement
    //   (reemplazo de google.maps.Marker, deprecado desde 2024-02-21)
    // - v=weekly: canal estable recomendado por Google
    // NOTA: NO usamos loading=async — provoca lazy-loading de librerías que
    // requiere el patrón de bootstrap loader inline, incompatible con nuestro
    // modelo actual de cargar el script y usar window.google.maps.* sincrónicamente.
    // El pequeño warning "loading=async" en consola es cosmético; lo dejamos.
    isLoading = true
    const script = document.createElement('script')
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places,marker&v=weekly`
    script.async = true
    script.defer = true

    script.onload = () => {
      isLoading = false
      isLoaded = true
      resolve()
      callbacks.forEach(cb => cb())
      callbacks.length = 0
    }

    script.onerror = () => {
      isLoading = false
      reject(new Error('Failed to load Google Maps'))
    }
    
    document.head.appendChild(script)
  })
}
