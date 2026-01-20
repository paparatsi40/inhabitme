/**
 * FAQs dinámicas para páginas de barrio
 * 
 * Estrategia:
 * - Responden intención real de búsqueda
 * - Long-tail keywords naturales
 * - 4-5 preguntas por barrio
 * - Contextuales y específicas
 */

export interface FAQ {
  question: string
  answer: string
}

type NeighborhoodFAQs = {
  [city: string]: {
    [neighborhood: string]: FAQ[]
  }
}

/**
 * Genera FAQs genéricas para cualquier barrio/ciudad
 */
export function generateGenericFAQs(neighborhood: string, city: string): FAQ[] {
  return [
    {
      question: `¿Es ${neighborhood} un buen barrio para alquilar en ${city}?`,
      answer: `Sí. ${neighborhood} es uno de los barrios más solicitados para estancias medias en ${city}. Combina vida local auténtica con todas las comodidades necesarias para trabajar remotamente: cafés con WiFi, espacios tranquilos, transporte público cercano y ambiente internacional.`,
    },
    {
      question: `¿Cuánto cuesta alquilar un apartamento mensual en ${neighborhood}?`,
      answer: `Los precios de alquiler mensual en ${neighborhood} varían según el tamaño y amenities. En general, un estudio ronda los €800-1200/mes, mientras que un apartamento de 1-2 habitaciones puede costar €1200-1800/mes, todo incluido (WiFi, servicios, limpieza).`,
    },
    {
      question: `¿${neighborhood} tiene buena conexión WiFi para trabajar remotamente?`,
      answer: `Todas las propiedades que listamos en ${neighborhood} tienen WiFi verificado de mínimo 50 Mbps, ideal para videollamadas, trabajo en la nube y streaming. Muchas incluyen además escritorio dedicado y silla ergonómica para trabajar cómodamente.`,
    },
    {
      question: `¿Qué incluye el alquiler mensual en ${neighborhood}, ${city}?`,
      answer: `Nuestros alquileres en ${neighborhood} son todo incluido: WiFi de alta velocidad, servicios (agua, luz, gas), limpieza regular, y en muchos casos también ropa de cama, toallas y artículos básicos de cocina. Sin sorpresas ni costes ocultos.`,
    },
    {
      question: `¿Cuál es la estancia mínima para alquilar en ${neighborhood}?`,
      answer: `La mayoría de propiedades en ${neighborhood} tienen una estancia mínima de 1 mes, perfectas para estancias medias de 1 a 12 meses. Ideales para nómadas digitales, estudiantes internacionales, profesionales en movilidad o proyectos temporales.`,
    },
  ]
}

/**
 * FAQs específicas por barrio (override las genéricas)
 * Solo para barrios principales que necesitan copy más específico
 */
export const NEIGHBORHOOD_FAQS: NeighborhoodFAQs = {
  // MADRID
  madrid: {
    malasana: [
      {
        question: '¿Es Malasaña seguro para vivir?',
        answer: 'Sí, Malasaña es un barrio muy seguro y vibrante de Madrid. Cuenta con gran presencia policial, calles bien iluminadas y una comunidad local muy activa. Es especialmente popular entre nómadas digitales y profesionales remotos por su ambiente internacional y tolerante.',
      },
      {
        question: '¿Cuánto cuesta alquilar en Malasaña para estancias medias?',
        answer: 'Los precios de alquiler mensual en Malasaña varían entre €900-1500/mes para un estudio o apartamento de 1 habitación, todo incluido. Los apartamentos de 2 habitaciones pueden costar €1400-2000/mes. Todos nuestros precios incluyen WiFi, servicios y limpieza.',
      },
      {
        question: '¿Malasaña es bueno para trabajar remotamente?',
        answer: 'Malasaña es uno de los mejores barrios de Madrid para nómadas digitales. Tiene docenas de cafés con WiFi excelente, varios coworkings (Impact Hub, WeWork), bibliotecas públicas y un ambiente muy propicio para la creatividad y productividad.',
      },
      {
        question: '¿Qué transporte público hay en Malasaña?',
        answer: 'Malasaña está muy bien conectado: Metro líneas 1, 2, 3, 5 y 10 en menos de 10 minutos caminando, múltiples líneas de autobús, Bicimad (bicicletas públicas) y está en el centro de Madrid, por lo que puedes llegar caminando a la mayoría de sitios.',
      },
    ],
    chamberi: [
      {
        question: '¿Chamberí es un barrio tranquilo o animado?',
        answer: 'Chamberí es el equilibrio perfecto: residencial y tranquilo durante el día, pero con vida nocturna moderada. Ideal para profesionales que buscan un ambiente más sosegado que Malasaña pero sin alejarse del centro. Perfecto para trabajar desde casa sin ruido excesivo.',
      },
      {
        question: '¿Es caro alquilar en Chamberí comparado con otros barrios?',
        answer: 'Chamberí tiene precios medio-altos (€1100-1800/mes), similares a Salamanca pero más accesibles que el centro histórico. La calidad de vida compensa: calles limpias, comercio local, transporte excelente y ambiente familiar sin ser aburrido.',
      },
      {
        question: '¿Chamberí tiene buenos cafés para trabajar?',
        answer: 'Sí, Chamberí tiene una excelente oferta de cafés tranquilos perfectos para trabajar: Federal Café, Toma Café, La Bicicleta Café y Café Moderno son algunos favoritos de nómadas digitales. Todos con WiFi potente, enchufes y ambiente tranquilo.',
      },
    ],
    chueca: [
      {
        question: '¿Chueca es un barrio ruidoso?',
        answer: 'Chueca es vibrante y animado, especialmente por las noches y fines de semana. Si buscas tranquilidad absoluta para trabajar, quizás prefieras Chamberí. Pero si te gusta el ambiente cosmopolita, diverso y con vida nocturna a la vuelta de la esquina, Chueca es ideal.',
      },
      {
        question: '¿Chueca es seguro para extranjeros?',
        answer: 'Chueca es uno de los barrios más abiertos, tolerantes y seguros de Madrid. Con gran presencia internacional, turismo y comunidad LGBTQ+, es muy acogedor para cualquier persona independientemente de su origen. Perfecto para expatriados y nómadas digitales.',
      },
    ],
  },

  // BARCELONA
  barcelona: {
    gracia: [
      {
        question: '¿Gracia está bien conectado con el centro de Barcelona?',
        answer: 'Sí, Gracia está a 10-15 minutos del centro de Barcelona en metro (L3 y L4). También puedes llegar caminando a Passeig de Gràcia en 20 minutos. Excelente conexión de transporte sin el ruido y turismo del centro.',
      },
      {
        question: '¿Es Gracia un buen barrio para nómadas digitales?',
        answer: 'Gracia es probablemente el mejor barrio de Barcelona para nómadas digitales: tiene ambiente de pueblo dentro de la ciudad, docenas de cafés con WiFi, varios coworkings, plazas tranquilas para trabajar al aire libre y una comunidad muy activa de freelancers y emprendedores.',
      },
    ],
    eixample: [
      {
        question: '¿Eixample es caro para alquilar?',
        answer: 'Eixample tiene precios medio-altos (€1200-2000/mes), pero ofrece excelente calidad: arquitectura modernista, calles amplias, transporte excelente y ambiente internacional. Es más caro que Gracia pero más céntrico y con mejor infraestructura.',
      },
    ],
  },

  // VALENCIA
  valencia: {
    ruzafa: [
      {
        question: '¿Ruzafa es el mejor barrio de Valencia para nómadas digitales?',
        answer: 'Sí, Ruzafa es el epicentro de la comunidad de nómadas digitales en Valencia. Tiene docenas de cafés modernos con WiFi excelente, varios coworkings (Wayco, Vortex), eventos de networking regulares y un ambiente muy internacional y creativo.',
      },
      {
        question: '¿Cuánto cuesta alquilar en Ruzafa?',
        answer: 'Los precios en Ruzafa rondan €700-1200/mes para un apartamento de 1 habitación, significativamente más barato que Madrid o Barcelona. Excelente relación calidad-precio: barrio trendy, céntrico y con todo lo necesario para trabajar remotamente.',
      },
    ],
  },
}

/**
 * Obtiene FAQs para un barrio específico
 * Si no hay FAQs específicas, genera genéricas
 */
export function getFAQs(city: string, neighborhood: string): FAQ[] {
  const cityLower = city.toLowerCase()
  const neighborhoodLower = neighborhood.toLowerCase()
  
  // Intentar obtener FAQs específicas
  const specificFAQs = NEIGHBORHOOD_FAQS[cityLower]?.[neighborhoodLower]
  
  if (specificFAQs && specificFAQs.length > 0) {
    return specificFAQs
  }
  
  // Fallback a FAQs genéricas
  return generateGenericFAQs(neighborhood, city)
}
