# 🎨 Open Graph Images Guide - InhabitMe

## 📖 Overview

InhabitMe usa **imágenes Open Graph dinámicas** generadas automáticamente usando Next.js Image Response API. Esto significa que **no necesitas crear imágenes manualmente** - se generan en tiempo real basadas en el contenido.

## 🚀 Quick Start

### Ver las Imágenes

Visita la página de test en tu navegador local:
```
http://localhost:3000/test-og
```

O en producción:
```
https://www.inhabitme.com/test-og
```

### Probar en Redes Sociales

1. **Facebook Debugger**: https://developers.facebook.com/tools/debug/
2. **Twitter Card Validator**: https://cards-dev.twitter.com/validator
3. **LinkedIn Post Inspector**: https://www.linkedin.com/post-inspector/

## 🎯 Cómo Funciona

### Endpoint API

```
GET /api/og
```

**Ubicación**: `src/app/api/og/route.tsx`

### Parámetros

| Parámetro | Tipo | Descripción | Ejemplo |
|-----------|------|-------------|---------|
| `city` | string | Ciudad (madrid, barcelona, valencia, default) | `madrid` |
| `title` | string | Título principal | `Medium-term rentals in Madrid` |
| `subtitle` | string | Texto secundario | `Verified stays with workspace & WiFi` |

### Ejemplos de URLs

#### Homepage
```
https://www.inhabitme.com/api/og
```

#### Madrid
```
https://www.inhabitme.com/api/og?city=madrid&title=Medium-term%20rentals%20in%20Madrid
```

#### Barcelona
```
https://www.inhabitme.com/api/og?city=barcelona&title=Medium-term%20rentals%20in%20Barcelona
```

#### Valencia
```
https://www.inhabitme.com/api/og?city=valencia&title=Medium-term%20rentals%20in%20Valencia
```

#### Propiedad Específica
```
https://www.inhabitme.com/api/og?city=madrid&title=Cozy%20Studio%20in%20Malasaña&subtitle=Modern%20apartment%20with%20workspace
```

## 🎨 Diseño de las Imágenes

### Dimensiones
- **Tamaño**: 1200x630 px
- **Proporción**: 1.91:1 (Facebook recomendado)
- **Formato**: PNG (generado dinámicamente)

### Colores por Ciudad

| Ciudad | Color Principal | Gradiente | Emoji |
|--------|----------------|-----------|-------|
| Madrid | `#E63946` (Rojo) | Rojo → Naranja | 🏛️ |
| Barcelona | `#06AED5` (Azul) | Azul claro → Azul oscuro | 🏖️ |
| Valencia | `#F77F00` (Naranja) | Naranja → Amarillo | 🍊 |
| Default | `#3B82F6` (Azul) | Azul → Morado | 🏠 |

### Elementos Visuales

1. **Fondo**: Gradiente con patrón de puntos sutiles
2. **Emoji**: Icono grande representativo de la ciudad
3. **Título**: Nombre de la ciudad (si aplica)
4. **Subtítulo**: Descripción o mensaje principal
5. **Branding**: Logo "InhabitMe" y URL en la parte inferior

## 🔧 Integración

### En Páginas

Las imágenes OG se generan automáticamente para:

#### 1. Homepage (`/[locale]/page.tsx`)
```typescript
// Usa imagen por defecto
openGraph: {
  images: [{ url: getDefaultOgImage() }]
}
```

#### 2. Páginas de Ciudades (`/[locale]/[city]/page.tsx`)
```typescript
// Genera imagen específica de ciudad
openGraph: {
  images: [{
    url: getCityOgImage(citySlug, cityName),
    width: 1200,
    height: 630,
  }]
}
```

#### 3. Páginas de Propiedades (`/[locale]/properties/[id]/page.tsx`)
```typescript
// Usa imagen de propiedad o genera dinámicamente
openGraph: {
  images: property.images?.length > 0
    ? [{ url: property.images[0].url }]
    : [{ url: getPropertyOgImage(property.title, property.city) }]
}
```

## 🧪 Testing

### Método 1: Página de Test

1. Ejecuta el proyecto:
   ```bash
   npm run dev
   ```

2. Abre el navegador:
   ```
   http://localhost:3000/test-og
   ```

3. Verás todas las variantes de imágenes OG

### Método 2: View Page Source

1. Visita cualquier página (ej: `/en/madrid`)
2. Click derecho → "View Page Source"
3. Busca `<meta property="og:image"`
4. Copia la URL y ábrela en una nueva pestaña

### Método 3: Social Media Debuggers

#### Facebook
1. Ve a https://developers.facebook.com/tools/debug/
2. Pega la URL de tu página: `https://www.inhabitme.com/en/madrid`
3. Click "Debug"
4. Verás cómo se ve la imagen OG

#### Twitter
1. Ve a https://cards-dev.twitter.com/validator
2. Pega la URL
3. Click "Preview Card"

#### LinkedIn
1. Ve a https://www.linkedin.com/post-inspector/
2. Pega la URL
3. Click "Inspect"

## 🎭 Personalización

### Cambiar Colores de Ciudad

Edita `src/app/api/og/route.tsx`:

```typescript
const CITIES = {
  madrid: {
    name: 'Madrid',
    color: '#E63946',  // ← Cambiar aquí
    emoji: '🏛️',
    gradient: ['#E63946', '#F77F00'],  // ← Y aquí
  },
  // ...
}
```

### Agregar Nueva Ciudad

```typescript
const CITIES = {
  // ... ciudades existentes
  sevilla: {
    name: 'Sevilla',
    color: '#FF6B35',
    emoji: '🌞',
    gradient: ['#FF6B35', '#F7931E'],
  },
}
```

### Cambiar Diseño

El componente JSX en `route.tsx` usa **Tailwind-like inline styles**. Puedes modificar:

- **Tamaño de fuente**: `fontSize: '72px'`
- **Posición**: `position: 'absolute'`
- **Sombras**: `textShadow: '0 4px 20px rgba(0,0,0,0.2)'`
- **Opacidad**: `opacity: 0.1`

## 🚨 Troubleshooting

### Imagen no se muestra en redes sociales

**Problema**: La imagen OG no aparece cuando compartes la URL

**Soluciones**:
1. Verifica que el endpoint `/api/og` funciona (abre la URL directamente)
2. Usa el Facebook Debugger para refrescar el cache
3. Verifica que `NEXT_PUBLIC_APP_URL` esté configurado en Vercel
4. Asegúrate de que el sitio esté en producción (HTTPS)

### Imagen se ve cortada en móvil

**Problema**: Parte de la imagen no se ve en móviles

**Solución**: Esto es normal - Facebook/Twitter ajustan automáticamente. Mantén el contenido importante en el centro.

### Errores de generación

**Problema**: Error 500 al generar imagen

**Soluciones**:
1. Revisa logs en Vercel Dashboard
2. Verifica que los parámetros sean válidos
3. Asegúrate de que `export const runtime = 'edge'` esté presente
4. Verifica que no uses dependencias no compatibles con Edge Runtime

### Caché en redes sociales

**Problema**: La imagen antigua sigue apareciendo después de cambios

**Solución**:
1. Facebook: Usa el [Debugger](https://developers.facebook.com/tools/debug/) y click "Scrape Again"
2. Twitter: Espera ~7 días o usa la [Card Validator](https://cards-dev.twitter.com/validator)
3. LinkedIn: Usa el [Post Inspector](https://www.linkedin.com/post-inspector/)

## 📊 Mejores Prácticas

### ✅ Hacer

- Mantener texto corto y legible (máx 2-3 líneas)
- Usar alto contraste (texto blanco en fondo oscuro)
- Incluir branding consistente
- Testear en múltiples plataformas
- Usar emojis para personalidad
- Generar imágenes dinámicamente cuando sea posible

### ❌ Evitar

- Texto muy pequeño (<40px)
- Demasiado texto (más de 3 líneas principales)
- Colores similares para texto y fondo
- Imágenes pixeladas o de baja calidad
- Información importante en los bordes
- Archivos muy pesados (>1MB)

## 🔗 Recursos

- [Next.js Image Response API](https://nextjs.org/docs/app/api-reference/functions/image-response)
- [Open Graph Protocol](https://ogp.me/)
- [Facebook Sharing Best Practices](https://developers.facebook.com/docs/sharing/best-practices)
- [Twitter Card Documentation](https://developer.twitter.com/en/docs/twitter-for-websites/cards/overview/markup)
- [LinkedIn Post Inspector](https://www.linkedin.com/help/linkedin/answer/a521928)

## 📈 Analytics

Para trackear el rendimiento de tus OG images:

1. **Facebook Insights**: Ve cuántas veces se comparte tu contenido
2. **Twitter Analytics**: Mide engagement de cards
3. **Google Analytics**: Trackea referrals desde redes sociales
4. **Custom Events**: Agrega eventos cuando se comparte contenido

---

**Última actualización**: Enero 23, 2026  
**Mantenido por**: Equipo InhabitMe
