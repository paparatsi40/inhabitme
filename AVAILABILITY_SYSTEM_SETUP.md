# 📅 Sistema de Disponibilidad Profesional - InhabitMe

> **Estado:** ✅ Base de datos creada  
> **Fecha:** 13 Enero 2026  
> **Arquitectura:** Sistema completo de gestión de disponibilidad

---

## 🎯 Overview

Sistema profesional de gestión de disponibilidad de propiedades con:

- ✅ **Calendario de periodos** (rented, blocked, available, maintenance)
- ✅ **Validación de overlaps** automática
- ✅ **Búsqueda inteligente** por fechas
- ✅ **Dashboard para hosts** con gestión visual
- ✅ **Performance optimizado** con índices y funciones PostgreSQL

---

## 🗄️ Base de Datos

### Tabla Principal: `property_availability_periods`

```sql
id                 UUID PRIMARY KEY
listing_id         UUID (FK → listings)
start_date         DATE
end_date           DATE
status             VARCHAR(20) -- 'available', 'rented', 'blocked', 'maintenance'
notes              TEXT
tenant_reference   VARCHAR(255)
created_at         TIMESTAMP
updated_at         TIMESTAMP
created_by         VARCHAR(255)
```

### Índices Creados:

- `idx_availability_listing` - Búsqueda por propiedad
- `idx_availability_dates` - Búsqueda por rango de fechas
- `idx_availability_status` - Filtrado por estado
- `idx_availability_lookup` - Búsqueda compuesta (optimizada)

---

## 🔧 Setup en Supabase

### 1. Ejecutar la migración

```sql
-- Ir a Supabase Dashboard → SQL Editor
-- Copiar y ejecutar: supabase/migrations/create_availability_system.sql
```

### 2. Verificar instalación

```sql
-- Verificar que la tabla existe
SELECT * FROM property_availability_periods LIMIT 1;

-- Verificar funciones
SELECT proname FROM pg_proc WHERE proname LIKE '%availability%';

-- Debería mostrar:
-- - check_availability_overlap
-- - get_next_available_date
-- - is_available_in_range
```

---

## 🛠️ Funciones Útiles

### 1. Detectar Overlaps

```sql
SELECT check_availability_overlap(
  'listing-uuid',
  '2026-03-01'::DATE,
  '2026-06-01'::DATE
);
-- Retorna: true si hay overlap, false si está libre
```

### 2. Próxima Fecha Disponible

```sql
SELECT get_next_available_date('listing-uuid');
-- Retorna: DATE de próxima disponibilidad
```

### 3. Verificar Disponibilidad en Rango

```sql
SELECT is_available_in_range(
  'listing-uuid',
  '2026-03-01'::DATE,
  '2026-06-01'::DATE
);
-- Retorna: true si está disponible, false si no
```

---

## 📊 Queries Comunes

### Ver periodos de una propiedad:

```sql
SELECT 
  start_date,
  end_date,
  status,
  notes
FROM property_availability_periods
WHERE listing_id = 'your-listing-id'
ORDER BY start_date DESC;
```

### Buscar propiedades disponibles en rango:

```sql
SELECT l.* 
FROM listings l
WHERE l.status = 'active'
  AND is_available_in_range(
    l.id,
    '2026-03-01'::DATE,
    '2026-06-01'::DATE
  ) = true
ORDER BY l.created_at DESC;
```

### Ver estado actual de todas las propiedades:

```sql
SELECT * FROM listing_availability_status
ORDER BY current_status, next_available_date;
```

---

## 🎨 Próximos Pasos de Implementación

### Fase 2: Dashboard del Host (3-4 horas)

**Archivos a crear:**

```
src/
├── app/
│   └── dashboard/
│       └── properties/
│           └── [id]/
│               └── availability/
│                   └── page.tsx          ← Dashboard de disponibilidad
│
├── components/
│   └── availability/
│       ├── AvailabilityCalendar.tsx      ← Calendario visual
│       ├── PeriodList.tsx                ← Lista de periodos
│       ├── PeriodForm.tsx                ← Form CRUD
│       └── AvailabilityStats.tsx         ← Métricas
│
└── lib/
    └── repositories/
        └── availability.repository.ts     ← Queries
```

**Funcionalidades:**

1. ✅ Vista de calendario (mes actual + navegación)
2. ✅ Lista de periodos existentes
3. ✅ Crear nuevo periodo (con validación de overlap)
4. ✅ Editar periodo existente
5. ✅ Eliminar periodo
6. ✅ Estadísticas (días ocupados, tasa de ocupación)

---

### Fase 3: Búsqueda por Fechas (2 horas)

**Archivos a modificar:**

```
src/
├── app/
│   └── search/
│       └── page.tsx                      ← Añadir filtro de fechas
│
├── components/
│   └── search/
│       └── DateRangeFilter.tsx           ← Nuevo componente
│
└── lib/
    └── repositories/
        └── listing.repository.ts          ← Añadir query con fechas
```

**Filtros:**

- Disponible desde: DATE
- Por al menos: NUMBER (meses)
- Resultado: Solo propiedades disponibles en ese rango

---

### Fase 4: Vista en Listing Detail (1 hora)

**Archivo a modificar:**

```
src/app/listings/[id]/ListingDetailClient.tsx
```

**Sección a añadir:**

```tsx
<AvailabilitySection
  listingId={listing.id}
  nextAvailableDate={getNextAvailableDate(listing.id)}
  isCurrentlyRented={isRented}
/>
```

**Muestra:**

- ✅ Estado actual (Disponible / Ocupado)
- ✅ Próxima fecha disponible (si está ocupado)
- ✅ Disclaimer sobre fechas tentativas

---

## 🎯 Casos de Uso

### Caso 1: Host marca propiedad como rentada

```typescript
// POST /api/availability/periods
{
  "listingId": "uuid",
  "startDate": "2026-02-10",
  "endDate": "2026-03-14",
  "status": "rented",
  "notes": "Inquilino confirmado"
}
```

### Caso 2: Guest busca propiedad disponible

```typescript
// GET /api/listings/search?city=madrid&availableFrom=2026-03-01&months=3
// Retorna solo propiedades sin overlap en ese rango
```

### Caso 3: Host bloquea periodo por mantenimiento

```typescript
// POST /api/availability/periods
{
  "listingId": "uuid",
  "startDate": "2026-04-15",
  "endDate": "2026-04-20",
  "status": "maintenance",
  "notes": "Pintura y reparaciones"
}
```

---

## 📈 Métricas que Puedes Extraer

```sql
-- Tasa de ocupación por propiedad
SELECT 
  listing_id,
  COUNT(*) FILTER (WHERE status = 'rented') as total_rentals,
  SUM(end_date - start_date) FILTER (WHERE status = 'rented') as days_rented
FROM property_availability_periods
GROUP BY listing_id;

-- Propiedades más rentadas
SELECT 
  l.title,
  COUNT(p.id) as rental_count
FROM listings l
JOIN property_availability_periods p ON p.listing_id = l.id
WHERE p.status = 'rented'
GROUP BY l.id, l.title
ORDER BY rental_count DESC
LIMIT 10;
```

---

## ✅ Checklist de Implementación

**Base de datos:**
- [x] Tabla `property_availability_periods` creada
- [x] Índices optimizados
- [x] Funciones PostgreSQL
- [x] Triggers de updated_at
- [x] Vista `listing_availability_status`

**Backend (Pendiente):**
- [ ] Repository para availability
- [ ] API endpoints CRUD
- [ ] Validación de overlaps
- [ ] Tests unitarios

**Dashboard Host (Pendiente):**
- [ ] Página de disponibilidad
- [ ] Calendario interactivo
- [ ] Form de periodos
- [ ] Lista de periodos

**Búsqueda (Pendiente):**
- [ ] Filtro de fechas
- [ ] Query optimizada
- [ ] UI de resultados

**Listing Detail (Pendiente):**
- [ ] Sección de disponibilidad
- [ ] Estado actual
- [ ] Próxima fecha disponible

---

## 🎉 Beneficios del Sistema

✅ **Para Hosts:**
- Control total sobre disponibilidad
- Previene dobles bookings
- Tracking de ocupación
- Planificación a largo plazo

✅ **Para Guests:**
- Búsqueda por fechas específicas
- Resultados precisos
- No contactan propiedades ocupadas
- Ahorro de tiempo

✅ **Para el Negocio:**
- Menos fricciones
- Mejor experiencia de usuario
- Datos de ocupación
- Optimización de revenue

---

## 📞 Soporte

Si tienes dudas sobre la implementación:
1. Revisa los queries de ejemplo arriba
2. Consulta las funciones PostgreSQL
3. Usa la vista `listing_availability_status` para debugging

---

**Sistema completo y profesional.** 🚀
