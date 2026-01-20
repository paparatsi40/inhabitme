'use client'

import { useState, useEffect } from 'react'
import { CheckCircle } from 'lucide-react'

const CITIES = [
  { 
    name: 'Madrid', 
    image: 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=800&h=600&fit=crop&q=80',
    subtitle: 'Capital de España'
  },
  { 
    name: 'Barcelona', 
    image: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=800&h=600&fit=crop&q=80',
    subtitle: 'Mar y Modernismo'
  },
  { 
    name: 'Lisboa', 
    image: 'https://images.unsplash.com/photo-1585208798174-6cedd86e019a?w=800&h=600&fit=crop&q=80',
    subtitle: 'Fiscalidad favorable'
  },
  { 
    name: 'Buenos Aires', 
    image: 'https://images.unsplash.com/photo-1589909202802-8f4aadce1849?w=800&h=600&fit=crop&q=80',
    subtitle: 'Cultura y tango'
  },
  { 
    name: 'Ciudad de México', 
    image: 'https://images.unsplash.com/photo-1585464231875-d9ef1f5ad396?w=800&h=600&fit=crop&q=80',
    subtitle: 'Capital digital de LatAm'
  },
  { 
    name: 'Medellín', 
    image: 'https://images.unsplash.com/photo-1568632234157-ce7aecd03d0d?w=800&h=600&fit=crop&q=80',
    subtitle: 'Eterna primavera'
  },
]

export function CityCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % CITIES.length)
    }, 4000) // Cambia cada 4 segundos

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="relative">
      <div className="relative bg-white rounded-3xl shadow-2xl overflow-hidden border-2 border-gray-200">
        {/* Carrusel de imágenes */}
        <div className="aspect-[4/3] relative overflow-hidden">
          {CITIES.map((city, index) => (
            <div
              key={city.name}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentIndex ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <img
                src={city.image}
                alt={city.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
              
              {/* Nombre de ciudad */}
              <div className="absolute top-6 left-6 right-6">
                <div className="inline-flex items-center gap-2 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-bold text-gray-900">{city.name}</span>
                </div>
              </div>

              {/* Subtitle */}
              <div className="absolute bottom-24 left-6 right-6">
                <p className="text-white text-lg font-semibold drop-shadow-lg">
                  {city.subtitle}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Stats overlay */}
        <div className="absolute bottom-6 left-6 right-6 grid grid-cols-3 gap-3 z-10">
          <div className="bg-white/95 backdrop-blur-sm rounded-xl p-3 text-center shadow-lg">
            <p className="text-2xl font-black text-blue-600">150+</p>
            <p className="text-xs text-gray-600 font-semibold">Propiedades</p>
          </div>
          <div className="bg-white/95 backdrop-blur-sm rounded-xl p-3 text-center shadow-lg">
            <p className="text-2xl font-black text-purple-600">9</p>
            <p className="text-xs text-gray-600 font-semibold">Ciudades</p>
          </div>
          <div className="bg-white/95 backdrop-blur-sm rounded-xl p-3 text-center shadow-lg">
            <p className="text-2xl font-black text-green-600">100%</p>
            <p className="text-xs text-gray-600 font-semibold">Verificado</p>
          </div>
        </div>

        {/* Indicadores de progreso (dots) */}
        <div className="absolute bottom-20 left-0 right-0 flex justify-center gap-2 z-10">
          {CITIES.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`h-2 rounded-full transition-all ${
                index === currentIndex 
                  ? 'w-8 bg-white' 
                  : 'w-2 bg-white/50 hover:bg-white/70'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Floating badge */}
      <div className="absolute -top-4 -right-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-5 py-3 rounded-2xl shadow-xl font-bold text-sm rotate-3 z-20">
        ✓ WiFi &gt;50 Mbps
      </div>
    </div>
  )
}
