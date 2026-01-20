# 🔧 Fix 404 - Themes API Route

## 🚨 Problema

```
GET /api/listings/32b4b8d5-f686-4d01-8b25-e6f0ca5020cd 404
```

El API route existe pero Next.js no lo detecta por **caché**.

---

## ✅ Solución Definitiva

### En PowerShell:

```powershell
# 1. Detener servidor
Ctrl+C

# 2. Limpiar caché COMPLETO
Remove-Item -Recurse -Force .next

# 3. Reiniciar
npm run dev
```

### Espera a ver:
```
✓ Ready in XXXms
○ Compiling /api/listings/[id] ...
✓ Compiled /api/listings/[id]
```

---

## 🧪 Verificar que Funcione

**En otra terminal** (mientras el servidor corre), ejecuta:

```powershell
curl http://localhost:3000/api/listings/32b4b8d5-f686-4d01-8b25-e6f0ca5020cd
```

**Debería responder** con JSON del listing o un error 404 real (si no existe).

**Si sigue dando 404 inmediatamente** (sin compilar), entonces el problema persiste.

---

## 🔍 Si SIGUE Fallando

### Verificar que el archivo existe:

```powershell
Test-Path "C:\Users\calfaro\AndroidStudioProjects\inhabitme\src\app\api\listings\[id]\route.ts"
```

**Debería decir: True**

### Si dice False:

El archivo no se creó. Créalo manualmente:
1. Ve a: `src/app/api/listings/`
2. Crea carpeta: `[id]`
3. Dentro, crea: `route.ts`
4. Copia el contenido del archivo que te di

---

## ⚡ Acción AHORA

**Ejecuta estos comandos:**

```powershell
# Detener
Ctrl+C

# Limpiar
Remove-Item -Recurse -Force .next

# Reiniciar
npm run dev
```

**Espera a que compile y prueba de nuevo el customize** 🚀
