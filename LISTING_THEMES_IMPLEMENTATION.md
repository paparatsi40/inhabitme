# 🎨 Listing Themes System - Implementation Plan

## 📋 Estado Actual

### ✅ Completado (Fase 1: Fundación)

1. **Base de Datos**
   - ✅ Migration SQL completa (`create_listing_themes.sql`)
   - ✅ Tabla `listing_themes` con todas las columnas
   - ✅ Triggers automáticos para `updated_at` y themes por defecto
   - ✅ Vista `listings_with_themes` para queries optimizadas
   - ✅ Vista `theme_analytics` para métricas
   - ✅ RLS policies para seguridad
   - ✅ Función `clone_theme()` para copiar configs

2. **TypeScript Types**
   - ✅ Tipos completos en `listing-theme.ts`
   - ✅ 5 plantillas predefinidas (THEME_PRESETS)
   - ✅ Metadata de cada plantilla
   - ✅ Helper functions (validación, defaults, etc.)
   - ✅ Generador de estilos CSS

---

## 🗂️ Estructura de Archivos

### Creados
```
supabase/migrations/
  └── create_listing_themes.sql ✅

src/lib/domain/
  └── listing-theme.ts ✅

src/components/listings/
  ├── theme/ (A crear)
  │   ├── ThemeProvider.tsx
  │   ├── ThemePreview.tsx
  │   ├── TemplateSelector.tsx
  │   ├── ColorPicker.tsx
  │   ├── BackgroundUploader.tsx
  │   └── LayoutCustomizer.tsx
  │
  ├── variants/ (A crear)
  │   ├── headers/
  │   │   ├── HeroHeader.tsx
  │   │   ├── SplitHeader.tsx
  │   │   ├── CompactHeader.tsx
  │   │   ├── MinimalHeader.tsx
  │   │   └── FullscreenHeader.tsx
  │   │
  │   ├── galleries/
  │   │   ├── GridGallery.tsx
  │   │   ├── MasonryGallery.tsx
  │   │   ├── SliderGallery.tsx
  │   │   └── FullscreenGallery.tsx
  │   │
  │   ├── amenities/
  │   │   ├── ListAmenities.tsx
  │   │   ├── GridAmenities.tsx
  │   │   ├── BadgeAmenities.tsx
  │   │   └── IconAmenities.tsx
  │   │
  │   └── ctas/
  │       ├── FixedCTA.tsx
  │       ├── FloatingCTA.tsx
  │       └── InlineCTA.tsx
  │
  └── ThemedListingPage.tsx (Componente principal)

src/app/[locale]/
  └── dashboard/properties/[id]/customize/
      └── page.tsx (Dashboard de customización)

src/app/api/
  └── listings/[id]/theme/
      └── route.ts (CRUD de themes)
```

---

## 🎨 5 Plantillas Definidas

### 1. Modern Professional ✨
**Tier**: Free  
**Ideal para**: Nómadas digitales, profesionales, remote workers

**Características**:
- Background: Gradiente azul-púrpura
- Header: Hero grande con imagen principal
- Gallery: Grid limpio 3x2
- Amenities: Grid con iconos
- CTA: Fixed bottom bar
- Font: Inter (sans-serif moderno)

**Preview**:
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[Gradiente azul-púrpura]

        [Hero Image - Grande]
        
    TÍTULO EN BOLD MODERNO
    📍 Madrid, Malasaña | ⭐ Featured
    
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[Gallery Grid 3x2]

💼 Workspace    |    🏠 Amenities    |    💰 Pricing
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[Fixed CTA Bottom]
```

---

### 2. Cozy & Warm 🏡
**Tier**: Free  
**Ideal para**: Familias, estancias largas, ambientes acogedores

**Características**:
- Background: Gradiente cálido (beige-naranja)
- Header: Split (imagen izq, info derecha)
- Gallery: Slider con navegación
- Amenities: Lista vertical con descripciones
- CTA: Inline después de descripción
- Font: Playfair Display (serif elegante)

**Preview**:
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[Fondo beige cálido con textura]

[Imagen] │  Título Serif Elegante
         │  "Tu hogar temporal..."
         │  📍 Ubicación
         │  [Book Now Button]
         
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[Slider Gallery con flechas]

☕ Comodidades:
  • Cocina completa equipada
  • Lavadora y secadora
  • ...
```

---

### 3. Vibrant & Creative 🎨
**Tier**: Founding Host  
**Ideal para**: Artistas, creativos, jóvenes, espacios únicos

**Características**:
- Background: Gradiente vibrante (rosa-púrpura)
- Header: Hero con overlay colorido
- Gallery: Masonry (Pinterest style)
- Amenities: Badges coloridos
- CTA: Floating button (siempre visible)
- Font: Montserrat (bold y creativa)

**Preview**:
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[Gradiente rosa-púrpura vibrante]

    [Hero con overlay]
    TÍTULO BOLD Y VIBRANTE
    
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[Masonry Gallery - diferentes tamaños]

[WiFi] [Desk] [AC] [Balcony] <- Badges coloridos

                    [🎯 Floating CTA]
```

---

### 4. Minimalist & Clean 🤍
**Tier**: Founding Host  
**Ideal para**: Minimalistas, profesionales, espacios modernos

**Características**:
- Background: Blanco/gris muy claro
- Header: Compact (pequeño, info esencial)
- Gallery: Grid perfecto (mucho espacio)
- Amenities: Solo iconos (sin texto)
- CTA: Inline, discreto
- Font: Inter (ultra clean)

**Preview**:
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[Blanco limpio]

Título Clean Sans Serif
Madrid • 2 bed • €1,200/mo

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[  ]  [  ]  [  ]  <- Gallery grid perfecto

💼 🏠 ❄️ 🔥 🚗 <- Solo iconos

         [Request to Book]
```

---

### 5. Luxury Premium 💎
**Tier**: Founding Host  
**Ideal para**: Propiedades de lujo, high-end, premium

**Características**:
- Background: Negro/gris oscuro con detalles gold
- Header: Fullscreen (pantalla completa)
- Gallery: Slider elegante con transiciones
- Amenities: Iconos con gold accent
- CTA: Fixed, premium styling
- Font: Playfair Display (elegante)

**Preview**:
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[Fullscreen Image]

        Título Elegante Serif
    "Luxury Living in the Heart of Madrid"
        
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[Negro/Gris oscuro con gold accents]

[Slider Gallery - Elegante]

✨ Premium Amenities ✨
[Gold icons]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[Fixed CTA - Premium Style]
```

---

## 🔧 Próximos Pasos (Orden de Implementación)

### Paso 1: API Routes (1-2 días)
```typescript
// GET /api/listings/[id]/theme
// POST /api/listings/[id]/theme  
// PUT /api/listings/[id]/theme
// DELETE /api/listings/[id]/theme (reset to default)
```

### Paso 2: Theme Provider Component (1 día)
```typescript
// Componente que envuelve el listing
// Lee theme de DB
// Aplica estilos dinámicamente
```

### Paso 3: Variant Components (2-3 días)
```typescript
// Headers: 5 variants
// Galleries: 4 variants
// Amenities: 4 variants
// CTAs: 3 variants
```

### Paso 4: Theme Customizer Dashboard (2-3 días)
```typescript
// Template selector con previews
// Color pickers (primario, secundario, accent)
// Background uploader (Founding Host)
// Layout options
// Real-time preview
// Save/Publish
```

### Paso 5: Integration & Polish (2 días)
```typescript
// Actualizar ListingDetailClient.tsx
// Mobile responsive cada variant
// Performance optimization
// Testing
```

---

## 🎯 Decisiones de Diseño

### Tier System

**Free (Hosts Regulares)**:
- ✅ 2 plantillas: Modern, Cozy
- ✅ Colores predefinidos (no picker)
- ❌ No custom background
- ❌ No logo personalizado

**Founding Host 2026**:
- ✅ TODAS las 5 plantillas
- ✅ Color picker completo
- ✅ Custom background upload
- ✅ Logo personalizado
- ✅ Video intro
- ✅ Bio extendida
- **Badge**: "🌟 Founding Host - Premium Customization"

**Premium Upgrade (Futuro - €9.99/mes)**:
- ✅ Igual que Founding Host
- ✅ Analytics del listing
- ✅ A/B testing de plantillas
- ✅ Prioridad en soporte

---

## 💾 Flujo de Datos

### 1. Lectura (Listing Page)
```typescript
// /listings/[id]

1. Fetch listing data + theme
   GET /api/listings/[id] 
   → Incluye theme_config (JSON)

2. ThemedListingPage component
   → Lee theme_config
   → Renderiza componentes apropiados
   
3. Render
   → Headers/[variant].tsx
   → Galleries/[variant].tsx
   → etc.
```

### 2. Escritura (Dashboard)
```typescript
// /dashboard/properties/[id]/customize

1. Load current theme
   GET /api/listings/[id]/theme

2. User modifica
   → State local (React)
   → Preview en tiempo real

3. Save
   PUT /api/listings/[id]/theme
   → Valida colores, URLs
   → Guarda en DB
   → Invalida cache
```

---

## 🔐 Permisos y Validación

### Backend Validation
```typescript
// API route
async function validateThemeUpdate(theme, listing, user) {
  // 1. User es owner del listing
  if (listing.host_user_id !== user.id) {
    throw new Error('Unauthorized')
  }
  
  // 2. Template permitido para tier del user
  if (isFoundingHostTemplate(theme.template)) {
    const isFoundingHost = await checkFoundingHost(user.id)
    if (!isFoundingHost) {
      throw new Error('Template requires Founding Host status')
    }
  }
  
  // 3. Custom background solo para Founding
  if (theme.background.type === 'image') {
    const isFoundingHost = await checkFoundingHost(user.id)
    if (!isFoundingHost) {
      throw new Error('Custom background requires Founding Host status')
    }
  }
  
  // 4. Validar colores (hex format)
  if (!validateThemeColors(theme.colors)) {
    throw new Error('Invalid color format')
  }
  
  return true
}
```

---

## 📱 Mobile Responsiveness

### Estrategia
- Todos los variants deben ser mobile-first
- Testing en: iOS Safari, Android Chrome, Mobile Firefox
- Breakpoints: 640px, 768px, 1024px, 1280px

### Adaptaciones por Variant

**Headers**:
- Hero → Stack vertical en mobile
- Split → Full width image, luego info
- Fullscreen → Reduce height en mobile

**Galleries**:
- Grid → 1-2 cols en mobile
- Masonry → 1 col en mobile
- Slider → Touch swipe enabled

**CTAs**:
- Fixed → Siempre visible, sticky
- Floating → Ajustar posición
- Inline → Mantener igual

---

## 🚀 Performance

### Optimizaciones

1. **CSS-in-JS Mínimo**
   - Usar Tailwind classes cuando posible
   - Solo inline styles para colores custom

2. **Image Optimization**
   - Custom backgrounds → Cloudinary compression
   - Lazy loading de gallery images
   - WebP format

3. **Code Splitting**
   - Dynamic imports de variants
   - Solo cargar variant usado

4. **Caching**
   ```typescript
   // Cache key: listing_id + theme_version
   const cacheKey = `listing:${id}:theme:${theme_version}`
   ```

---

## 📊 Analytics a Trackear

### Métricas Clave

1. **Uso de Plantillas**
   ```sql
   SELECT template, COUNT(*) 
   FROM listing_themes 
   GROUP BY template;
   ```

2. **Conversión por Template**
   ```sql
   SELECT 
     lt.template,
     COUNT(b.id) as bookings,
     COUNT(DISTINCT l.id) as listings,
     ROUND(COUNT(b.id)::decimal / COUNT(DISTINCT l.id), 2) as booking_rate
   FROM listing_themes lt
   JOIN listings l ON lt.listing_id = l.id
   LEFT JOIN bookings b ON b.property_id = l.id
   GROUP BY lt.template;
   ```

3. **Custom vs Default**
   - ¿Cuántos hosts personalizan?
   - ¿Conversión es mejor con customización?

4. **Founding Host Usage**
   - % que usan templates premium
   - % que suben custom background
   - Feature más usada

---

## 🎨 Inspiración Visual

### Referencias
- **Shopify Themes**: Sistema de templates
- **Notion**: Personalización simple pero efectiva
- **Webflow**: Preview en tiempo real
- **Airbnb Experiences**: Headers impactantes
- **Dribbble**: Inspiración de diseño

---

## ✅ Checklist de Implementación

### Fase 1: Fundación (Completado)
- [x] Migration SQL
- [x] TypeScript types
- [x] Template presets
- [x] Documentación

### Fase 2: API & Backend (1-2 días)
- [ ] GET /api/listings/[id]/theme
- [ ] POST /api/listings/[id]/theme
- [ ] PUT /api/listings/[id]/theme
- [ ] DELETE /api/listings/[id]/theme
- [ ] Validación completa
- [ ] Testing de API

### Fase 3: Components Variants (2-3 días)
- [ ] 5 Header variants
- [ ] 4 Gallery variants
- [ ] 4 Amenities variants
- [ ] 3 CTA variants
- [ ] ThemeProvider component
- [ ] Mobile responsive todos

### Fase 4: Customizer Dashboard (2-3 días)
- [ ] Template selector UI
- [ ] Color pickers
- [ ] Background uploader
- [ ] Layout options
- [ ] Real-time preview
- [ ] Save/Publish flow
- [ ] Founding Host checks

### Fase 5: Integration (1-2 días)
- [ ] Actualizar ListingDetailClient.tsx
- [ ] Conectar con API
- [ ] Testing end-to-end
- [ ] Performance optimization
- [ ] Analytics setup

### Fase 6: Polish (1 día)
- [ ] Mobile testing completo
- [ ] Edge cases
- [ ] Documentación de usuario
- [ ] Video tutorial (opcional)

---

## 🎉 Listo para Empezar

**Base completada**. Próximos pasos:

1. Ejecutar migration SQL en Supabase
2. Implementar API routes
3. Crear variant components
4. Dashboard de customización
5. Integration & testing

**Estimación total**: 8-12 días de trabajo enfocado

---

¿Continuamos con la Fase 2 (API Routes)? 🚀
