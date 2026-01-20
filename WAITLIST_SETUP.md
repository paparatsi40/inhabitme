# 🎯 Setup de Waitlist Inteligente

## ✅ Lo que acabamos de implementar:

### 1. **Modal inteligente de waitlist**
- Usuario hace click en "Avísame cuando haya en [Ciudad]"
- Modal aparece con form de email
- Muestra **alternativas inteligentes** de ciudades similares
- Usuario puede ir directamente a ver esas alternativas

### 2. **Sistema completo**
- ✅ Guarda emails en base de datos (Supabase)
- ✅ Email automático de confirmación al usuario
- ✅ Email de notificación al admin (tú)
- ✅ Recomendaciones inteligentes por ciudad

---

## 🔧 Para que funcione, necesitas:

### Paso 1: Crear la tabla en Supabase

1. Ve a tu dashboard de Supabase: https://supabase.com/dashboard
2. Selecciona tu proyecto de inhabitme
3. Ve a **SQL Editor** (en el menú lateral)
4. Click en **"New Query"**
5. Copia y pega el contenido del archivo:
   `supabase/migrations/create_waitlist_table.sql`
6. Click **"Run"** (o Ctrl + Enter)

**Deberías ver:** "Success. No rows returned"

---

### Paso 2: Verificar que la tabla existe

En el SQL Editor, ejecuta:

```sql
SELECT * FROM property_waitlist LIMIT 5;
```

Si no da error, ¡la tabla está creada! ✅

---

### Paso 3: Reiniciar el servidor

```bash
Ctrl + C
npm run dev
```

---

## 🧪 Cómo probar:

1. Ve a una ciudad sin propiedades: `http://localhost:3000/sevilla`
2. Click en "📧 Avísame cuando haya en Sevilla"
3. **Modal aparece** con:
   - Form de email
   - 3 alternativas inteligentes (Madrid, Valencia, Lisboa)
4. Ingresa tu email y click "Notificarme"
5. Deberías ver:
   - ✅ Mensaje de éxito
   - ✅ Email de confirmación en tu bandeja
   - ✅ Email de notificación a hola@inhabitme.com

---

## 📧 Emails que se envían:

### Al usuario:
- **Asunto:** "Te avisaremos cuando haya propiedades en Sevilla"
- **Contenido:** Confirmación profesional con logo y diseño

### A ti (admin):
- **Asunto:** "🔔 Nuevo interesado en Sevilla"
- **Contenido:** Email y ciudad del interesado

---

## 🎯 Alternativas inteligentes por ciudad:

### Sevilla → Madrid, Valencia, Lisboa
- Madrid: "Capital con más opciones"
- Valencia: "Playa y clima mediterráneo"  
- Lisboa: "Clima similar, fiscalidad favorable"

### Porto → Lisboa, Madrid, Barcelona

### Medellín → CDMX, Buenos Aires, Barcelona

### Default (para otras) → Madrid, Barcelona, Lisboa

---

## 📊 Cómo usar los datos:

### Ver todos los interesados:

```sql
SELECT * FROM property_waitlist 
ORDER BY created_at DESC;
```

### Ver interesados por ciudad:

```sql
SELECT * FROM property_waitlist 
WHERE city_slug = 'sevilla'
AND notified = false;
```

### Cuando subas propiedades en Sevilla:

```sql
SELECT email FROM property_waitlist 
WHERE city_slug = 'sevilla'
AND notified = false;
```

Copia los emails y envíales un email avisando.

Luego marca como notificados:

```sql
UPDATE property_waitlist
SET notified = true, notified_at = NOW()
WHERE city_slug = 'sevilla';
```

---

## ✅ Resultado:

**Antes:** Usuario frustrado se va a Airbnb ❌

**Ahora:** 
- ✅ Capturas su email
- ✅ Le das alternativas inmediatas
- ✅ No se va a la competencia
- ✅ Validas demanda por ciudad
- ✅ Profesional y confiable

---

## 🚀 ¡Listo!

El sistema está implementado. Solo falta crear la tabla en Supabase y reiniciar el servidor.
