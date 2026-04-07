# 🔧 Habilitar Amenities - 5 Minutos

## ⚡ Acción Requerida

**Necesitas ejecutar la migration SQL en Supabase para habilitar las amenities.**

---

## 📋 Pasos (5 minutos):

### 1. Ve a Supabase Dashboard
```
https://supabase.com/dashboard
```

### 2. Selecciona tu proyecto
- Click en tu proyecto de inhabitme

### 3. Ve al SQL Editor
- Click en el menú lateral: **SQL Editor**
- O ve a: **Database** → **SQL Editor**

### 4. Nueva Query
- Click en **"New query"**

### 5. Copia y Pega
**Abre el archivo:**
```
supabase/migrations/add_amenities_columns.sql
```

**Copia TODO el contenido** (121 líneas)

**Pégalo** en el SQL Editor de Supabase

### 6. Ejecutar
- Click en el botón **"Run"** (verde, arriba a la derecha)
- O presiona: `Ctrl+Enter`

### 7. Verificar Éxito
Deberías ver:
```
Success. No rows returned
```

O algo similar que indique que se ejecutó correctamente.

---

## ✅ Verificación

**Para verificar que funcionó**, ejecuta esta query en el SQL Editor:

```sql
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'listings' 
AND column_name LIKE 'has_%';
```

**Deberías ver** al menos 13 columnas:
- has_heating
- has_ac
- has_balcony
- has_terrace
- has_washing_machine
- has_dryer
- has_dishwasher
- has_kitchen
- has_elevator
- has_parking
- has_doorman
- has_security_system
- has_safe

---

## 🎨 Después de Ejecutar

**Sin reiniciar el servidor**, ve a:
```
http://localhost:3000/en/search
```

**Click en "Filtros"** (o el botón de filtros)

**Deberías ver:**
- ✅ Sección "Amenities y Filtros Avanzados"
- ✅ 17 checkboxes de amenities
- ✅ Agrupados por categoría:
  - Clima y Confort (4)
  - Hogar y Comodidades (4)
  - Edificio y Accesibilidad (3)
  - Mascota y Estilo de Vida (2)
  - Seguridad (2)
  - Trabajo Remoto (2 ya existentes)

---

## 🚨 Si Hay Error

**Error común:** "permission denied"

**Solución:** Verifica que estés usando el **Service Role Key**, no el anon key.

En tu dashboard de Supabase:
- Settings → API
- Usa la **service_role** key (empieza con `eyJhbGc...`)

---

## 📊 Bonus: Ver Estadísticas

Después de ejecutar, puedes ver qué amenities son más populares:

```sql
SELECT * FROM amenities_popularity;
```

---

## 🎯 Siguiente Paso

**Después de ejecutar la migration:**

1. Ve a `/en/search`
2. Click "Filtros"
3. **Verás todas las amenities disponibles** 🎉
4. Puedes filtrar propiedades por amenities

---

**¡Ejecuta la migration AHORA y luego prueba los filtros!** 🚀

**Duración:** 5 minutos ⏱️
