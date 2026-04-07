# 🛠️ Testing Commands Reference

## 🚀 Quick Start Commands

### Setup Development Environment
```bash
# Terminal 1 - Stripe Webhooks
stripe listen --forward-to localhost:3000/api/webhooks/stripe

# Terminal 2 - Next.js Server
npm run dev

# Terminal 3 - Optional: Watch logs
tail -f .next/server.log
```

---

## 💾 Database Queries (Supabase SQL Editor)

### Ver últimas reservas
```sql
SELECT 
  id,
  status,
  guest_paid,
  host_paid,
  contacts_released,
  featured_used,
  host_fee / 100.0 as host_fee_euros,
  created_at
FROM bookings
ORDER BY created_at DESC
LIMIT 10;
```

### Ver detalles de una reserva específica
```sql
SELECT 
  b.id,
  b.status,
  b.check_in,
  b.check_out,
  b.months_duration,
  b.monthly_price / 100.0 as monthly_price_euros,
  b.deposit_amount / 100.0 as deposit_euros,
  b.guest_fee / 100.0 as guest_fee_euros,
  b.host_fee / 100.0 as host_fee_euros,
  b.total_first_payment / 100.0 as total_first_payment_euros,
  b.guest_paid,
  b.host_paid,
  b.contacts_released,
  b.featured_used,
  l.title as property_title
FROM bookings b
LEFT JOIN listings l ON b.property_id = l.id
WHERE b.id = 'BOOKING_ID_HERE';
```

### Ver reservas por estado
```sql
SELECT 
  status,
  COUNT(*) as count,
  SUM(total_first_payment) / 100.0 as total_value_euros
FROM bookings
GROUP BY status
ORDER BY count DESC;
```

### Ver propiedades Featured
```sql
SELECT 
  id,
  title,
  featured,
  monthly_price / 100.0 as price_euros,
  host_user_id,
  created_at
FROM listings
WHERE featured = true
ORDER BY created_at DESC;
```

### Reset una reserva para re-testing
```sql
-- CUIDADO: Solo para testing!
UPDATE bookings
SET 
  status = 'pending_host_approval',
  guest_paid = false,
  host_paid = false,
  contacts_released = false,
  guest_paid_at = NULL,
  host_paid_at = NULL,
  guest_payment_intent = NULL,
  host_payment_intent = NULL
WHERE id = 'BOOKING_ID_HERE';
```

### Eliminar reservas de test
```sql
-- CUIDADO: Solo para testing!
DELETE FROM bookings
WHERE guest_email LIKE '%test%'
  OR host_email LIKE '%test%';
```

---

## 🔍 Stripe CLI Commands

### Ver eventos en tiempo real
```bash
stripe listen

# Con filtros
stripe listen --events checkout.session.completed,payment_intent.succeeded
```

### Ver últimos eventos
```bash
stripe events list --limit 10
```

### Ver detalles de un evento específico
```bash
stripe events retrieve evt_XXXXX
```

### Ver pagos recientes
```bash
stripe payment_intents list --limit 10
```

### Ver detalles de un pago
```bash
stripe payment_intents retrieve pi_XXXXX
```

### Reenviar un webhook manualmente
```bash
stripe events resend evt_XXXXX
```

### Ver checkout sessions
```bash
stripe checkout sessions list --limit 10
```

### Trigger webhook de test
```bash
stripe trigger payment_intent.succeeded
stripe trigger checkout.session.completed
```

---

## 📧 Resend API Testing (cURL)

### Ver logs de emails (via API)
```bash
curl -X GET https://api.resend.com/emails \
  -H "Authorization: Bearer YOUR_RESEND_API_KEY"
```

### Enviar email de test
```bash
curl -X POST https://api.resend.com/emails \
  -H "Authorization: Bearer YOUR_RESEND_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "from": "InhabitMe <noreply@mail.inhabitme.com>",
    "to": "your-test@email.com",
    "subject": "Test Email",
    "html": "<h1>Testing</h1>"
  }'
```

---

## 🧪 Test API Endpoints (cURL)

### Create Booking Request
```bash
curl -X POST http://localhost:3000/api/bookings/request \
  -H "Content-Type: application/json" \
  -H "Cookie: YOUR_CLERK_SESSION_COOKIE" \
  -d '{
    "propertyId": "PROPERTY_ID",
    "checkIn": "2026-02-01",
    "checkOut": "2026-08-01",
    "message": "Test booking"
  }'
```

### Host Respond (Accept)
```bash
curl -X POST http://localhost:3000/api/bookings/BOOKING_ID/respond \
  -H "Content-Type: application/json" \
  -H "Cookie: YOUR_CLERK_SESSION_COOKIE" \
  -d '{
    "action": "accept",
    "message": "Welcome!"
  }'
```

### Host Respond (Reject)
```bash
curl -X POST http://localhost:3000/api/bookings/BOOKING_ID/respond \
  -H "Content-Type: application/json" \
  -H "Cookie: YOUR_CLERK_SESSION_COOKIE" \
  -d '{
    "action": "reject",
    "message": "Dates not available"
  }'
```

### Create Guest Checkout
```bash
curl -X POST http://localhost:3000/api/bookings/BOOKING_ID/create-checkout \
  -H "Cookie: YOUR_CLERK_SESSION_COOKIE"
```

### Create Host Payment Checkout
```bash
curl -X POST http://localhost:3000/api/bookings/BOOKING_ID/host-payment \
  -H "Cookie: YOUR_CLERK_SESSION_COOKIE"
```

### Get Booking Details
```bash
curl -X GET http://localhost:3000/api/bookings/BOOKING_ID \
  -H "Cookie: YOUR_CLERK_SESSION_COOKIE"
```

### Toggle Featured
```bash
curl -X POST http://localhost:3000/api/properties/PROPERTY_ID/toggle-featured \
  -H "Cookie: YOUR_CLERK_SESSION_COOKIE"
```

---

## 🔐 Clerk Metadata Update (via API)

### Set user as Founding Host
```bash
curl -X PATCH https://api.clerk.com/v1/users/USER_ID \
  -H "Authorization: Bearer YOUR_CLERK_SECRET_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "public_metadata": {
      "role": "founding_host",
      "founding_host_year": 2026
    }
  }'
```

### Get user metadata
```bash
curl -X GET https://api.clerk.com/v1/users/USER_ID \
  -H "Authorization: Bearer YOUR_CLERK_SECRET_KEY"
```

---

## 🧹 Cleanup Commands

### Clear Next.js cache
```bash
rm -rf .next
npm run dev
```

### Reinstall dependencies
```bash
rm -rf node_modules package-lock.json
npm install
```

### Clear Stripe webhook events (local)
```bash
# Just restart the stripe listen command
# Ctrl+C then restart:
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

---

## 📊 Monitoring Commands

### Watch server logs in real-time
```bash
# On Windows (PowerShell)
Get-Content .next/server.log -Wait -Tail 50

# On Mac/Linux
tail -f .next/server.log
```

### Watch Stripe events in real-time
```bash
stripe listen --print-json | jq '.'
```

### Monitor Supabase real-time changes
```sql
-- In Supabase SQL Editor
LISTEN bookings_changes;
```

---

## 🐛 Debugging Commands

### Check environment variables are loaded
```bash
# In Node.js/Next.js console
console.log({
  stripeKey: !!process.env.STRIPE_SECRET_KEY,
  webhookSecret: !!process.env.STRIPE_WEBHOOK_SECRET,
  clerkKey: !!process.env.CLERK_SECRET_KEY,
  supabaseKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
  resendKey: !!process.env.RESEND_API_KEY
});
```

### Test Stripe connection
```bash
stripe balance retrieve
```

### Test Supabase connection
```sql
SELECT version();
```

### Verify webhook signature locally
```javascript
// In Node REPL or debug script
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const payload = 'webhook_payload_here';
const signature = 'stripe_signature_here';
const secret = process.env.STRIPE_WEBHOOK_SECRET;

try {
  const event = stripe.webhooks.constructEvent(payload, signature, secret);
  console.log('✅ Signature valid', event.type);
} catch (err) {
  console.error('❌ Signature invalid', err.message);
}
```

---

## 🎯 Quick Test Scenarios

### Scenario 1: Happy Path (Normal Host + Featured)
```bash
# Terminal 1
stripe listen --forward-to localhost:3000/api/webhooks/stripe

# Terminal 2
npm run dev

# Then:
# 1. Create property with Featured ON
# 2. Guest requests booking
# 3. Host accepts
# 4. Guest pays (card: 4242 4242 4242 4242)
# 5. Host pays €80 fee
# 6. Verify contacts released
```

### Scenario 2: Founding Host (Fee = €0)
```bash
# 1. Set user metadata in Clerk:
curl -X PATCH https://api.clerk.com/v1/users/USER_ID \
  -H "Authorization: Bearer $CLERK_SECRET_KEY" \
  -d '{"public_metadata": {"role": "founding_host", "founding_host_year": 2026}}'

# 2. Same as Scenario 1 but:
#    - Host doesn't pay fee
#    - Booking confirmed automatically
```

### Scenario 3: Rejection
```bash
# Same setup, but:
# - Host clicks "Reject"
# - Verify no payments made
# - Verify guest gets rejection email
```

---

## 📈 Performance Testing

### Load test booking creation
```bash
# Using Apache Bench (ab)
ab -n 10 -c 2 -p booking.json -T application/json \
  -H "Cookie: YOUR_SESSION" \
  http://localhost:3000/api/bookings/request
```

### Check API response times
```bash
curl -w "@curl-format.txt" -o /dev/null -s \
  http://localhost:3000/api/bookings/BOOKING_ID
```

Create `curl-format.txt`:
```
time_namelookup:  %{time_namelookup}\n
time_connect:  %{time_connect}\n
time_starttransfer:  %{time_starttransfer}\n
time_total:  %{time_total}\n
```

---

## 🔑 Environment Variables Checklist

```bash
# Quick verification script
echo "Checking environment variables..."
[ -n "$NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY" ] && echo "✅ Stripe Public Key" || echo "❌ Missing Stripe Public Key"
[ -n "$STRIPE_SECRET_KEY" ] && echo "✅ Stripe Secret Key" || echo "❌ Missing Stripe Secret Key"
[ -n "$STRIPE_WEBHOOK_SECRET" ] && echo "✅ Stripe Webhook Secret" || echo "❌ Missing Stripe Webhook Secret"
[ -n "$NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY" ] && echo "✅ Clerk Public Key" || echo "❌ Missing Clerk Public Key"
[ -n "$CLERK_SECRET_KEY" ] && echo "✅ Clerk Secret Key" || echo "❌ Missing Clerk Secret Key"
[ -n "$SUPABASE_SERVICE_ROLE_KEY" ] && echo "✅ Supabase Key" || echo "❌ Missing Supabase Key"
[ -n "$RESEND_API_KEY" ] && echo "✅ Resend Key" || echo "❌ Missing Resend Key"
```

---

## 🎉 Success Verification

After completing a test, verify:

```bash
# 1. Check Stripe Dashboard
open https://dashboard.stripe.com/test/payments

# 2. Check Supabase bookings table
# (Use SQL queries above)

# 3. Check Resend email logs
open https://resend.com/emails

# 4. Check local server logs
cat .next/server.log | grep -i "booking\|payment\|webhook"
```

---

**Ready for Testing! 🚀**
