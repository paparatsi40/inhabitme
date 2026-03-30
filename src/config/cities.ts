/**
 * Configuración centralizada de ciudades (Single Source of Truth)
 * 
 * Este archivo contiene TODA la información de ciudades para mantener consistencia
 * entre todos los componentes: homepage, carrusel, páginas de ciudad, SEO, etc.
 * 
 * Para agregar una nueva ciudad, solo añade un objeto al array CITIES.
 */

export interface CityConfig {
  slug: string
  name: string
  subtitle: string
  price: string
  country: string
  image: string
  gradient: string
  hoverBorder: string
  textColor: string
  description: string
  indexable: boolean
  neighborhoods: Array<{
    slug: string
    name: string
    description?: string
  }>
  coordinates?: {
    lat: number
    lng: number
    zoom: number
  }
}

export const CITIES: CityConfig[] = [
  {
    slug: 'madrid',
    name: 'Madrid',
    subtitle: 'Capital de España',
    price: '800 EUR',
    country: 'ES',
    image: 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=640&h=480&fit=crop&q=60',
    gradient: 'from-blue-600 to-blue-800',
    hoverBorder: 'hover:border-blue-400',
    textColor: 'text-blue-700',
    description: 'Descubre Madrid: alojamientos verificados para estancias de 1-12 meses.',
    indexable: true,
    neighborhoods: [
      { slug: 'malasana', name: 'Malasaña', description: 'Vibrante y diverso' },
      { slug: 'chamberi', name: 'Chamberí', description: 'Elegante y tranquilo' },
      { slug: 'salamanca', name: 'Salamanca', description: 'Premium y exclusivo' },
      { slug: 'chueca', name: 'Chueca', description: 'Diverso y cosmopolita' },
      { slug: 'lavapies', name: 'Lavapiés', description: 'Multicultural y auténtico' },
      { slug: 'retiro', name: 'Retiro', description: 'Verde y residencial' },
      { slug: 'centro', name: 'Centro', description: 'Histórico y céntrico' },
      { slug: 'las-letras', name: 'Las Letras', description: 'Cultural y bohemio' },
      { slug: 'huertas', name: 'Huertas', description: 'Vida nocturna' },
      { slug: 'justicia', name: 'Justicia', description: 'Tradicional y céntrico' },
      { slug: 'sol', name: 'Sol', description: 'Punto neurálgico' },
      { slug: 'gran-via', name: 'Gran Vía', description: 'Icónico' },
      { slug: 'arguelles', name: 'Argüelles', description: 'Universitario y dinámico' },
      { slug: 'moncloa', name: 'Moncloa', description: 'Cerca de universidades' },
      { slug: 'tetuan', name: 'Tetuán', description: 'Emergente y accesible' },
      { slug: 'prosperidad', name: 'Prosperidad', description: 'Familiar y cómodo' },
    ],
    coordinates: { lat: 40.4168, lng: -3.7038, zoom: 13 },
  },
  {
    slug: 'barcelona',
    name: 'Barcelona',
    subtitle: 'Mar y Modernismo',
    price: '900 EUR',
    country: 'ES',
    image: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=640&h=480&fit=crop&q=60',
    gradient: 'from-purple-600 to-purple-800',
    hoverBorder: 'hover:border-purple-400',
    textColor: 'text-purple-700',
    description: 'Explora Barcelona: viviendas verificadas para estancias medias.',
    indexable: true,
    neighborhoods: [
      { slug: 'gracia', name: 'Gracia', description: 'Alternativo y joven' },
      { slug: 'eixample', name: 'Eixample', description: 'Elegante y modernista' },
      { slug: 'gotico', name: 'Gótico', description: 'Histórico y vibrante' },
      { slug: 'born', name: 'Born', description: 'Artístico y trendy' },
      { slug: 'raval', name: 'Raval', description: 'Multicultural y creativo' },
      { slug: 'poblenou', name: 'Poblenou', description: 'Tech hub y playa' },
    ],
    coordinates: { lat: 41.3851, lng: 2.1734, zoom: 13 },
  },
  {
    slug: 'valencia',
    name: 'Valencia',
    subtitle: 'Playa y calidad de vida',
    price: '700 EUR',
    country: 'ES',
    image: 'https://images.unsplash.com/photo-1523531294919-4bcd7c65e216?w=640&h=480&fit=crop&q=60',
    gradient: 'from-green-600 to-emerald-800',
    hoverBorder: 'hover:border-green-400',
    textColor: 'text-green-700',
    description: 'Descubre Valencia: alojamientos para profesionales remotos.',
    indexable: true,
    neighborhoods: [
      { slug: 'ruzafa', name: 'Ruzafa', description: 'Creativo y trendy' },
      { slug: 'el-carmen', name: 'El Carmen', description: 'Histórico y bohemio' },
      { slug: 'benimaclet', name: 'Benimaclet', description: 'Auténtico y universitario' },
      { slug: 'centro', name: 'Centro', description: 'Céntrico y comercial' },
    ],
    coordinates: { lat: 39.4699, lng: -0.3763, zoom: 13 },
  },
  {
    slug: 'sevilla',
    name: 'Sevilla',
    subtitle: 'Sol y flamenco',
    price: '600 EUR',
    country: 'ES',
    image: 'https://images.unsplash.com/photo-1543783207-ec64e4d95325?w=640&h=480&fit=crop&q=60',
    gradient: 'from-amber-600 to-orange-700',
    hoverBorder: 'hover:border-amber-400',
    textColor: 'text-amber-700',
    description: 'Alquiler mensual en Sevilla: viviendas con WiFi rapido.',
    indexable: true,
    neighborhoods: [
      { slug: 'triana', name: 'Triana', description: 'Auténtico y tradicional' },
      { slug: 'centro', name: 'Centro', description: 'Histórico y monumental' },
      { slug: 'nervion', name: 'Nervión', description: 'Moderno y comercial' },
      { slug: 'macarena', name: 'Macarena', description: 'Bohemio y alternativo' },
      { slug: 'alameda', name: 'Alameda', description: 'Joven y vibrante' },
    ],
    coordinates: { lat: 37.3891, lng: -5.9845, zoom: 13 },
  },
  {
    slug: 'lisboa',
    name: 'Lisboa',
    subtitle: 'Fiscalidad favorable',
    price: '750 EUR',
    country: 'PT',
    image: 'https://images.unsplash.com/photo-1585208798174-6cedd86e019a?w=640&h=480&fit=crop&q=60',
    gradient: 'from-yellow-600 to-orange-700',
    hoverBorder: 'hover:border-orange-400',
    textColor: 'text-orange-700',
    description: 'Lisboa para nómadas: alojamientos en barrios auténticos.',
    indexable: true,
    neighborhoods: [
      { slug: 'baixa', name: 'Baixa', description: 'Céntrico y histórico' },
      { slug: 'chiado', name: 'Chiado', description: 'Elegante y cultural' },
      { slug: 'alfama', name: 'Alfama', description: 'Tradicional y auténtico' },
      { slug: 'bairro-alto', name: 'Bairro Alto', description: 'Vida nocturna' },
      { slug: 'principe-real', name: 'Príncipe Real', description: 'Trendy y chic' },
      { slug: 'santos', name: 'Santos', description: 'Tech hub emergente' },
      { slug: 'estrela', name: 'Estrela', description: 'Residencial y tranquilo' },
    ],
    coordinates: { lat: 38.7223, lng: -9.1393, zoom: 13 },
  },
  {
    slug: 'porto',
    name: 'Porto',
    subtitle: 'Vino y autenticidad',
    price: '650 EUR',
    country: 'PT',
    image: 'https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=640&h=480&fit=crop&q=60',
    gradient: 'from-indigo-600 to-purple-700',
    hoverBorder: 'hover:border-indigo-400',
    textColor: 'text-indigo-700',
    description: 'Porto: segunda ciudad de Portugal con escena tech creciente.',
    indexable: true,
    neighborhoods: [
      { slug: 'ribeira', name: 'Ribeira', description: 'Patrimonio UNESCO' },
      { slug: 'cedofeita', name: 'Cedofeita', description: 'Artístico y creativo' },
      { slug: 'boavista', name: 'Boavista', description: 'Moderno y business' },
      { slug: 'foz', name: 'Foz', description: 'Exclusivo y costero' },
    ],
    coordinates: { lat: 41.1579, lng: -8.6291, zoom: 13 },
  },
  {
    slug: 'ciudad-de-mexico',
    name: 'Ciudad de Mexico',
    subtitle: 'Capital digital de LatAm',
    price: '500 EUR',
    country: 'MX',
    image: 'https://images.unsplash.com/photo-1585464231875-d9ef1f5ad396?w=640&h=480&fit=crop&q=60',
    gradient: 'from-pink-600 to-red-700',
    hoverBorder: 'hover:border-pink-400',
    textColor: 'text-pink-700',
    description: 'CDMX para nómadas digitales: alojamientos verificados.',
    indexable: true,
    neighborhoods: [
      { slug: 'condesa', name: 'Condesa', description: 'Trendy y art déco' },
      { slug: 'roma-norte', name: 'Roma Norte', description: 'Hipster y cultural' },
      { slug: 'polanco', name: 'Polanco', description: 'Premium y exclusivo' },
      { slug: 'coyoacan', name: 'Coyoacán', description: 'Bohemio y tradicional' },
      { slug: 'santa-fe', name: 'Santa Fe', description: 'Business moderno' },
      { slug: 'juarez', name: 'Juárez', description: 'Emergente y creativo' },
      { slug: 'del-valle', name: 'Del Valle', description: 'Residencial y tranquilo' },
      { slug: 'san-miguel-chapultepec', name: 'San Miguel Chapultepec', description: 'Céntrico y verde' },
    ],
    coordinates: { lat: 19.4326, lng: -99.1332, zoom: 13 },
  },
  {
    slug: 'buenos-aires',
    name: 'Buenos Aires',
    subtitle: 'Cultura y tango',
    price: '400 EUR',
    country: 'AR',
    image: 'https://images.unsplash.com/photo-1589909202802-8f4aadce1849?w=640&h=480&fit=crop&q=60',
    gradient: 'from-cyan-600 to-blue-700',
    hoverBorder: 'hover:border-cyan-400',
    textColor: 'text-cyan-700',
    description: 'Buenos Aires para remotos: departamentos con WiFi verificado.',
    indexable: true,
    neighborhoods: [
      { slug: 'palermo', name: 'Palermo', description: 'Trendy y vibrante' },
      { slug: 'recoleta', name: 'Recoleta', description: 'Elegante y clásico' },
      { slug: 'san-telmo', name: 'San Telmo', description: 'Tango y antigüedades' },
      { slug: 'belgrano', name: 'Belgrano', description: 'Residencial y verde' },
      { slug: 'puerto-madero', name: 'Puerto Madero', description: 'Moderno y premium' },
      { slug: 'caballito', name: 'Caballito', description: 'Familiar y tradicional' },
    ],
    coordinates: { lat: -34.6037, lng: -58.3816, zoom: 13 },
  },
  {
    slug: 'medellin',
    name: 'Medellin',
    subtitle: 'Eterna primavera',
    price: '450 EUR',
    country: 'CO',
    image: 'https://images.unsplash.com/photo-1568632234157-ce7aecd03d0d?w=640&h=480&fit=crop&q=60',
    gradient: 'from-emerald-600 to-green-700',
    hoverBorder: 'hover:border-emerald-400',
    textColor: 'text-emerald-700',
    description: 'Medellin: capital digital de Colombia.',
    indexable: true,
    neighborhoods: [
      { slug: 'el-poblado', name: 'El Poblado', description: 'Premium y nightlife' },
      { slug: 'laureles', name: 'Laureles', description: 'Elegante y verde' },
      { slug: 'envigado', name: 'Envigado', description: 'Familiar y tranquilo' },
      { slug: 'sabaneta', name: 'Sabaneta', description: 'Auténtico local' },
    ],
    coordinates: { lat: 6.2476, lng: -75.5658, zoom: 13 },
  },
  {
    slug: 'austin',
    name: 'Austin',
    subtitle: 'Tech hub de Texas',
    price: '850 EUR',
    country: 'US',
    image: 'https://images.unsplash.com/photo-1531218150217-54595bc2b934?w=640&h=480&fit=crop&q=60',
    gradient: 'from-orange-600 to-red-700',
    hoverBorder: 'hover:border-orange-400',
    textColor: 'text-orange-700',
    description: 'Austin, Texas: capital tech del Lone Star State.',
    indexable: true,
    neighborhoods: [
      { slug: 'mueller', name: 'Mueller', description: 'Desarrollo sostenible y tech' },
      { slug: 'zilker', name: 'Zilker', description: 'Nature y outdoor lifestyle' },
      { slug: 'barton-hills', name: 'Barton Hills', description: 'Residencial y tranquilo' },
      { slug: 'domain', name: 'The Domain', description: 'Tech hub corporativo' },
      { slug: 'east-austin', name: 'East Austin', description: 'Creativo y emergente' },
      { slug: 'tarrytown', name: 'Tarrytown', description: 'Exclusivo y premium' },
    ],
    coordinates: { lat: 30.2672, lng: -97.7431, zoom: 13 },
  },
]

// Helper functions
export function getCityBySlug(slug: string): CityConfig | undefined {
  return CITIES.find(city => city.slug === slug)
}

export function getAllCitySlugs(): string[] {
  return CITIES.map(city => city.slug)
}

export function getNeighborhoodBySlug(citySlug: string, neighborhoodSlug: string) {
  const city = getCityBySlug(citySlug)
  return city?.neighborhoods.find(n => n.slug === neighborhoodSlug)
}

export function getAllCityNeighborhoodParams(): Array<{ locale: string; city: string; neighborhood: string }> {
  const locales = ['en', 'es']
  return CITIES.flatMap((city) =>
    city.neighborhoods.flatMap((n) =>
      locales.map((locale) => ({
        locale,
        city: city.slug,
        neighborhood: n.slug,
      }))
    )
  )
}
