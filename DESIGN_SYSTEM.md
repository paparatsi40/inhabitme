# 🎨 inhabitme Design System

## 📐 Design Tokens

### Colors

#### Brand Colors
```tsx
// Gradientes principales (azul → morado)
from-brand-blue-500 to-brand-purple-600    // CTA principal
from-brand-blue-50 to-brand-purple-50      // Backgrounds suaves

// Colores individuales
brand-blue-600    // Links, botones primarios
brand-purple-600  // Acentos, precios destacados
```

#### Trust Colors
```tsx
trust-success  // Verde - Verificado, correcto
trust-warning  // Amarillo - Advertencias
trust-info     // Azul - Información
```

---

## 📏 Spacing

### Section Spacing
```tsx
mb-section       // 3rem (48px) - Entre secciones
mb-section-lg    // 4rem (64px) - Entre secciones grandes
```

### Card Spacing
```tsx
p-card          // 1.5rem (24px) - Padding interno cards
p-card-sm       // 1rem (16px) - Padding pequeño
```

### Responsive Spacing Pattern
```tsx
// Mobile → Desktop
p-4 sm:p-6 md:p-8 lg:p-12
mb-8 lg:mb-10
gap-3 sm:gap-4
```

---

## 📝 Typography

### Scale
```tsx
text-hero          // 40px - Títulos hero (mobile)
text-hero-lg       // 48px - Títulos hero (desktop)
text-section-title // 24px - Títulos de sección
text-card-title    // 18px - Títulos de card
```

### Responsive Pattern
```tsx
// Mobile → Desktop
text-2xl sm:text-3xl md:text-4xl
text-xl sm:text-2xl
```

---

## 🎴 Border Radius

```tsx
rounded-card       // 12px - Cards estándar
rounded-card-lg    // 16px - Cards grandes
rounded-card-xl    // 24px - Secciones destacadas
```

---

## 🧱 Component Patterns

### Hero Section
```tsx
<header className="bg-gradient-to-br from-brand-blue-50 to-brand-purple-50 rounded-card-xl p-4 sm:p-6 md:p-8 lg:p-12 mb-section">
  <Badge className="bg-brand-purple-100 text-brand-purple-700">
    ✓ Badge contextual
  </Badge>
  
  <h1 className="text-hero md:text-hero-lg">
    Título Principal
  </h1>
  
  <p className="text-gray-600">
    Descripción concisa
  </p>
</header>
```

### Card Standard
```tsx
<Card className="p-card rounded-card hover:shadow-lg transition">
  <h3 className="text-card-title mb-2">Título</h3>
  <p className="text-sm text-gray-600">Contenido</p>
</Card>
```

### CTA Button
```tsx
<Button className="bg-gradient-to-r from-brand-blue-600 to-brand-purple-600 hover:from-brand-blue-700 hover:to-brand-purple-700">
  Acción Principal →
</Button>
```

### Sticky CTA Mobile
```tsx
<div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t shadow-2xl z-50 p-4">
  <Button size="lg" className="w-full">
    CTA Visible
  </Button>
</div>
```

### Grid Responsive
```tsx
{/* Barrios/Cards */}
<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
  ...
</div>

{/* Features (siempre 4 cols o menos) */}
<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
  ...
</div>
```

---

## 🎯 Breakpoints

```tsx
// Mobile-first
Base:  < 640px
sm:    640px+   (tablet)
md:    768px+   (desktop pequeño)
lg:    1024px+  (desktop)
xl:    1280px+  (desktop grande)
```

---

## ✅ Best Practices

### DO ✅
- Usar tokens del design system (`brand-blue-600` no `blue-600`)
- Spacing consistente (`mb-section` no `mb-10`)
- Typography scale (`text-hero` no `text-4xl`)
- Gradientes de marca (`from-brand-blue-500 to-brand-purple-600`)

### DON'T ❌
- No usar colores Tailwind default directamente
- No mezclar spacing arbitrarios (usar tokens)
- No hardcodear tamaños sin responsive
- No usar border-radius inconsistentes

---

## 🚀 Uso en Código

### Antes:
```tsx
<div className="bg-blue-50 rounded-lg p-6 mb-10">
  <h2 className="text-3xl font-bold">Título</h2>
</div>
```

### Después (con Design System):
```tsx
<div className="bg-gradient-to-br from-brand-blue-50 to-brand-purple-50 rounded-card p-card mb-section">
  <h2 className="text-section-title">Título</h2>
</div>
```

---

## 📊 Ventajas

✅ **Consistencia visual** - Mismo look en todo el sitio
✅ **Mantenibilidad** - Cambiar tokens = actualiza todo
✅ **Velocidad** - No pensar en valores cada vez
✅ **Escalabilidad** - Fácil añadir nuevas páginas
✅ **Onboarding** - Nuevos devs saben qué usar

---

**Version:** 1.0.0  
**Last updated:** Enero 2026
