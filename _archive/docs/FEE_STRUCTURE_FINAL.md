# 💰 inhabitme - Estructura de Fees FINAL

## 🎯 Modelo de Negocio Definitivo

**inhabitme es un matchmaker de bookings completos**

A diferencia del modelo inicial de "pago por lead" (€15), ahora inhabitme facilita bookings completos con fees transparentes y fijos.

---

## 💶 Fees Actuales

### **1. Fee del GUEST (Solicitante/Inquilino)**

**€89** - Pago único cuando el host acepta la solicitud

#### ¿Cuándo paga?
- ✅ Guest envía solicitud → Host acepta
- ✅ Host paga su fee (si no es Founding Host)
- ✅ Guest recibe email: "Host aceptó! Paga €89 para recibir contacto"
- ✅ Guest paga €89 vía Stripe Checkout
- ✅ Contactos liberados

#### ¿Qué incluye?
- ✅ Match confirmado con el host
- ✅ Contacto directo (email + teléfono)
- ✅ Coordinación fuera de la plataforma
- ✅ Sin comisiones adicionales

#### ¿Por qué €89?
- 🟢 **Transparente** - Flat fee, no % que crece con el precio
- 🟢 **Justo** - Menor que agencias (€200-500)
- 🟢 **No intimida** - Accesible para estancias medianas/largas
- 🟢 **Compromiso** - Filtra solicitudes no serias

---

### **2. Fee del HOST (Propietario)**

**€50** - Host regular  
**€80** - Si tiene Featured Listing activo  
**€0** - Founding Host 2026 ✨

#### ¿Cuándo paga?
- ✅ Guest solicita booking
- ✅ Host hace click "Aceptar"
- 🔒 **Host paga €50 ANTES de confirmar aceptación** (si es regular)
- ✅ Founding Host acepta gratis (benefit exclusivo)
- ✅ Después de pagar → Aceptación confirmada
- ✅ Guest recibe email para pagar €89

#### ¿Qué incluye?
- ✅ Match confirmado con guest serio
- ✅ Guest ya comprometido (va a pagar €89)
- ✅ Contacto directo después de ambos pagos
- ✅ Sin comisiones adicionales

#### ¿Por qué €50/€80/€0?
- 🟢 **€50**: Fee justo para hosts regulares (match de calidad)
- 🟢 **€80**: Hosts con Featured pagan más (mayor visibilidad = más leads)
- 🟢 **€0**: Founding Host 2026 - Benefit exclusivo (incentivo early adopters)

---

## 🔄 Flujo Completo de Pagos

```
1. Guest solicita booking
   └─> inhabitme registra solicitud
   
2. Host recibe email: "Nueva solicitud de reserva"
   
3. Host hace click "Aceptar"
   └─> Si es Founding Host:
       ✅ Acepta gratis
       ✅ Aceptación confirmada
   └─> Si es Host Regular:
       🔒 Redirect a Stripe para pagar €50 (o €80 si Featured)
       ✅ Después de pagar → Aceptación confirmada

4. Guest recibe email: "¡Host aceptó! Paga €89 para recibir contacto"

5. Guest paga €89 vía Stripe Checkout

6. inhabitme libera contactos a AMBOS:
   ✅ Guest recibe: Email + teléfono del host
   ✅ Host recibe: Email + teléfono del guest

7. Guest y Host coordinan directamente
   └─> Renta, depósito, contrato → Todo fuera de inhabitme
   └─> Meses 2-3 → Pago directo al host
```

---

## 💰 ¿Qué NO Cobra inhabitme?

### inhabitme NO maneja:
- ❌ **Renta mensual** (€1000-€2000) → Guest paga directo al host
- ❌ **Depósito** (€1000+) → Guest paga directo al host
- ❌ **Meses adicionales** → Guest paga directo al host
- ❌ **Contratos** → Guest y host firman fuera de plataforma
- ❌ **Servicios** (luz, agua) → No participamos
- ❌ **Daños** → No participamos

**inhabitme solo cobra el servicio de matchmaking:**
- ✅ Guest: €89
- ✅ Host: €50 (o €0 si es Founding Host)

---

## 🎁 Founding Host 2026 Benefits

### Founding Host (Primeros 10 hosts en 2026):

#### Fees:
- ✅ **€0 por booking** (vs €50 para hosts regulares)
- ✅ **Acepta solicitudes gratis** durante todo 2026
- ✅ **Ahorro real: €50 × N bookings** (ejemplo: 10 bookings = €500 ahorrados)

#### Otros Benefits:
- ✅ **Featured Listing gratis** (vs €30/mes)
- ✅ **Badge "Founding Host 2026"** (visibilidad)
- ✅ **Prioridad en búsquedas** (algoritmo favorece)
- ✅ **Acceso anticipado** a nuevas features

#### Valor Total:
```
€0 fee por booking × 10 bookings = €500
Featured gratis × 12 meses = €360
Total ahorro: ~€860 en 2026
```

**Incentivo para early adopters muy fuerte** 🌟

---

## 📊 Comparación con Competencia

### Airbnb:
- 💰 **Host fee**: 3% (~€30-60 por mes)
- 💰 **Guest fee**: 14-16% (~€140-320 por mes)
- 💰 **Total mes 1**: €170-380
- 💰 **Total 3 meses**: €510-1140 ❌

### inhabitme:
- 💰 **Host fee**: €50 (o €0 Founding)
- 💰 **Guest fee**: €89
- 💰 **Total mes 1**: €139 (o €89 Founding)
- 💰 **Total 3 meses**: €139 (o €89 Founding) ✅

**inhabitme es 4-8x más barato** que Airbnb para estancias medianas/largas 🎯

---

## 🔮 Modelo Antiguo vs Actual

### ❌ Modelo Antiguo (Descartado):

**"Pago por Lead" - €15**

#### Flujo:
```
Guest paga €15 → Recibe email del host → Contacta → Negocia
```

#### Por qué lo descartamos:
- ⚠️ **Leads fríos**: Guest podía pagar y no hacer nada
- ⚠️ **Baja conversión**: Host recibía contactos no serios
- ⚠️ **Revenue limitado**: €15 × leads (bajo ticket)
- ⚠️ **Experiencia pobre**: No había commitment bilateral

---

### ✅ Modelo Actual (Implementado):

**"Booking Completo" - €89 guest + €50 host**

#### Flujo:
```
Guest solicita → Host acepta (paga €50) → Guest paga €89 → Contactos liberados
```

#### Por qué es mejor:
- ✅ **Commitment bilateral**: Ambos pagan = ambos serios
- ✅ **Alta conversión**: Solo requests serios llegan al host
- ✅ **Mejor revenue**: €139 × booking (vs €15 × lead)
- ✅ **Experiencia premium**: Match de calidad garantizado
- ✅ **Win-win-win**: Guest, Host, inhabitme todos ganan

---

## 📈 Proyección de Revenue (Ejemplo)

### Escenario Conservador (Año 1):

```
50 propiedades activas
× 2 bookings/propiedad/año = 100 bookings

100 bookings × €139 promedio* = €13,900/año
(*€89 guest + €50 host regular, asumiendo 50% Founding Host)

Costos:
- Stripe fees (3%): ~€417
- Hosting/servicios: ~€2,000
= Revenue neto: ~€11,500
```

### Escenario Medio (Año 1):

```
200 propiedades activas
× 4 bookings/propiedad/año = 800 bookings

800 bookings × €139 = €111,200/año

Costos:
- Stripe fees (3%): ~€3,336
- Hosting/servicios: ~€5,000
= Revenue neto: ~€102,864
```

### Escenario Optimista (Año 1):

```
500 propiedades activas
× 6 bookings/propiedad/año = 3,000 bookings

3,000 bookings × €139 = €417,000/año

Costos:
- Stripe fees (3%): ~€12,510
- Hosting/servicios: ~€10,000
- Team (1 part-time): ~€20,000
= Revenue neto: ~€374,490
```

**inhabitme tiene potencial de ser un negocio rentable desde Año 1** 🚀

---

## 🎯 FAQ - Fees

### ¿Por qué ambos pagan?

**Garantiza seriedad bilateral:**
- Guest que paga €89 → Está comprometido
- Host que paga €50 → Está comprometido
- = Match de calidad alta

### ¿Por qué no solo cobrar al guest?

**El host también recibe valor:**
- ✅ Solo recibe solicitudes serias (guest ya pagó)
- ✅ Ahorra tiempo (no pierde tiempo con curiosos)
- ✅ Conversión más alta (guest comprometido)

### ¿Por qué no % del alquiler?

**Ventajas del flat fee:**
- ✅ **Transparente**: Siempre sabes cuánto pagas
- ✅ **Justo**: No crece con el precio del alquiler
- ✅ **Predecible**: Budget claro desde inicio
- ✅ **Menos conflictos**: No hay que auditar pagos

### ¿Qué pasa si el guest cancela antes de pagar?

**No hay problema:**
- Guest no pierde nada (no ha pagado aún)
- Host solo perdió €50 (si pagó), pero puede aceptar otro
- inhabitme no devuelve fees (servicio de match fue prestado)

### ¿inhabitme devuelve fees si no se concreta el alquiler?

**NO**, porque:
- ✅ inhabitme cumplió: Conectó guest serio con host serio
- ✅ Si no se concreta después es por motivos externos
- ✅ Host y guest ya pueden negociar directamente
- ✅ Nuestro servicio de matchmaking ya fue prestado

**Análogo a**: Una agencia de citas cobra aunque la relación no funcione después.

---

## 🔐 Legal & Compliance

### inhabitme es un **Marketplace**, NO:
- ❌ Agencia inmobiliaria (no gestionamos contratos)
- ❌ Plataforma de pagos (solo matchmaking)
- ❌ Gestor de propiedades (no administramos)

### inhabitme SÍ es:
- ✅ **Marketplace de contactos** (como LinkedIn Premium)
- ✅ **Servicio de matchmaking** (conectamos personas)
- ✅ **Facilitador** (simplificamos la búsqueda)

### Por lo tanto:
- ✅ **No necesitamos licencia inmobiliaria**
- ✅ **No manejamos depósitos/rentas**
- ✅ **No somos parte de contratos**
- ✅ **Riesgo legal mínimo**

---

## ✅ Resumen Ejecutivo

### inhabitme cobra:
- **Guest**: €89 (matchmaking fee)
- **Host Regular**: €50 (matchmaking fee)
- **Host Featured**: €80 (matchmaking fee + visibilidad)
- **Founding Host 2026**: €0 (benefit exclusivo)

### inhabitme NO cobra:
- ❌ Renta mensual
- ❌ Depósito
- ❌ Comisiones adicionales
- ❌ % sobre alquiler

### Valor diferencial:
- ✅ Flat fee transparente (vs % comisión)
- ✅ 4-8x más barato que Airbnb
- ✅ Matchmaking de calidad (commitment bilateral)
- ✅ Sin intermediarios en renta/depósito
- ✅ Founding Host program (incentivo early adopters)

---

**🎉 Modelo de fees competitivo, justo y escalable** ✨
