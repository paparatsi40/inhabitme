/**
 * Lifestyle signals específicos por ciudad.
 *
 * Reemplaza el set genérico templateado por 65 barrios con datos
 * realistas y verificables a nivel ciudad. Si una ciudad no está
 * mapeada aquí, se usa el fallback genérico (definido en messages JSON).
 *
 * Mantén los keys consistentes para todos los locales (EN, ES).
 */

export interface CityLifestyleSignals {
  /** Internet quality / WiFi infrastructure */
  internet: { en: string; es: string }
  /** Cafés / coworking spaces */
  cowork: { en: string; es: string }
  /** Public transport / mobility */
  transport: { en: string; es: string }
  /** Community / nomad scene */
  community: { en: string; es: string }
}

export const CITY_LIFESTYLE: Record<string, CityLifestyleSignals> = {
  madrid: {
    internet: {
      en: 'Fiber optic in most apartments. 100–600 Mbps standard.',
      es: 'Fibra óptica en la mayoría de pisos. 100–600 Mbps estándar.',
    },
    cowork: {
      en: 'Hubsy, Spaces, Talent Garden. Plus countless cafés like Hanso and Toma.',
      es: 'Hubsy, Spaces, Talent Garden. Y decenas de cafés como Hanso y Toma.',
    },
    transport: {
      en: 'Metro lines 1–12 cover the entire city. Cercanías for nearby towns.',
      es: 'Metro líneas 1–12 cubren toda la ciudad. Cercanías para localidades cercanas.',
    },
    community: {
      en: 'Madrid Tech & Nomads Slack, regular meetups in Malasaña and Chamberí.',
      es: 'Slack Madrid Tech & Nomads, meetups regulares en Malasaña y Chamberí.',
    },
  },
  barcelona: {
    internet: {
      en: 'Fiber widely deployed by Movistar, Vodafone, Orange. 300+ Mbps common.',
      es: 'Fibra desplegada por Movistar, Vodafone, Orange. 300+ Mbps común.',
    },
    cowork: {
      en: 'OneCoWork, Aticco, Cloudworks. Strong cafe-coworking culture in Gràcia and Born.',
      es: 'OneCoWork, Aticco, Cloudworks. Fuerte cultura de café-coworking en Gràcia y Born.',
    },
    transport: {
      en: 'Metro, tram, and Bicing bike-share. Beach reachable on foot from many neighborhoods.',
      es: 'Metro, tranvía y Bicing. Playa alcanzable a pie desde muchos barrios.',
    },
    community: {
      en: 'Barcelona Tech City, Pier01 startup hub, big nomad scene year-round.',
      es: 'Barcelona Tech City, hub Pier01, escena nómada grande todo el año.',
    },
  },
  valencia: {
    internet: {
      en: 'Fiber widespread. Telefónica and Vodafone offer 600 Mbps to most addresses.',
      es: 'Fibra extendida. Telefónica y Vodafone ofrecen 600 Mbps a la mayoría.',
    },
    cowork: {
      en: 'Wayco, Botica, Lanzadera (startup accelerator). Plenty of beach-side cafés.',
      es: 'Wayco, Botica, Lanzadera (aceleradora). Muchos cafés cerca de la playa.',
    },
    transport: {
      en: 'Metro, Valenbisi bike-share, flat city perfect for cycling.',
      es: 'Metro, Valenbisi y ciudad plana perfecta para bici.',
    },
    community: {
      en: 'Smaller but growing nomad community, Lanzadera ecosystem connects founders.',
      es: 'Comunidad nómada pequeña pero creciente, ecosistema Lanzadera conecta founders.',
    },
  },
  sevilla: {
    internet: {
      en: 'Fiber in central neighborhoods. 300 Mbps standard with Movistar / Orange.',
      es: 'Fibra en barrios centrales. 300 Mbps estándar con Movistar / Orange.',
    },
    cowork: {
      en: 'Workincompany, La Industrial. Affordable cafés in Triana and Alameda.',
      es: 'Workincompany, La Industrial. Cafés accesibles en Triana y Alameda.',
    },
    transport: {
      en: 'Metro line 1, tram, and Sevici bike-share. Compact center walkable in 25 min.',
      es: 'Metro línea 1, tranvía y Sevici. Centro compacto caminable en 25 min.',
    },
    community: {
      en: 'Smaller nomad presence, mainly around Alameda and Macarena.',
      es: 'Presencia nómada pequeña, sobre todo en Alameda y Macarena.',
    },
  },
  lisboa: {
    internet: {
      en: 'Fiber by NOS, MEO, Vodafone. Up to 1 Gbps in central neighborhoods.',
      es: 'Fibra por NOS, MEO, Vodafone. Hasta 1 Gbps en barrios centrales.',
    },
    cowork: {
      en: 'Second Home, Avila Spaces, Heden. Café culture strong in Príncipe Real and Santos.',
      es: 'Second Home, Avila Spaces, Heden. Cultura de café fuerte en Príncipe Real y Santos.',
    },
    transport: {
      en: 'Metro, tram, GIRA bike-share. Hilly — tram 28 is iconic.',
      es: 'Metro, tranvía, GIRA. Ciudad con cuestas — tram 28 icónico.',
    },
    community: {
      en: 'Largest nomad community in Iberia. Web Summit hub. Constant meetups.',
      es: 'Mayor comunidad nómada de Iberia. Web Summit. Meetups constantes.',
    },
  },
  porto: {
    internet: {
      en: 'Fiber widely available. Often faster and cheaper than Lisbon.',
      es: 'Fibra ampliamente disponible. Suele ser más rápida y barata que Lisboa.',
    },
    cowork: {
      en: 'Porto i/o, UPTEC. Riverside cafés in Ribeira and creative scene in Cedofeita.',
      es: 'Porto i/o, UPTEC. Cafés frente al río en Ribeira, escena creativa en Cedofeita.',
    },
    transport: {
      en: 'Metro 6 lines, walkable center. Andante card for all transport.',
      es: 'Metro 6 líneas, centro caminable. Tarjeta Andante para todo el transporte.',
    },
    community: {
      en: 'Tight-knit growing community, less touristy than Lisbon. Nomad List favorite.',
      es: 'Comunidad pequeña y creciente, menos turística que Lisboa. Favorito de Nomad List.',
    },
  },
  'ciudad-de-mexico': {
    internet: {
      en: 'Telmex/Izzi fiber in Roma/Condesa/Polanco. 200–500 Mbps common.',
      es: 'Fibra Telmex/Izzi en Roma/Condesa/Polanco. 200–500 Mbps común.',
    },
    cowork: {
      en: 'WeWork, Selina, Público. Endless café options in Roma and Condesa.',
      es: 'WeWork, Selina, Público. Innumerables cafés en Roma y Condesa.',
    },
    transport: {
      en: 'Metro 12 lines, Metrobús, Ecobici. Use Uber/DiDi for long routes.',
      es: 'Metro 12 líneas, Metrobús, Ecobici. Uber/DiDi para trayectos largos.',
    },
    community: {
      en: 'Largest nomad hub in Latin America. Constant events in Roma and Juárez.',
      es: 'Mayor hub nómada de Latinoamérica. Eventos constantes en Roma y Juárez.',
    },
  },
  'buenos-aires': {
    internet: {
      en: 'Fiber via Fibertel, Telecom. 100–300 Mbps in Palermo, Recoleta, Puerto Madero.',
      es: 'Fibra por Fibertel, Telecom. 100–300 Mbps en Palermo, Recoleta, Puerto Madero.',
    },
    cowork: {
      en: 'AreaTres, La Maquinita Co. Iconic cafés like Lattente and Felix Felicis.',
      es: 'AreaTres, La Maquinita Co. Cafés icónicos como Lattente y Felix Felicis.',
    },
    transport: {
      en: 'Subte (metro) 6 lines, plus extensive Colectivos (buses). Ecobici bike-share.',
      es: 'Subte 6 líneas, Colectivos (buses) extensos. Ecobici de bicicletas.',
    },
    community: {
      en: 'Strong tech scene (Mercado Libre, Globant). Active nomad meetups in Palermo.',
      es: 'Escena tech fuerte (Mercado Libre, Globant). Meetups nómadas activos en Palermo.',
    },
  },
  medellin: {
    internet: {
      en: 'Fiber from Tigo, Claro, ETB. 200+ Mbps in El Poblado and Laureles.',
      es: 'Fibra de Tigo, Claro, ETB. 200+ Mbps en El Poblado y Laureles.',
    },
    cowork: {
      en: 'Selina, Atom House, El Poblado coworks. Pergamino, Hija Mía cafés.',
      es: 'Selina, Atom House, coworks en El Poblado. Cafés Pergamino, Hija Mía.',
    },
    transport: {
      en: 'Metro line A/B + Metrocable. EnCicla bike-share in flat areas.',
      es: 'Metro líneas A/B + Metrocable. EnCicla en zonas planas.',
    },
    community: {
      en: 'Booming nomad scene in El Poblado. Meetups, Spanish exchanges, startup culture.',
      es: 'Escena nómada en auge en El Poblado. Meetups, intercambios y cultura startup.',
    },
  },
  austin: {
    internet: {
      en: 'Google Fiber, AT&T Fiber, Spectrum. Gigabit speeds widely available.',
      es: 'Google Fiber, AT&T Fiber, Spectrum. Velocidades gigabit ampliamente disponibles.',
    },
    cowork: {
      en: 'WeWork, Capital Factory, The Riveter. Coffee culture is strong (Houndstooth, Mozart\'s).',
      es: 'WeWork, Capital Factory, The Riveter. Cultura del café fuerte (Houndstooth, Mozart\'s).',
    },
    transport: {
      en: 'Capital Metro buses, bike lanes growing. Car still useful for outer neighborhoods.',
      es: 'Buses Capital Metro, carriles bici en crecimiento. Carro útil para barrios exteriores.',
    },
    community: {
      en: 'Major US tech hub. Capital Factory meetups, SXSW, Austin Tech Alliance.',
      es: 'Hub tech principal de USA. Meetups en Capital Factory, SXSW, Austin Tech Alliance.',
    },
  },
  miami: {
    internet: {
      en: 'Xfinity, AT&T Fiber. Gigabit available, 500 Mbps standard in Brickell, Wynwood.',
      es: 'Xfinity, AT&T Fiber. Gigabit disponible, 500 Mbps estándar en Brickell y Wynwood.',
    },
    cowork: {
      en: 'WeWork Brickell, The LAB Miami, Spaces Wynwood. Vibrant café scene.',
      es: 'WeWork Brickell, The LAB Miami, Spaces Wynwood. Escena de cafés vibrante.',
    },
    transport: {
      en: 'Metromover free downtown, Metrorail/Metrobus. Bike share. Car helps.',
      es: 'Metromover gratis en el centro, Metrorail/Metrobus. Bici. Carro ayuda.',
    },
    community: {
      en: 'Booming tech transplant scene (Miami Tech Week, eMerge Americas).',
      es: 'Escena tech en auge (Miami Tech Week, eMerge Americas).',
    },
  },
}

export function getCityLifestyle(citySlug: string, locale: 'en' | 'es'): {
  internet: string
  cowork: string
  transport: string
  community: string
} | null {
  const data = CITY_LIFESTYLE[citySlug]
  if (!data) return null
  return {
    internet: data.internet[locale],
    cowork: data.cowork[locale],
    transport: data.transport[locale],
    community: data.community[locale],
  }
}
