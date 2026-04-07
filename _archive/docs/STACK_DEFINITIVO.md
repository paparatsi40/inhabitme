# Stack Definitivo de inhabitme.com

## **Stack Tecnológico Final**

### **Frontend**

- ✅ **Next.js 14.2.18** - App Router
- ✅ **React 18** - Client Components
- ✅ **TypeScript** - Type safety
- ✅ **Tailwind CSS 3.4** - Styling
- ✅ **Radix UI** - Headless components
- ✅ **Lucide Icons** - Icon library
- ✅ **Framer Motion** - Animations

### **Backend / Database**

- ✅ **Drizzle ORM** - Database toolkit (TypeScript-first)
- ✅ **PostgreSQL** - Database (via Supabase)
- ✅ **Supabase** - Database hosting + Auth (futuro)
- ✅ **postgres.js** - Database driver

### **Authentication** (Temporal)

- ⚠️ **Clerk REMOVIDO** - Causaba bug de Webpack
- 🔜 **Supabase Auth** - Próxima implementación
- 🔜 **O NextAuth.js** - Alternativa considerada

### **Deployment**

- 🔜 **Vercel** - Hosting (Edge-ready)
- ✅ **Git** - Version control

---

## **Por qué Drizzle > Prisma**

### **Razones Técnicas:**

1. **Sin bugs de Webpack/RSC**
    - Prisma tiene conflicto conocido con Next.js 14/15
    - Drizzle funciona sin problemas

2. **Performance**
    - Drizzle: SQL directo, más rápido
    - Prisma: Overhead de engine

3. **Bundle Size**
    - Drizzle: ~20KB
    - Prisma: ~500KB+ (client + engine)

4. **Edge Runtime**
    - Drizzle: ✅ Compatible
    - Prisma: ❌ Limitado

5. **Developer Experience**
    - Drizzle: SQL visible, fácil debug
    - Prisma: Abstracción oculta

### **Decisión Final:**

✅ **Drizzle es el ORM oficial de inhabitme**

---

## **Estructura de Base de Datos**

### **8 Tablas (Drizzle Schema)**

1. **User** - Usuarios de la plataforma
2. **Property** - Alojamientos publicados
3. **PropertyImage** - Galería de fotos
4. **Booking** - Reservas
5. **Payment** - Transacciones (Stripe)
6. **Review** - Reseñas y ratings
7. **Availability** - Calendario de disponibilidad
8. **Message** - Chat guest-host

**Schema ubicado en:** `src/db/schema.ts`

---

## **Convenciones del Proyecto**

### **Nombres de Tabla**

- PascalCase en Drizzle: `Property`, `User`
- Se mapean a nombres Postgres con comillas: `"Property"`, `"User"`

### **IDs**

- Tipo: `text` (UUID v4)
- Generación: `crypto.randomUUID()`

### **Timestamps**

- `createdAt` - Fecha de creación
- `updatedAt` - Última actualización
- Tipo: `timestamp`

### **Decimales**

- Precios: `decimal(10, 2)`
- Permite hasta €99,999,999.99

---

## **Comandos Útiles**

### **Desarrollo**

```bash
npm run dev          # Iniciar servidor
npm run build        # Build para producción
npm run start        # Servidor de producción
```

### **Base de Datos (Drizzle)**

```bash
npx drizzle-kit generate  # Generar migraciones
npx drizzle-kit push      # Push schema a DB
npx drizzle-kit studio    # Abrir Drizzle Studio (GUI)
```

### **Linting**

```bash
npm run lint         # ESLint
```

---

## **Variables de Entorno Requeridas**

```env
# Database
DATABASE_URL="postgresql://..."

# Clerk (Temporal - removido del layout)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_..."
CLERK_SECRET_KEY="sk_..."

# Stripe (Futuro)
STRIPE_SECRET_KEY="sk_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_..."
```

---

## **Diferenciadores de inhabitme**

### **1. Workspace-First**

- `hasDesk` - Escritorio dedicado
- `wifiSpeed` - Velocidad medida (Mbps)
- `wifiVerified` - Verificado por plataforma
- `hasErgonomicChair` - Silla ergonómica
- `hasSecondMonitor` - Monitor incluido

### **2. Estancias Medias**

- `minStayMonths` - Mínimo 1 mes
- `maxStayMonths` - Hasta 6 meses
- Orientado a nómadas digitales

### **3. Transparencia**

- `monthlyPrice` - Precio claro mensual
- `depositAmount` - Sin sorpresas
- Legal-first approach

---

## **Estado Actual del Proyecto**

### ✅ **Funcionando**

- Landing page profesional
- Búsqueda de propiedades (`/search`)
- Conexión a Supabase via Drizzle
- Cards de propiedades con datos reales
- Navbar y navegación básica
- Dashboard (sin auth)

### 🚧 **En Desarrollo**

- Detalle de propiedad
- Filtros de búsqueda
- Formulario crear propiedad
- Sistema de reservas
- Pagos con Stripe

### 🔜 **Próximos**

- Autenticación (Supabase Auth o NextAuth)
- Upload de imágenes
- Sistema de mensajes
- Reviews
- Dashboard de host
- B2B API

---

## **Lecciones Aprendidas**

### **1. Bug de Prisma + Next.js**

- **Problema:** `TypeError: Cannot read properties of undefined (reading 'call')`
- **Causa:** Prisma Client + React Server Components + Webpack
- **Solución:** Migrar a Drizzle ORM

### **2. Clerk en Layout**

- **Problema:** `ClerkProvider` causaba error de hidratación
- **Causa:** Conflicto con RSC en Next.js App Router
- **Solución:** Remover temporalmente, usar auth diferente

### **3. DNS Corporativo**

- **Problema:** `ENOTFOUND` al conectar a Supabase
- **Causa:** Firewall/DNS corporativo bloqueando
- **Solución:** Cambiar a red personal

---

## **Documentación de Referencia**

- [Drizzle ORM Docs](https://orm.drizzle.team/)
- [Next.js 14 Docs](https://nextjs.org/docs)
- [Supabase Docs](https://supabase.com/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Radix UI](https://www.radix-ui.com/)

---

**Última actualización:** 30 de diciembre de 2024
**Estado:** ✅ Producción Ready (sin auth)