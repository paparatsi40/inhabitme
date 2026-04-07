# 🔔 Configuración de Stripe Webhook

## ✅ Implementación Completada

He creado el **webhook handler completo** que automatiza todo el flujo de pagos de inhabitme.

---

## 🎯 ¿Qué Hace el Webhook?

### **Cuando el GUEST paga (€89):**
1. ✅ Marca el booking como `confirmed`
2. ✅ Actualiza `guest_payment_status` a `paid`
3. ✅ **Libera contactos** a ambas partes automáticamente
4. ✅ Envía email al guest con contacto del host
5. ✅ Envía email al host con contacto del guest

### **Cuando el HOST paga (€50/€80):**
1. ✅ Marca `host_payment_status` como `paid`
2. ✅ Cambia booking a `pending_guest_payment`
3. ✅ **Envía email al guest** para que pague €89

---

## 🛠️ Configuración Necesaria

### **PASO 1: Obtener el Webhook Secret de Stripe**

#### **Para Testing Local (ahora):**

```bash
# Terminal 1: Servidor Next.js
npm run dev

# Terminal 2: Stripe CLI
stripe listen --forward-to localhost:3000/api/webhooks/stripe-bookings
```

Stripe CLI te dará un **webhook secret** que empieza con `whsec_...`

#### **Para Producción (después):**

1. Ve a [Stripe Dashboard → Webhooks](https://dashboard.stripe.com/webhooks)
2. Click "Add endpoint"
3. URL: `https://tudominio.com/api/webhooks/stripe-bookings`
4. Eventos a escuchar:
   - `checkout.session.completed`
   - `checkout.session.expired`
5. Copia el **Signing secret**

---

### **PASO 2: Agregar a `.env.local`**

```env
# Stripe Webhook
STRIPE_WEBHOOK_SECRET=whsec_... # El secret que obtuviste
```

---

### **PASO 3: Reiniciar Servidor**

```bash
Ctrl+C
npm run dev
```

---

## 🧪 Testing del Webhook

### **Test 1: Pago del Host**

1. Como guest → Hacer solicitud
2. Como host → Aceptar (pagar €50)
3. ✅ Webhook detecta pago del host
4. ✅ Guest recibe email para pagar
5. ✅ Booking en estado `pending_guest_payment`

**Verifica en terminal:**
```
🔔 Stripe webhook event: checkout.session.completed
✅ Host payment completed
✅ Guest notified to complete payment
```

---

### **Test 2: Pago del Guest**

1. Como guest → Ir al booking y pagar €89
2. ✅ Webhook detecta pago del guest
3. ✅ Booking cambia a `confirmed`
4. ✅ **Ambos reciben emails con contactos**

**Verifica en terminal:**
```
🔔 Stripe webhook event: checkout.session.completed
✅ Guest payment completed
✅ Contacts released to both parties
✅ Contacts email sent to guest: alfaengineer@gmail.com
✅ Contacts email sent to host: alfaroc@live.com
```

---

## 📊 Estados del Booking (Automatizados)

```
pending_host_approval
    ↓ (Host acepta y paga)
pending_guest_payment (Webhook lo cambia automáticamente)
    ↓ (Guest paga)
confirmed (Webhook libera contactos automáticamente)
```

---

## 🔒 Seguridad

El webhook:
- ✅ Verifica la firma de Stripe (signature verification)
- ✅ Solo acepta requests de Stripe
- ✅ Valida que el booking existe
- ✅ Usa Supabase Service Role Key (full access seguro)

---

## 📧 Emails Automatizados

### **Email 1: Guest Payment Reminder**
**Cuando:** Host paga y acepta  
**Para:** Guest  
**Contenido:**
- "¡Host aceptó!"
- Detalles de la reserva
- Botón "Completar Pago"

### **Email 2: Contacts Released (Guest)**
**Cuando:** Guest paga  
**Para:** Guest  
**Contenido:**
- "¡Reserva confirmada!"
- Contacto del host (email + teléfono)
- Próximos pasos

### **Email 3: Contacts Released (Host)**
**Cuando:** Guest paga  
**Para:** Host  
**Contenido:**
- "¡Reserva confirmada!"
- Contacto del guest (email + teléfono)
- Próximos pasos

---

## ⚡ Beneficios de la Automatización

1. ✅ **Sin intervención manual** - Todo automático
2. ✅ **Instantáneo** - Contactos liberados en segundos
3. ✅ **Confiable** - Stripe maneja la notificación
4. ✅ **Transparente** - Logs completos en terminal
5. ✅ **Escalable** - Funciona con miles de bookings

---

## 🎯 Próximos Pasos

1. **Configura Stripe CLI local** (5 min)
2. **Agrega STRIPE_WEBHOOK_SECRET a .env.local** (1 min)
3. **Reinicia servidor** (30 seg)
4. **Testing completo** (10 min)

---

**El webhook está listo y esperando configuración** 🚀
