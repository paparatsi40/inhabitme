# inhabitme.com

> Estancias medias sin sorpresas. Alojamientos de 1-6 meses listos para vivir y trabajar.

## 📱 **¡NUEVA! PWA Configurada - Funciona como App Móvil**

Tu aplicación ya está optimizada como **Progressive Web App (PWA)**:

✅ **Instalable** en iOS y Android (sin App Store)
✅ **Funciona offline** con caché inteligente
✅ **Push notifications** ready
✅ **Home screen icon** como app nativa
✅ **Modo standalone** (sin barra del navegador)

**📖 Lee la estrategia completa:** [`MOBILE_STRATEGY.md`](./MOBILE_STRATEGY.md)

## 🚀 Stack Técnico

- **Framework**: Next.js 15 (App Router + React Server Components)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS + Shadcn/ui
- **Authentication**: Clerk
- **Database**: PostgreSQL + Prisma ORM
- **Payments**: Stripe Connect (próximamente)
- **Testing**: Vitest + Playwright
- **Deployment**: Vercel

## 📁 Estructura del Proyecto

```
src/
├── app/                      # Next.js App Router
│   ├── (auth)/              # Rutas de autenticación
│   ├── (main)/              # Rutas principales
│   ├── globals.css          # Estilos globales
│   ├── layout.tsx           # Layout principal
│   └── page.tsx             # Landing page
├── components/              # Componentes compartidos
│   └── ui/                  # Componentes UI (Shadcn)
├── features/                # Lógica por feature
│   ├── properties/          # Gestión de propiedades
│   ├── bookings/            # Sistema de reservas
│   ├── auth/                # Autenticación
│   └── payments/            # Pagos
├── lib/                     # Utilidades y configuración
│   ├── db.ts                # Cliente Prisma
│   └── utils.ts             # Helpers
└── types/                   # Tipos TypeScript globales
```

## 🛠️ Comandos Disponibles

```bash
# Desarrollo
npm run dev              # Iniciar servidor de desarrollo (Turbopack)

# Build y producción
npm run build            # Compilar para producción
npm start                # Iniciar servidor de producción

# Calidad de código
npm run lint             # Ejecutar ESLint
npm run lint:fix         # Fix automático ESLint
npm run type-check       # Verificar tipos TypeScript
npm run format           # Formatear código con Prettier

# Testing
npm run test             # Ejecutar tests unitarios (Vitest)
npm run test:e2e         # Ejecutar tests E2E (Playwright)
npm run test:e2e:ui      # Tests E2E con UI interactiva

# Database
npx prisma studio        # Abrir Prisma Studio
npx prisma generate      # Generar cliente Prisma
npx prisma db push       # Sincronizar schema con DB
npx prisma migrate dev   # Crear migración
```

## 🔧 Setup Local

### 1. Instalar dependencias

```bash
npm install
```

### 2. Configurar variables de entorno

Crea un archivo `.env.local`:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/inhabitme"

# Clerk Auth
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up

# Stripe (próximamente)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

### 3. Inicializar base de datos

```bash
npx prisma generate
npx prisma db push
```

### 4. Ejecutar en desarrollo

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## 🎨 Sistema de Diseño

### Colores

La paleta de colores se define en `src/app/globals.css` usando variables CSS:

- `--primary`: Color principal de marca
- `--secondary`: Color secundario
- `--accent`: Color de acentos
- `--muted`: Colores neutros
- `--destructive`: Estados de error

### Componentes UI

Utilizamos [Shadcn/ui](https://ui.shadcn.com/) para componentes reutilizables:

```tsx
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
```

## 🌍 Internacionalización (i18n)

Soportamos 3 idiomas:

- 🇪🇸 **Español (ES)** - Default
- 🇬🇧 **Inglés (EN)**
- 🇵🇹 **Portugués (PT)**

Configuración en `next.config.ts`.

## 🔐 Autenticación

Usamos **Clerk** para:

- Sign up / Sign in
- Gestión de organizaciones (B2B)
- Multi-factor authentication
- Session management
- User profiles

## 🗄️ Base de Datos

### Schema Principal

```prisma
model User {
  id            String     @id @default(cuid())
  email         String     @unique
  role          UserRole   @default(GUEST)
  properties    Property[]
  bookings      Booking[]
  createdAt     DateTime   @default(now())
}

model Property {
  id            String     @id @default(cuid())
  title         String
  city          String
  priceMonthly  Int        // En céntimos
  owner         User       @relation(fields: [ownerId], references: [id])
  ownerId       String
  bookings      Booking[]
  createdAt     DateTime   @default(now())
}

model Booking {
  id            String     @id @default(cuid())
  startDate     DateTime
  endDate       DateTime
  totalAmount   Int        // En céntimos
  status        BookingStatus
  property      Property   @relation(fields: [propertyId], references: [id])
  propertyId    String
  guest         User       @relation(fields: [guestId], references: [id])
  guestId       String
  createdAt     DateTime   @default(now())
}
```

## 📦 Deployment

### Vercel (Recomendado)

1. Push código a GitHub
2. Importar proyecto en Vercel
3. Configurar variables de entorno
4. Deploy automático

### Variables de Entorno Requeridas

```env
DATABASE_URL=
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
```

## 🧪 Testing

### Tests Unitarios (Vitest)

```bash
# Ejecutar todos los tests
npm run test

# Watch mode
npm run test -- --watch

# Coverage
npm run test -- --coverage
```

### Tests E2E (Playwright)

```bash
# Ejecutar tests E2E
npm run test:e2e

# UI mode (recomendado)
npm run test:e2e:ui
```

## 📝 Convenciones de Código

### TypeScript

- Tipado estricto habilitado
- Interfaces para props de componentes
- Tipos explícitos en funciones server

### Nomenclatura

- Componentes: `PascalCase`
- Archivos de componentes: `kebab-case.tsx`
- Hooks personalizados: `use-feature-name.ts`
- Utilidades: `camelCase`

### Imports

Orden de imports:

1. React y frameworks
2. Librerías externas
3. Componentes internos
4. Utilidades y tipos
5. Estilos

## 🤝 Contribuir

1. Fork el proyecto
2. Crea tu rama de feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Copyright 2025 inhabitme. Todos los derechos reservados.

## 📞 Contacto

- Website: [inhabitme.com](https://inhabitme.com)
- Email: hola@inhabitme.com

---

**Hecho con ❤️ para nómadas digitales y profesionales en movimiento**
