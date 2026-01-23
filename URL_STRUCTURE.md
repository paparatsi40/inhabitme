# 🌐 URL Structure - InhabitMe

## 📋 Tabla de Contenido

1. [Principios de Diseño](#principios-de-diseño)
2. [Estructura Actual](#estructura-actual)
3. [Patrones de URL](#patrones-de-url)
4. [Normalización y Redirecciones](#normalización-y-redirecciones)
5. [Mejores Prácticas](#mejores-prácticas)
6. [Troubleshooting](#troubleshooting)

---

## 🎯 Principios de Diseño

InhabitMe sigue estos principios para URLs SEO-friendly:

### ✅ DO:
- Usar **minúsculas** siempre
- Usar **guiones** (`-`) para separar palabras
- Mantener URLs **cortas y descriptivas**
- Usar estructura **jerárquica clara**
- Incluir **palabras clave relevantes**
- Ser **consistente** en toda la aplicación
- **No trailing slashes** (excepto root)

### ❌ DON'T:
- Usar MAYÚSCULAS o MixedCase
- Usar guiones bajos (`_`)
- URLs largas (>75 caracteres)
- Parámetros innecesarios
- Caracteres especiales o acentos
- Trailing slashes en páginas

---

## 🏗️ Estructura Actual

### Formato Base

```
https://www.inhabitme.com/{locale}/{resource}/{id}
```

### Jerarquía

```
www.inhabitme.com/
├── en/                          # Locale: Inglés
│   ├── (homepage)
│   ├── search                   # Búsqueda
│   ├── {city}/                  # Páginas de ciudad
│   │   └── {neighborhood}/      # Páginas de barrio
│   ├── properties/              # Propiedades
│   │   ├── {id}                 # Detalle de propiedad
│   │   └── new                  # Crear propiedad
│   ├── about                    # Información
│   ├── faq                      # Preguntas frecuentes
│   ├── contact                  # Contacto
│   ├── terms                    # Términos
│   ├── privacy                  # Privacidad
│   ├── cookies                  # Cookies
│   ├── founding-hosts           # Programa de hosts fundadores
│   ├── dashboard/               # Dashboard de usuario
│   │   ├── properties/          # Propiedades del usuario
│   │   ├── analytics           # Analíticas
│   │   ├── payments            # Pagos
│   │   ├── profile             # Perfil
│   │   └── settings            # Configuración
│   ├── bookings/                # Reservas
│   │   └── {id}                 # Detalle de reserva
│   └── sign-in                  # Autenticación
│       └── sign-up
└── es/                          # Locale: Español
    └── (misma estructura)
```

---

## 🎨 Patrones de URL

### 1. Homepage

| Locale | URL |
|--------|-----|
| Inglés | `/en` |
| Español | `/es` |
| Root | `/` → redirige a `/en` |

**Canonical**: `https://www.inhabitme.com/{locale}`

### 2. Páginas de Ciudad

```
/{locale}/{city}
```

**Ejemplos:**
- `https://www.inhabitme.com/en/madrid`
- `https://www.inhabitme.com/es/barcelona`
- `https://www.inhabitme.com/en/valencia`

**SEO:**
- Keywords: `{city} monthly rental`, `{city} furnished apartment`
- Open Graph: Imagen dinámica específica de ciudad
- Hreflang: Alternativas EN/ES

### 3. Páginas de Barrio

```
/{locale}/{city}/{neighborhood}
```

**Ejemplos:**
- `https://www.inhabitme.com/en/madrid/malasana`
- `https://www.inhabitme.com/es/barcelona/gracia`
- `https://www.inhabitme.com/en/valencia/ruzafa`

**SEO:**
- Keywords: `{neighborhood} {city}`, `rent in {neighborhood}`
- Breadcrumbs: Home → {City} → {Neighborhood}

### 4. Propiedades

```
/{locale}/properties/{id}
```

**Ejemplos:**
- `https://www.inhabitme.com/en/properties/abc-123-xyz`
- `https://www.inhabitme.com/es/properties/modern-studio-malasana`

**SEO:**
- Dynamic metadata con título y descripción de propiedad
- Open Graph con imagen principal o generada
- Structured data (JSON-LD RealEstateListing)

**IDs:**
- Formato: UUID o slug SEO-friendly
- Ejemplo bueno: `modern-studio-malasana-2br`
- Ejemplo malo: `12345` o `abc123xyz`

### 5. Búsqueda

```
/{locale}/search?city={city}&minPrice={min}&maxPrice={max}
```

**Ejemplos:**
- `https://www.inhabitme.com/en/search?city=madrid&minPrice=800&maxPrice=1500`
- `https://www.inhabitme.com/es/search?city=barcelona`

**Parámetros:**
| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `city` | string | Ciudad (madrid, barcelona, valencia) |
| `minPrice` | number | Precio mínimo (EUR/mes) |
| `maxPrice` | number | Precio máximo (EUR/mes) |
| `beds` | number | Número de habitaciones |
| `type` | string | Tipo (studio, apartment, loft) |

### 6. Páginas Estáticas

```
/{locale}/{page}
```

**Páginas:**
- `/en/about` - Sobre nosotros
- `/en/faq` - Preguntas frecuentes
- `/en/contact` - Contacto
- `/en/terms` - Términos de servicio
- `/en/privacy` - Política de privacidad
- `/en/cookies` - Política de cookies

### 7. Dashboard (Protegido)

```
/{locale}/dashboard/{section}
```

**Secciones:**
- `/en/dashboard` - Dashboard principal
- `/en/dashboard/properties` - Mis propiedades
- `/en/dashboard/analytics` - Analíticas
- `/en/dashboard/payments` - Pagos
- `/en/dashboard/profile` - Perfil
- `/en/dashboard/settings` - Configuración

### 8. Autenticación

```
/{locale}/sign-in
/{locale}/sign-up
```

Gestionado por Clerk con catch-all routes.

---

## 🔄 Normalización y Redirecciones

### Trailing Slashes

**Política**: Sin trailing slashes (excepto root)

```
❌ /en/madrid/     → ✅ /en/madrid (301 redirect)
❌ /en/properties/ → ✅ /en/properties (301 redirect)
✅ /                → Sin cambio
```

**Implementación**: `next.config.js` + middleware

### Lowercase URLs

**Política**: Todas las URLs en minúsculas

```
❌ /en/Madrid      → ✅ /en/madrid (301 redirect)
❌ /en/MalaS%C3%A1na → ✅ /en/malasana (301 redirect)
```

**Implementación**: Middleware con `normalizePathname()`

### www vs non-www

**Política**: Siempre usar `www.`

```
❌ https://inhabitme.com/     → ✅ https://www.inhabitme.com/ (301 redirect)
❌ https://inhabitme.com/en   → ✅ https://www.inhabitme.com/en (301 redirect)
```

**Implementación**: `next.config.js` redirects + Vercel config

### Legacy URLs

**Redirects permanentes (301):**

| Old URL | New URL | Razón |
|---------|---------|-------|
| `/listings/{id}` | `/properties/{id}` | Renaming de recurso |
| `/{locale}/listings/{id}` | `/{locale}/properties/{id}` | Renaming de recurso |

**Implementación**: 
- Middleware: `getRedirectDestination()`
- Next.config: `redirects()`
- Página redirect: `app/[locale]/listings/[id]/page.tsx`

---

## 📊 Mejores Prácticas

### Crear Nuevas URLs

Cuando agregues nuevas páginas, sigue estos pasos:

#### 1. Definir la URL

```typescript
// ✅ Bueno
/en/properties/modern-loft-chamberi

// ❌ Malo
/en/Property/Modern-Loft-Chamberi
/en/properties/123
```

#### 2. Agregar Metadata

```typescript
export async function generateMetadata({ params }): Promise<Metadata> {
  return generatePageMetadata({
    title: 'Tu título',
    description: 'Tu descripción',
    locale: params.locale,
    path: `properties/${params.id}`,
    keywords: ['keyword1', 'keyword2'],
  })
}
```

#### 3. Agregar Canonical URL

```typescript
// Automático con generatePageMetadata
alternates: {
  canonical: 'https://www.inhabitme.com/en/properties/...',
}
```

#### 4. Agregar Hreflang

```typescript
// Automático con generatePageMetadata
alternates: {
  languages: {
    'en': 'https://www.inhabitme.com/en/...',
    'es': 'https://www.inhabitme.com/es/...',
  },
}
```

### Slugs SEO-Friendly

**Formato de ID de propiedades:**

```typescript
// Generar slug desde título
import { normalizeSlug } from '@/lib/seo/url-utils'

const propertyTitle = "Modern Studio in Malasaña"
const slug = normalizeSlug(propertyTitle)
// Result: "modern-studio-in-malasana"

// Agregar ID único
const propertyId = `${slug}-${shortId()}`
// Result: "modern-studio-in-malasana-abc123"
```

**Validar slug:**

```typescript
import { isValidSlug } from '@/lib/seo/url-utils'

isValidSlug('modern-studio')      // ✅ true
isValidSlug('Modern-Studio')      // ❌ false (uppercase)
isValidSlug('modern_studio')      // ❌ false (underscore)
isValidSlug('modern--studio')     // ❌ false (double hyphen)
```

### Breadcrumbs

Genera breadcrumbs automáticamente:

```typescript
import { generateBreadcrumbs } from '@/lib/seo/url-utils'

const breadcrumbs = generateBreadcrumbs('/en/madrid/malasana')
// Result:
// [
//   { name: 'Home', url: 'https://www.inhabitme.com' },
//   { name: 'En', url: 'https://www.inhabitme.com/en' },
//   { name: 'Madrid', url: 'https://www.inhabitme.com/en/madrid' },
//   { name: 'Malasana', url: 'https://www.inhabitme.com/en/madrid/malasana' },
// ]
```

---

## 🔍 Verificación

### Checklist de Nueva URL

Antes de lanzar una nueva página:

- [ ] URL en minúsculas
- [ ] Sin trailing slash
- [ ] Slug SEO-friendly (solo a-z, 0-9, -)
- [ ] Metadata completa (title, description, keywords)
- [ ] Open Graph configurado
- [ ] Canonical URL definida
- [ ] Hreflang para ambos locales
- [ ] Breadcrumbs (si aplica)
- [ ] Sitemap incluido
- [ ] Redirect si reemplaza URL antigua

### Herramientas de Testing

**Validar URL:**
```typescript
import { isValidSlug, normalizePathname } from '@/lib/seo/url-utils'

const pathname = '/en/Madrid/'
const normalized = normalizePathname(pathname)
console.log(normalized) // '/en/madrid'
```

**Validar en navegador:**
```
http://localhost:3000/en/Madrid/
  ↓ debe redirigir a
http://localhost:3000/en/madrid
```

**Validar en producción:**
```bash
# Test trailing slash
curl -I https://www.inhabitme.com/en/madrid/

# Debe retornar:
# HTTP/2 301
# Location: https://www.inhabitme.com/en/madrid
```

---

## 🚨 Troubleshooting

### Problema: URLs con mayúsculas no redirigen

**Solución:**
1. Verifica que middleware esté importando `hasMixedCase`
2. Verifica logs del middleware
3. Clear cache de Vercel (Deployments → ... → Invalidate Cache)

### Problema: Trailing slashes no se eliminan

**Solución:**
1. Verifica `next.config.js` tiene redirect de trailing slash
2. Verifica middleware `shouldRemoveTrailingSlash`
3. Verifica que no haya conflictos con Vercel config

### Problema: Redirect loops

**Solución:**
1. Verifica que no haya redirects circulares
2. Verifica orden de middleware (auth → SEO → i18n)
3. Agrega logs para debug:

```typescript
console.log('[Middleware] Original:', req.nextUrl.pathname)
console.log('[Middleware] Normalized:', normalizedPath)
```

### Problema: 404 en rutas válidas

**Solución:**
1. Verifica que la carpeta de página existe: `app/[locale]/{path}/page.tsx`
2. Verifica que exports sean correctos (default export)
3. Verifica middleware matcher no excluye la ruta
4. Check Vercel deployment logs

---

## 📚 Recursos

**Archivos relevantes:**
- `src/lib/seo/url-utils.ts` - Utilidades de URL
- `src/middleware.ts` - Normalización y redirects
- `next.config.js` - Redirects permanentes
- `src/i18n/routing.ts` - Configuración i18n

**Guías relacionadas:**
- `SEO_GUIDE.md` - Guía general de SEO
- `OPEN_GRAPH_GUIDE.md` - Open Graph images

**Referencias externas:**
- [Google SEO Starter Guide - URL Structure](https://developers.google.com/search/docs/crawling-indexing/url-structure)
- [Next.js Redirects](https://nextjs.org/docs/app/api-reference/next-config-js/redirects)
- [Next.js Middleware](https://nextjs.org/docs/app/building-your-application/routing/middleware)

---

**Última actualización**: Enero 23, 2026  
**Mantenido por**: Equipo InhabitMe
