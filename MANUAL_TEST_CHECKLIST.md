# ✅ Manual Test Checklist - inhabitme Payment Flow

## 📋 Pre-Testing Setup

- [ ] `.env.local` tiene todas las variables configuradas
- [ ] Stripe CLI instalado (`stripe --version` funciona)
- [ ] Dos cuentas de test (Guest y Host) creadas en Clerk
- [ ] Base de datos Supabase accesible

---

## 🧪 TEST 1: Flujo Normal - Host Regular con Featured

### Setup
- [ ] Terminal 1: `stripe listen --forward-to localhost:3000/api/webhooks/stripe` corriendo
- [ ] Terminal 2: `npm run dev` corriendo
- [ ] Copiar `whsec_xxx` de Stripe CLI → `.env.local` → restart server

### 1️⃣ Host Crea Propiedad Featured

**Login como Host:**
- [ ] Ir a `/en/dashboard`
- [ ] Click "Properties" o "Manage Properties"
- [ ] Click "Create New Property"
- [ ] Llenar:
  - [ ] Título: "Test Featured Property"
  - [ ] Precio mensual: 1200
  - [ ] Depósito: 1200
  - [ ] Descripción, fotos, etc.
  - [ ] **Featured: ON** ⭐
- [ ] Submit
- [ ] ✅ Propiedad visible en dashboard
- [ ] ✅ Badge "⭐ Featured" visible

### 2️⃣ Guest Solicita Reserva

**Login como Guest (diferente cuenta):**
- [ ] Ir a `/en/search`
- [ ] Buscar la propiedad creada
- [ ] ✅ Badge "⭐ Featured" visible
- [ ] ✅ Aparece primera en resultados
- [ ] Click en la propiedad
- [ ] Click "Book Now" o "Request to Book"
- [ ] Llenar formulario:
  - [ ] Check-in: 2026-02-01
  - [ ] Check-out: 2026-08-01 (6 meses)
  - [ ] Mensaje: "Hola, me interesa mucho tu propiedad"
- [ ] Ver cálculo automático:
  - [ ] Duración: 6 meses
  - [ ] Primer mes: €1,200
  - [ ] Depósito: €1,200
  - [ ] inhabitme fee: €89
  - [ ] **Total: €2,489**
- [ ] Click "Enviar solicitud"
- [ ] ✅ Redirigido a `/en/bookings/[id]`
- [ ] ✅ Status: "Esperando Respuesta del Host"

**Verificar DB (Supabase):**
```sql
SELECT id, status, guest_id, host_id, featured_used, host_fee
FROM bookings
ORDER BY created_at DESC
LIMIT 1;
```
- [ ] `status` = `pending_host_approval`
- [ ] `featured_used` = `true`
- [ ] `host_fee` = `8000` (€80 en centavos)

### 3️⃣ Host Acepta la Solicitud

**Login como Host:**
- [ ] Ir a `/en/host/bookings`
- [ ] ✅ Solicitud pendiente visible
- [ ] Click en la solicitud
- [ ] Ver detalles:
  - [ ] Fechas correctas
  - [ ] Mensaje del guest visible
  - [ ] Fee a pagar: €80 (Featured)
- [ ] Click "Accept" o "Aceptar"
- [ ] Mensaje opcional: "Bienvenido!"
- [ ] Submit
- [ ] ✅ Status actualizado

**Verificar DB:**
- [ ] `status` = `pending_guest_payment`
- [ ] `host_response` tiene el mensaje

**Verificar Email (check logs o Resend):**
- [ ] Email enviado al Guest
- [ ] Subject: "¡Tu Solicitud fue Aceptada!"
- [ ] Botón "Completar Pago" presente

### 4️⃣ Guest Completa el Pago

**Login como Guest:**
- [ ] Ir a `/en/bookings/[id]` (o click email)
- [ ] ✅ Status: "¡El Host Aceptó!"
- [ ] ✅ Botón de pago visible: "Pagar €2,489.00"
- [ ] Ver desglose:
  - [ ] Primer mes: €1,200.00
  - [ ] Depósito: €1,200.00
  - [ ] inhabitme fee: €89.00
  - [ ] Total: €2,489.00
- [ ] Click "Pagar €2,489.00"
- [ ] ✅ Redirigido a Stripe Checkout
- [ ] Llenar formulario Stripe:
  - [ ] Email: tu email de test
  - [ ] Tarjeta: `4242 4242 4242 4242`
  - [ ] Fecha: cualquier futura (12/30)
  - [ ] CVV: 123
  - [ ] Nombre: Test Guest
- [ ] Click "Pay"
- [ ] ✅ Pago procesado
- [ ] ✅ Redirigido a success page

**Verificar Webhook (Terminal 1):**
```
[200] POST /api/webhooks/stripe [evt_xxx]
Event: checkout.session.completed
```
- [ ] Webhook recibido sin errores
- [ ] Status code: 200

**Verificar DB:**
```sql
SELECT id, status, guest_paid, guest_payment_intent, host_paid
FROM bookings
WHERE id = 'xxx';
```
- [ ] `status` = `pending_host_payment`
- [ ] `guest_paid` = `true`
- [ ] `guest_paid_at` tiene timestamp
- [ ] `guest_payment_intent` = `pi_xxx`
- [ ] `guest_payment_amount` = `248900` (€2,489)

**Verificar Email al Host:**
- [ ] Subject: "💰 Nuevo pago recibido"
- [ ] Fee: €80.00
- [ ] Botón "Pagar Fee y Confirmar"

### 5️⃣ Host Paga Success Fee

**Login como Host:**
- [ ] Ir a `/en/host/bookings/[id]` (o click email)
- [ ] ✅ Status: "Pago Recibido - Esperando tu confirmación"
- [ ] Ver fee:
  - [ ] inhabitme Success Fee: **€80.00**
  - [ ] (Featured listing bonus)
- [ ] Ver monto que recibirá:
  - [ ] Recibirás: **€2,320.00**
  - [ ] Cálculo: €2,489 - €89 - €80
- [ ] Click "Pagar Success Fee"
- [ ] ✅ Redirigido a Stripe Checkout
- [ ] Completar pago:
  - [ ] Tarjeta: `4242 4242 4242 4242`
  - [ ] Submit
- [ ] ✅ Pago procesado

**Verificar Webhook (Terminal 1):**
```
[200] POST /api/webhooks/stripe [evt_xxx]
Event: payment_intent.succeeded
Metadata: type=host_payment
```
- [ ] Webhook recibido
- [ ] Metadata tiene `type: host_payment`

**Verificar DB:**
```sql
SELECT id, status, guest_paid, host_paid, contacts_released
FROM bookings
WHERE id = 'xxx';
```
- [ ] `status` = `confirmed`
- [ ] `host_paid` = `true`
- [ ] `host_paid_at` tiene timestamp
- [ ] `host_payment_intent` = `pi_xxx`
- [ ] `host_payment_amount` = `8000` (€80)
- [ ] `contacts_released` = `true`
- [ ] `contacts_released_at` tiene timestamp

### 6️⃣ Verificar Liberación de Contactos

**Login como Guest:**
- [ ] Ir a `/en/bookings/[id]`
- [ ] ✅ Status: "¡Reserva Confirmada!"
- [ ] ✅ Email del Host visible
- [ ] ✅ Teléfono del Host visible (si disponible)
- [ ] ✅ Banner verde con información de contacto

**Login como Host:**
- [ ] Ir a `/en/host/bookings/[id]`
- [ ] ✅ Status: "Pago Confirmado"
- [ ] ✅ Email del Guest visible
- [ ] ✅ Teléfono del Guest visible (si disponible)
- [ ] ✅ Monto a recibir: €2,320.00

**Verificar Emails:**
- [ ] Email al Guest:
  - [ ] Subject: "🎉 ¡Reserva Confirmada!"
  - [ ] Contacto del host visible
  - [ ] Detalles de la reserva
  - [ ] Próximos pasos
- [ ] Email al Host:
  - [ ] Subject: "💰 Pago Confirmado - Nueva Reserva"
  - [ ] Contacto del guest visible
  - [ ] Monto a recibir: €2,320.00
  - [ ] Plazo: 1-3 días hábiles

---

## 🌟 TEST 2: Founding Host 2026 (Fee = €0)

### Setup Founding Host

**Clerk Dashboard:**
- [ ] Users → Select host account
- [ ] Metadata → Public Metadata
- [ ] Add JSON:
```json
{
  "role": "founding_host",
  "founding_host_year": 2026
}
```
- [ ] Save

**Verificar Badge:**
- [ ] Login como Founding Host
- [ ] Dashboard tiene badge "🌟 Founding Host 2026"
- [ ] Featured toggle disponible (gratis)

### Flujo Modificado

**Pasos 1-4: Igual que TEST 1**
- [ ] Propiedad creada con Featured
- [ ] Guest solicita
- [ ] Host acepta
- [ ] Guest paga €2,489

**Paso 5 Modificado: Host NO Paga**

**Login como Founding Host:**
- [ ] Ir a `/en/host/bookings/[id]`
- [ ] ✅ Status: "Pago Recibido"
- [ ] ✅ **NO hay botón de pago** (fee = €0)
- [ ] ✅ Botón: "Confirmar Reserva" (gratis)
- [ ] Click "Confirmar Reserva"
- [ ] ✅ Confirmado sin pago
- [ ] ✅ Redirigido a página de confirmación

**Verificar DB:**
```sql
SELECT id, status, host_paid, host_payment_amount, contacts_released
FROM bookings
WHERE id = 'xxx';
```
- [ ] `status` = `confirmed`
- [ ] `host_paid` = `true`
- [ ] `host_payment_amount` = `0` (sin fee!)
- [ ] `contacts_released` = `true`

**Verificar Emails:**
- [ ] Badge "🌟 Founding Host 2026" en emails
- [ ] Host recibe: €2,400 (sin fee de €80)
- [ ] Cálculo: €2,489 - €89 = €2,400

---

## 🚫 TEST 3: Host Rechaza Solicitud

### Flujo

**Pasos 1-2: Igual que TEST 1**
- [ ] Propiedad creada
- [ ] Guest solicita reserva

**Paso 3 Modificado: Host Rechaza**

**Login como Host:**
- [ ] Ir a `/en/host/bookings`
- [ ] Click en solicitud pendiente
- [ ] Click "Reject" o "Rechazar"
- [ ] Razón: "Fechas no disponibles"
- [ ] Submit
- [ ] ✅ Status actualizado

**Verificar DB:**
- [ ] `status` = `cancelled`
- [ ] `cancelled_by` = host user ID
- [ ] `cancelled_at` tiene timestamp
- [ ] `cancellation_reason` = "Fechas no disponibles"

**Verificar Email al Guest:**
- [ ] Subject: "Actualización sobre tu Solicitud"
- [ ] Mensaje del host visible
- [ ] Sugerencias para buscar otras propiedades
- [ ] Botón "Ver Otras Propiedades"

**Login como Guest:**
- [ ] Ir a `/en/bookings/[id]`
- [ ] ✅ Status: "Reserva Cancelada"
- [ ] ✅ Razón del host visible
- [ ] ✅ **No se cobró nada**

---

## 🔍 Verificación Stripe Dashboard

**Ir a Stripe Dashboard → Payments:**
- [ ] 2 pagos visibles (1 guest, 1 host)
- [ ] Pago Guest:
  - [ ] Amount: €2,489.00
  - [ ] Status: Succeeded
  - [ ] Metadata: `booking_id`, `guest_id`, `type: guest_payment`
- [ ] Pago Host:
  - [ ] Amount: €80.00 (o €0 si Founding)
  - [ ] Status: Succeeded
  - [ ] Metadata: `booking_id`, `host_id`, `type: host_payment`

**Events:**
- [ ] `checkout.session.completed` (guest)
- [ ] `payment_intent.succeeded` (guest)
- [ ] `checkout.session.completed` (host) - si aplica
- [ ] `payment_intent.succeeded` (host) - si aplica

---

## 📊 Verificación Final de Precios

### Guest siempre paga:
- [ ] Primer mes: €1,200
- [ ] Depósito: €1,200
- [ ] inhabitme fee: €89
- [ ] **Total Guest: €2,489**

### Host Regular (Featured):
- [ ] Fee: €80
- [ ] Recibe: €2,489 - €89 - €80 = **€2,320**

### Founding Host 2026:
- [ ] Fee: €0
- [ ] Recibe: €2,489 - €89 = **€2,400**

---

## ✅ Success Criteria - All Tests

- [ ] ✅ Guest puede solicitar reserva
- [ ] ✅ Host puede aceptar solicitud
- [ ] ✅ Host puede rechazar solicitud
- [ ] ✅ Guest puede pagar primer pago
- [ ] ✅ Webhooks recibidos correctamente
- [ ] ✅ Status actualizados en DB
- [ ] ✅ Host puede pagar success fee
- [ ] ✅ Founding Host NO paga fee
- [ ] ✅ Contactos liberados automáticamente
- [ ] ✅ Emails enviados en cada paso
- [ ] ✅ Featured listings: €80 fee
- [ ] ✅ Normal listings: €50 fee (probar también)
- [ ] ✅ Founding Host: €0 fee
- [ ] ✅ Cálculos correctos de montos

---

## 🐛 Debugging Checklist

Si algo falla, verificar:

**Webhooks:**
- [ ] `stripe listen` corriendo en Terminal 1
- [ ] `STRIPE_WEBHOOK_SECRET` actualizado en `.env.local`
- [ ] Server reiniciado después de cambiar `.env.local`
- [ ] Terminal muestra `[200] POST /api/webhooks/stripe`

**Base de Datos:**
- [ ] Supabase está online
- [ ] Credentials correctas en `.env.local`
- [ ] Tablas `bookings`, `listings` existen
- [ ] RLS policies permiten las operaciones

**Emails:**
- [ ] Resend API key válida
- [ ] EMAIL_FROM configurado
- [ ] Check Resend Dashboard → Logs

**Stripe:**
- [ ] Test mode activado
- [ ] API keys correctas (test keys)
- [ ] Webhooks registrados en Stripe Dashboard

---

## 📝 Notas Finales

- Todos los montos en **euros (EUR)**
- Fechas en formato ISO: `YYYY-MM-DD`
- Duración mínima: **1 mes**
- Guest fee: **€89** (fijo)
- Host fee Normal: **€50**
- Host fee Featured: **€80**
- Host fee Founding 2026: **€0**

---

**Testing Completo! 🎉**

Si todos los checkboxes están marcados, el sistema está **100% funcional** y listo para producción.
