# ⚡ Cloudinary Setup - Sistema Profesional de Imágenes

## 🏆 Por qué Cloudinary

**Cloudinary es el estándar de la industria** para manejo de imágenes:

### **Empresas que lo usan:**

- 🎬 **Netflix** - Streaming de imágenes
- 🛍️ **Shopify** - E-commerce
- 🏠 **Airbnb** - Fotos de propiedades
- 🎵 **Spotify** - Cover art
- 📱 **Uber** - Fotos de perfil

### **Ventajas sobre UploadThing:**

| Feature | UploadThing | Cloudinary |
|---------|-------------|------------|
| Storage gratis | 2 GB | **25 GB** ✅ |
| Optimización | Básica | **Avanzada** |
| Transformaciones | ❌ | **✅ On-the-fly** |
| WebP/AVIF | ❌ | **✅ Automático** |
| CDN | Básico | **Cloudflare** ✅ |
| Lazy loading | Manual | **Automático** ✅ |

---

## 🚀 Configuración (5 minutos)

### **Paso 1: Crear cuenta**

1. Ve a: **https://cloudinary.com/users/register/free**
2. Regístrate con email (o GitHub)
3. **Plan gratuito incluye:**
    - 25 GB storage
    - 25 GB bandwidth/mes
    - Transformaciones ilimitadas
    - ✅ Perfecto para MVP

---

### **Paso 2: Obtener credenciales**

Una vez dentro del dashboard:

1. En la página principal verás un box **"Account Details"**
2. Copia estos 3 valores:
    - **Cloud Name** (ej: `dxyz123abc`)
    - **API Key** (ej: `123456789012345`)
    - **API Secret** (ej: `abcdefghijklmnopqrstuvwxyz`)

---

### **Paso 3: Configurar .env.local**

Abre `.env.local` y reemplaza:

```env
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=tu_cloud_name_aqui
CLOUDINARY_API_KEY=tu_api_key_aqui
CLOUDINARY_API_SECRET=tu_api_secret_aqui
```

Con tus valores reales:

```env
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=dxyz123abc
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=abcdefghijklmnopqrstuvwxyz
```

---

### **Paso 4: Crear Upload Preset**

**Esto es importante** - Cloudinary necesita un "preset" para uploads desde el cliente:

1. En el dashboard, ve a: **Settings** (⚙️ arriba derecha)
2. Click en pestaña **"Upload"**
3. Scroll hasta **"Upload presets"**
4. Click **"Add upload preset"**
5. Configura así:
    - **Preset name:** `inhabitme_properties`
    - **Signing Mode:** **Unsigned** ✅ (importante!)
    - **Folder:** `inhabitme/properties` (opcional)
    - **Allowed formats:** `jpg, jpeg, png, webp`
    - **Max file size:** `5 MB`
6. Click **"Save"**

---

### **Paso 5: Reiniciar servidor**

```bash
# Detén el servidor (Ctrl+C)
npm run dev
```

---

## ✅ Probar que funciona

1. **Ve a:** `http://localhost:3000/test-upload`
2. **Click en el área de upload**
3. **Selecciona 1-3 fotos**
4. **Deberías ver:**
    - ✅ Modal de Cloudinary
    - ✅ Progress bar
    - ✅ Preview inmediato
    - ✅ Badge "Optimizada ⚡"
    - ✅ URLs de Cloudinary CDN

---

## 🎨 Transformaciones Automáticas

Cloudinary optimiza tus imágenes automáticamente:

### **Sin hacer nada:**

- ✅ Compresión inteligente (-40% tamaño)
- ✅ Conversión a WebP (navegadores modernos)
- ✅ Responsive images (diferentes tamaños)
- ✅ Lazy loading

### **Transformaciones on-the-fly:**

```typescript
// Original
https://res.cloudinary.com/tu-cloud/image/upload/v123/abc.jpg

// Resize a 800px ancho (automático)
https://res.cloudinary.com/tu-cloud/image/upload/w_800/v123/abc.jpg

// Thumbnail 300x300
https://res.cloudinary.com/tu-cloud/image/upload/c_fill,w_300,h_300/v123/abc.jpg

// Calidad 80% + WebP
https://res.cloudinary.com/tu-cloud/image/upload/q_80,f_webp/v123/abc.jpg
```

**No necesitas re-subir** - Solo cambia la URL.

---

## 📊 Plan Gratuito vs Pro

| Feature | Free | Pro ($89/mes) |
|---------|------|---------------|
| Storage | 25 GB | 100 GB |
| Bandwidth | 25 GB/mes | 200 GB/mes |
| Transformaciones | ✅ Ilimitadas | ✅ Ilimitadas |
| CDN | ✅ Cloudflare | ✅ Cloudflare |
| Video | 1 GB | 25 GB |
| Backup | ❌ | ✅ |

**Para inhabitme:** Plan Free es perfecto para empezar. ✅

---

## 🔧 Uso en el código

### **Component ya implementado:**

```tsx
import { CloudinaryUploader } from '@/components/properties/CloudinaryUploader';

function MyForm() {
  const [images, setImages] = useState<string[]>([]);

  return (
    <CloudinaryUploader
      onImagesUploaded={setImages}
      maxImages={10}
    />
  );
}
```

### **Mostrar imágenes optimizadas:**

```tsx
import { CldImage } from 'next-cloudinary';

<CldImage
  src="https://res.cloudinary.com/tu-cloud/image/upload/v123/abc.jpg"
  width={800}
  height={600}
  alt="Propiedad"
  quality={80}
  format="auto" // Automáticamente WebP si el navegador lo soporta
/>
```

---

## 💡 Tips Pro

### **1. Estructura de folders:**

```
inhabitme/
├── properties/
│   ├── property-123/
│   │   ├── main.jpg
│   │   ├── bedroom.jpg
│   │   └── workspace.jpg
└── users/
    └── avatars/
```

### **2. Naming convention:**

```
{propertyId}_{timestamp}_{type}.jpg
Ejemplo: prop-123_1704067200_main.jpg
```

### **3. Transformaciones útiles:**

```typescript
// Thumbnails para listado
w_400,h_300,c_fill,f_auto,q_auto

// Hero image optimizada
w_1920,h_1080,c_fill,f_auto,q_80

// Mobile
w_800,f_auto,q_auto,dpr_2.0
```

---

## 🆘 Troubleshooting

### **Error: "Upload preset must be unsigned"**

✅ Ve a Settings → Upload → Edit preset → Cambia a "Unsigned"

### **Error: "Invalid cloud name"**

✅ Verifica que `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` esté correcto

### **No aparece el modal de upload**

✅ Reinicia el servidor después de configurar .env.local

---

## 🎓 Recursos

- **Docs:** https://cloudinary.com/documentation
- **Next.js Integration:** https://next.cloudinary.dev/
- **Playground:** https://cloudinary.com/playground
- **Support:** https://support.cloudinary.com/

---

## ✅ Checklist

- [ ] Cuenta creada en Cloudinary
- [ ] Cloud Name, API Key, API Secret copiados
- [ ] Upload preset `inhabitme_properties` creado (unsigned)
- [ ] Variables en `.env.local` configuradas
- [ ] Servidor reiniciado
- [ ] Probado en `/test-upload`
- [ ] ¡Funcionando! 🎉

---

**¿Listo para la excelencia?** Cloudinary es lo que usan los profesionales. 💎