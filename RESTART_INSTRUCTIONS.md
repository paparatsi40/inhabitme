# 🔧 Fix 404 Error - Reinicio Completo

## El Problema:
Next.js tiene el archivo `create-checkout/route.ts` pero da 404 porque el caché está corrupto.

## ✅ Solución (Ejecuta en orden):

### Paso 1: Detener Servidor
```powershell
Ctrl+C
```

### Paso 2: Limpiar Cache Completo
```powershell
Remove-Item -Recurse -Force .next
```

### Paso 3: Reiniciar
```powershell
npm run dev
```

### Paso 4: Esperar Compilación
Espera a ver:
```
✓ Ready in XXXms
```

### Paso 5: Probar de Nuevo
1. Ve a la página del booking
2. Click "Pagar Ahora"
3. Debería funcionar

---

## Si Sigue Fallando:

### Opción B - Limpiar TODO y Reinstalar:
```powershell
# Detener servidor
Ctrl+C

# Limpiar todo
Remove-Item -Recurse -Force .next
Remove-Item -Recurse -Force node_modules\.cache

# Reinstalar dependencias
npm install

# Reiniciar
npm run dev
```

---

## 🎯 Lo que Debería Pasar:

Cuando funcione, verás en el terminal:
```
🔵 Creating Stripe checkout...
🔵 Booking ID: xxx-xxx-xxx
🔵 Guest email: alfaengineer@gmail.com
🔵 Amounts: { monthly_price: 100000, deposit: 100000, guest_fee: 8900 }
```

Y te redirigirá a la página de Stripe Checkout 💳
