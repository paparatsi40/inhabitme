# 💰 Sistema de Monetización - Pago por Lead

## 🎯 Modelo de Negocio

**inhabitme NO cobra comisiones por reserva.**  
**inhabitme cobra por desbloquear el contacto del anfitrión.**

### Por qué este modelo es ideal para MVP:

✅ **Validación rápida** - Sabes si hay demanda real  
✅ **Ingreso desde día 1** - No necesitas volumen de reservas  
✅ **Simple técnicamente** - Un solo pago, no calendarios ni contratos  
✅ **Legal y claro** - Solo conectamos personas  
✅ **Escalable** - Funciona con 10 o 10,000 propiedades  

---

## 💶 Precio del Lead

**€15 pago único** por contacto directo con el anfitrión

### Qué obtiene el guest:
- ✅ Email del anfitrión
- ✅ Capacidad de coordinar directamente (visita, fechas, contrato)
- ✅ Sin intermediarios en la negociación final

### Por qué €15:
- 🟢 **No es frívolo** - Filtra curiosos, solo gente seria paga
- 🟢 **Es accesible** - No es una barrera para quien realmente busca
- 🟢 **Es justo** - Menor que una comisión de agencia (€50-100)
- 🟢 **Es recurrente** - Guests buscan varias opciones (3-5 leads promedio)

---

## 🔄 Flujo Completo

```
1. Guest ve propiedad
   ↓
2. Click "Contactar al Anfitrión" (€15)
   ↓
3. Redirige a Stripe Checkout
   ↓
4. Paga con tarjeta (Stripe)
   ↓
5. Success → Muestra email del host
   ↓
6. Guest contacta host directamente
   ↓
7. Negocian y cierran sin inhabitme
```

### inhabitme NO participa en:
- ❌ Contratos de alquiler
- ❌ Pagos mensuales
- ❌ Depósitos
- ❌ Inspecciones
- ❌ Disputas

**= Modelo marketplace puro, riesgo mínimo**

---

## 🛠️ Implementación Técnica

### Archivos Creados:

```
src/
├── app/
│   ├── properties/[id]/page.tsx         (CTA "Contactar" añadido)
│   ├── api/leads/
│   │   ├── create-checkout/route.ts     (Stripe Checkout Session)
│   │   └── verify-payment/route.ts      (Verifica pago + retorna email)
│   └── leads/
│       └── success/page.tsx             (Página post-pago con email)
```

### Flujo de Datos:

```typescript
// 1. Usuario hace click en "Contactar"
POST /api/leads/create-checkout
{
  propertyId: "abc123",
  propertyTitle: "Apartamento...",
  propertyCity: "Madrid"
}

// 2. API crea Stripe Session
stripe.checkout.sessions.create({
  mode: 'payment',
  line_items: [{ amount: 1500 }],  // €15.00
  success_url: '/leads/success?session_id={ID}&property_id=abc123',
  metadata: { propertyId: 'abc123' }
})

// 3. Stripe redirige a success_url
// 4. Página success verifica pago
GET /api/leads/verify-payment?session_id=cs_xxx&property_id=abc123

// 5. API verifica sesión de Stripe
stripe.checkout.sessions.retrieve(sessionId)
// → payment_status: 'paid'

// 6. API busca property en Supabase
SELECT owner_id FROM listings WHERE id = 'abc123'

// 7. API retorna email del host
{ success: true, hostEmail: "host@example.com" }

// 8. Frontend muestra email + plantilla + próximos pasos
```

---

## 💳 Configuración de Stripe

### Variables de Entorno Necesarias:

```env
# Ya configuradas:
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...

# Opcional (webhooks):
STRIPE_WEBHOOK_SECRET=whsec_...
```

### Producto en Stripe:

**Nombre**: Contacto con Anfitrión  
**Descripción**: Desbloquea el email del anfitrión para coordinar directamente tu estancia  
**Precio**: €15.00 (one-time payment)  
**Tipo**: Digital product  

### Modo Test:

Usa tarjetas de prueba de Stripe:
- ✅ Éxito: `4242 4242 4242 4242`
- ❌ Fallo: `4000 0000 0000 0002`
- Fecha: Cualquiera futura
- CVC: Cualquier 3 dígitos

---

## 📊 Proyección de Ingresos (Ejemplo)

### Escenario Conservador:

```
100 propiedades activas
× 5 vistas por propiedad/mes = 500 vistas
× 10% lead conversion = 50 leads/mes
× €15 por lead = €750/mes

Año 1: ~€9,000 revenue
```

### Escenario Medio:

```
500 propiedades activas
× 10 vistas por propiedad/mes = 5,000 vistas
× 15% lead conversion = 750 leads/mes
× €15 por lead = €11,250/mes

Año 1: ~€135,000 revenue
```

### Escenario Optimista:

```
2,000 propiedades activas
× 20 vistas por propiedad/mes = 40,000 vistas
× 20% lead conversion = 8,000 leads/mes
× €15 por lead = €120,000/mes

Año 1: ~€1.4M revenue
```

**Nota**: Estos son ingresos BRUTOS. Costos incluyen Stripe fees (~3%), hosting, etc.

---

## 🧪 Testing del Flujo

### Test Manual:

1. **Ve a propiedad**: `http://localhost:3000/properties/[id]`
2. **Click "Contactar al Anfitrión"**
3. **Verifica**:
   - ✅ Redirige a Stripe Checkout
   - ✅ Muestra precio €15.00
   - ✅ Descripción de producto correcta
4. **Paga con tarjeta test**: `4242 4242 4242 4242`
5. **Verifica**:
   - ✅ Redirige a `/leads/success`
   - ✅ Muestra email del host
   - ✅ Muestra plantilla de email
   - ✅ Botones funcionan

### Test de Cancelación:

1. En Stripe Checkout, click "Back"
2. **Verifica**:
   - ✅ Vuelve a `/properties/[id]?canceled=true`
   - ✅ Usuario puede intentar de nuevo

---

## 📈 Métricas a Trackear

### KPIs Principales:

| Métrica | Qué mide | Target |
|---------|----------|--------|
| **Lead conversion rate** | % de vistas que pagan | 10-20% |
| **Average leads per guest** | Cuántos leads compra cada uno | 2-4 |
| **Property view to lead** | Tiempo desde ver hasta pagar | <5 min |
| **Email open rate** | % hosts que abren email guest | 60-80% |
| **Final booking rate** | % leads que cierran alquiler | 20-40% |

### Revenue Metrics:

- **MRR**: Leads vendidos × €15
- **CAC**: Costo adquisición cliente (guest)
- **LTV**: Lifetime value (cuántos leads compra)
- **Profit margin**: ~65% (después de Stripe fees + hosting)

---

## 🔐 Seguridad y Legal

### Protección de Datos:

✅ **Email del host protegido** - Solo visible después de pagar  
✅ **Stripe maneja PCI** - No tocamos tarjetas  
✅ **No guardamos info sensible** - Solo referencias  
✅ **GDPR compliant** - Usuario paga por obtener dato público  

### Términos Legales Importantes:

⚖️ **inhabitme es un marketplace** - Solo conectamos personas  
⚖️ **No somos agencia** - No gestionamos contratos  
⚖️ **No somos parte del alquiler** - Relación directa guest-host  
⚖️ **Pago por lead es legal** - Equivalente a "publicar anuncio"  

**Recomendación**: Actualizar Términos y Condiciones para dejar claro que:
- El pago es por contacto, no por reserva
- inhabitme no garantiza disponibilidad final
- Contratos se negocian fuera de la plataforma

---

## 🚀 Próximos Pasos (Post-MVP)

### Fase 2 - Mejorar Conversión:
1. **Dashboard para hosts** con leads recibidos
2. **Email automático al host** cuando llega lead
3. **Tracking de respuesta** (host respondió en <24h?)
4. **Reviews de hosts** (¿respondió? ¿fue útil?)

### Fase 3 - Escalar:
1. **Suscripciones para hosts** (€29/mes propiedades ilimitadas)
2. **Featured listings** (+€10/mes destacar propiedad)
3. **Modelo híbrido**: Lead + comisión opcional si cierran

### Fase 4 - Bookings Completos (solo si hay tracción):
1. Integrar calendario de disponibilidad
2. Sistema de reservas completo
3. Pagos mensuales gestionados
4. Contratos digitales

**Pero primero: Validar que el modelo de leads funciona** ✅

---

## ✅ Checklist de Implementación

- ✅ CTA "Contactar al Anfitrión" en detalle de propiedad
- ✅ API `/api/leads/create-checkout` (Stripe Session)
- ✅ API `/api/leads/verify-payment` (Verifica + retorna email)
- ✅ Página `/leads/success` con email del host
- ✅ Página cancel/error handling
- ✅ Logging completo para debugging
- ✅ Variables de entorno configuradas
- ⏳ Tabla `property_leads` en Supabase (opcional pero recomendado)
- ⏳ Email automático al host (próxima iteración)

---

**🎉 Sistema de monetización listo para generar revenue desde día 1**
