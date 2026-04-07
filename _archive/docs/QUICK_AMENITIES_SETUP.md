# ⚡ Quick Setup - Sistema de Amenities

## 🎯 Implementar en 5 Minutos

### Paso 1: Migración de Base de Datos (2 min)

1. **Abrir Supabase Dashboard**
   - Ir a: https://supabase.com/dashboard
   - Seleccionar proyecto `inhabitme`
   - Click en "SQL Editor" (menú izquierdo)

2. **Ejecutar Migration**
   - Abrir archivo: `supabase/migrations/add_amenities_columns.sql`
   - Copiar TODO el contenido
   - Pegar en SQL Editor de Supabase
   - Click **"Run"** (botón verde)
   - ✅ Ver mensaje: "Success. No rows returned"

3. **Verificar**
   ```sql
   -- Ejecutar esto para verificar columnas:
   SELECT column_name, data_type 
   FROM information_schema.columns 
   WHERE table_name = 'listings' 
   AND column_name LIKE 'has%' OR column_name LIKE 'pets%';
   ```
   
   **Deberías ver**:
   ```
   has_heating          | boolean
   has_ac               | boolean
   has_elevator         | boolean
   has_parking          | boolean
   pets_allowed         | boolean
   ... etc
   ```

---

### Paso 2: Reiniciar Servidor (1 min)

```bash
# Terminal
# Ctrl+C para detener si está corriendo

npm run dev
```

**Esperar**: `✓ Ready in XXms`

---

### Paso 3: Testing (2 min)

1. **Navegar a búsqueda**
   ```
   http://localhost:3000/en/search
   ```

2. **Abrir filtros**
   - Click botón **"Filtros"**
   - Click **"Amenities y Filtros Avanzados"** (expandir)

3. **Seleccionar amenities**
   - ✅ Check "🛗 Ascensor"
   - ✅ Check "🚗 Parking"
   - ✅ Check "🐕 Pet Friendly"
   - Click **"Buscar"**

4. **Verificar URL**
   ```
   /search?hasElevator=true&hasParking=true&petsAllowed=true
   ```

5. **Verificar contador**
   - Badge azul debe mostrar: "3 amenities seleccionadas"

---

## ✅ Testing Checklist

Marca cada item al testear:

**Base de Datos**:
- [ ] Migration ejecutada sin errores
- [ ] Columnas verificadas en `listings`
- [ ] Índices creados

**Frontend**:
- [ ] Servidor reiniciado
- [ ] Página `/search` carga
- [ ] Botón "Filtros" funciona
- [ ] Sección "Amenities" se expande

**Filtros Básicos**:
- [ ] Ciudad funciona
- [ ] Barrio funciona
- [ ] Precio min/max funciona
- [ ] Habitaciones funciona

**Amenities**:
- [ ] ✅ Clima: Calefacción, AC, Balcón, Terraza
- [ ] ✅ Hogar: Cocina, Lavadora, Secadora, Lavavajillas
- [ ] ✅ Edificio: Ascensor, Parking, Portero
- [ ] ✅ Lifestyle: Pet Friendly, Smoking allowed
- [ ] ✅ Seguridad: Sistema seguridad, Caja fuerte
- [ ] ✅ Trabajo: Escritorio, Monitor, WiFi speed

**Funcionalidad**:
- [ ] Checkboxes se marcan/desmarcan
- [ ] Contador actualiza correctamente
- [ ] Click "Buscar" → URL actualiza
- [ ] URL contiene parámetros correctos
- [ ] Recargar página → Filtros persisten
- [ ] "Limpiar filtros" → Resetea todo

**Mobile**:
- [ ] Responsive en móvil
- [ ] Grid 2 columnas en mobile
- [ ] Checkboxes touch-friendly

---

## 🐛 Si Algo Falla

### Error: "column does not exist"

**Causa**: Migration no se ejecutó

**Solución**:
```sql
-- Verificar columnas en Supabase SQL Editor:
SELECT column_name FROM information_schema.columns 
WHERE table_name = 'listings';

-- Si no aparecen las nuevas columnas:
-- 1. Re-ejecutar migration SQL completa
-- 2. Verificar que no haya errores de sintaxis
```

---

### Error: "SearchFiltersEnhanced is not defined"

**Causa**: Componente no encontrado

**Solución**:
```bash
# Verificar que archivo existe:
ls src/components/search/SearchFiltersEnhanced.tsx

# Si no existe:
# 1. Revisar que se creó el archivo
# 2. Reiniciar servidor: npm run dev
```

---

### Filtros no Aparecen Expandidos

**Causa**: Estado colapsado por defecto

**Solución**:
- Click en "Amenities y Filtros Avanzados" para expandir
- Es comportamiento esperado (UX)

---

### URL no Actualiza

**Causa**: Falta click en "Buscar"

**Solución**:
- Seleccionar amenities
- **Importante**: Click botón "Buscar"
- URL se actualiza al aplicar filtros

---

## 📊 Datos de Prueba

### Actualizar Propiedades Existentes (Opcional)

Si quieres que propiedades existentes tengan amenities:

```sql
-- Supabase SQL Editor

-- Opción 1: Marcar TODAS las propiedades activas
UPDATE listings 
SET 
  has_kitchen = true,
  has_washing_machine = true,
  has_heating = true,
  has_elevator = true,
  has_ac = true
WHERE status = 'active';

-- Opción 2: Marcar solo algunas propiedades
UPDATE listings 
SET 
  has_parking = true,
  pets_allowed = true,
  has_balcony = true
WHERE status = 'active' 
AND city_name = 'Madrid'
LIMIT 10;

-- Verificar actualización:
SELECT 
  id, 
  title, 
  has_elevator, 
  has_parking, 
  pets_allowed 
FROM listings 
WHERE status = 'active' 
LIMIT 5;
```

---

## 🎨 Vista Previa del Sistema

### Filtros Básicos
```
┌─────────────────────────────────────────────────────┐
│ Ciudad    │ Barrio │ Min € │ Max € │ Habitaciones │
│ [Madrid▼] │ [Todos▼] │ [800] │ [2000] │ [2+     ▼] │
└─────────────────────────────────────────────────────┘
```

### Amenities Expandidas
```
▼ Amenities y Filtros Avanzados [3]

💼 Espacio de Trabajo
☑ 🪑 Escritorio    ☐ 🖥️ Monitor    [WiFi: 50 Mbps]

❄️🔥 Clima y Confort
☑ 🔥 Calefacción   ☐ ❄️ AC         ☐ 🪴 Balcón

🏠 Hogar y Comodidades
☐ 🍳 Cocina        ☑ 👕 Lavadora    ☐ 🌬️ Secadora

🏢 Edificio
☐ 🛗 Ascensor      ☐ 🚗 Parking     ☐ 👔 Portero

🐾 Lifestyle
☐ 🐕 Pet Friendly  ☐ 🚬 Fumar OK

[🔍 Buscar]  [✕ Limpiar]  3 amenities seleccionadas
```

---

## 📱 Casos de Uso de Testing

### Test 1: Remote Worker
```
Seleccionar:
- ✅ Escritorio
- ✅ WiFi: 100 Mbps
- ✅ Calefacción
- ✅ AC

Click "Buscar"

Verificar URL:
/search?hasDesk=true&minWifiSpeed=100&hasHeating=true&hasAc=true
```

### Test 2: Con Mascota
```
Seleccionar:
- ✅ Pet Friendly
- ✅ Ascensor
- ✅ Balcón

Click "Buscar"

Verificar URL:
/search?petsAllowed=true&hasElevator=true&hasBalcony=true
```

### Test 3: Familia
```
Seleccionar:
- Habitaciones: 3+
- ✅ Parking
- ✅ Ascensor
- ✅ Cocina

Click "Buscar"

Verificar URL:
/search?bedrooms=3&hasParking=true&hasElevator=true&hasKitchen=true
```

---

## 🚀 Features Implementadas

### ✅ Completado

- [x] **17 amenities** diferentes
- [x] Base de datos con índices
- [x] Componente UI moderno
- [x] API con filtros completos
- [x] URLs SEO-friendly
- [x] Persistencia de filtros
- [x] Contador de amenities
- [x] Mobile responsive
- [x] Agrupación por categorías

### 📋 Opcional (Futuro)

- [ ] Filtros guardados
- [ ] Alertas de nuevas propiedades
- [ ] Comparador de propiedades
- [ ] Mapa con amenities
- [ ] Dashboard de host con amenities

---

## 📞 Support

**Si tienes problemas**:

1. Verificar migration SQL ejecutada
2. Verificar servidor reiniciado
3. Verificar consola del navegador (F12)
4. Verificar terminal del servidor

**Logs útiles**:
```bash
# Server logs
# Buscar errores en el terminal donde corre npm run dev

# Browser console
# F12 → Console → Buscar errores en rojo
```

---

## 🎉 Listo!

Si completaste todos los checkboxes, **el sistema de amenities está 100% funcional**.

**Usuarios pueden ahora**:
- ✅ Buscar propiedades por amenities específicas
- ✅ Combinar múltiples filtros
- ✅ Ver contador de filtros activos
- ✅ Compartir búsquedas via URL
- ✅ Usar en mobile sin problemas

---

**inhabitme - Encuentra tu espacio perfecto** 🏠✨
