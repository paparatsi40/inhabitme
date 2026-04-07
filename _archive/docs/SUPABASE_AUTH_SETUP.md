# 🔐 Configurar Supabase Auth (5 minutos)

## 🎯 ¿Por qué Supabase Auth?

**Supabase Auth > Clerk** porque:

- ✅ **Más simple** - Ya tienes Supabase
- ✅ **Gratis sin límites** - Unlimited users
- ✅ **Integración perfecta** - Con tu DB
- ✅ **Sin hidratación issues** - Funciona 100% con Next.js
- ✅ **Row Level Security** - Incluido

---

## 📋 PASO 1: Obtener tu Anon Key (2 min)

1. **Ve a tu proyecto en Supabase:**
   ```
   https://supabase.com/dashboard/project/agjntynuysvwgzlcdmiq/settings/api
   ```

2. **Copia estos dos valores:**
    - **Project URL:** `https://agjntynuysvwgzlcdmiq.supabase.co`
    - **anon public key:** (largo string que empieza con `eyJ...`)

3. **Pégalos en tu `.env.local`:**
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://agjntynuysvwgzlcdmiq.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ...
   ```

---

## 📋 PASO 2: Configurar Email Provider (2 min)

1. **Ve a Authentication > Providers:**
   ```
   https://supabase.com/dashboard/project/agjntynuysvwgzlcdmiq/auth/providers
   ```

2. **Verifica que "Email" esté ENABLED** ✅

3. **Configuración recomendada:**
    - ✅ Enable Email provider
    - ✅ Confirm email: **OFF** (para testing)
    - ✅ Secure email change: **OFF** (para testing)

   > **Nota:** En producción, activa "Confirm email"

---

## 📋 PASO 3: Configurar URL Redirects (1 min)

1. **Ve a Authentication > URL Configuration:**
   ```
   https://supabase.com/dashboard/project/agjntynuysvwgzlcdmiq/auth/url-configuration
   ```

2. **Agrega estos Site URLs:**
   ```
   http://localhost:3000
   https://tu-dominio-produccion.com (cuando lo tengas)
   ```

3. **Redirect URLs:**
   ```
   http://localhost:3000/**
   https://tu-dominio-produccion.com/**
   ```

---

## 🚀 PASO 4: Probar (1 min)

```bash
# 1. Reinicia el servidor
npm run dev

# 2. Ve a:
http://localhost:3000/auth/signup

# 3. Crea una cuenta
# 4. Deberías ver "¡Cuenta creada!"
# 5. Ve al login y entra
```

---

## ✅ Lo que ya está implementado:

- ✅ **AuthContext** - Manejo de sesión global
- ✅ **ProtectedRoute** - Rutas protegidas
- ✅ **Login page** - `/auth/login`
- ✅ **Signup page** - `/auth/signup`
- ✅ **Navbar con auth** - Login/Logout buttons
- ✅ **Formulario conectado** - Usa el user ID real

---

## 📊 Flujo completo:

```
1. Usuario va a /auth/signup
   ↓
2. Crea cuenta
   ↓
3. Supabase Auth crea el user
   ↓
4. Redirect a /dashboard
   ↓
5. Puede crear propiedades en /properties/new
   ↓
6. La propiedad se guarda con su hostId real
```

---

## 🔧 Troubleshooting:

### **Error: "Invalid API key"**

- Verifica que copiaste el **anon public key** (no el service_role)
- Reinicia el servidor después de cambiar .env

### **Error: "Email not confirmed"**

- Ve a Auth > Providers
- Desactiva "Confirm email" para testing

### **No llega el email**

- Supabase tiene rate limits en desarrollo
- Desactiva confirmación para testing
- En producción, configura un email provider (SendGrid, etc)

---

## 🎉 ¡Listo!

Una vez configurado, tendrás:

- 🔐 Auth completo
- 👤 Usuarios reales
- 🏠 Propiedades ligadas a usuarios
- 🔒 Rutas protegidas
- 🎨 UI profesional

**inhabitme.com ahora tiene autenticación enterprise-level** 🚀