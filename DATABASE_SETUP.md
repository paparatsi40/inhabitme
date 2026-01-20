# 💾 Base de Datos - Configuración Completa

## ✅ Lo que ya está hecho:

1. ✅ Prisma instalado y configurado
2. ✅ Schema completo con 8 modelos
3. ✅ Cliente de Prisma generado
4. ✅ Configuración para Supabase

---

## 🔧 LO QUE NECESITAS HACER AHORA:

### **Paso 1: Actualizar `.env.local` con tu contraseña de Supabase**

Abre `.env.local` y reemplaza `[YOUR-PASSWORD]` con tu contraseña real de Supabase:

```env
# ANTES:
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.agjntynuysvwgzlcdmiq.supabase.co:5432/postgres"

# DESPUÉS (ejemplo):
DATABASE_URL="postgresql://postgres:TU_CONTRASEÑA_REAL@db.agjntynuysvwgzlcdmiq.supabase.co:5432/postgres"
```

**¿Dónde encontrar tu contraseña?**

- Dashboard de Supabase → Settings → Database
- O usa la que guardaste cuando creaste el proyecto

---

### **Paso 2: Crear las tablas en Supabase**

Una vez actualizaste el `.env.local`, ejecuta:

```bash
npx prisma db push
```

Esto creará todas las tablas en tu base de datos de Supabase.

---

### **Paso 3: (Opcional) Agregar datos de prueba**

Para tener datos iniciales, puedes ejecutar el seed:

```bash
npx prisma db seed
```

---

## 📊 Modelos Creados (8 tablas):

### **1. User**

- Sincronizado con Clerk
- Roles: GUEST, HOST, BOTH, ADMIN
- Relaciones con Properties, Bookings, Reviews

### **2. Property**

- Información completa del alojamiento
- Workspace amenities (wifi speed, desk, monitor)
- Pricing y availability
- Status: DRAFT, PENDING_REVIEW, ACTIVE, INACTIVE

### **3. PropertyImage**

- Múltiples fotos por propiedad
- Orden y caption
- isMain para foto principal

### **4. Booking**

- Gestión de reservas
- Fechas, precios, depósitos
- Status: PENDING, CONFIRMED, ACTIVE, COMPLETED, CANCELLED

### **5. Payment**

- Integración con Stripe
- Tipos: DEPOSIT, MONTHLY_RENT, REFUND
- Tracking de transacciones

### **6. Review**

- Sistema de ratings 1-5
- Comentarios de huéspedes
- Ligado a bookings

### **7. Availability**

- Calendario de disponibilidad
- Por propiedad y fecha

### **8. Message**

- Sistema de mensajería guest-host
- Relacionado con bookings

---

## 🎯 Después de crear las tablas:

Podrás implementar:

1. **CRUD de Propiedades** → Hosts pueden publicar alojamientos
2. **Búsqueda** → Guests pueden buscar por ciudad, precio, fechas
3. **Sistema de Reservas** → Flow completo de booking
4. **Pagos con Stripe** → Procesamiento de pagos
5. **Reviews** → Sistema de reputación

---

## 🔍 Ver tus datos en Supabase:

1. Ve a: https://supabase.com/dashboard
2. Selecciona tu proyecto
3. Menú lateral → **Table Editor**
4. Verás todas las tablas creadas

---

## ⚡ Comandos útiles:

```bash
# Ver el estado de tu database
npx prisma db pull

# Ver tus datos en navegador
npx prisma studio

# Regenerar cliente tras cambios en schema
npx prisma generate

# Crear las tablas (lo que necesitas hacer ahora)
npx prisma db push
```

---

## 🚨 Si hay errores:

### Error: "Can't reach database server"

→ Verifica que la contraseña en `.env.local` sea correcta

### Error: "Connection pool timeout"

→ Ve a Supabase → Settings → Database → Connection pooling
→ Usa la "Connection pooling" URL en vez de la directa

### Error: "SSL connection required"

→ Agrega `?sslmode=require` al final de tu DATABASE_URL

---

## ✨ Estado actual:

```
✅ Prisma configurado
✅ Schema definido (8 modelos)
✅ Cliente generado
⏳ Falta: Actualizar .env.local con tu contraseña
⏳ Falta: Ejecutar `npx prisma db push`
```

---

**Una vez completes estos pasos, estarás listo para crear propiedades y reservas reales!** 🚀