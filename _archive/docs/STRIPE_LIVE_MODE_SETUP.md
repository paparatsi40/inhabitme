# 🚀 Stripe Live Mode Setup - inhabitme

## ⚠️ IMPORTANTE: Diferencias entre Test y Live Mode

### **Test Mode (Desarrollo):**
- ✅ Tarjetas de prueba (`4242 4242 4242 4242`)
- ✅ No se procesan pagos reales
- ✅ Keys empiezan con `sk_test_*` y `pk_test_*`
- ✅ Webhook secret empieza con `whsec_*` (test)

### **Live Mode (Producción):**
- 💳 **Tarjetas REALES** de clientes
- 💰 **Pagos REALES** procesados
- 🔑 Keys empiezan con `sk_live_*` y `pk_live_*`
- 🔒 Webhook secret empieza con `whsec_*` (diferente)

---

## 📋 **Checklist Completo - Cambio a Live Mode**

### **1. Activar Stripe Account (Si no lo has hecho)**

1. Ve a: `https://dashboard.stripe.com`
2. Completa la información de tu negocio:
   - ✅ Información legal de la empresa
   - ✅ Información bancaria (para recibir pagos)
   - ✅ Verificación de identidad
   - ✅ Información fiscal

⚠️ **Stripe puede requerir documentación adicional dependiendo del país**

---

### **2. Obtener Live API Keys**

1. **Ve a Stripe Dashboard**
2. **Cambia a "Live mode"** (toggle arriba a la derecha debe estar en ROJO 🔴)
3. **Ve a:** `Developers → API Keys`
4. **Copia las keys:**

```
Secret key (empezará con sk_live_...)
→ Guardar como STRIPE_SECRET_KEY

Publishable key (empezará con pk_live_...)
→ Guardar como NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
```

⚠️ **NUNCA compartas la Secret Key públicamente**

---

### **3. Crear Webhook en Live Mode**

1. **Asegúrate de estar en Live mode** 🔴
2. **Ve a:** `Developers → Webhooks`
3. **Click:** "Add endpoint"
4. **Configurar:**

```
Endpoint URL: https://inhabitme.com/api/webhooks/stripe-bookings

Description: inhabitme Bookings Payment Automation

Listen to: Events on your account

Select events to listen to:
✅ checkout.session.completed
✅ payment_intent.succeeded  
✅ payment_intent.payment_failed
```

5. **Click:** "Add endpoint"
6. **Click en el webhook creado**
7. **Click:** "Reveal" en "Signing secret"
8. **Copiar el secret** (empieza con `whsec_...`)

```
→ Guardar como STRIPE_WEBHOOK_SECRET
```

---

### **4. Configurar Variables en Vercel/Hosting**

#### **Si usas Vercel:**

1. **Ve a:** `https://vercel.com/dashboard`
2. **Selecciona tu proyecto:** inhabitme
3. **Ve a:** Settings → Environment Variables
4. **Agregar TODAS estas variables:**

```env
STRIPE_SECRET_KEY=sk_live_xxxxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx (el de LIVE mode)
```

5. **Click:** "Save"
6. **Redeploy** el proyecto

#### **Si usas otro hosting:**

Configura las mismas variables en el panel de tu hosting.

---

### **5. Verificar Webhook en Producción**

**Después del deploy:**

1. **Ve a Stripe Dashboard → Webhooks**
2. **Click en tu webhook**
3. **Verifica:**
   - ✅ Status: Enabled
   - ✅ URL correcta
   - ✅ Events correctos

4. **Testing del Webhook:**
   - Click en "Send test webhook"
   - Selecciona `checkout.session.completed`
   - Click "Send test webhook"
   - Verifica en tus logs que se recibió

---

## 🧪 **Testing en Producción (Con Pagos Reales)**

⚠️ **IMPORTANTE**: En live mode usarás tarjetas REALES

### **Opción A: Crear un Booking de Prueba**

1. **Crear una propiedad** en producción
2. **Solicitar booking** con tu propia cuenta
3. **Usar una tarjeta real** con un monto pequeño
4. **Verificar:**
   - ✅ Pago procesado correctamente
   - ✅ Webhook recibido
   - ✅ Booking actualizado
   - ✅ Emails enviados

5. **Luego puedes:**
   - Reembolsar el pago desde Stripe Dashboard
   - O dejarlo como prueba exitosa

### **Opción B: Usar Stripe Test Cards en Producción (NO recomendado)**

❌ **NO funciona** - Las test cards solo funcionan en test mode

---

## 📊 **Monitorear Pagos en Live Mode**

### **Dashboard de Stripe:**

1. **Payments:** Ver todos los pagos procesados
2. **Customers:** Ver información de clientes
3. **Webhooks → [tu webhook]:** Ver eventos recibidos
4. **Logs:** Debugging de problemas

### **En inhabitme:**

1. **Dashboard Admin:** Ver todos los bookings
2. **Email notifications:** Confirmar que se envían
3. **Base de datos:** Verificar estados correctos

---

## 💰 **Fees de Stripe en Live Mode**

### **Costos que Stripe cobra:**

**Europa:**
- 1.5% + €0.25 por transacción exitosa
- Sin fee mensual
- Sin fee de setup

**Ejemplo:**
- Guest paga €89 → Stripe cobra €1.58
- inhabitme recibe: €87.42

- Host paga €50 → Stripe cobra €1.00
- inhabitme recibe: €49.00

**Total neto por booking:** ~€136.42

---

## 🔒 **Seguridad en Live Mode**

### **Mejores Prácticas:**

1. ✅ **NUNCA** expongas las secret keys en el frontend
2. ✅ **Siempre** verifica la firma del webhook
3. ✅ **Usa HTTPS** en producción (obligatorio)
4. ✅ **Rotar keys** periódicamente
5. ✅ **Monitor de fraude** activado en Stripe
6. ✅ **Alertas** configuradas para pagos fallidos

### **Webhook Signature Verification:**

El código ya lo hace automáticamente:

```typescript
const sig = headers().get('stripe-signature')
const event = stripe.webhooks.constructEvent(
  body, 
  sig, 
  process.env.STRIPE_WEBHOOK_SECRET
)
// ✅ Si la firma no coincide, lanza error
```

---

## ⚠️ **CHECKLIST FINAL ANTES DE LIVE**

### **Configuración:**
- [ ] Stripe account activado completamente
- [ ] Información bancaria verificada
- [ ] Live API keys obtenidas
- [ ] Webhook en live mode creado
- [ ] Variables de entorno actualizadas en producción
- [ ] Proyecto redeployado

### **Testing:**
- [ ] Webhook responde correctamente
- [ ] Pagos se procesan (prueba con pago real pequeño)
- [ ] Emails se envían correctamente
- [ ] Base de datos se actualiza
- [ ] Contactos se liberan automáticamente

### **Monitoreo:**
- [ ] Alertas configuradas en Stripe
- [ ] Logs de errores monitoreados
- [ ] Email de admin recibiendo notificaciones

---

## 🎯 **Diferencias Clave: Test vs Live**

| Aspecto | Test Mode | Live Mode |
|---------|-----------|-----------|
| **Pagos** | Simulados | Reales 💰 |
| **Tarjetas** | 4242... | Tarjetas reales |
| **Secret Key** | sk_test_* | sk_live_* |
| **Publishable** | pk_test_* | pk_live_* |
| **Webhook Secret** | whsec_* (test) | whsec_* (diferente) |
| **Fees** | No se cobran | Stripe cobra fees |
| **Dashboard** | Modo Test 🟢 | Modo Live 🔴 |

---

## 🚨 **IMPORTANTE: Nunca Mezclar**

❌ **NUNCA uses:**
- Test keys en producción
- Live keys en desarrollo
- Webhook secret de test en producción
- Webhook secret de live en desarrollo

✅ **SIEMPRE:**
- Test keys → `.env.local` (desarrollo)
- Live keys → Variables de entorno del hosting (producción)
- Git ignora archivos .env (seguridad)

---

## 🎉 **Una Vez Configurado:**

inhabitme procesará **pagos reales** automáticamente:

1. ✅ Guest paga €89 → Stripe procesa → Dinero a tu cuenta
2. ✅ Host paga €50/€80 → Stripe procesa → Dinero a tu cuenta
3. ✅ Webhook actualiza booking → Automático
4. ✅ Emails con contactos → Automático
5. ✅ Todo sin intervención manual 🚀

---

## 📞 **Soporte:**

**Si tienes problemas:**

1. **Stripe Support:** `https://support.stripe.com`
2. **Webhook logs:** Dashboard → Webhooks → [tu webhook] → Logs
3. **Test mode primero:** Siempre prueba en test antes de live

---

## ✅ **Ready for Live Mode**

Con esta configuración, **inhabitme procesará pagos reales** de forma segura y automática.

**¡Buena suerte con el lanzamiento!** 🚀💰
