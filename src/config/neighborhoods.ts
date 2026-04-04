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

// --- SSOT de ciudades + barrios (para rutas /[city]/[neighborhood]) ---

export type NeighborhoodRef = { slug: string; name: string }

export type CityNeighborhoods = {
  slug: string
  name: string
  neighborhoods: NeighborhoodRef[]
}

export const CITY_NEIGHBORHOODS: Record<string, CityNeighborhoods> = {
  madrid: {
    slug: 'madrid',
    name: 'Madrid',
    neighborhoods: [
      { name: 'Malasaña', slug: 'malasana' },
      { name: 'Chamberí', slug: 'chamberi' },
      { name: 'Salamanca', slug: 'salamanca' },
      { name: 'Chueca', slug: 'chueca' },
      { name: 'Lavapiés', slug: 'lavapies' },
      { name: 'Retiro', slug: 'retiro' },
      { name: 'Centro', slug: 'centro' },
      { name: 'Las Letras', slug: 'las-letras' },
      { name: 'Huertas', slug: 'huertas' },
      { name: 'Justicia', slug: 'justicia' },
      { name: 'Sol', slug: 'sol' },
      { name: 'Gran Vía', slug: 'gran-via' },
      { name: 'Argüelles', slug: 'arguelles' },
      { name: 'Moncloa', slug: 'moncloa' },
      { name: 'Tetuán', slug: 'tetuan' },
      { name: 'Prosperidad', slug: 'prosperidad' },
    ],
  },
  barcelona: {
    slug: 'barcelona',
    name: 'Barcelona',
    neighborhoods: [
      { name: 'Gracia', slug: 'gracia' },
      { name: 'Eixample', slug: 'eixample' },
      { name: 'Gótico', slug: 'gotico' },
      { name: 'Born', slug: 'born' },
      { name: 'Raval', slug: 'raval' },
      { name: 'Poblenou', slug: 'poblenou' },
    ],
  },
  valencia: {
    slug: 'valencia',
    name: 'Valencia',
    neighborhoods: [
      { name: 'Ruzafa', slug: 'ruzafa' },
      { name: 'El Carmen', slug: 'el-carmen' },
      { name: 'Benimaclet', slug: 'benimaclet' },
      { name: 'Centro', slug: 'centro' },
    ],
  },
  sevilla: {
    slug: 'sevilla',
    name: 'Sevilla',
    neighborhoods: [
      { name: 'Triana', slug: 'triana' },
      { name: 'Centro', slug: 'centro' },
      { name: 'Nervión', slug: 'nervion' },
      { name: 'Macarena', slug: 'macarena' },
    ],
  },
  lisboa: {
    slug: 'lisboa',
    name: 'Lisboa',
    neighborhoods: [
      { name: 'Baixa', slug: 'baixa' },
      { name: 'Chiado', slug: 'chiado' },
      { name: 'Alfama', slug: 'alfama' },
      { name: 'Bairro Alto', slug: 'bairro-alto' },
      { name: 'Príncipe Real', slug: 'principe-real' },
    ],
  },
  porto: {
    slug: 'porto',
    name: 'Porto',
    neighborhoods: [
      { name: 'Ribeira', slug: 'ribeira' },
      { name: 'Cedofeita', slug: 'cedofeita' },
      { name: 'Boavista', slug: 'boavista' },
      { name: 'Foz', slug: 'foz' },
    ],
  },
  'ciudad-de-mexico': {
    slug: 'ciudad-de-mexico',
    name: 'Ciudad de México',
    neighborhoods: [
      { name: 'Condesa', slug: 'condesa' },
      { name: 'Roma Norte', slug: 'roma-norte' },
      { name: 'Polanco', slug: 'polanco' },
      { name: 'Coyoacán', slug: 'coyoacan' },
      { name: 'Santa Fe', slug: 'santa-fe' },
    ],
  },
  'buenos-aires': {
    slug: 'buenos-aires',
    name: 'Buenos Aires',
    neighborhoods: [
      { name: 'Palermo', slug: 'palermo' },
      { name: 'Recoleta', slug: 'recoleta' },
      { name: 'San Telmo', slug: 'san-telmo' },
      { name: 'Belgrano', slug: 'belgrano' },
      { name: 'Puerto Madero', slug: 'puerto-madero' },
    ],
  },
  medellin: {
    slug: 'medellin',
    name: 'Medellín',
    neighborhoods: [
      { name: 'El Poblado', slug: 'el-poblado' },
      { name: 'Laureles', slug: 'laureles' },
      { name: 'Envigado', slug: 'envigado' },
      { name: 'Sabaneta', slug: 'sabaneta' },
    ],
  },
  austin: {
    slug: 'austin',
    name: 'Austin',
    neighborhoods: [
      { name: 'Mueller', slug: 'mueller' },
      { name: 'Zilker', slug: 'zilker' },
      { name: 'Barton Hills', slug: 'barton-hills' },
      { name: 'The Domain', slug: 'domain' },
      { name: 'East Austin', slug: 'east-austin' },
      { name: 'Tarrytown', slug: 'tarrytown' },
    ],
  },
  miami: {
    slug: 'miami',
    name: 'Miami',
    neighborhoods: [
      { name: 'Brickell', slug: 'brickell' },
      { name: 'Wynwood', slug: 'wynwood' },
      { name: 'Miami Beach', slug: 'miami-beach' },
      { name: 'Downtown', slug: 'downtown' },
      { name: 'Edgewater', slug: 'edgewater' },
      { name: 'Coconut Grove', slug: 'coconut-grove' },
    ],
  },
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

  // AUSTIN, TEXAS
  austin: {
    mueller: [
      { slug: 'east-austin', name: 'East Austin', description: 'Creativo y emergente' },
      { slug: 'domain', name: 'The Domain', description: 'Tech hub corporativo' },
      { slug: 'zilker', name: 'Zilker', description: 'Verde y trendy' },
    ],
    zilker: [
      { slug: 'barton-hills', name: 'Barton Hills', description: 'Residencial y tranquilo' },
      { slug: 'mueller', name: 'Mueller', description: 'Sostenible y moderno' },
      { slug: 'tarrytown', name: 'Tarrytown', description: 'Premium y exclusivo' },
    ],
    'barton-hills': [
      { slug: 'zilker', name: 'Zilker', description: 'Vibrante y al aire libre' },
      { slug: 'tarrytown', name: 'Tarrytown', description: 'Elegante' },
      { slug: 'mueller', name: 'Mueller', description: 'Innovador' },
    ],
    domain: [
      { slug: 'mueller', name: 'Mueller', description: 'Cerca de Tesla y tech' },
      { slug: 'tarrytown', name: 'Tarrytown', description: 'Residencial' },
      { slug: 'east-austin', name: 'East Austin', description: 'Artístico' },
    ],
    'east-austin': [
      { slug: 'mueller', name: 'Mueller', description: 'Planificado y verde' },
      { slug: 'zilker', name: 'Zilker', description: 'Cerca del centro' },
      { slug: 'domain', name: 'The Domain', description: 'Segundo centro urbano' },
    ],
    tarrytown: [
      { slug: 'zilker', name: 'Zilker', description: 'Cerca de Lady Bird Lake' },
      { slug: 'barton-hills', name: 'Barton Hills', description: 'Tranquilo' },
      { slug: 'domain', name: 'The Domain', description: 'Corporativo' },
    ],
  },

  // MIAMI, FLORIDA
  miami: {
    brickell: [
      { slug: 'downtown', name: 'Downtown', description: 'Céntrico y conectado' },
      { slug: 'edgewater', name: 'Edgewater', description: 'Bahía y lifestyle moderno' },
      { slug: 'coconut-grove', name: 'Coconut Grove', description: 'Verde y bohemio' },
    ],
    wynwood: [
      { slug: 'miami-beach', name: 'Miami Beach', description: 'Playa y ocio premium' },
      { slug: 'downtown', name: 'Downtown', description: 'Conectividad y servicios' },
      { slug: 'brickell', name: 'Brickell', description: 'Finance y high-rise living' },
    ],
    'miami-beach': [
      { slug: 'wynwood', name: 'Wynwood', description: 'Arte y creatividad' },
      { slug: 'edgewater', name: 'Edgewater', description: 'Residencial frente a la bahía' },
      { slug: 'downtown', name: 'Downtown', description: 'Urbano y accesible' },
    ],
    downtown: [
      { slug: 'brickell', name: 'Brickell', description: 'Centro financiero' },
      { slug: 'wynwood', name: 'Wynwood', description: 'Cultural y dinámico' },
      { slug: 'edgewater', name: 'Edgewater', description: 'Skyline y bahía' },
    ],
    edgewater: [
      { slug: 'downtown', name: 'Downtown', description: 'Movilidad y servicios' },
      { slug: 'miami-beach', name: 'Miami Beach', description: 'Lifestyle costero' },
      { slug: 'brickell', name: 'Brickell', description: 'Negocios y amenities' },
    ],
    'coconut-grove': [
      { slug: 'brickell', name: 'Brickell', description: 'Conectado al centro financiero' },
      { slug: 'edgewater', name: 'Edgewater', description: 'Moderno y residencial' },
      { slug: 'wynwood', name: 'Wynwood', description: 'Creatividad y gastronomía' },
    ],
  },
}

/**
 * Obtiene la configuración de ciudad (safe)
 */
export function getCityConfig(citySlug: unknown): CityNeighborhoods | undefined {
  if (typeof citySlug !== 'string' || !citySlug.trim()) return undefined
  return CITY_NEIGHBORHOODS[citySlug.toLowerCase()]
}

/**
 * Obtiene la configuración de barrio (safe)
 */
export function getNeighborhoodConfig(
  citySlug: unknown,
  neighborhoodSlug: unknown
): NeighborhoodRef | undefined {
  const city = getCityConfig(citySlug)
  if (!city) return undefined

  if (typeof neighborhoodSlug !== 'string' || !neighborhoodSlug.trim()) return undefined
  const neighborhoodLower = neighborhoodSlug.toLowerCase()

  return city.neighborhoods.find((n) => n.slug === neighborhoodLower)
}

export function getAllCityNeighborhoodParams(): Array<{ locale: string; city: string; neighborhood: string }> {
  const locales = ['en', 'es']
  return Object.values(CITY_NEIGHBORHOODS).flatMap((city) =>
    city.neighborhoods.flatMap((n) =>
      locales.map((locale) => ({
        locale,
        city: city.slug,
        neighborhood: n.slug,
      }))
    )
  )
}

/**
 * Obtiene barrios relacionados para un barrio específico (safe)
 */
export function getRelatedNeighborhoods(
  city: unknown,
  neighborhood: unknown
): RelatedNeighborhood[] {
  if (typeof city !== 'string' || !city.trim()) return []
  if (typeof neighborhood !== 'string' || !neighborhood.trim()) return []

  const cityLower = city.toLowerCase()
  const neighborhoodLower = neighborhood.toLowerCase()

  return NEIGHBORHOOD_RELATIONS[cityLower]?.[neighborhoodLower] || []
}