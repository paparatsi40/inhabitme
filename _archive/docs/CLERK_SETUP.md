# 🔐 Guía de Configuración de Clerk

## ¿Qué es Clerk?

Clerk es un servicio de autenticación moderno que maneja:

- Sign up / Sign in
- Gestión de usuarios
- Sesiones seguras
- OAuth (Google, GitHub, etc.)
- MFA (autenticación de dos factores)
- Roles y permisos

## 📋 Pasos para Configurar Clerk

### **Paso 1: Crear cuenta en Clerk**

1. Ve a: https://dashboard.clerk.com/
2. Haz clic en "Get started for free"
3. Crea tu cuenta con email o GitHub

### **Paso 2: Crear una aplicación**

1. Una vez dentro del dashboard, haz clic en "Create application"
2. Nombre: `inhabitme` (o el que prefieras)
3. Selecciona los métodos de autenticación que quieres:
    - ✅ **Email** (recomendado)
    - ✅ **Google** (opcional pero recomendado)
    - ✅ **GitHub** (opcional)
4. Haz clic en "Create application"

### **Paso 3: Obtener las API Keys**

1. En el dashboard, ve a la sección **"API Keys"** (menú izquierdo)
2. Verás dos keys importantes:
    - **Publishable Key** (comienza con `pk_test_...`)
    - **Secret Key** (comienza con `sk_test_...`)

### **Paso 4: Copiar las keys a tu proyecto**

1. Abre el archivo `.env.local` en la raíz de tu proyecto
2. Reemplaza las keys de ejemplo:

```env
# Copia tu Publishable Key aquí
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_TU_KEY_AQUI

# Copia tu Secret Key aquí
CLERK_SECRET_KEY=sk_test_TU_KEY_AQUI
```

### **Paso 5: Configurar URLs permitidas**

En el dashboard de Clerk:

1. Ve a **"Paths"** o **"URLs"**
2. Agrega estas URLs:
    - Sign in URL: `/sign-in`
    - Sign up URL: `/sign-up`
    - After sign in: `/dashboard`
    - After sign up: `/onboarding`

### **Paso 6: Reiniciar el servidor**

Después de actualizar `.env.local`:

```bash
# Detén el servidor (Ctrl + C)
# Reinicia
npm run dev
```

## ✅ Verificar que funciona

1. Ve a: http://localhost:3000
2. Haz clic en "Registrarse"
3. Deberías ver el formulario de Clerk
4. Regístrate con tu email
5. ¡Listo! Serás redirigido a `/onboarding`

---

## 🎨 Personalizar Clerk (Opcional)

### Cambiar colores y branding:

1. En el dashboard de Clerk, ve a **"Customization"**
2. Puedes cambiar:
    - Logo
    - Colores primarios
    - Textos
    - Temas (light/dark)

### Colores recomendados para inhabitme:

```
Primary color: #3b82f6 (azul)
Background: #ffffff
Text: #171717
```

---

## 🆓 Plan Gratuito de Clerk

El plan gratuito incluye:

- ✅ 10,000 usuarios activos mensuales
- ✅ Email + password authentication
- ✅ OAuth social providers
- ✅ Session management
- ✅ User management dashboard

**Más que suficiente para el MVP y primeros usuarios.**

---

## 🔒 Seguridad

Las keys de Clerk son sensibles. **NUNCA** las subas a GitHub:

✅ `.env.local` está en `.gitignore` por defecto
❌ No las pongas en el código
❌ No las compartas públicamente

---

## 🚨 Solución de Problemas

### Error: "publishableKey is invalid"

→ Verifica que copiaste correctamente las keys de Clerk

### Error: "Cannot find module @clerk/nextjs"

→ Ejecuta: `npm install @clerk/nextjs --legacy-peer-deps`

### No redirige después de sign in

→ Verifica las URLs en `.env.local` y en el dashboard de Clerk

---

## 📚 Recursos

- [Clerk Documentation](https://clerk.com/docs)
- [Clerk Next.js Guide](https://clerk.com/docs/quickstarts/nextjs)
- [Clerk Dashboard](https://dashboard.clerk.com/)

---

## ✨ ¿Listo?

Una vez configurado Clerk, tu app tendrá:

- ✅ Sign up / Sign in funcionando
- ✅ Usuarios en dashboard de Clerk
- ✅ Sesiones seguras
- ✅ Protección de rutas
- ✅ User profile management

**¡Ya puedes agregar funcionalidad real con usuarios reales!** 🚀