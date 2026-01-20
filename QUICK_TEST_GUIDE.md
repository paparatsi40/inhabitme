# ⚡ Quick Test Guide - Payment Flow

## 🚀 Setup Rápido (2 minutos)

### 1. Verificar `.env.local` tiene todas las claves
```bash
✓ NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
✓ STRIPE_SECRET_KEY  
✓ STRIPE_WEBHOOK_SECRET
✓ NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
✓ CLERK_SECRET_KEY
✓ SUPABASE_SERVICE_ROLE_KEY
✓ RESEND_API_KEY
```

### 2. Iniciar Stripe Webhook Listener (Terminal 1)
```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```
Copia el `whsec_xxx` y actualízalo en `.env.local`

### 3. Iniciar Servidor (Terminal 2)
```bash
npm run dev
```

---

## 🎯 Test Rápido del Flujo Completo (5 minutos)

### Escenario: Guest renta propiedad Featured de Host Regular

**PASO 1: Login como Host**
- Email: Tu cuenta de test como Host
- Dashboard → Properties → Create new property
- Activa **Featured** ⭐

**PASO 2: Login como Guest** (diferente cuenta)
- Busca la propiedad en `/search`
- Click "Book Now"
- Fechas: 2026-02-01 a 2026-08-01 (6 meses)
- Submit booking request

**PASO 3: Host Acepta** (cambiar cuenta)
- Ve a `/en/host/bookings`
- Click "Accept" en la solicitud

**PASO 4: Guest Paga**
- Email recibido con botón "Completar Pago"
- O ir a `/en/bookings/[id]`
- Click "Pagar €X,XXX.XX"
- Stripe Checkout: `4242 4242 4242 4242`
- Completar pago

✅ **Webhook recibido** → Status = `pending_host_payment`

**PASO 5: Host Paga Success Fee**
- Ve a `/en/host/bookings/[id]`
- Click "Pagar Success Fee" (€80 Featured)
- Stripe: `4242 4242 4242 4242`
- Completar

✅ **Webhook recibido** → Status = `confirmed`
✅ **Emails enviados** con contactos a ambos

---

## 🌟 Test Founding Host (3 minutos)

**Setup Host como Founding Host:**
1. Clerk Dashboard → Users
2. Select host user → Metadata → Public Metadata
3. Add:
```json
{
  "role": "founding_host",
  "founding_host_year": 2026
}
```

**Flujo:**
1. Repetir PASO 1-4 (hasta que Guest paga)
2. **PASO 5 Modificado:**
   - Host NO paga fee (€0)
   - Booking confirmado automáticamente
   - Contactos liberados sin pago de host

✅ Badge "Founding Host 2026" en dashboard

---

## ⚠️ Debugging Rápido

### Webhooks no llegan
```bash
# Terminal debe mostrar:
stripe > Ready! You are using Stripe API Version [...]
stripe > Listening for events on your account...
```

### Pago no procesa
1. Check `stripe listen` está corriendo
2. Verificar `STRIPE_WEBHOOK_SECRET` coincide
3. Stripe Dashboard → Events → Ver último webhook

### Emails no envían
- Resend Dashboard → Logs
- Verificar `EMAIL_FROM` en `.env.local`

### Base de datos
```sql
-- Supabase SQL Editor
SELECT id, status, guest_paid, host_paid, contacts_released
FROM bookings
ORDER BY created_at DESC
LIMIT 10;
```

---

## 📊 Estados Esperados

```
1. pending_host_approval  → Host debe responder
2. pending_guest_payment  → Guest debe pagar  
3. pending_host_payment   → Host debe pagar (o skip si Founding)
4. confirmed              → ✅ Completo, contactos liberados
```

---

## 💰 Precios del Sistema

### Guest siempre paga:
- Primer mes: Precio de la propiedad
- Depósito: Reembolsable al final
- **inhabitme fee: €89** (fijo)

### Host paga:
- **€50**: Propiedad Normal
- **€80**: Propiedad Featured ⭐
- **€0**: Founding Host 2026 🌟

### Featured Listings:
- Toggle en Dashboard de propiedades
- **Featured gratis** para Founding Host 2026
- Badge "⭐ Featured" en resultados de búsqueda
- Aparecen primero en listados

---

## 🧪 Tarjetas de Test

```
✅ Pago exitoso:         4242 4242 4242 4242
❌ Rechazo:              4000 0000 0000 9995  
🔐 3D Secure:            4000 0027 6000 3184
```

---

## ✅ Success Checklist

- [ ] Guest puede enviar booking request
- [ ] Host puede aceptar/rechazar
- [ ] Guest puede pagar via Stripe
- [ ] Webhook `checkout.session.completed` actualiza DB
- [ ] Host puede pagar su fee (o skip si Founding)
- [ ] Webhook `payment_intent.succeeded` confirma booking
- [ ] Emails enviados en cada paso
- [ ] Contactos liberados al final
- [ ] Featured listings: €80 vs €50
- [ ] Founding Host 2026: fee = €0

---

## 🚨 Si algo falla

1. **Check Terminal logs** (ambos)
2. **Stripe Dashboard** → Events
3. **Supabase** → Table Editor → `bookings`
4. **Resend Dashboard** → Logs
5. Reiniciar `stripe listen` y `npm run dev`

---

**¡Listo para Testing! 🎉**

Para más detalles, ver: `TESTING_PAYMENT_FLOW.md`
