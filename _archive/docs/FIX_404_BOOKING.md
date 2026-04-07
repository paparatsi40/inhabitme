# 🚨 Fix 404 - Booking Request

## Problema
```
POST http://localhost:3000/api/bookings/request 404 (Not Found)
```

El archivo existe pero Next.js no lo detecta → **Problema de cache**

---

## ✅ Solución (30 segundos)

### En la terminal donde corre `npm run dev`:

```bash
# 1. Detener servidor
Ctrl+C

# 2. Limpiar cache (Windows PowerShell)
Remove-Item -Recurse -Force .next

# 3. Reiniciar
npm run dev

# 4. Esperar a que compile
# Deberías ver: ✓ Ready in XXXms

# 5. Refrescar navegador
F5
```

---

## 🔄 Alternativamente (Si sigues con error)

### Opción 1: Borrar cache manualmente
1. Cerrar VSCode/Cursor
2. Ir a carpeta del proyecto
3. Eliminar carpeta `.next` manualmente
4. Abrir VSCode/Cursor
5. `npm run dev`

### Opción 2: Hard restart
```bash
# Detener todo
Ctrl+C

# Reinstalar (solo si nada más funciona)
rm -rf node_modules
npm install
npm run dev
```

---

## ✅ Verificación

Después de limpiar cache, cuando visites un listing:

**En la terminal del servidor deberías ver**:
```
○ Compiling /api/bookings/request ...
✓ Compiled /api/bookings/request in XXXms
```

**En el navegador**:
- Click "Request to Book"
- Modal abre
- Submit → NO error 404
- Debería mostrar error 401 (Unauthorized) si no estás logueado
- O crear booking si estás logueado

---

## 🎯 Quick Test

Después de reiniciar, prueba directamente la API:

```bash
# En navegador, ir a:
http://localhost:3000/api/bookings/request

# Debería mostrar:
{"error":"Unauthorized"}

# NO debería mostrar:
Cannot GET /api/bookings/request
```

Si muestra "Unauthorized" → ✅ API funciona  
Si muestra "Cannot GET" → ❌ Todavía hay problema de cache

---

## 📝 Nota

Este error es común cuando:
- Creas nuevos API routes
- Next.js no recompila automáticamente
- Cache queda desactualizado

**Solución**: Siempre limpiar `.next` cuando hay 404 en API routes nuevas

---

**Hazlo ahora:**
```bash
Ctrl+C
Remove-Item -Recurse -Force .next
npm run dev
```

Luego refresca el navegador 🚀
