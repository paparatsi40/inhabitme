# 🐛 Problemas Conocidos

## TypeError: Cannot read properties of undefined (reading 'call')

### 🔍 Descripción

Error de Webpack/React Server Components cuando se intenta usar Prisma Client en Next.js 15.1.0.

### 📍 Stack trace típico:

```
TypeError: Cannot read properties of undefined (reading 'call')
    at options.factory (webpack.js:712:31)
    at __webpack_require__ (webpack.js:37:33)
    ...react-server-dom-webpack...
```

### ⚠️ Causa raíz

Next.js 15.x tiene un bug conocido con cómo Webpack empaqueta `@prisma/client` en el contexto de
React Server Components. El módulo de Prisma no se registra correctamente en la tabla interna de
módulos de Webpack.

**Referencias:**

- https://github.com/vercel/next.js/issues/58824
- https://github.com/prisma/prisma/issues/22504

### ✅ Soluciones implementadas

#### 1. **Aislamiento completo de Prisma** ✅

- Prisma SOLO se usa en API Routes (`/api/*`)
- NO se usa en Server Actions
- NO se usa en Server Components directamente

#### 2. **Client Components para UI** ✅

- Páginas que consumen datos usan `'use client'`
- Fetch a API Routes en lugar de Server Actions

#### 3. **Mock data temporal** ✅

- `/search` usa datos mock hasta resolver el bug
- Permite testing de UI sin bloquear desarrollo

### 🔄 Soluciones alternativas (futuro)

#### Opción A: Downgrade a Next.js 14.2.x

```bash
npm install next@14.2.15
```

**Pros:** Estable, sin bugs
**Contras:** No tienes las nuevas features de Next.js 15

#### Opción B: Esperar a Next.js 15.2+

El equipo de Vercel está trabajando en el fix.

#### Opción C: Usar ORM alternativo temporalmente

- Drizzle ORM
- Kysely
- SQL directo con `postgres` package

### 📊 Estado actual del proyecto

```
✅ FUNCIONANDO:
├─ Landing page
├─ Auth (Clerk)
├─ Dashboard
├─ Database (8 tablas en Supabase)
├─ API Routes (/api/properties/search)
└─ /search (con mock data)

⚠️ TEMPORAL:
└─ /search usa datos mock en lugar de DB real

❌ NO FUNCIONAN (por el bug):
├─ Server Actions con Prisma
└─ Prisma Client en Server Components
```

### 🎯 Recomendación actual

**Mantener la implementación con mock data** hasta que:

1. Next.js lance el fix (estimado: versión 15.2.x)
2. O migrar a Next.js 14.2.x si se necesita producción YA

### 📝 Notas adicionales

- La base de datos está correctamente configurada
- Las tablas existen y tienen datos
- El API `/api/properties/search` funciona correctamente
- El problema es SOLO en cómo Webpack empaqueta Prisma para RSC

---

**Última actualización:** 30 de diciembre de 2024