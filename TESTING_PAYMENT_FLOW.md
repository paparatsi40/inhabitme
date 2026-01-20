# 🧪 Guía de Testing - Flujo de Pago Complete

## 📋 Resumen del Flujo Complete

inhabitme implementa un flujo de reserva de 2 pasos:
1. **Guest paga primero** → Primer mes + Depósito + Fee (€89)
2. **Host paga después** → Success fee (€50 o €80 Featured, €0 Founding Host 2026)
3. **Contactos liberados** → Ambos reciben información de contacto

---

## 🔧 Setup Previo (5 minutos)

### 1. Variables de Entorno
Verifica que `.env.local` tenga todas las claves necesarias:

```bash
# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
CLERK_WEBHOOK_SECRET=whsec_...

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://...
SUPABASE_SERVICE_ROLE_KEY=...

# Email
RESEND_API_KEY=re_...
EMAIL_FROM=InhabitMe <noreply@mail.inhabitme.com>
```

### 2. Webhooks en Local (Desarrollo)

#### Stripe Webhook (Terminal 1)
```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

Copia el **webhook signing secret** que aparece y actualiza `.env.local`:
```
STRIPE_WEBHOOK_SECRET=whsec_...
```

#### Clerk Webhook (Terminal 2)
```bash
# Ya configurado en Clerk Dashboard
# Endpoint: https://your-domain.com/api/webhooks/clerk
```

### 3. Iniciar Servidor (Terminal 3)
```bash
npm run dev
```

---

## 🎯 Test Case 1: Flujo Normal (Host Regular + Featured)

### Paso 1: Crear Usuarios de Test

**Usuario 1 - Guest (Inquilino)**
- Email: `test-guest@example.com`
- Rol: Guest

**Usuario 2 - Host (Propietario)**
- Email: `test-host@example.com`
- Rol: Host (no Founding Host)

### Paso 2: Host Crea una Propiedad

1. Login como **Host** (`test-host@example.com`)
2. Ir a Dashboard → "Create Property"
3. Crear propiedad con:
   - Título: "Test Property - Featured"
   - Precio mensual: €1,200
   - Depósito: €1,200
   - **Featured: ACTIVADO** ⭐

### Paso 3: Guest Solicita Reserva

1. Login como **Guest** (`test-guest@example.com`)
2. Buscar la propiedad en `/search`
3. Click en "Book Now"
4. Llenar formulario:
   - Check-in: 2026-02-01
   - Check-out: 2026-08-01 (6 meses)
   - Mensaje: "Hola, me interesa tu propiedad"
5. Submit

**✅ Resultado Esperado:**
- Booking creado con status: `pending_host_approval`
- Email enviado al Host (revisar logs)
- Guest redirigido a `/bookings/[id]`

### Paso 4: Host Acepta la Solicitud

1. Login como **Host**
2. Ir a `/en/host/bookings` (Dashboard de Host)
3. Click en la solicitud pendiente
4. Click "Accept"
5. Mensaje opcional: "Bienvenido! Te espero"

**✅ Resultado Esperado:**
- Status cambia a: `pending_guest_payment`
- Email enviado al Guest: "¡Tu Solicitud fue Aceptada!"
- Guest puede ver botón de pago

### Paso 5: Guest Completa el Pago

1. Login como **Guest**
2. Ir a `/en/bookings/[id]`
3. Ver desglose:
   - Primer mes: €1,200.00
   - Depósito: €1,200.00
   - inhabitme fee: €89.00
   - **TOTAL: €2,489.00**
4. Click "Pagar €2,489.00"
5. Redirigido a Stripe Checkout
6. Usar tarjeta de test: `4242 4242 4242 4242`
7. Completar pago

**✅ Resultado Esperado:**
- Webhook recibido: `checkout.session.completed`
- Status cambia a: `pending_host_payment`
- Email enviado al Host: "💰 Nuevo pago recibido"
- Campos actualizados:
  - `guest_paid: true`
  - `guest_paid_at: timestamp`
  - `guest_payment_intent: pi_xxx`

### Paso 6: Host Paga su Fee

1. Login como **Host**
2. Email recibido con link "Pagar Fee y Confirmar"
3. O ir a `/en/host/bookings/[id]`
4. Ver fee: **€80.00** (Featured property)
5. Click "Pagar Success Fee"
6. Stripe Checkout abre
7. Pagar con tarjeta de test

**✅ Resultado Esperado:**
- Webhook recibido: `payment_intent.succeeded` (con type: host_payment)
- Status cambia a: `confirmed`
- `host_paid: true`
- `contacts_released: true`
- Emails enviados a **ambos** con información de contacto

### Paso 7: Verificar Liberación de Contactos

**Guest ve:**
- Status: "¡Reserva Confirmada!"
- Email del Host visible
- Teléfono del Host (si disponible)

**Host ve:**
- Status: "Pago Confirmado"
- Email del Guest visible
- Teléfono del Guest (si disponible)
- Monto que recibirá: €2,329.00
  - Cálculo: €2,489 (guest paid) - €89 (guest fee) - €80 (host fee) = €2,320

---

## 🎯 Test Case 2: Founding Host 2026 (Fee = €0)

### Setup: Host con Founding Host Badge

1. Crear **Usuario Host Founding**
2. En Clerk Dashboard:
   - User → Metadata → Public Metadata:
   ```json
   {
     "role": "founding_host",
     "founding_host_year": 2026
   }
   ```

### Featured Gratis para Founding Host

1. Login como Founding Host
2. Ir a Dashboard → Properties
3. **Toggle Featured** en cualquier propiedad
4. ✅ Sin costo adicional (Featured es gratis en 2026)

### Flujo de Booking (Founding Host)

Seguir Pasos 1-5 del Test Case 1 (hasta que Guest paga)

**Paso 6 Modificado: Host NO Paga Fee**

1. Login como **Founding Host**
2. Ir a `/en/host/bookings/[id]`
3. Click "Confirmar Reserva"
4. ✅ **No redirect a Stripe** (fee = €0)
5. Booking confirmado automáticamente

**✅ Resultado Esperado:**
- Status: `confirmed`
- `host_paid: true`
- `host_payment_amount: 0`
- `contacts_released: true`
- Badge en emails: "🌟 Founding Host 2026"
- Host recibe: €2,400 (sin fee de €80)

---

## 🎯 Test Case 3: Host Rechaza la Solicitud

### Paso 1-3: Igual que Test Case 1

### Paso 4: Host Rechaza

1. Login como **Host**
2. Ir a `/en/host/bookings`
3. Click en solicitud pendiente
4. Click "Reject"
5. Razón: "Fechas no disponibles, disculpa"

**✅ Resultado Esperado:**
- Status: `cancelled`
- Email enviado al Guest con mensaje del host
- No se cobra nada a nadie
- Guest puede buscar otras propiedades

---

## 🧪 Tarjetas de Test de Stripe

```
# Pago exitoso
4242 4242 4242 4242

# Pago rechazado (insufficient funds)
4000 0000 0000 9995

# Autenticación 3D Secure requerida
4000 0027 6000 3184

# Expira: Cualquier fecha futura
CVV: Cualquier 3 dígitos
```

---

## 🔍 Debugging Checklist

### Si el pago no procesa:

1. **Verificar Webhooks**
   ```bash
   # Stripe webhook escuchando?
   stripe listen --forward-to localhost:3000/api/webhooks/stripe
   ```

2. **Logs de Servidor**
   - Buscar: "Webhook error" o "Checkout creation error"
   - Verificar que `STRIPE_WEBHOOK_SECRET` coincida

3. **Verificar en Stripe Dashboard**
   - Events → Ver webhooks recibidos
   - Payments → Ver transacciones

4. **Base de Datos (Supabase)**
   ```sql
   SELECT id, status, guest_paid, host_paid, contacts_released
   FROM bookings
   WHERE id = 'xxx';
   ```

### Si los emails no llegan:

1. Verificar Resend Dashboard
2. Check logs: `console.log('Would send email')`
3. Verificar `EMAIL_FROM` en `.env.local`

---

## 📊 Estados de Booking

```
pending_host_approval → Host debe responder
pending_guest_payment → Guest debe pagar
pending_host_payment → Host debe pagar fee
confirmed → Todo pagado, contactos liberados
cancelled → Rechazado o cancelado
```

---

## 💰 Cálculos de Pricing

### Ejemplo: Propiedad €1,200/mes, 6 meses, Featured

**Guest paga (Paso 5):**
- Primer mes: €1,200
- Depósito: €1,200
- inhabitme fee: €89
- **Total Guest:** €2,489

**Host paga (Paso 6):**
- Success fee: €80 (Featured) o €50 (Normal)
- **Total Host:** €80

**Host recibe (después):**
- Transferencia: €2,489 - €89 - €80 = **€2,320**

**Founding Host 2026:**
- Fee: **€0**
- Host recibe: €2,489 - €89 = **€2,400**

---

## ✅ Success Criteria

El flujo está completo cuando:

✅ Guest puede solicitar reserva  
✅ Host puede aceptar/rechazar  
✅ Guest puede pagar via Stripe  
✅ Host puede pagar su fee (o skip si Founding Host)  
✅ Contactos se liberan automáticamente  
✅ Emails se envían en cada paso  
✅ Status se actualiza correctamente  
✅ Featured listings tienen fee correcto (€80 vs €50)  
✅ Founding Host 2026 → fee = €0  

---

## 🚀 Testing en Producción

### Webhooks en Producción

1. **Stripe Webhook**
   - Stripe Dashboard → Webhooks
   - Add endpoint: `https://your-domain.com/api/webhooks/stripe`
   - Events: `checkout.session.completed`, `payment_intent.succeeded`
   - Copiar signing secret → Vercel env var

2. **Clerk Webhook**
   - Clerk Dashboard → Webhooks
   - Add endpoint: `https://your-domain.com/api/webhooks/clerk`
   - Events: `user.created`, `user.updated`
   - Copiar signing secret → Vercel env var

---

## 📞 Support

Si encuentras bugs durante el testing:
- Check Stripe Dashboard → Logs
- Check Supabase → Table Editor → `bookings`
- Check Resend Dashboard → Email logs
- Check Terminal → Server console logs

---

**Happy Testing! 🎉**
