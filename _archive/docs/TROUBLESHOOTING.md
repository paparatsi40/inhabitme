# 🔧 Troubleshooting Guide

## ❌ Error: `/api/bookings/request` 404 Not Found

### Síntomas
```
Failed to load resource: the server responded with a status of 404 (Not Found)
:3000/api/bookings/request
```

### Soluciones

#### Solución 1: Reiniciar Servidor (Más Común)
```bash
# En la terminal donde corre npm run dev
# Presiona Ctrl+C para detener

# Luego:
npm run dev
```

#### Solución 2: Limpiar Cache de Next.js
```bash
# Detener servidor (Ctrl+C)

# Eliminar carpeta .next
rm -rf .next

# O en Windows PowerShell:
Remove-Item -Recurse -Force .next

# Reiniciar
npm run dev
```

#### Solución 3: Verificar Estructura de Archivos
El archivo debe estar en:
```
src/app/api/bookings/request/route.ts
```

Verifica que existe con:
```bash
ls src/app/api/bookings/request/route.ts
```

#### Solución 4: Reinstalar Dependencias (Último Recurso)
```bash
rm -rf node_modules
rm package-lock.json
npm install
npm run dev
```

---

## ⚠️ Warnings de Clerk (Normales)

Estos warnings son **normales en desarrollo**:

```
Clerk: Clerk has been loaded with development keys.
```
✅ **OK** - Solo usar production keys en deploy

```
The prop "afterSignInUrl" is deprecated
```
✅ **OK** - No afecta funcionalidad, actualizar después

---

## 🔍 Otros Errores Comunes

### Error: "Module not found"
```bash
# Reinstalar dependencias
npm install
```

### Error: "EADDRINUSE" (Puerto ocupado)
```bash
# Matar proceso en puerto 3000
# Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux:
lsof -ti:3000 | xargs kill -9

# O cambiar puerto:
npm run dev -- -p 3001
```

### Error: Supabase connection
Verificar `.env.local`:
```bash
NEXT_PUBLIC_SUPABASE_URL=https://...
SUPABASE_SERVICE_ROLE_KEY=...
```

### Error: Stripe webhook
```bash
# Verificar que stripe CLI está corriendo:
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

---

## ✅ Verificación Rápida

### 1. Servidor corriendo
```bash
# Terminal debe mostrar:
✓ Ready in XXXms
○ Compiling / ...
```

### 2. API accesible
Abrir en navegador:
```
http://localhost:3000/api/listings/search
```
Debería retornar JSON (no 404)

### 3. Bookings endpoint
```bash
# Test con curl (requiere auth, pero no debería dar 404)
curl http://localhost:3000/api/bookings/request
# Debería retornar 401 Unauthorized (no 404)
```

---

## 🚀 Quick Fix para tu Error Actual

**Haz esto AHORA**:

```bash
# 1. Detener servidor
Ctrl+C en la terminal

# 2. Limpiar cache
Remove-Item -Recurse -Force .next

# 3. Reiniciar
npm run dev

# 4. Esperar mensaje:
✓ Ready in XXXms

# 5. Refrescar navegador
F5 o Ctrl+R

# ✅ Debería funcionar
```

---

## 📞 Si Sigue Sin Funcionar

1. **Verificar consola del servidor** (terminal donde corre npm run dev)
   - Buscar errores en rojo
   - Copiar mensaje completo

2. **Verificar ruta del archivo**
   ```bash
   ls src/app/api/bookings/request/
   # Debe mostrar: route.ts
   ```

3. **Verificar que Next.js detectó el cambio**
   ```
   # En consola del servidor debería aparecer:
   ○ Compiling /api/bookings/request ...
   ✓ Compiled /api/bookings/request
   ```

4. **Testing directo de la API**
   ```bash
   # Desde Postman o curl:
   POST http://localhost:3000/api/bookings/request
   
   # Debería retornar 401 (no 404)
   # 401 = No auth (correcto)
   # 404 = Endpoint no existe (error)
   ```

---

## 🎯 Resumen para tu Error

**TL;DR**:
```bash
Ctrl+C
Remove-Item -Recurse -Force .next
npm run dev
```

Luego refresca el navegador (F5)

---

**¿Funcionó? Si no, comparte el output completo de la terminal donde corre `npm run dev`** 👍
