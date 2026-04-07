# 🔧 Implementación: Host Paga al Aceptar

## 🎯 Objetivo

**Cuando el host hace click "Aceptar":**
- Si es **Founding Host** → Acepta gratis ✅
- Si es **Host Regular** → Paga €50 primero 🔒

---

## 📋 Checklist de Implementación

### ✅ Paso 1: Migration SQL
- [ ] Agregar columna `host_payment_status` a tabla `bookings`
- [ ] Agregar columna `host_payment_amount` a tabla `bookings`
- [ ] Agregar columna `host_stripe_session_id` a tabla `bookings`

### ✅ Paso 2: API Host Payment Checkout
- [ ] Crear `/api/bookings/[id]/host-checkout` route
- [ ] Verificar que user es el host
- [ ] Verificar que booking está en `pending_host_approval`
- [ ] Crear Stripe Checkout Session para €50 (o €80 si Featured)
- [ ] Guardar session ID en booking

### ✅ Paso 3: Actualizar `/respond` route
- [ ] Detectar si host es Founding Host
- [ ] Si NO es Founding → Redirect a payment checkout
- [ ] Si SÍ es Founding → Acepta inmediatamente

### ✅ Paso 4: Success Page Host
- [ ] Crear `/host/bookings/[id]/payment-success` page
- [ ] Verificar pago de Stripe
- [ ] Actualizar booking a `pending_guest_payment`
- [ ] Enviar email al guest

### ✅ Paso 5: Frontend - Host Bookings Page
- [ ] Actualizar botón "Aceptar" para manejar payment flow
- [ ] Mostrar loading state durante redirect
- [ ] Manejar errores de pago

---

## 🗄️ Migration SQL

```sql
-- Add host payment columns to bookings table
ALTER TABLE bookings
ADD COLUMN host_payment_status VARCHAR(20) DEFAULT 'pending',
ADD COLUMN host_payment_amount INTEGER,
ADD COLUMN host_stripe_session_id TEXT,
ADD COLUMN host_paid_at TIMESTAMP;

-- Add index for querying
CREATE INDEX idx_bookings_host_payment ON bookings(host_payment_status);

-- Add constraint to ensure valid statuses
ALTER TABLE bookings
ADD CONSTRAINT check_host_payment_status
CHECK (host_payment_status IN ('pending', 'paid', 'failed', 'waived'));

COMMENT ON COLUMN bookings.host_payment_status IS 'Payment status: pending, paid, failed, waived (for Founding Hosts)';
COMMENT ON COLUMN bookings.host_payment_amount IS 'Amount in cents (5000 = €50, 8000 = €80)';
```

---

## 🔧 Implementación Paso a Paso

### **1. Crear API Host Payment Checkout**

`src/app/api/bookings/[id]/host-checkout/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { auth, clerkClient } from '@clerk/nextjs/server';
import { createClient } from '@supabase/supabase-js';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const bookingId = params.id;
    
    // Get booking details
    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .select('*, property:property_id(title, featured, owner_id)')
      .eq('id', bookingId)
      .single();
    
    if (bookingError || !booking) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      );
    }
    
    // Verify user is the host
    if (booking.property.owner_id !== userId) {
      return NextResponse.json(
        { error: 'Unauthorized - not the host' },
        { status: 403 }
      );
    }
    
    // Verify booking is in correct status
    if (booking.status !== 'pending_host_approval') {
      return NextResponse.json(
        { error: 'Booking cannot be accepted at this time' },
        { status: 400 }
      );
    }
    
    // Check if host is Founding Host
    const user = await clerkClient().users.getUser(userId);
    const isFounding Host = user.publicMetadata?.role === 'founding_host';
    
    if (isFoundingHost) {
      // Founding Host doesn't pay - accept immediately
      const { error: updateError } = await supabase
        .from('bookings')
        .update({
          status: 'pending_guest_payment',
          host_payment_status: 'waived',
          host_payment_amount: 0,
          updated_at: new Date().toISOString(),
        })
        .eq('id', bookingId);
      
      if (updateError) {
        throw updateError;
      }
      
      // TODO: Send email to guest
      
      return NextResponse.json({
        success: true,
        isFounding Host: true,
        message: 'Booking accepted (Founding Host benefit)'
      });
    }
    
    // Regular host - create payment checkout
    const hostFee = booking.property.featured ? 8000 : 5000; // €80 or €50
    
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: 'inhabitme - Host Acceptance Fee',
              description: `Confirm booking for "${booking.property.title}"`,
              images: ['https://inhabitme.com/logo.png'], // TODO: Add real logo
            },
            unit_amount: hostFee,
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/host/bookings/${bookingId}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/host/bookings?canceled=true`,
      metadata: {
        bookingId,
        userId,
        type: 'host_acceptance_fee',
      },
    });
    
    // Save session ID to booking
    const { error: updateError } = await supabase
      .from('bookings')
      .update({
        host_stripe_session_id: session.id,
        host_payment_amount: hostFee,
      })
      .eq('id', bookingId);
    
    if (updateError) {
      throw updateError;
    }
    
    return NextResponse.json({
      success: true,
      sessionUrl: session.url,
      isFoundingHost: false,
    });
    
  } catch (error: any) {
    console.error('Host checkout error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
```

---

### **2. Crear Success Page para Host**

`src/app/[locale]/host/bookings/[id]/payment-success/page.tsx`

```typescript
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { CheckCircle2, Home, Inbox } from 'lucide-react';

export default function HostPaymentSuccessPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const bookingId = params.id as string;
  const sessionId = searchParams.get('session_id');
  
  const [verifying, setVerifying] = useState(true);
  const [verified, setVerified] = useState(false);
  
  useEffect(() => {
    if (!sessionId) {
      router.push('/host/bookings');
      return;
    }
    
    // Verify payment and update booking
    const verifyPayment = async () => {
      try {
        const res = await fetch(
          `/api/bookings/${bookingId}/verify-host-payment?session_id=${sessionId}`
        );
        
        if (res.ok) {
          setVerified(true);
        } else {
          console.error('Payment verification failed');
          // Redirect to bookings after error
          setTimeout(() => router.push('/host/bookings'), 3000);
        }
      } catch (error) {
        console.error('Error verifying payment:', error);
        setTimeout(() => router.push('/host/bookings'), 3000);
      } finally {
        setVerifying(false);
      }
    };
    
    verifyPayment();
  }, [sessionId, bookingId, router]);
  
  if (verifying) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Verificando pago...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Success Card */}
        <div className="bg-white rounded-3xl shadow-xl p-8 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full mb-6">
            <CheckCircle2 className="w-10 h-10 text-white" />
          </div>
          
          <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-4">
            ¡Pago Confirmado!
          </h1>
          
          <p className="text-lg text-gray-700 mb-8">
            Tu aceptación ha sido confirmada. El guest recibirá un email para completar su pago.
          </p>
          
          {/* What's Next */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              ¿Qué sigue?
            </h2>
            
            <div className="space-y-4 text-left">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-white rounded-full flex items-center justify-center text-blue-600 font-bold">
                  1
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">Guest recibe notificación</h3>
                  <p className="text-sm text-gray-600">Le hemos enviado un email con el link para pagar €89</p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-white rounded-full flex items-center justify-center text-blue-600 font-bold">
                  2
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">Guest completa el pago</h3>
                  <p className="text-sm text-gray-600">Cuando pague, recibirás su contacto completo</p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-white rounded-full flex items-center justify-center text-blue-600 font-bold">
                  3
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">Coordinación directa</h3>
                  <p className="text-sm text-gray-600">Podrán coordinar fechas, visita y contrato</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => router.push('/host/bookings')}
              className="flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition"
            >
              <Inbox className="w-5 h-5" />
              Ver Mis Solicitudes
            </button>
            
            <button
              onClick={() => router.push('/dashboard')}
              className="flex items-center justify-center gap-2 px-8 py-4 bg-white border-2 border-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition"
            >
              <Home className="w-5 h-5" />
              Ir al Dashboard
            </button>
          </div>
        </div>
        
        {/* Powered by */}
        <p className="text-center text-sm text-gray-500 mt-8">
          Powered by <span className="font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">inhabitme</span>
        </p>
      </div>
    </div>
  );
}
```

---

### **3. Crear API Verify Host Payment**

`src/app/api/bookings/[id]/verify-host-payment/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { createClient } from '@supabase/supabase-js';
import Stripe from 'stripe';
import { Resend } from 'resend';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const resend = new Resend(process.env.RESEND_API_KEY);

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth();
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('session_id');
    
    if (!userId || !sessionId) {
      return NextResponse.json(
        { error: 'Unauthorized or missing session' },
        { status: 401 }
      );
    }
    
    const bookingId = params.id;
    
    // Verify Stripe session
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    
    if (session.payment_status !== 'paid') {
      return NextResponse.json(
        { error: 'Payment not completed' },
        { status: 400 }
      );
    }
    
    // Get booking
    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .select('*, property:property_id(title, owner_id)')
      .eq('id', bookingId)
      .single();
    
    if (bookingError || !booking) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      );
    }
    
    // Verify user is the host
    if (booking.property.owner_id !== userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }
    
    // Update booking
    const { error: updateError } = await supabase
      .from('bookings')
      .update({
        status: 'pending_guest_payment',
        host_payment_status: 'paid',
        host_paid_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', bookingId);
    
    if (updateError) {
      throw updateError;
    }
    
    // Send email to guest
    const guestEmail = booking.guest_email;
    
    if (guestEmail && guestEmail.includes('@')) {
      try {
        await resend.emails.send({
          from: process.env.EMAIL_FROM!,
          to: guestEmail,
          subject: '✅ ¡Tu Solicitud fue Aceptada! - Completa el Pago',
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
              <h1 style="color: #2563eb;">¡Tu Solicitud fue Aceptada!</h1>
              
              <p>Buenas noticias! El host ha aceptado tu solicitud para <strong>${booking.property.title}</strong>.</p>
              
              <h2>Próximo Paso:</h2>
              <p>Para recibir el contacto del host y coordinar tu estancia, completa el pago de €89.</p>
              
              <a href="${process.env.NEXT_PUBLIC_APP_URL}/bookings/${bookingId}" 
                 style="display: inline-block; background: linear-gradient(to right, #2563eb, #7c3aed); color: white; padding: 16px 32px; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 20px 0;">
                Completar Pago €89
              </a>
              
              <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
                Powered by <strong>inhabitme</strong>
              </p>
            </div>
          `
        });
      } catch (emailError) {
        console.error('Error sending email to guest:', emailError);
        // Don't fail the request if email fails
      }
    }
    
    return NextResponse.json({
      success: true,
      message: 'Booking accepted, guest notified'
    });
    
  } catch (error: any) {
    console.error('Verify host payment error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
```

---

### **4. Actualizar Frontend Host Bookings**

Actualizar el botón "Aceptar" en `src/app/[locale]/host/bookings/page.tsx`:

```typescript
// Dentro del componente, agregar función handleAccept

const handleAccept = async (bookingId: string) => {
  setAcceptingId(bookingId);
  
  try {
    const res = await fetch(`/api/bookings/${bookingId}/host-checkout`, {
      method: 'POST',
    });
    
    const data = await res.json();
    
    if (!res.ok) {
      throw new Error(data.error || 'Error al aceptar');
    }
    
    if (data.isFoundingHost) {
      // Founding Host - accepted immediately
      alert('¡Solicitud aceptada! (Founding Host benefit)');
      // Refresh page
      window.location.reload();
    } else {
      // Regular host - redirect to payment
      window.location.href = data.sessionUrl;
    }
    
  } catch (error: any) {
    alert(error.message || 'Error al procesar la aceptación');
    setAcceptingId(null);
  }
};

// En el JSX, actualizar el botón:
<button
  onClick={() => handleAccept(booking.id)}
  disabled={acceptingId === booking.id}
  className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 px-6 rounded-xl font-semibold hover:shadow-lg transition disabled:opacity-50"
>
  {acceptingId === booking.id ? (
    <>
      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent inline-block mr-2" />
      Procesando...
    </>
  ) : (
    <>Aceptar</>
  )}
</button>
```

---

## ✅ Testing Checklist

### Test Flow Founding Host:
1. Como Founding Host, acepta una solicitud
2. ✅ Debería aceptar inmediatamente (sin pago)
3. ✅ Guest recibe email para pagar €89
4. ✅ Estado cambia a `pending_guest_payment`

### Test Flow Regular Host:
1. Como Host Regular, acepta una solicitud
2. ✅ Redirect a Stripe Checkout (€50 o €80)
3. ✅ Paga con tarjeta test
4. ✅ Redirect a `/host/bookings/[id]/payment-success`
5. ✅ Estado cambia a `pending_guest_payment`
6. ✅ Guest recibe email para pagar €89

---

## 🚀 Deploy Checklist

- [ ] Ejecutar migration SQL en Supabase
- [ ] Desplegar nuevos API routes
- [ ] Desplegar nuevo frontend
- [ ] Testing en staging con Stripe test mode
- [ ] Testing en producción con Stripe live mode

---

**🎉 Sistema completo de "Host paga al aceptar" listo para implementar** ✨
