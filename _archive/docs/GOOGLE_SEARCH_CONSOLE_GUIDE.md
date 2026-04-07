# 🔍 Google Search Console - Guía Completa para InhabitMe

## 📋 Tabla de Contenido

1. [Configuración Inicial](#configuración-inicial)
2. [Verificar Propiedad](#verificar-propiedad)
3. [Enviar Sitemap](#enviar-sitemap)
4. [Monitoreo y Análisis](#monitoreo-y-análisis)
5. [Optimizaciones Continuas](#optimizaciones-continuas)
6. [Solución de Problemas](#solución-de-problemas)

---

## 🚀 Configuración Inicial

### Paso 1: Acceder a Google Search Console

1. **Ve a**: https://search.google.com/search-console
2. **Inicia sesión** con tu cuenta de Google
3. Si es tu primera vez, verás "Agregar propiedad"

### Paso 2: Agregar Propiedad

Hay dos métodos. **Usa el Método 1** (recomendado):

#### **Método 1: Prefijo de URL** (Recomendado)
```
URL prefix: https://www.inhabitme.com
```

**Ventajas:**
- ✅ Más simple de verificar
- ✅ Solo rastrea el dominio específico (www)
- ✅ Perfecto para sitios en producción

**Desventajas:**
- ❌ No incluye subdominios automáticamente

#### **Método 2: Propiedad de Dominio**
```
Domain: inhabitme.com
```

**Ventajas:**
- ✅ Incluye todos los subdominios (www, blog, app, etc)
- ✅ Más completo para sitios grandes

**Desventajas:**
- ❌ Requiere verificación DNS (más complejo)

---

## ✅ Verificar Propiedad

### Opción A: HTML Tag (Recomendada)

Esta es la forma más fácil y ya está configurada en el proyecto.

#### 1. En Google Search Console

1. Selecciona **"HTML tag"** como método de verificación
2. Copia el código que se ve así:
   ```html
   <meta name="google-site-verification" content="ABC123XYZ..." />
   ```
3. Copia solo la parte `ABC123XYZ...` (el contenido del atributo `content`)

#### 2. Configurar en Vercel

1. Ve a **Vercel Dashboard** → Tu proyecto `inhabitme`
2. **Settings** → **Environment Variables**
3. Agrega nueva variable:
   - **Key**: `NEXT_PUBLIC_GOOGLE_VERIFICATION_CODE`
   - **Value**: `ABC123XYZ...` (el código que copiaste)
   - **Environments**: Production, Preview, Development
4. **Save**
5. **Redeploy** el proyecto

#### 3. Verificar

1. Espera 2-3 minutos a que termine el deploy
2. Regresa a Google Search Console
3. Click **"Verificar"**
4. ✅ Debería decir "Propiedad verificada"

### Opción B: Archivo HTML (Alternativa)

Si prefieres no usar variables de entorno:

1. Google te da un archivo: `google123abc.html`
2. Descárgalo
3. Sube a: `public/google123abc.html` en tu proyecto
4. Commit y push
5. Verifica que funcione: `https://www.inhabitme.com/google123abc.html`
6. Click "Verificar" en Google Search Console

### Opción C: Google Analytics (Si ya lo tienes)

Si ya tienes Google Analytics instalado con el mismo correo:
1. Selecciona "Google Analytics"
2. Click "Verificar"
3. Listo ✅

---

## 🗺️ Enviar Sitemap

### Ya está Enviado ✅

Según la imagen que compartiste, ya tienes el sitemap enviado:
- **URL**: `https://www.inhabitme.com/sitemap.xml`
- **Status**: Success ✅
- **Páginas descubiertas**: 2 (aumentará gradualmente)

### Si Necesitas Reenviarlo

1. En Google Search Console, ve a **Sitemaps** (menú izquierdo)
2. En "Añadir un sitemap nuevo", escribe: `sitemap.xml`
3. Click **"Enviar"**
4. Espera unos minutos
5. Actualiza la página

### Verificar Estado

El sitemap debería mostrar:
```
Estado: Correcto ✅
Enviado: [fecha]
Última lectura: [fecha reciente]
Descubiertos: [número creciente de páginas]
```

---

## 📊 Monitoreo y Análisis

Ahora viene lo importante: **usar los datos para mejorar**.

### 1. Cobertura (Coverage / Indexación)

**Ubicación**: Indexación → Páginas

**Qué revisar:**
- ✅ **Páginas indexadas**: Número de páginas en Google
- ⚠️ **Descubiertas pero no indexadas**: Páginas que Google encontró pero no indexó aún
- ❌ **Excluidas**: Páginas bloqueadas o con problemas

**Meta para InhabitMe:**
- Objetivo: **~96 páginas indexadas** (según tu sitemap actual)
- Timeline: 2-4 semanas para indexación completa

**Acciones:**
```
Semana 1: ~10-20 páginas indexadas
Semana 2: ~30-50 páginas indexadas
Semana 3: ~60-80 páginas indexadas
Semana 4: ~90-96 páginas indexadas (completo)
```

### 2. Rendimiento (Performance)

**Ubicación**: Rendimiento

**Métricas clave:**

| Métrica | Qué significa | Objetivo |
|---------|--------------|----------|
| **Clics** | Usuarios que hicieron clic desde Google | Aumentar ↑ |
| **Impresiones** | Veces que apareciste en resultados | Aumentar ↑ |
| **CTR** | % de clics / impresiones | >5% |
| **Posición** | Posición promedio en resultados | <10 |

**Filtros útiles:**
- Por **Consultas** (keywords que generan tráfico)
- Por **Páginas** (qué páginas tienen más clics)
- Por **Países** (de dónde vienen los usuarios)
- Por **Dispositivos** (móvil vs desktop)

**Acciones:**
1. Identifica **consultas con buena posición pero bajo CTR**
   - Mejora el meta description para hacerlo más atractivo
   
2. Identifica **consultas en posición 11-20**
   - Oportunidad: están cerca de primera página
   - Mejora contenido para subir posiciones

3. Identifica **páginas sin clics**
   - Revisa metadata (title, description)
   - Revisa que estén indexadas

### 3. Experiencia (Core Web Vitals)

**Ubicación**: Experiencia → Core Web Vitals

**Métricas:**

| Métrica | Nombre | Bueno | Objetivo InhabitMe |
|---------|--------|-------|-------------------|
| **LCP** | Largest Contentful Paint | <2.5s | ✅ Optimizado |
| **FID** | First Input Delay | <100ms | ✅ Optimizado |
| **CLS** | Cumulative Layout Shift | <0.1 | ✅ Optimizado |

**Con Performance 94/100, deberías estar en verde ✅**

### 4. Usabilidad Móvil

**Ubicación**: Experiencia → Usabilidad móvil

**Qué revisar:**
- ✅ Sin errores
- ❌ Texto demasiado pequeño
- ❌ Elementos demasiado juntos
- ❌ Contenido más ancho que la pantalla

**Con Accessibility 92/100, deberías estar bien ✅**

### 5. Mejoras (Enhancements)

**Ubicación**: Mejoras

**Tipos de mejoras:**

#### **Breadcrumbs**
- Estado actual: ❓ (verificar si aparecen)
- Si no aparecen: Agregar structured data de breadcrumbs

#### **Sitelinks Search Box**
- Estado: ❓ (verificar)
- Aparece cuando Google confía en tu sitio
- Se activa automáticamente con buen SEO

#### **Logo**
- Estado: ✅ (ya configurado en SEO_CONFIG)
- Aparece en resultados de búsqueda de marca

---

## 🔧 Optimizaciones Continuas

### Rutina Semanal (10 minutos)

**Lunes:**
1. Revisar **Cobertura** → ver páginas indexadas
2. Revisar **errores nuevos** (si hay)
3. Verificar **Core Web Vitals** (móvil y desktop)

**Viernes:**
1. Revisar **Rendimiento** → top queries
2. Identificar **oportunidades** (posición 11-20)
3. Revisar **CTR** de páginas principales

### Rutina Mensual (30 minutos)

**Primera semana del mes:**

1. **Análisis de keywords**
   - Exportar top 100 queries
   - Identificar keywords con potencial
   - Crear contenido para keywords relevantes

2. **Análisis de competencia**
   - Ver qué keywords tienen competidores
   - Identificar gaps de contenido

3. **Optimización de contenido**
   - Actualizar páginas con bajo CTR
   - Mejorar meta descriptions
   - Agregar contenido a páginas thin

4. **Technical SEO**
   - Revisar errores de crawling
   - Verificar que todas las páginas importantes estén indexadas
   - Revisar velocidad de carga

### Acciones Inmediatas (Hoy/Esta Semana)

#### ✅ Ya Hecho
- [x] Sitemap enviado y validado
- [x] Metadata completa en todas las páginas
- [x] Open Graph configurado
- [x] URLs optimizadas
- [x] Robots.txt configurado

#### 🎯 Por Hacer

**Prioridad Alta:**
1. **Obtener código de verificación** de Google Search Console
2. **Configurar variable de entorno** en Vercel
3. **Verificar propiedad** en GSC
4. **Esperar 24-48h** para primeros datos

**Prioridad Media:**
2. **Configurar Google Analytics** (para métricas adicionales)
3. **Agregar más contenido** (blog posts, guías de ciudades)
4. **Crear backlinks** (estrategia de link building)

**Prioridad Baja:**
4. **Structured data adicional** (reviews, FAQs)
5. **Rich snippets** para propiedades
6. **Schema.org markup** para organización

---

## 🚨 Solución de Problemas

### Problema: Propiedad no se verifica

**Causas comunes:**
1. Variable de entorno mal configurada
2. Deploy no completado
3. Código de verificación incorrecto

**Soluciones:**
1. Verifica que la variable esté en Vercel:
   ```bash
   NEXT_PUBLIC_GOOGLE_VERIFICATION_CODE=tu-codigo
   ```
2. Redeploy el proyecto
3. Espera 2-3 minutos
4. Verifica que aparezca en el HTML:
   ```bash
   curl https://www.inhabitme.com | grep "google-site-verification"
   ```
5. Si aparece, intenta verificar de nuevo

### Problema: Páginas no se indexan

**Causas:**
1. **Robot.txt bloquea** (revisa que no bloquee rutas importantes)
2. **Canonical apunta a otra URL**
3. **Contenido duplicado**
4. **Poco contenido** (thin content)

**Soluciones:**
1. Revisa robots.txt: `https://www.inhabitme.com/robots.txt`
2. Verifica canonical en las páginas afectadas
3. Usa "URL Inspection Tool" en GSC
4. Solicita indexación manual:
   - GSC → URL Inspection
   - Pega la URL
   - "Solicitar indexación"

### Problema: CTR bajo (<2%)

**Causas:**
1. Title/description poco atractivos
2. No incluye call-to-action
3. No destaca vs competencia

**Soluciones:**
1. Mejora el title:
   ```
   Antes: "Properties in Madrid"
   Después: "Monthly Rentals in Madrid | Verified + WiFi | From €800"
   ```
2. Mejora el description:
   ```
   Antes: "Find properties in Madrid"
   Después: "Modern furnished apartments for 1-6 months. Workspace, fast WiFi, transparent pricing. Book verified stays in Madrid's best neighborhoods."
   ```

### Problema: Posición estancada

**Causas:**
1. Competencia alta
2. Contenido insuficiente
3. Pocos backlinks

**Soluciones:**
1. **Mejora contenido**:
   - Agrega más información
   - Incluye imágenes de calidad
   - Agrega videos (si es posible)
   
2. **Link building**:
   - Busca directorios de nicho
   - Guest posts en blogs de viajes
   - Partnerships con blogs de nómadas digitales

3. **Internal linking**:
   - Enlaza páginas relacionadas
   - Usa anchor text descriptivo

---

## 📈 KPIs y Objetivos

### Mes 1 (Arranque)
- ✅ Propiedad verificada
- ✅ Sitemap enviado
- 🎯 20-40 páginas indexadas
- 🎯 Primeras impresiones en búsquedas

### Mes 2 (Crecimiento)
- 🎯 60-80 páginas indexadas
- 🎯 100+ impresiones/día
- 🎯 5+ clics/día
- 🎯 CTR >3%

### Mes 3 (Consolidación)
- 🎯 90-96 páginas indexadas (100%)
- 🎯 500+ impresiones/día
- 🎯 20+ clics/día
- 🎯 CTR >5%
- 🎯 Posición promedio <20

### Mes 6 (Madurez)
- 🎯 1000+ impresiones/día
- 🎯 50+ clics/día
- 🎯 CTR >5%
- 🎯 Posición promedio <15
- 🎯 Top 10 en keywords principales

---

## 📚 Recursos Adicionales

**Google Search Console:**
- [Guía oficial de GSC](https://support.google.com/webmasters/answer/9128668)
- [Search Console Training](https://developers.google.com/search/docs/beginner/search-console)

**SEO Tools (complementarios):**
- [Google Analytics](https://analytics.google.com) - Para métricas de tráfico
- [PageSpeed Insights](https://pagespeed.web.dev/) - Para performance
- [Mobile-Friendly Test](https://search.google.com/test/mobile-friendly) - Para móvil
- [Rich Results Test](https://search.google.com/test/rich-results) - Para structured data

**Cursos recomendados:**
- Google SEO Fundamentals (gratis)
- Moz Beginner's Guide to SEO (gratis)

---

## ✅ Checklist de Configuración

Usa esta checklist para asegurarte de que todo está configurado:

### Configuración Inicial
- [ ] Cuenta de Google Search Console creada
- [ ] Propiedad agregada (www.inhabitme.com)
- [ ] Método de verificación elegido (HTML tag recomendado)
- [ ] Variable de entorno configurada en Vercel
- [ ] Propiedad verificada ✅

### Sitemaps
- [x] Sitemap generado (`sitemap.xml`)
- [x] Sitemap enviado a GSC
- [x] Estado: Success ✅
- [ ] Páginas descubriéndose gradualmente

### Monitoreo
- [ ] Cobertura revisada (páginas indexadas)
- [ ] Rendimiento configurado (período de tiempo)
- [ ] Alertas activadas (opcional)
- [ ] Google Analytics conectado (opcional)

### Optimización
- [ ] Meta titles revisados
- [ ] Meta descriptions atractivas
- [ ] Open Graph funcionando
- [ ] Core Web Vitals en verde
- [ ] Móvil usable sin errores

---

## 🎯 Próximos Pasos (Orden de Prioridad)

### HOY
1. ✅ Acceder a Google Search Console
2. ✅ Agregar propiedad `www.inhabitme.com`
3. ⏳ Obtener código de verificación (HTML tag)
4. ⏳ Configurar en Vercel como variable de entorno
5. ⏳ Redeploy y verificar

### ESTA SEMANA
6. ⏳ Esperar indexación inicial (20-40 páginas)
7. ⏳ Revisar cobertura diariamente
8. ⏳ Verificar que no haya errores

### PRÓXIMAS 2 SEMANAS
9. ⏳ Monitorear primeras impresiones
10. ⏳ Analizar primeras queries
11. ⏳ Optimizar páginas con bajo CTR

### PRÓXIMO MES
12. ⏳ Crear estrategia de contenido
13. ⏳ Implementar link building
14. ⏳ Optimizar conversiones

---

**Última actualización**: Enero 23, 2026  
**Mantenido por**: Equipo InhabitMe  
**Estado del SEO**: 🎯 **100/100** en Lighthouse
