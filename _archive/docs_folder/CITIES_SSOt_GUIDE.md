# Guía de Arquitectura: Sistema de Ciudades (SSOT)

## Resumen Ejecutivo

Este documento describe la arquitectura de **Single Source of Truth (SSOT)** implementada para gestionar ciudades en InhabitMe. 

**Problema anterior:** La información de ciudades estaba dispersa en 7+ archivos, causando inconsistencias y errores 404 al agregar nuevas ciudades.

**Solución implementada:** Centralización de toda la información de ciudades en `src/config/cities.ts`, con consumo automático por todos los componentes.

---

## Arquitectura SSOT

### Diagrama de Flujo

```
┌─────────────────────────────────────────────────────────────┐
│                    src/config/cities.ts                    │
│                   (Single Source of Truth)                  │
│                                                             │
│  ┌─────────────┐  ┌──────────────┐  ┌─────────────────┐   │
│  │   Datos de  │  │  Vecindarios │  │  Coordenadas   │   │
│  │   ciudad    │  │  (barrios)    │  │   (GPS/mapas)  │   │
│  └─────────────┘  └──────────────┘  └─────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                              │
          ┌───────────────────┼───────────────────┐
          │                   │                   │
          ▼                   ▼                   ▼
┌─────────────────┐  ┌──────────────────┐  ┌────────────────┐
│   Homepage      │  │  Páginas de      │  │     SEO        │
│   (CityCards)   │  │  Ciudad/Barrio   │  │   (Metadata)   │
└─────────────────┘  └──────────────────┘  └────────────────┘
```

---

## Estructura del Archivo Central

### `src/config/cities.ts`

```typescript
export interface CityConfig {
  slug: string           // URL-friendly: 'madrid', 'buenos-aires'
  name: string           // Display: 'Madrid', 'Buenos Aires'
  subtitle: string       // Para homepage: 'Capital de España'
  price: string          // Precio desde: '800 EUR'
  country: string        // Código ISO: 'ES', 'AR', 'MX'
  image: string          // URL de Unsplash
  gradient: string       // Tailwind classes para hero
  hoverBorder: string    // Tailwind classes para hover
  textColor: string      // Tailwind classes para texto
  description: string    // Para SEO/meta
  indexable: boolean     // Para SEO (sitemap)
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
```

---

## Guía Paso a Paso: Agregar Nueva Ciudad

### Paso 1: Agregar a `src/config/cities.ts`

```typescript
export const CITIES: CityConfig[] = [
  // ... ciudades existentes ...
  
  {
    slug: 'berlin',
    name: 'Berlin',
    subtitle: 'Tech hub europeo',
    price: '700 EUR',
    country: 'DE',
    image: 'https://images.unsplash.com/photo-1560969184-10fe8719e047?w=800&h=600&fit=crop&q=80',
    gradient: 'from-gray-600 to-gray-800',
    hoverBorder: 'hover:border-gray-400',
    textColor: 'text-gray-600',
    description: 'Berlín para nómadas digitales: creatividad, historia y tecnología.',
    indexable: true,
    neighborhoods: [
      { slug: 'mitte', name: 'Mitte', description: 'Céntrico y histórico' },
      { slug: 'kreuzberg', name: 'Kreuzberg', description: 'Alternativo y multicultural' },
      { slug: 'friedrichshain', name: 'Friedrichshain', description: 'Vibrante y creativo' },
      { slug: 'neukolln', name: 'Neukölln', description: 'Trendy y emergente' },
    ],
    coordinates: { lat: 52.52, lng: 13.405, zoom: 13 },
  },
]
```

### Paso 2: Agregar descripciones a `messages/en.json`

```json
{
  "neighborhoods": {
    "madrid": { ... },
    "barcelona": { ... },
    // ... otras ciudades ...
    
    "berlin": {
      "mitte": "The historic heart of Berlin. Government district, Brandenburg Gate, and Museum Island. Perfect for professionals who need to be at the center of everything.",
      "kreuzberg": "Berlin's alternative and multicultural epicenter. Street art, international food scene, and vibrant nightlife. Ideal for creatives and free spirits.",
      "friedrichshain": "Young, vibrant, and full of energy. Former East Berlin district with clubs, cafés, and a strong creative community. Perfect for digital nomads.",
      "neukolln": "Berlin's trendy up-and-coming neighborhood. International community, artisanal cafés, and a mix of old and new. Great for young professionals."
    }
  }
}
```

### Paso 3: Agregar descripciones a `messages/es.json`

```json
{
  "neighborhoods": {
    "madrid": { ... },
    "barcelona": { ... },
    // ... otras ciudades ...
    
    "berlin": {
      "mitte": "El corazón histórico de Berlín. Distrito gubernamental, Puerta de Brandeburgo e Isla de los Museos. Perfecto para profesionales que necesitan estar en el centro.",
      "kreuzberg": "Epicentro alternativo y multicultural de Berlín. Arte urbano, escena gastronómica internacional y vida nocturna vibrante. Ideal para creativos.",
      "friedrichshain": "Joven, vibrante y lleno de energía. Antiguo distrito de Berlín Este con clubs, cafés y fuerte comunidad creativa. Perfecto para nómadas digitales.",
      "neukolln": "El barrio trendy y emergente de Berlín. Comunidad internacional, cafés artesanales y mezcla de lo antiguo y nuevo. Excelente para jóvenes profesionales."
    }
  }
}
```

### Paso 4: Verificar

1. **Homepage**: La ciudad aparece automáticamente en la grilla y el carrusel
2. **Página de ciudad**: `/en/berlin` funciona y muestra los barrios
3. **Página de barrio**: `/en/berlin/mitte` muestra la descripción en inglés
4. **SEO**: El sitemap incluye automáticamente las nuevas rutas

---

## Archivos que Consumen el SSOT

### 1. Homepage (`src/app/[locale]/page.tsx`)

```typescript
import { CITIES } from '@/config/cities'

// Grilla de ciudades
<div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
  {CITIES.map((city) => (
    <CityCard
      key={city.slug}
      slug={city.slug}
      name={city.name}
      subtitle={city.subtitle}
      price={city.price}
      gradient={city.gradient}
      hoverBorder={city.hoverBorder}
      textColor={city.textColor}
    />
  ))}
</div>
```

### 2. Carrusel (`src/components/hero/CityCarousel.tsx`)

```typescript
import { CITIES } from '@/config/cities'

// Usa CITIES directamente para el carrusel animado
{CITIES.map((city, index) => (
  <div key={city.name}>
    <img src={city.image} alt={city.name} />
    <p>{city.subtitle}</p>
  </div>
))}
```

### 3. Página de Ciudad (`src/app/[locale]/[city]/page.tsx`)

```typescript
import { CITIES, getCityBySlug } from '@/config/cities'

const city = getCityBySlug(citySlug)
const neighborhoods = city?.neighborhoods || []
```

### 4. Página de Barrio (`src/app/[locale]/[city]/[neighborhood]/page.tsx`)

```typescript
import { getTranslations, getLocale } from 'next-intl/server'

const locale = await getLocale()
const t = await getTranslations({ locale, namespace: 'neighborhoods' })
const description = t(`${citySlug}.${neighborhoodSlug}`)
```

### 5. SEO (`src/config/cities.ts` - `getAllCityNeighborhoodParams`)

```typescript
export function getAllCityNeighborhoodParams() {
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
```

---

## API de Helpers Disponibles

```typescript
// Obtener ciudad por slug
getCityBySlug('madrid') → CityConfig | undefined

// Obtener todos los slugs
getAllCitySlugs() → ['madrid', 'barcelona', ...]

// Obtener barrio específico
getNeighborhoodBySlug('madrid', 'malasana') → NeighborhoodRef | undefined

// Generar parámetros estáticos para Next.js
getAllCityNeighborhoodParams() → [{ locale, city, neighborhood }]
```

---

## Errores Comunes y Soluciones

### Error 404 al agregar ciudad

**Causa:** La página de ciudad no encuentra la configuración.

**Solución:** Verificar que:
1. El slug está en `CITIES` (config/cities.ts)
2. El `matcher` del middleware incluye la ruta
3. Los `params` usan `await` (Next.js 16+)

### Descripciones no aparecen traducidas

**Causa:** Falta la traducción en `messages/{en,es}.json`

**Solución:** 
- Verificar que la clave existe: `neighborhoods.{citySlug}.{neighborhoodSlug}`
- Verificar que el JSON es válido (sin comas finales)
- Reiniciar el servidor de desarrollo

### Carrusel no muestra nueva ciudad

**Causa:** `CityCarousel.tsx` no está importando de `CITIES`.

**Verificación:**
```typescript
import { CITIES } from '@/config/cities'
// NO usar array local hardcodeado
```

### Google Maps no carga

**Causa:** Múltiples cargas del script de Google Maps.

**Solución:** Usar siempre el loader compartido:
```typescript
import { loadGoogleMaps } from '@/lib/maps/google-maps-loader'
```

---

## Checklist de Calidad

Antes de dar por completada la adición de una ciudad:

- [ ] Ciudad aparece en homepage grilla
- [ ] Ciudad aparece en carrusel animado
- [ ] `/en/{ciudad}` carga sin 404
- [ ] `/es/{ciudad}` carga sin 404
- [ ] Barrios listados en página de ciudad
- [ ] `/en/{ciudad}/{barrio}` carga descripción en inglés
- [ ] `/es/{ciudad}/{barrio}` carga descripción en español
- [ ] Imágenes cargan correctamente (URLs de Unsplash válidas)
- [ ] Login funciona (middleware de Clerk activo)
- [ ] No hay errores en consola (Google Maps duplicado)

---

## Dependencias Técnicas

| Tecnología | Versión | Uso |
|------------|---------|-----|
| Next.js | 16.1.6 | App Router, params como Promise |
| next-intl | 4.7.0 | Traducciones i18n |
| Clerk | 6.36.5 | Autenticación |
| Tailwind CSS | 3.4.19 | Estilos gradient/hover |

---

## Notas de Mantenimiento

### Cuándo NO usar el SSOT

- **Datos de propiedades específicas:** Usar base de datos (Supabase)
- **Precios dinámicos:** Usar lógica de negocio en tiempo real
- **Disponibilidad de listings:** Usar API/repositorios

### Límites conocidos

- **Máximo recomendado:** 20 ciudades (rendimiento de build)
- **Imágenes:** Usar Unsplash con parámetros `w=800&h=600&fit=crop&q=80`
- **Descripciones:** Máximo 500 caracteres por barrio

---

## Historial de Cambios

| Fecha | Cambio | Autor |
|-------|--------|-------|
| 2026-03-04 | Implementación SSOT inicial | Firebender |
| 2026-03-04 | Migración de descripciones a next-intl | Firebender |
| 2026-03-04 | Fix de Clerk middleware | Firebender |

---

## Contacto y Soporte

Para dudas sobre la arquitectura:
- Revisar este documento primero
- Verificar el archivo `src/config/cities.ts` como referencia
- Consultar los mensajes de error en consola del navegador y servidor

---

**Documento versión:** 1.0  
**Última actualización:** 2026-03-04  
**Próxima revisión:** Al agregar ciudad #11
