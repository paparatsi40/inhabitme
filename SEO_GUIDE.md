# SEO & URL Structure Guide - InhabitMe

## 📋 Tabla de Contenido

1. [Estructura de URLs](#estructura-de-urls)
2. [Open Graph & Meta Tags](#open-graph--meta-tags)
3. [Configuración Centralizada](#configuración-centralizada)
4. [Imágenes Open Graph](#imágenes-open-graph)
5. [Verificación y Monitoreo](#verificación-y-monitoreo)
6. [Mejores Prácticas](#mejores-prácticas)

---

## 🌐 Estructura de URLs

InhabitMe utiliza una estructura de URLs limpia, jerárquica y SEO-friendly con soporte multiidioma.

### Patrón Base

```
https://www.inhabitme.com/{locale}/{path}
```

### URLs Principales

#### Homepage
- **Inglés**: `https://www.inhabitme.com/en`
- **Español**: `https://www.inhabitme.com/es` (o simplemente `/`)

#### Páginas de Ciudades
```
/{locale}/{city}
```

**Ejemplos:**
- `https://www.inhabitme.com/en/madrid`
- `https://www.inhabitme.com/es/barcelona`
- `https://www.inhabitme.com/en/valencia`

#### Páginas de Barrios
```
/{locale}/{city}/{neighborhood}
```

**Ejemplos:**
- `https://www.inhabitme.com/en/madrid/malasana`
- `https://www.inhabitme.com/es/barcelona/gracia`
- `https://www.inhabitme.com/en/valencia/ruzafa`

#### Páginas de Propiedades
```
/{locale}/properties/{id}
```

**Ejemplos:**
- `https://www.inhabitme.com/en/properties/abc123`
- `https://www.inhabitme.com/es/properties/xyz789`

#### Búsqueda
```
/{locale}/search?city={city}&minPrice={min}&maxPrice={max}
```

**Ejemplo:**
- `https://www.inhabitme.com/en/search?city=madrid&minPrice=800&maxPrice=1500`

---

## 🎨 Open Graph & Meta Tags

### Configuración Actual

Todas las páginas principales ahora tienen **metadata completa** con:

✅ **Open Graph tags** (Facebook, LinkedIn)
✅ **Twitter Cards**
✅ **Canonical URLs**
✅ **Alternate language links** (hreflang)
✅ **Structured data** (JSON-LD para propiedades)

### Páginas con Metadata Dinámica

1. **Homepage** (`/[locale]/page.tsx`)
   - Título y descripción internacionalizados
   - Imagen por defecto: `/og-image.png`
   - Locale-aware URLs

2. **Páginas de Ciudades** (`/[locale]/[city]/page.tsx`)
   - Metadata específica por ciudad
   - Imágenes específicas: `/og-{city}.jpg`
   - Keywords dinámicos con ciudad + barrios

3. **Páginas de Propiedades** (`/[locale]/properties/[id]/page.tsx`)
   - ✨ **NUEVO**: Metadata dinámica basada en datos de propiedad
   - Usa imagen principal de la propiedad
   - Título: `{property.title} in {city}`
   - Precio en descripción
   - Structured data (JSON-LD) para rich snippets

4. **Páginas de Barrios** (`/[locale]/[city]/[neighborhood]/page.tsx`)
   - Metadata específica por barrio
   - Keywords con ciudad + barrio

---

## ⚙️ Configuración Centralizada

### Archivo Principal: `src/lib/seo/config.ts`

Contiene toda la configuración SEO:

```typescript
export const SEO_CONFIG = {
  baseUrl: 'https://www.inhabitme.com',
  siteName: 'InhabitMe',
  
  // Títulos y descripciones por idioma
  defaultTitle: { en: '...', es: '...' },
  defaultDescription: { en: '...', es: '...' },
  
  // Open Graph defaults
  openGraph: {
    type: 'website',
    defaultImage: '/og-image.png',
    imageWidth: 1200,
    imageHeight: 630,
  },
  
  // Twitter defaults
  twitter: {
    card: 'summary_large_image',
    site: '@inhabitme',
  },
  
  // Verificación de Google
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION_CODE,
  },
}
```

### Helpers de Metadata: `src/lib/seo/metadata-helpers.ts`

Funciones reutilizables para generar metadata:

- `generatePageMetadata()` - Metadata genérica para cualquier página
- `generatePropertyMetadata()` - Metadata específica para propiedades
- `generateCityMetadata()` - Metadata específica para ciudades
- `generatePropertyStructuredData()` - JSON-LD para propiedades

---

## 🖼️ Imágenes Open Graph

### ✨ Sistema de Imágenes Dinámicas

InhabitMe utiliza **imágenes Open Graph generadas automáticamente** usando Next.js Image Response API. 

**✅ No necesitas crear imágenes manualmente** - se generan en tiempo real basadas en:
- Ciudad (Madrid, Barcelona, Valencia)
- Título de la página o propiedad
- Colores y gradientes específicos por ciudad

### Endpoint API

```
GET /api/og?city={city}&title={title}&subtitle={subtitle}
```

**Ubicación**: `src/app/api/og/route.tsx`

### Imágenes Disponibles

#### ✅ Generadas Automáticamente:
- **Default**: `/api/og` - Homepage e InhabitMe general
- **Madrid**: `/api/og?city=madrid` - Con gradiente rojo-naranja 🏛️
- **Barcelona**: `/api/og?city=barcelona` - Con gradiente azul 🏖️
- **Valencia**: `/api/og?city=valencia` - Con gradiente naranja-amarillo 🍊
- **Propiedades**: `/api/og?city=madrid&title={propertyTitle}` - Dinámico por propiedad

### Especificaciones

- **Tamaño**: 1200x630 px (proporción 1.91:1)
- **Formato**: PNG (generado dinámicamente)
- **Tiempo de generación**: <100ms
- **Caché**: Automático en edge (Vercel)

### Colores por Ciudad

| Ciudad | Color | Gradiente | Emoji |
|--------|-------|-----------|-------|
| Madrid | Rojo `#E63946` | Rojo → Naranja | 🏛️ |
| Barcelona | Azul `#06AED5` | Azul → Azul oscuro | 🏖️ |
| Valencia | Naranja `#F77F00` | Naranja → Amarillo | 🍊 |
| Default | Azul `#3B82F6` | Azul → Morado | 🏠 |

### Ver y Testear Imágenes

#### Página de Test Interna
Visita `/test-og` en tu navegador para ver todas las variantes:
```
http://localhost:3000/test-og  (desarrollo)
https://www.inhabitme.com/test-og  (producción)
```

#### Validadores de Redes Sociales
Verifica cómo se ven las imágenes:
- **Facebook**: [Debugger](https://developers.facebook.com/tools/debug/)
- **Twitter**: [Card Validator](https://cards-dev.twitter.com/validator)
- **LinkedIn**: [Post Inspector](https://www.linkedin.com/post-inspector/)

#### Guía Detallada
Ver `OPEN_GRAPH_GUIDE.md` para documentación completa sobre Open Graph images.

---

## 🔍 Verificación y Monitoreo

### Google Search Console

1. **Obtener código de verificación**:
   - Ve a [Google Search Console](https://search.google.com/search-console)
   - Agrega propiedad: `www.inhabitme.com`
   - Elige método: "HTML tag"
   - Copia el código (ej: `google-site-verification=ABC123...`)

2. **Configurar en el proyecto**:
   ```bash
   # En .env.local o en Vercel Environment Variables
   NEXT_PUBLIC_GOOGLE_VERIFICATION_CODE=ABC123...
   ```

3. **Verificar en GSC**:
   - Haz redeploy en Vercel
   - Regresa a GSC y haz clic en "Verificar"

### Métricas a Monitorear

- **Pages Indexed**: Número de páginas en el índice de Google
- **Click-through Rate (CTR)**: % de clics desde resultados de búsqueda
- **Average Position**: Posición promedio en resultados
- **Core Web Vitals**: Métricas de rendimiento (LCP, FID, CLS)
- **Mobile Usability**: Problemas en móvil
- **Sitemap Status**: Estado del sitemap

---

## 🚀 Mejores Prácticas

### URLs

✅ **Hacer:**
- Usar guiones (`-`) para separar palabras
- Mantener URLs cortas y descriptivas
- Usar minúsculas
- Incluir palabras clave relevantes
- Mantener estructura jerárquica

❌ **Evitar:**
- Usar guiones bajos (`_`)
- URLs largas (>75 caracteres)
- Parámetros innecesarios
- Cambiar URLs establecidas sin redirecciones
- Usar caracteres especiales

### Meta Tags

✅ **Hacer:**
- Títulos únicos por página (50-60 caracteres)
- Descripciones únicas (150-160 caracteres)
- Incluir palabras clave naturalmente
- Agregar llamadas a la acción en descripciones
- Usar título atractivo para Open Graph

❌ **Evitar:**
- Duplicar titles/descriptions
- Keyword stuffing
- Títulos demasiado largos o cortos
- Descripciones genéricas

### Open Graph

✅ **Hacer:**
- Imágenes de alta calidad (1200x630px)
- Incluir `og:title`, `og:description`, `og:image`, `og:url`
- Agregar `og:type` apropiado
- Usar imágenes descriptivas
- Testear en validadores

❌ **Evitar:**
- Imágenes con texto ilegible
- Imágenes de baja resolución
- URLs relativas en `og:url`
- Olvidar `og:locale`

### Structured Data

✅ **Hacer:**
- Usar esquemas relevantes (RealEstateListing, Product)
- Incluir información completa y precisa
- Validar con [Schema.org validator](https://validator.schema.org/)
- Mantener consistencia con contenido visible

❌ **Evitar:**
- Datos incorrectos o desactualizados
- Structured data sin contenido visible equivalente
- Múltiples esquemas conflictivos

---

## 🔧 Variables de Entorno

Agregar en Vercel o `.env.production`:

```bash
# App URL (crítico para sitemap y Open Graph)
NEXT_PUBLIC_APP_URL=https://www.inhabitme.com

# Google Search Console
NEXT_PUBLIC_GOOGLE_VERIFICATION_CODE=tu-codigo-aqui

# Opcional: Analytics
# NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

---

## 📊 Checklist de SEO

### Por Página

- [ ] Título único y descriptivo
- [ ] Meta description atractiva
- [ ] Canonical URL correcta
- [ ] Alternate language links (hreflang)
- [ ] Open Graph tags completos
- [ ] Twitter Card tags
- [ ] Imágenes con alt text
- [ ] URLs limpias y descriptivas
- [ ] Structured data (cuando aplique)
- [ ] Responsive (mobile-friendly)

### General

- [ ] Sitemap.xml actualizado
- [ ] Robots.txt configurado
- [ ] Google Search Console verificado
- [ ] Imágenes Open Graph creadas
- [ ] Redirecciones 301 para URLs antiguas (si aplica)
- [ ] HTTPS habilitado
- [ ] Performance optimizado (Core Web Vitals)

---

## 📚 Recursos Adicionales

- [Next.js Metadata API](https://nextjs.org/docs/app/api-reference/functions/generate-metadata)
- [Google SEO Starter Guide](https://developers.google.com/search/docs/beginner/seo-starter-guide)
- [Schema.org Documentation](https://schema.org/)
- [Open Graph Protocol](https://ogp.me/)
- [Twitter Card Documentation](https://developer.twitter.com/en/docs/twitter-for-websites/cards/overview/abouts-cards)

---

## 🎯 Próximos Pasos

1. ✅ ~~Crear imágenes Open Graph~~ - **COMPLETADO** (generación dinámica)
2. **Obtener y configurar** código de verificación de Google Search Console
3. **Testear imágenes OG** en `/test-og` y validadores de redes sociales
4. **Monitorear** métricas en Google Search Console semanalmente
5. **Expandir** metadata a páginas adicionales (FAQ, About, etc.)
6. **Implementar** Analytics (Google Analytics o alternativa)
7. **Optimizar** Core Web Vitals

---

**Última actualización**: Enero 23, 2026
**Mantenido por**: Equipo InhabitMe
