# 🏗️ Arquitectura Técnica - inhabitme.com

## 📊 Visión General

inhabitme.com es una plataforma full-stack para alojamientos de estancias medias (1-6 meses),
construida con las mejores prácticas de desarrollo moderno y arquitectura escalable.

---

## 🎯 Stack Tecnológico

### Frontend

- **Framework**: Next.js 15.1.5 (App Router)
- **Runtime**: React 19.0.0 (Server Components + Client Components)
- **Language**: TypeScript 5 (strict mode)
- **Styling**: Tailwind CSS 3.4 + Shadcn/ui
- **Icons**: Lucide React + Radix Icons

### Backend

- **API**: Next.js API Routes + Server Actions
- **Database**: PostgreSQL
- **ORM**: Prisma 6.2.0
- **Authentication**: Clerk 6.11.0
- **Payments**: Stripe Connect (próximamente)

### DevOps & Tools

- **Testing**: Vitest 2.1.8 + Playwright 1.49.1
- **Linting**: ESLint 8 + Prettier 3.4.2
- **Build**: Turbopack
- **Deployment**: Vercel
- **CI/CD**: GitHub Actions (próximamente)

---

## 📂 Estructura de Carpetas

```
inhabitme/
├── prisma/
│   └── schema.prisma              # Database schema
├── src/
│   ├── app/                       # Next.js App Router
│   │   ├── (auth)/               # Auth routes group
│   │   │   ├── sign-in/
│   │   │   └── sign-up/
│   │   ├── (main)/               # Main app routes
│   │   │   ├── dashboard/
│   │   │   ├── properties/
│   │   │   └── bookings/
│   │   ├── api/                  # API routes
│   │   ├── globals.css           # Global styles
│   │   ├── layout.tsx            # Root layout
│   │   └── page.tsx              # Landing page
│   ├── components/               # Shared components
│   │   └── ui/                   # Shadcn UI components
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       └── input.tsx
│   ├── features/                 # Feature modules
│   │   ├── auth/
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   └── utils/
│   │   ├── properties/
│   │   │   ├── components/
│   │   │   ├── server-actions/
│   │   │   └── types/
│   │   ├── bookings/
│   │   └── payments/
│   ├── lib/                      # Utilities
│   │   ├── db.ts                 # Prisma client
│   │   └── utils.ts              # Helper functions
│   └── types/                    # Global TypeScript types
├── public/                       # Static assets
├── tests/                        # E2E tests
│   └── e2e/
├── .env.example                  # Environment variables template
├── .eslintrc.json                # ESLint config
├── .gitignore                    # Git ignore rules
├── next.config.ts                # Next.js config
├── package.json                  # Dependencies
├── prettier.config.js            # Prettier config
├── tailwind.config.ts            # Tailwind config
├── tsconfig.json                 # TypeScript config
└── README.md                     # Project documentation
```

---

## 🗄️ Modelo de Datos (Prisma)

### Core Models

#### User

```prisma
- id: String (cuid)
- clerkId: String (unique)
- email: String (unique)
- role: UserRole (GUEST | HOST | ADMIN)
- properties: Property[]
- bookings: Booking[]
- reviews: Review[]
```

#### Property

```prisma
- id: String (cuid)
- title: String
- city: String
- priceMonthly: Int (céntimos)
- hasWifi: Boolean
- wifiSpeed: Int (Mbps)
- hasDesk: Boolean
- status: PropertyStatus
- owner: User
- bookings: Booking[]
- images: PropertyImage[]
```

#### Booking

```prisma
- id: String (cuid)
- checkInDate: DateTime
- checkOutDate: DateTime
- totalAmount: Int (céntimos)
- status: BookingStatus
- property: Property
- guest: User
- payment: Payment
```

#### Payment

```prisma
- id: String (cuid)
- stripePaymentId: String
- amount: Int (céntimos)
- status: String
- booking: Booking
```

---

## 🔐 Autenticación & Autorización

### Clerk Integration

**Rutas públicas**:

- `/` - Landing
- `/sign-in` - Login
- `/sign-up` - Registro

**Rutas protegidas**:

- `/dashboard` - Dashboard del usuario
- `/properties/*` - Gestión de propiedades
- `/bookings/*` - Reservas
- `/settings` - Configuración

### Roles

```typescript
enum UserRole {
  GUEST,    // Usuario que busca alojamiento
  HOST,     // Anfitrión con propiedades
  ADMIN     // Administrador de la plataforma
}
```

### Authorization Layers

1. **Middleware** (next.js)
    - Pre-flight checks
    - Session validation
    - Route protection

2. **Server Actions**
    - Input validation (Zod)
    - Authorization checks
    - Database queries

3. **API Routes**
    - RESTful endpoints
    - Webhook handlers (Stripe, Clerk)

---

## 🎨 Sistema de Diseño

### Colores (CSS Variables)

```css
:root {
  --primary: 221.2 83.2% 53.3%;      /* Azul principal */
  --secondary: 210 40% 96.1%;         /* Gris claro */
  --accent: 210 40% 96.1%;            /* Acento */
  --destructive: 0 84.2% 60.2%;       /* Rojo de error */
  --muted: 210 40% 96.1%;             /* Texto secundario */
  --border: 214.3 31.8% 91.4%;        /* Bordes */
}
```

### Componentes UI (Shadcn)

- **Button**: 6 variantes (default, destructive, outline, secondary, ghost, link)
- **Card**: Contenedor con Header, Title, Content, Footer
- **Input**: Input accesible con validación
- **Dialog**: Modal system
- **Toast**: Notificaciones
- **Dropdown**: Menús desplegables

### Breakpoints

```javascript
screens: {
  'sm': '640px',
  'md': '768px',
  'lg': '1024px',
  'xl': '1280px',
  '2xl': '1536px',
}
```

---

## 🌍 Internacionalización (i18n)

### Idiomas Soportados

- 🇪🇸 **Español (ES)** - Default
- 🇬🇧 **Inglés (EN)**
- 🇵🇹 **Portugués (PT)**

### Implementación

```typescript
// next.config.ts
i18n: {
  locales: ['en-US', 'es-ES', 'pt-PT'],
  defaultLocale: 'en-US',
}
```

---

## 🔄 Flujos de Usuario

### 1. Flujo de Registro (Guest)

```
Landing → Sign Up → Onboarding → Browse Properties → Book
```

### 2. Flujo de Registro (Host)

```
Landing → Sign Up → Onboarding → Add Property → Verification → Active
```

### 3. Flujo de Reserva

```
Search → Property Detail → Select Dates → Review Booking → 
Payment → Confirmation → Contract
```

### 4. Flujo de Pago

```
Booking → Stripe Checkout → Payment Processing → 
Confirmation Email → Contract Generation
```

---

## 🚀 Performance Optimizations

### Server Components

- Por defecto para todas las páginas
- Data fetching en el servidor
- Zero JS para contenido estático

### Image Optimization

- Next.js Image component
- AVIF y WebP formats
- Lazy loading automático

### Code Splitting

- Automático por route
- Dynamic imports para modales
- Lazy loading de componentes pesados

### Caching Strategy

```typescript
// Static pages
export const revalidate = 3600; // 1 hour

// Dynamic data
export const dynamic = 'force-dynamic';
```

---

## 🧪 Testing Strategy

### Unit Tests (Vitest)

```bash
src/
├── features/
│   └── properties/
│       ├── use-properties.ts
│       └── use-properties.test.ts
```

### Integration Tests

```bash
src/
├── features/
│   └── bookings/
│       ├── create-booking.ts
│       └── create-booking.test.ts
```

### E2E Tests (Playwright)

```bash
tests/
└── e2e/
    ├── auth.spec.ts
    ├── booking-flow.spec.ts
    └── property-creation.spec.ts
```

---

## 📊 Monitoring & Analytics (Próximamente)

- **Error Tracking**: Sentry
- **Analytics**: Vercel Analytics + Posthog
- **Performance**: Vercel Speed Insights
- **Uptime**: Vercel Monitoring

---

## 🔒 Security Best Practices

### Input Validation

```typescript
import { z } from 'zod';

const bookingSchema = z.object({
  propertyId: z.string().cuid(),
  checkInDate: z.date(),
  checkOutDate: z.date(),
});
```

### CSRF Protection

- SameSite cookies
- HTTPS only in production
- Secure headers (next.config.ts)

### Rate Limiting

- API routes con rate limits
- Stripe webhook signature validation
- Clerk webhook verification

### Data Privacy

- GDPR compliance
- Data encryption at rest
- Secure password storage (Clerk)

---

## 📦 Deployment

### Vercel Configuration

**Build Command**: `npm run build`
**Output Directory**: `.next`
**Install Command**: `npm install`

### Environment Variables

```env
# Database
DATABASE_URL=

# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
```

### CI/CD Pipeline (GitHub Actions)

```yaml
name: Deploy
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - Checkout
      - Setup Node
      - Install deps
      - Run tests
      - Type check
      - Lint
      - Build
      - Deploy to Vercel
```

---

## 🎯 Roadmap de Features

### Fase 0: MVP Landing (✅ Completado)

- [x] Landing page profesional
- [x] Formulario de captación
- [x] Sistema de diseño base
- [x] Estructura de proyecto escalable

### Fase 1: Core MVP (En Progreso)

- [ ] Autenticación con Clerk
- [ ] CRUD de propiedades
- [ ] Sistema de búsqueda y filtros
- [ ] Sistema de reservas
- [ ] Integración con Stripe Connect
- [ ] Panel de administración básico

### Fase 2: Features Avanzadas

- [ ] Sistema de mensajería
- [ ] Reviews y ratings
- [ ] Calendario de disponibilidad
- [ ] Generación de contratos
- [ ] Multi-idioma completo
- [ ] Mobile app (React Native)

### Fase 3: Escalabilidad

- [ ] B2B features (empresas)
- [ ] API pública
- [ ] Webhooks para integraciones
- [ ] Analytics avanzados
- [ ] A/B testing platform

---

## 📞 Soporte Técnico

**Contacto**: dev@inhabitme.com
**Documentation**: https://docs.inhabitme.com
**Status Page**: https://status.inhabitme.com

---

**Última actualización**: Diciembre 2025
**Versión**: 0.1.0
**Mantenido por**: Team inhabitme
