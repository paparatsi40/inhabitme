# 🔍 Página de Búsqueda - COMPLETADA

## 🎉 Lo que acabamos de implementar:

### **1. Server Actions** (`src/app/actions/properties.ts`)

- ✅ `searchProperties()` - Buscar con filtros
- ✅ `getPropertyById()` - Obtener detalle de propiedad
- ✅ `getCities()` - Lista de ciudades disponibles

### **2. Página de Búsqueda** (`src/app/search/page.tsx`)

- ✅ Layout completo con navbar
- ✅ Filtros de búsqueda
- ✅ Grid de resultados
- ✅ Empty state cuando no hay resultados

### **3. Componentes**

- ✅ `SearchFilters` - Filtros interactivos (ciudad, precio, habitaciones)
- ✅ `PropertyCard` - Card de propiedad con imagen, precio, amenities
- ✅ `Badge` - Componente UI para etiquetas

### **4. Filtros Implementados**

- Ciudad (dropdown)
- Precio mínimo
- Precio máximo
- Número de habitaciones
- Botón de limpiar filtros

---

## 🎯 Cómo Probar:

### **1. Abre la página de búsqueda:**

```
http://localhost:3000/search
```

### **2. Desde la landing page:**

- Click en "Buscar alojamiento" en el hero
- O desde el navbar: "Buscar"

### **3. Usa los filtros:**

- Selecciona una ciudad
- Establece rango de precios
- Filtra por habitaciones
- Click en "Buscar"

---

## ⚠️ **IMPORTANTE: No hay propiedades aún**

Verás el mensaje "No hay alojamientos disponibles" porque:

- ✅ Las tablas existen en Supabase
- ❌ Pero no hemos insertado propiedades de prueba aún

---

## 🏠 **Para Agregar Propiedades de Prueba:**

### **Opción 1: Desde el Dashboard de Supabase**

1. Ve a: https://supabase.com/dashboard
2. Selecciona tu proyecto
3. Click en "Table Editor"
4. Selecciona la tabla "User"
5. Inserta tu usuario con tu `clerkId`:

```sql
INSERT INTO "User" (id, "clerkId", email, "firstName", "lastName", role)
VALUES (
  gen_random_uuid(),
  'TU_CLERK_ID_AQUI',  -- Lo ves en el dashboard
  'alfaroc@live.com',
  'Carlos',
  NULL,
  'HOST'
);
```

6. Luego en la tabla "Property", inserta una propiedad de prueba:

```sql
INSERT INTO "Property" (
  id, title, description, city, country, address,
  "monthlyPrice", "depositAmount", bedrooms, bathrooms,
  "hasDesk", "wifiSpeed", "wifiVerified", status, "isVerified",
  "hostId", "createdAt", "updatedAt"
)
VALUES (
  gen_random_uuid(),
  'Apartamento Test en Madrid',
  'Apartamento de prueba',
  'Madrid',
  'España',
  'Calle Test 123',
  1400.00,
  1400.00,
  2,
  1,
  true,
  300,
  true,
  'ACTIVE',
  true,
  'EL_ID_DEL_USER_QUE_CREASTE',  -- Copia el id del user
  NOW(),
  NOW()
);
```

### **Opción 2: Usar Prisma Studio** (más fácil)

```bash
npx prisma studio
```

Esto abre un navegador donde puedes:

1. Crear usuarios visualmente
2. Crear propiedades asociadas
3. Ver todas las tablas

---

## 🔍 **Tu clerkId (para insertar usuario):**

Para obtener tu `clerkId`:

1. Ve al dashboard: `http://localhost:3000/dashboard`
2. Abre las Dev Tools del navegador (F12)
3. Ve a la consola
4. Ejecuta:

```javascript
await fetch('/api/user').then(r => r.json())
```

O simplemente ve a: https://dashboard.clerk.com/

- Tus usuarios → Click en tu usuario
- Copia el "User ID"

---

## 📊 **Estado Actual:**

```
✅ Landing page
✅ Authentication (Clerk)
✅ Dashboard
✅ Database (8 tablas en Supabase)
✅ Página de búsqueda con filtros
✅ Server Actions para propiedades
✅ Components (PropertyCard, SearchFilters, Badge)

🚧 Falta:
├─ Agregar propiedades de prueba
├─ Página de detalle (/properties/:id)
├─ Formulario crear propiedad (/properties/new)
└─ Sistema de reservas
```

---

## 🚀 **Próximos Pasos Sugeridos:**

### **A) Crear propiedades de prueba AHORA**

Para ver la búsqueda funcionando con datos reales

### **B) Implementar página de detalle** (`/properties/:id`)

Para ver toda la info de una propiedad + hacer reservas

### **C) Implementar formulario de crear propiedad** (`/properties/new`)

Para que hosts puedan publicar sus alojamientos

---

## 💡 **Script Rápido para Datos de Prueba:**

Crea un archivo `scripts/seed-test.ts`:

```typescript
import { prisma } from '../src/lib/prisma';

async function main() {
  // Primero crea un usuario con tu clerkId
  const user = await prisma.user.create({
    data: {
      clerkId: 'TU_CLERK_ID_AQUI',
      email: 'alfaroc@live.com',
      firstName: 'Carlos',
      role: 'HOST',
    },
  });

  console.log('User created:', user.id);

  // Luego crea una propiedad
  const property = await prisma.property.create({
    data: {
      title: 'Apartamento Moderno en Chamberí',
      description: 'Precioso apartamento con workspace dedicado',
      city: 'Madrid',
      country: 'España',
      address: 'Calle Hartzenbusch 12',
      monthlyPrice: 1400,
      depositAmount: 1400,
      bedrooms: 2,
      bathrooms: 1,
      hasDesk: true,
      wifiSpeed: 300,
      wifiVerified: true,
      status: 'ACTIVE',
      isVerified: true,
      hostId: user.id,
    },
  });

  console.log('Property created:', property.id);
}

main();
```

Ejecuta:

```bash
npx tsx scripts/seed-test.ts
```

---

## ✨ **¡Ya tienes una plataforma funcional!**

Con:

- ✅ Autenticación real
- ✅ Base de datos configurada
- ✅ Búsqueda con filtros
- ✅ UI profesional

**Solo falta agregar propiedades para ver todo funcionando.** 🏠

**¿Qué quieres hacer ahora?**

- A) Agregar propiedades de prueba
- B) Implementar página de detalle
- C) Implementar formulario de crear propiedad