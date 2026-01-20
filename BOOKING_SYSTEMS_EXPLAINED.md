# 🔄 Sistema de Bookings - Antiguo vs Nuevo

## 📊 Resumen

inhabitme tiene **DOS sistemas** diferentes para capturar interés de usuarios:

1. **Sistema ANTIGUO: Leads/Availability** (Pre-booking)
2. **Sistema NUEVO: Bookings** (Reservas completas con pago)

---

## 🔴 Sistema ANTIGUO: Leads/Availability

### Qué es
Un sistema **pre-booking** donde solo capturamos el **interés** del usuario, pero **NO creamos una reserva real**.

### Componentes
```
/components/leads/
├── AvailabilityModal.tsx      ← Modal simple
├── AvailabilityForm.tsx        ← Form básico
├── AvailabilityCTA.tsx         ← Botón de CTA
└── AvailabilitySuccess.tsx     ← Pantalla de éxito
```

### API Endpoint
```
POST /api/leads/create-checkout
```

### Flujo
1. Usuario ve propiedad en `/listings/[id]`
2. Click "Check Availability" o similar
3. Modal aparece pidiendo:
   - Email
   - Fechas deseadas
   - Mensaje opcional
4. Submit → Se guarda como "lead" en base de datos
5. Usuario ve pantalla de éxito
6. **FIN** (no hay pago, no hay booking real)

### Tabla de Base de Datos
```sql
leads
├── id
├── email
├── listing_id
├── check_in
├── check_out
└── message
```

### Limitaciones
❌ No crea booking real  
❌ No integra pagos  
❌ No libera contactos  
❌ No tiene flujo host/guest  
❌ Solo captura interés para seguimiento manual  

### Uso Actual
Este sistema se usaba **antes** cuando inhabitme estaba en fase de validación (waitlist/leads). Ahora está **obsoleto** para el flujo principal.

---

## 🟢 Sistema NUEVO: Bookings (Implementado)

### Qué es
Un sistema **completo de reservas** con flujo de 2 pagos (guest + host), liberación de contactos automática y emails transaccionales.

### Componentes
```
/components/bookings/
└── BookingRequestModal.tsx     ← Modal completo con pricing
```

### API Endpoints
```
POST /api/bookings/request              ← Crear solicitud
POST /api/bookings/[id]/respond         ← Host acepta/rechaza
POST /api/bookings/[id]/create-checkout ← Guest paga
POST /api/bookings/[id]/host-payment    ← Host paga fee
POST /api/webhooks/stripe               ← Procesa pagos
```

### Flujo Completo
1. **Guest solicita** (Request to Book)
   - Fechas: check-in, check-out
   - Mensaje al host
   - Cálculo automático de costos
   - Status: `pending_host_approval`

2. **Host responde**
   - ✅ Acepta → Status: `pending_guest_payment`
   - ❌ Rechaza → Status: `cancelled`

3. **Guest paga** (si aceptado)
   - Primer mes + Depósito + Fee (€89)
   - Stripe Checkout
   - Webhook → Status: `pending_host_payment`

4. **Host paga** success fee
   - €50 (normal) / €80 (featured) / €0 (Founding 2026)
   - Stripe Checkout
   - Webhook → Status: `confirmed`

5. **Contactos liberados**
   - Emails a ambos con datos de contacto
   - Status: `confirmed`
   - `contacts_released: true`

### Tabla de Base de Datos
```sql
bookings
├── id
├── property_id
├── guest_id
├── host_id
├── status                    ← Estados del flujo
├── check_in
├── check_out
├── months_duration
├── monthly_price
├── deposit_amount
├── guest_fee                 ← €89
├── host_fee                  ← €50/€80/€0
├── total_first_payment
├── guest_paid                ← true/false
├── guest_paid_at
├── guest_payment_intent      ← Stripe PI
├── host_paid                 ← true/false
├── host_paid_at
├── host_payment_intent       ← Stripe PI
├── contacts_released         ← true/false
├── contacts_released_at
├── featured_used             ← Si propiedad era Featured
└── ... más campos
```

### Ventajas
✅ Booking completo con pagos  
✅ Flujo bidireccional (host + guest)  
✅ Liberación automática de contactos  
✅ Emails transaccionales en cada paso  
✅ Integración Stripe completa  
✅ Founding Host benefits integrados  
✅ Featured Listings pricing dinámico  

---

## 🔄 Cambio Realizado Hoy

### ANTES (Sistema Antiguo)
```tsx
// ListingDetailClient.tsx
import { AvailabilityModal } from '@/components/leads/AvailabilityModal'

<AvailabilityCTA onClick={() => setOpen(true)} />
<AvailabilityModal open={open} onClose={() => setOpen(false)} listing={listing} />
```

### DESPUÉS (Sistema Nuevo)
```tsx
// ListingDetailClient.tsx
import { BookingRequestModal } from '@/components/bookings/BookingRequestModal'

<Button onClick={() => setOpen(true)}>Request to Book</Button>
<BookingRequestModal isOpen={open} onClose={() => setOpen(false)} property={listing} />
```

---

## 📍 Dónde se Usa Cada Sistema

### Sistema ANTIGUO (Leads) - ⚠️ Descontinuado para flujo principal
- Páginas de ciudad/barrio (solo captura interés)
- Waitlist general
- Landing pages de validación

### Sistema NUEVO (Bookings) - ✅ Activo
- **`/listings/[id]`** ← Actualizado HOY
- **`/search`** ← Cuando implementes
- **`/properties/[id]`** ← Si existe
- Cualquier página donde quieras que usuarios **reserven de verdad**

---

## 🎯 Cuándo Usar Cada Sistema

### Usa el Sistema de LEADS si:
- Solo quieres capturar interés (sin compromiso)
- Estás en fase de validación/MVP
- No quieres procesar pagos todavía
- Quieres hacer seguimiento manual después

### Usa el Sistema de BOOKINGS si:
- Quieres reservas completas con pago
- Tienes propiedades verificadas listas para rentar
- Quieres automatizar el flujo completo
- Quieres liberar contactos automáticamente

---

## 💡 Recomendación

Para **inhabitme en producción**, deberías:

✅ **Usar Bookings** en:
- Páginas de propiedades individuales
- Resultados de búsqueda
- Dashboard de propiedades

⚠️ **Mantener Leads** solo para:
- Waitlist general del sitio
- Páginas de ciudad/barrio (interés general)
- Landing pages de marketing

---

## 🔧 Migración de Leads a Bookings

Si tienes "leads" antiguos que quieres convertir en bookings:

```sql
-- Query para ver leads antiguos
SELECT 
  l.id,
  l.email,
  l.check_in,
  l.check_out,
  l.listing_id,
  l.created_at
FROM leads l
WHERE l.created_at > '2026-01-01'
ORDER BY l.created_at DESC;

-- NO hay migración automática
-- Los leads son solo interés capturado
-- Los bookings requieren autenticación y proceso completo
```

**No hay migración directa** porque:
- Leads no tienen autenticación (solo email)
- Bookings requieren Clerk userId
- Bookings tienen flujo de pago completo
- Son casos de uso diferentes

---

## 📊 Comparación Lado a Lado

| Feature | Leads (Antiguo) | Bookings (Nuevo) |
|---------|----------------|------------------|
| **Autenticación** | ❌ No requerida | ✅ Clerk requerido |
| **Pago Guest** | ❌ No | ✅ Stripe Checkout |
| **Pago Host** | ❌ No | ✅ Success Fee |
| **Contactos** | ❌ Manual | ✅ Auto-liberados |
| **Emails** | ⚠️ Básicos | ✅ Transaccionales |
| **Status Flow** | ❌ No | ✅ 5 estados |
| **Founding Host** | ❌ No | ✅ Benefits integrados |
| **Featured** | ❌ No | ✅ Pricing dinámico |
| **Dashboard Host** | ❌ No | ✅ Completo |
| **Dashboard Guest** | ❌ No | ✅ Completo |

---

## 🚀 Próximos Pasos

1. ✅ **Completado**: Actualizado `/listings/[id]` a Bookings
2. ⏳ **Pendiente**: Actualizar `/search` a Bookings (si usa Leads)
3. ⏳ **Pendiente**: Revisar otras páginas que usen AvailabilityModal
4. ⏳ **Considerar**: Deprecar sistema de Leads completamente
5. ⏳ **Testing**: Probar flujo completo end-to-end

---

## ✅ Conclusión

inhabitme ahora usa el **Sistema de Bookings completo** en la página de listings, lo que significa:

🎉 **Usuarios pueden hacer reservas REALES con pago**  
🎉 **Hosts pueden gestionar solicitudes**  
🎉 **Contactos se liberan automáticamente**  
🎉 **Founding Host benefits funcionan**  
🎉 **Featured Listings pricing correcto**  

El sistema antiguo de "Availability/Leads" queda para casos de uso específicos (waitlist, interés general), pero **NO para reservas reales**.

---

**Sistema actualizado y listo para testing! 🚀**
