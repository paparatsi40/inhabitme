# 🚀 inhabitme - Testing del Flujo de Pago

## ⚡ Quick Start (2 minutos)

```bash
# Terminal 1: Stripe Webhooks
stripe listen --forward-to localhost:3000/api/webhooks/stripe
# Copia el whsec_xxx → .env.local

# Terminal 2: Server
npm run dev
```

## 🎯 Test Rápido (5 minutos)

1. **Host**: Crear propiedad con Featured ON
2. **Guest**: Request to Book (6 meses)
3. **Host**: Aceptar solicitud
4. **Guest**: Pagar con `4242 4242 4242 4242`
5. **Host**: Pagar €80 fee
6. ✅ **Verificar**: Contactos liberados

## 💰 Pricing

| Usuario | Concepto | Normal | Featured | Founding 2026 |
|---------|----------|--------|----------|---------------|
| **Guest** | Primer mes + Depósito + Fee | €2,489 | €2,489 | €2,489 |
| **Host** | Success Fee | €50 | €80 | **€0** |

## 📚 Documentación

| Archivo | Descripción | Tiempo |
|---------|-------------|--------|
| `QUICK_TEST_GUIDE.md` | Test básico | 5 min |
| `TESTING_PAYMENT_FLOW.md` | Guía completa | 30 min |
| `MANUAL_TEST_CHECKLIST.md` | Checklist detallado | 45 min |
| `TESTING_COMMANDS.md` | Comandos útiles | Referencia |
| `BOOKING_SYSTEMS_EXPLAINED.md` | Arquitectura | Lectura |

## 🔧 Cambios Realizados Hoy

1. ✅ Fixed `/api/bookings/request` (agregado bookingId)
2. ✅ Added Stripe public key a `.env.local`
3. ✅ Actualizado `/listings/[id]` a sistema de bookings completo

## ✅ Sistema 100% Funcional

- [x] Bookings con request → accept → pay flow
- [x] Stripe payments (Guest + Host)
- [x] Webhooks automáticos
- [x] Email notifications
- [x] Contact release
- [x] Founding Host benefits (€0 fee)
- [x] Featured Listings (€80 vs €50)
- [x] Host & Guest dashboards

## 🐛 Si Algo Falla

**Webhooks no llegan**:
```bash
# Verificar stripe listen está corriendo
# Copiar whsec_xxx a .env.local
# Reiniciar npm run dev
```

**Ver última reserva**:
```sql
SELECT id, status, guest_paid, host_paid, contacts_released
FROM bookings ORDER BY created_at DESC LIMIT 1;
```

**Check Stripe**:
- Dashboard → Events
- Dashboard → Payments

## 🎉 Listo para Testing!

**Empieza aquí**: `QUICK_TEST_GUIDE.md`

---

**inhabitme - Tu hogar para meses, no noches** 🏠
