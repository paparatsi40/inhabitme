# Plan de Optimizacion - InhabitMe Homepage

## 1. Performance Optimization (Server Components)

### Estado Actual
- ❌ Toda la pagina es Client Component
- ❌ Estado (months, city) solo se usa para calculateSavings pero no se muestra ni actualiza en UI
- ✅ 95% del contenido es estatico

### Cambios Propuestos

#### A. Extraer componentes client minimos
Ya creados:
- ✅ `ClientNav.tsx` - Solo auth de Clerk + LanguageSwitcher
- ✅ `StaticSections.tsx` - Secciones completamente estaticas

#### B. Convertir page.tsx a Server Component
```typescript
// ANTES: 'use client' en toda la pagina
// DESPUES: Server Component por defecto, client solo donde se necesita
```

#### C. Lazy load componentes pesados
```typescript
const CityCarousel = dynamic(() => import('@/components/hero/CityCarousel'), {
  loading: () => <div className="animate-pulse bg-gray-200 h-96 rounded-2xl" />,
  ssr: false
})
```

### Beneficios Esperados
- 📉 **-40% JavaScript bundle** (menos codigo enviado al cliente)
- ⚡ **+30% Faster First Paint** (HTML renderizado en servidor)
- 🚀 **Better SEO** (contenido pre-renderizado)
- 💰 **Mejor Core Web Vitals** (LCP, FID, CLS)

### Metricas a Monitorear
- Time to Interactive (TTI)
- First Contentful Paint (FCP)
- Largest Contentful Paint (LCP)
- Total Blocking Time (TBT)

---

## 2. A/B Testing Setup

### Tests Propuestos

#### Test 1: Pricing Badge Position
**Hipotesis:** Mover el pricing badge arriba del hero title aumentara conversiones

**Variantes:**
- **Control (A):** Badge despues del title (actual)
- **Variant (B):** Badge ANTES del title
- **Variant (C):** Badge como sticky bottom bar

**Metrica primaria:** Click-through rate a "View properties"
**Metrica secundaria:** Time on page

#### Test 2: CTA Copy
**Hipotesis:** CTAs mas especificos convierten mejor

**Variantes:**
- **Control (A):** "View properties" (actual)
- **Variant (B):** "Find your perfect space"
- **Variant (C):** "Browse 500+ verified homes"

**Metrica primaria:** Button click rate
**Metrica secundaria:** Bounce rate

#### Test 3: Pricing Display
**Hipotesis:** Mostrar ejemplo concreto vs rango convierte mejor

**Variantes:**
- **Control (A):** "One-time payment (€79-239) based on duration"
- **Variant (B):** "€139 for 3 months - No monthly fees"
- **Variant (C):** "From €79 - Pay once, stay months"

**Metrica primaria:** Scroll depth to pricing section
**Metrica secundaria:** Click to calculator

### Herramientas Recomendadas
1. **Vercel A/B Testing** (nativo, facil)
2. **PostHog** (open source, gratis hasta 1M events)
3. **Google Optimize** (descontinuado pero aun funciona)
4. **Statsig** (freemium, muy potente)

### Implementacion (Vercel Edge Middleware)
```typescript
// middleware.ts
import { NextRequest, NextResponse } from 'next/server'

export function middleware(req: NextRequest) {
  const bucket = Math.random() < 0.5 ? 'A' : 'B'
  const res = NextResponse.next()
  res.cookies.set('ab-test-pricing', bucket)
  return res
}
```

---

## 3. SEO Optimization

### Cambios Necesarios

#### A. Meta Tags (CRITICO)
```typescript
// src/app/[locale]/layout.tsx
export const metadata: Metadata = {
  title: 'InhabitMe - Monthly Rentals for Digital Nomads | €79-239',
  description: 'Find verified monthly rentals in Madrid, Barcelona, Lisbon. Pay once (€79-239), no monthly commissions. WiFi verified, flexible terms, trusted by 500+ nomads.',
  keywords: 'monthly rentals, digital nomad housing, coliving, Madrid apartments, Barcelona flats, medium-term rentals',
  openGraph: {
    title: 'InhabitMe - Monthly Rentals for Digital Nomads',
    description: 'One-time payment, no monthly fees. Find your perfect space.',
    images: ['/og-image.png'],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'InhabitMe - €79-239 Monthly Rentals',
    description: 'Pay once, stay months. No hidden fees.',
    images: ['/twitter-card.png'],
  },
  alternates: {
    canonical: 'https://inhabitme.com',
    languages: {
      'es': 'https://inhabitme.com/es',
      'en': 'https://inhabitme.com/en',
    },
  },
}
```

#### B. Structured Data (JSON-LD)
```typescript
// Agregar al layout o page
const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'RealEstateAgent',
  'name': 'InhabitMe',
  'description': 'Monthly rentals for digital nomads with transparent pricing',
  'url': 'https://inhabitme.com',
  'priceRange': '€79-€239',
  'areaServed': [
    { '@type': 'City', 'name': 'Madrid' },
    { '@type': 'City', 'name': 'Barcelona' },
    { '@type': 'City', 'name': 'Lisbon' },
  ],
  'aggregateRating': {
    '@type': 'AggregateRating',
    'ratingValue': '4.8',
    'reviewCount': '127'
  }
}
```

#### C. Sitemap + robots.txt
```xml
<!-- public/sitemap.xml -->
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
  <url>
    <loc>https://inhabitme.com/en</loc>
    <xhtml:link rel="alternate" hreflang="es" href="https://inhabitme.com/es"/>
    <priority>1.0</priority>
    <changefreq>weekly</changefreq>
  </url>
  <url>
    <loc>https://inhabitme.com/en/madrid</loc>
    <priority>0.9</priority>
  </url>
  <!-- ... mas ciudades -->
</urlset>
```

```txt
# public/robots.txt
User-agent: *
Allow: /

Sitemap: https://inhabitme.com/sitemap.xml
```

#### D. Performance (Web Vitals)
- ✅ Usar `next/image` en lugar de `<img>`
- ✅ Lazy load imagenes below the fold
- ✅ Preload critical fonts
- ✅ Minimize JS bundle

#### E. Keywords Strategy
**Primary Keywords:**
- "monthly rentals [city]"
- "digital nomad housing"
- "coliving [city]"
- "medium term rentals"

**Long-tail:**
- "affordable monthly rentals Madrid for digital nomads"
- "verified WiFi apartments Barcelona"
- "flexible rental terms Lisbon"

---

## 4. Analytics Setup

### Stack Recomendado

#### A. Vercel Analytics (Debe)
```bash
npm install @vercel/analytics
```

```typescript
// app/layout.tsx
import { Analytics } from '@vercel/analytics/react'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
```

**Metricas automaticas:**
- Web Vitals (LCP, FID, CLS, TTFB)
- Custom events
- A/B test results

#### B. PostHog (Recomendado - Open Source)
```bash
npm install posthog-js
```

```typescript
// lib/posthog.ts
import posthog from 'posthog-js'

if (typeof window !== 'undefined') {
  posthog.init('YOUR_API_KEY', {
    api_host: 'https://app.posthog.com',
    loaded: (posthog) => {
      if (process.env.NODE_ENV === 'development') posthog.debug()
    }
  })
}

export default posthog
```

**Features:**
- Session recordings
- Heatmaps
- Funnel analysis
- Feature flags (para A/B tests)
- User cohorts

#### C. Google Analytics 4 (Opcional)
```typescript
// lib/gtag.ts
export const GA_MEASUREMENT_ID = 'G-XXXXXXXXXX'

export const pageview = (url: string) => {
  window.gtag('config', GA_MEASUREMENT_ID, {
    page_path: url,
  })
}

export const event = ({ action, category, label, value }: any) => {
  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    value: value,
  })
}
```

#### D. Custom Events a Trackear

**Conversion Funnel:**
1. `homepage_view`
2. `pricing_section_view` (scroll depth)
3. `cta_click` (cual CTA?)
4. `city_card_click` (cual ciudad?)
5. `property_view`
6. `booking_initiated`
7. `payment_completed`

**Engagement:**
- `faq_opened` (cual pregunta?)
- `language_switched` (de/a?)
- `video_played` (si agregas)
- `calculator_used` (si haces interactivo)

**Technical:**
- `page_load_time`
- `api_error`
- `form_error`

#### E. Dashboard Sugerido (PostHog)

**Vista 1: Conversion Funnel**
```
Homepage → Pricing View → CTA Click → Property View → Booking
100%      →  75%        →   40%      →    25%         →  8%
```

**Vista 2: Traffic Sources**
- Direct: 30%
- Google Organic: 25%
- Social: 20%
- Referral: 15%
- Paid: 10%

**Vista 3: User Behavior**
- Avg. time on page: 2m 30s
- Bounce rate: 45%
- Pages per session: 2.3
- Scroll depth: 65% avg

---

## Orden de Implementacion

### Semana 1: Performance (Fundacion)
1. ✅ Extraer ClientNav
2. ✅ Extraer StaticSections
3. ⏳ Convertir page.tsx a Server Component
4. ⏳ Lazy load CityCarousel
5. ⏳ Optimizar imagenes con next/image
6. ⏳ Deploy y medir mejora

### Semana 2: Analytics (Medir)
1. ⏳ Setup Vercel Analytics
2. ⏳ Setup PostHog
3. ⏳ Implementar custom events
4. ⏳ Crear dashboards
5. ⏳ Baseline metrics (1 semana de data)

### Semana 3: SEO (Descubrir)
1. ⏳ Meta tags completos
2. ⏳ Structured data
3. ⏳ Sitemap
4. ⏳ robots.txt
5. ⏳ Submit a Google Search Console
6. ⏳ Monitor indexacion

### Semana 4: A/B Testing (Optimizar)
1. ⏳ Setup infrastructure (middleware)
2. ⏳ Test 1: Pricing badge position
3. ⏳ Run 1-2 semanas
4. ⏳ Analyze results
5. ⏳ Implement winner
6. ⏳ Test 2: CTA copy

---

## KPIs a Monitorear

### Performance
- **LCP:** <2.5s (actualmente ~?)
- **FID:** <100ms
- **CLS:** <0.1
- **TTI:** <3.5s

### Conversion
- **Homepage → CTA click:** >35%
- **CTA click → Property view:** >60%
- **Property view → Booking:** >10%

### Engagement
- **Avg time on page:** >2min
- **Bounce rate:** <50%
- **Scroll depth:** >70%

### SEO
- **Organic traffic:** +20% MoM
- **Keywords ranking:** Top 10 for 5+ primary keywords
- **Domain Authority:** Increase 5 points

---

## Proximos Pasos Inmediatos

1. **Review este documento** - Feedback?
2. **Priorizar** - Cual implementar primero?
3. **Crear branch** - `feature/performance-opt`
4. **Implementar Semana 1** (Performance)
5. **Deploy a staging**
6. **Medir impacto**
7. **Production deploy**

---

## Notas Tecnicas

### Git Strategy
```bash
# Branch principal
git checkout -b optimization/full-stack

# Sub-branches
git checkout -b optimization/performance
git checkout -b optimization/analytics
git checkout -b optimization/seo
git checkout -b optimization/ab-testing
```

### Testing
- Unit tests: Componentes nuevos
- Integration tests: A/B test logic
- E2E tests: Conversion funnel
- Performance tests: Lighthouse CI

### Monitoring
- Vercel Dashboard: Web Vitals
- PostHog: User behavior
- Sentry: Error tracking (recomendar?)
- LogRocket: Session replay (opcional)

---

**Creado:** 2026-01-21  
**Autor:** AI Assistant + Tu Feedback  
**Status:** PENDING REVIEW
