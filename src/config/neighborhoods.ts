/**
 * Configuración de barrios relacionados para interlinking SEO
 * 
 * Estrategia:
 * - Barrios geográficamente cercanos
 * - Barrios con vibe/pricing similar
 * - Máximo 6 relacionados por barrio (UX + SEO balance)
 */

export interface RelatedNeighborhood {
  slug: string
  name: string
  description?: string
}

type NeighborhoodRelations = {
  [city: string]: {
    [neighborhood: string]: RelatedNeighborhood[]
  }
}

export const NEIGHBORHOOD_RELATIONS: NeighborhoodRelations = {
  // MADRID
  madrid: {
    malasana: [
      { slug: 'chueca', name: 'Chueca', description: 'Vibrante y diverso' },
      { slug: 'chamberi', name: 'Chamberí', description: 'Elegante y tranquilo' },
      { slug: 'justicia', name: 'Justicia', description: 'Tradicional y céntrico' },
      { slug: 'centro', name: 'Centro', description: 'Corazón de Madrid' },
      { slug: 'las-letras', name: 'Las Letras', description: 'Cultural y bohemio' },
      { slug: 'lavapies', name: 'Lavapiés', description: 'Multicultural y auténtico' },
    ],
    chamberi: [
      { slug: 'malasana', name: 'Malasaña', description: 'Bohemio y creativo' },
      { slug: 'arguelles', name: 'Argüelles', description: 'Universitario y dinámico' },
      { slug: 'justicia', name: 'Justicia', description: 'Barrio tradicional' },
      { slug: 'salamanca', name: 'Salamanca', description: 'Premium y exclusivo' },
      { slug: 'moncloa', name: 'Moncloa', description: 'Cerca de universidades' },
      { slug: 'tetuan', name: 'Tetuán', description: 'Emergente y accesible' },
    ],
    salamanca: [
      { slug: 'chamberi', name: 'Chamberí', description: 'Elegante y residencial' },
      { slug: 'retiro', name: 'Retiro', description: 'Verde y tranquilo' },
      { slug: 'justicia', name: 'Justicia', description: 'Céntrico y clásico' },
      { slug: 'prosperidad', name: 'Prosperidad', description: 'Familiar y cómodo' },
    ],
    chueca: [
      { slug: 'malasana', name: 'Malasaña', description: 'Alternativo y joven' },
      { slug: 'justicia', name: 'Justicia', description: 'Tradicional' },
      { slug: 'centro', name: 'Centro', description: 'Todo cerca' },
      { slug: 'las-letras', name: 'Las Letras', description: 'Artístico' },
      { slug: 'chamberi', name: 'Chamberí', description: 'Sofisticado' },
    ],
    lavapies: [
      { slug: 'las-letras', name: 'Las Letras', description: 'Literario y cultural' },
      { slug: 'centro', name: 'Centro', description: 'Céntrico' },
      { slug: 'malasana', name: 'Malasaña', description: 'Artístico' },
      { slug: 'huertas', name: 'Huertas', description: 'Vida nocturna' },
    ],
    retiro: [
      { slug: 'salamanca', name: 'Salamanca', description: 'Elegante' },
      { slug: 'las-letras', name: 'Las Letras', description: 'Cultural' },
      { slug: 'huertas', name: 'Huertas', description: 'Animado' },
    ],
    centro: [
      { slug: 'sol', name: 'Sol', description: 'Punto neurálgico' },
      { slug: 'gran-via', name: 'Gran Vía', description: 'Icónico' },
      { slug: 'chueca', name: 'Chueca', description: 'Diverso' },
      { slug: 'malasana', name: 'Malasaña', description: 'Alternativo' },
      { slug: 'las-letras', name: 'Las Letras', description: 'Literario' },
    ],
    'las-letras': [
      { slug: 'huertas', name: 'Huertas', description: 'Animado' },
      { slug: 'lavapies', name: 'Lavapiés', description: 'Multicultural' },
      { slug: 'centro', name: 'Centro', description: 'Céntrico' },
      { slug: 'retiro', name: 'Retiro', description: 'Verde' },
    ],
    huertas: [
      { slug: 'las-letras', name: 'Las Letras', description: 'Cultural' },
      { slug: 'centro', name: 'Centro', description: 'Todo cerca' },
      { slug: 'lavapies', name: 'Lavapiés', description: 'Auténtico' },
    ],
    justicia: [
      { slug: 'malasana', name: 'Malasaña', description: 'Bohemio' },
      { slug: 'chueca', name: 'Chueca', description: 'Vibrante' },
      { slug: 'chamberi', name: 'Chamberí', description: 'Elegante' },
      { slug: 'salamanca', name: 'Salamanca', description: 'Exclusivo' },
    ],
    sol: [
      { slug: 'gran-via', name: 'Gran Vía', description: 'Emblemático' },
      { slug: 'centro', name: 'Centro', description: 'Corazón de Madrid' },
      { slug: 'las-letras', name: 'Las Letras', description: 'Cultural' },
    ],
    'gran-via': [
      { slug: 'sol', name: 'Sol', description: 'Icónico' },
      { slug: 'malasana', name: 'Malasaña', description: 'Creativo' },
      { slug: 'chueca', name: 'Chueca', description: 'Animado' },
      { slug: 'centro', name: 'Centro', description: 'Central' },
    ],
    arguelles: [
      { slug: 'chamberi', name: 'Chamberí', description: 'Sofisticado' },
      { slug: 'moncloa', name: 'Moncloa', description: 'Universitario' },
      { slug: 'malasana', name: 'Malasaña', description: 'Joven' },
    ],
    moncloa: [
      { slug: 'arguelles', name: 'Argüelles', description: 'Estudiantil' },
      { slug: 'chamberi', name: 'Chamberí', description: 'Residencial' },
    ],
    tetuan: [
      { slug: 'chamberi', name: 'Chamberí', description: 'Elegante' },
      { slug: 'prosperidad', name: 'Prosperidad', description: 'Familiar' },
    ],
    prosperidad: [
      { slug: 'salamanca', name: 'Salamanca', description: 'Exclusivo' },
      { slug: 'tetuan', name: 'Tetuán', description: 'Emergente' },
      { slug: 'chamberi', name: 'Chamberí', description: 'Tranquilo' },
    ],
  },

  // BARCELONA
  barcelona: {
    gracia: [
      { slug: 'eixample', name: 'Eixample', description: 'Modernista' },
      { slug: 'born', name: 'Born', description: 'Trendy' },
      { slug: 'gotico', name: 'Gótico', description: 'Histórico' },
    ],
    eixample: [
      { slug: 'gracia', name: 'Gracia', description: 'Bohemio' },
      { slug: 'gotico', name: 'Gótico', description: 'Medieval' },
      { slug: 'born', name: 'Born', description: 'De moda' },
      { slug: 'poblenou', name: 'Poblenou', description: 'Tech hub' },
    ],
    gotico: [
      { slug: 'born', name: 'Born', description: 'Artístico' },
      { slug: 'raval', name: 'Raval', description: 'Multicultural' },
      { slug: 'eixample', name: 'Eixample', description: 'Amplio' },
    ],
    born: [
      { slug: 'gotico', name: 'Gótico', description: 'Histórico' },
      { slug: 'gracia', name: 'Gracia', description: 'Creativo' },
      { slug: 'eixample', name: 'Eixample', description: 'Moderno' },
    ],
    raval: [
      { slug: 'gotico', name: 'Gótico', description: 'Antiguo' },
      { slug: 'born', name: 'Born', description: 'Moderno' },
    ],
    poblenou: [
      { slug: 'eixample', name: 'Eixample', description: 'Central' },
      { slug: 'born', name: 'Born', description: 'Cool' },
    ],
  },

  // VALENCIA
  valencia: {
    ruzafa: [
      { slug: 'centro', name: 'Centro', description: 'Histórico' },
      { slug: 'el-carmen', name: 'El Carmen', description: 'Artístico' },
      { slug: 'benimaclet', name: 'Benimaclet', description: 'Universitario' },
    ],
    'el-carmen': [
      { slug: 'centro', name: 'Centro', description: 'Céntrico' },
      { slug: 'ruzafa', name: 'Ruzafa', description: 'De moda' },
    ],
    benimaclet: [
      { slug: 'ruzafa', name: 'Ruzafa', description: 'Trendy' },
      { slug: 'centro', name: 'Centro', description: 'Todo cerca' },
    ],
    centro: [
      { slug: 'ruzafa', name: 'Ruzafa', description: 'Bohemio' },
      { slug: 'el-carmen', name: 'El Carmen', description: 'Cultural' },
      { slug: 'benimaclet', name: 'Benimaclet', description: 'Joven' },
    ],
  },

  // SEVILLA
  sevilla: {
    triana: [
      { slug: 'centro', name: 'Centro', description: 'Histórico' },
      { slug: 'alameda', name: 'Alameda', description: 'Alternativo' },
      { slug: 'nervion', name: 'Nervión', description: 'Moderno' },
    ],
    centro: [
      { slug: 'triana', name: 'Triana', description: 'Auténtico' },
      { slug: 'macarena', name: 'Macarena', description: 'Tradicional' },
      { slug: 'alameda', name: 'Alameda', description: 'De moda' },
    ],
    nervion: [
      { slug: 'centro', name: 'Centro', description: 'Céntrico' },
      { slug: 'macarena', name: 'Macarena', description: 'Residencial' },
    ],
    alameda: [
      { slug: 'centro', name: 'Centro', description: 'Todo cerca' },
      { slug: 'triana', name: 'Triana', description: 'Flamenco' },
      { slug: 'macarena', name: 'Macarena', description: 'Local' },
    ],
    macarena: [
      { slug: 'centro', name: 'Centro', description: 'Histórico' },
      { slug: 'alameda', name: 'Alameda', description: 'Bohemio' },
    ],
  },

  // CIUDAD DE MÉXICO
  'ciudad-de-mexico': {
    'roma-norte': [
      { slug: 'condesa', name: 'Condesa', description: 'Verde y tranquila' },
      { slug: 'juarez', name: 'Juárez', description: 'Céntrico' },
      { slug: 'del-valle', name: 'Del Valle', description: 'Residencial' },
    ],
    condesa: [
      { slug: 'roma-norte', name: 'Roma Norte', description: 'Hip y cultural' },
      { slug: 'polanco', name: 'Polanco', description: 'Premium' },
      { slug: 'juarez', name: 'Juárez', description: 'Central' },
    ],
    polanco: [
      { slug: 'condesa', name: 'Condesa', description: 'Bohemio' },
      { slug: 'san-miguel-chapultepec', name: 'San Miguel Chapultepec', description: 'Tranquilo' },
    ],
    juarez: [
      { slug: 'roma-norte', name: 'Roma Norte', description: 'De moda' },
      { slug: 'condesa', name: 'Condesa', description: 'Árboles' },
      { slug: 'coyoacan', name: 'Coyoacán', description: 'Cultural' },
    ],
    'del-valle': [
      { slug: 'roma-norte', name: 'Roma Norte', description: 'Hip' },
      { slug: 'coyoacan', name: 'Coyoacán', description: 'Histórico' },
    ],
    coyoacan: [
      { slug: 'del-valle', name: 'Del Valle', description: 'Residencial' },
      { slug: 'juarez', name: 'Juárez', description: 'Céntrico' },
    ],
    'san-miguel-chapultepec': [
      { slug: 'polanco', name: 'Polanco', description: 'Exclusivo' },
      { slug: 'condesa', name: 'Condesa', description: 'Verde' },
    ],
  },

  // BUENOS AIRES
  'buenos-aires': {
    palermo: [
      { slug: 'recoleta', name: 'Recoleta', description: 'Elegante' },
      { slug: 'belgrano', name: 'Belgrano', description: 'Residencial' },
      { slug: 'caballito', name: 'Caballito', description: 'Centrado' },
    ],
    recoleta: [
      { slug: 'palermo', name: 'Palermo', description: 'De moda' },
      { slug: 'san-telmo', name: 'San Telmo', description: 'Histórico' },
    ],
    'san-telmo': [
      { slug: 'recoleta', name: 'Recoleta', description: 'Chic' },
      { slug: 'palermo', name: 'Palermo', description: 'Trendy' },
    ],
    belgrano: [
      { slug: 'palermo', name: 'Palermo', description: 'Bohemio' },
      { slug: 'caballito', name: 'Caballito', description: 'Familiar' },
    ],
    caballito: [
      { slug: 'palermo', name: 'Palermo', description: 'Joven' },
      { slug: 'belgrano', name: 'Belgrano', description: 'Tranquilo' },
    ],
  },

  // MEDELLÍN
  medellin: {
    'el-poblado': [
      { slug: 'laureles', name: 'Laureles', description: 'Residencial' },
      { slug: 'envigado', name: 'Envigado', description: 'Tranquilo' },
      { slug: 'sabaneta', name: 'Sabaneta', description: 'Pueblo' },
    ],
    laureles: [
      { slug: 'el-poblado', name: 'El Poblado', description: 'Premium' },
      { slug: 'envigado', name: 'Envigado', description: 'Verde' },
    ],
    envigado: [
      { slug: 'el-poblado', name: 'El Poblado', description: 'Digital hub' },
      { slug: 'laureles', name: 'Laureles', description: 'Local' },
      { slug: 'sabaneta', name: 'Sabaneta', description: 'Familiar' },
    ],
    sabaneta: [
      { slug: 'envigado', name: 'Envigado', description: 'Cerca' },
      { slug: 'el-poblado', name: 'El Poblado', description: 'Moderno' },
    ],
  },

  // LISBOA
  lisboa: {
    'principe-real': [
      { slug: 'chiado', name: 'Chiado', description: 'Elegante' },
      { slug: 'bairro-alto', name: 'Bairro Alto', description: 'Nocturno' },
      { slug: 'santos', name: 'Santos', description: 'De moda' },
    ],
    chiado: [
      { slug: 'principe-real', name: 'Príncipe Real', description: 'Chic' },
      { slug: 'alfama', name: 'Alfama', description: 'Histórico' },
      { slug: 'bairro-alto', name: 'Bairro Alto', description: 'Vibrante' },
    ],
    alfama: [
      { slug: 'chiado', name: 'Chiado', description: 'Céntrico' },
      { slug: 'santos', name: 'Santos', description: 'Trendy' },
    ],
    'bairro-alto': [
      { slug: 'chiado', name: 'Chiado', description: 'Cultural' },
      { slug: 'principe-real', name: 'Príncipe Real', description: 'Sofisticado' },
      { slug: 'estrela', name: 'Estrela', description: 'Tranquilo' },
    ],
    santos: [
      { slug: 'principe-real', name: 'Príncipe Real', description: 'Moderno' },
      { slug: 'estrela', name: 'Estrela', description: 'Residencial' },
    ],
    estrela: [
      { slug: 'santos', name: 'Santos', description: 'Hip' },
      { slug: 'bairro-alto', name: 'Bairro Alto', description: 'Vivo' },
    ],
  },

  // PORTO
  porto: {
    ribeira: [
      { slug: 'cedofeita', name: 'Cedofeita', description: 'Artístico' },
      { slug: 'boavista', name: 'Boavista', description: 'Moderno' },
    ],
    cedofeita: [
      { slug: 'ribeira', name: 'Ribeira', description: 'Histórico' },
      { slug: 'boavista', name: 'Boavista', description: 'Residencial' },
      { slug: 'foz', name: 'Foz', description: 'Playa' },
    ],
    boavista: [
      { slug: 'cedofeita', name: 'Cedofeita', description: 'Cultural' },
      { slug: 'foz', name: 'Foz', description: 'Costero' },
    ],
    foz: [
      { slug: 'boavista', name: 'Boavista', description: 'Central' },
      { slug: 'cedofeita', name: 'Cedofeita', description: 'Bohemio' },
    ],
  },
}

/**
 * Obtiene barrios relacionados para un barrio específico
 */
export function getRelatedNeighborhoods(
  city: string,
  neighborhood: string
): RelatedNeighborhood[] {
  const cityLower = city.toLowerCase()
  const neighborhoodLower = neighborhood.toLowerCase()
  
  return NEIGHBORHOOD_RELATIONS[cityLower]?.[neighborhoodLower] || []
}
