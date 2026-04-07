# Cómo Agregar una Nueva Ciudad

## Paso 1: Agregar a `src/config/cities.ts`

Añadir objeto al array `CITIES`:

```typescript
{
  slug: 'berlin',
  name: 'Berlin',
  subtitle: 'Tech hub europeo',
  price: '700 EUR',
  country: 'DE',
  image: 'https://images.unsplash.com/photo-1560969184-10fe8719e047?w=800&h=600&fit=crop&q=80',
  gradient: 'from-gray-600 to-gray-800',
  hoverBorder: 'hover:border-gray-400',
  textColor: 'text-gray-600',
  description: 'Berlín para nómadas digitales: creatividad, historia y tecnología.',
  indexable: true,
  neighborhoods: [
    { slug: 'mitte', name: 'Mitte', description: 'Céntrico y histórico' },
    { slug: 'kreuzberg', name: 'Kreuzberg', description: 'Alternativo y multicultural' },
    { slug: 'friedrichshain', name: 'Friedrichshain', description: 'Vibrante y creativo' },
    { slug: 'neukolln', name: 'Neukölln', description: 'Trendy y emergente' },
  ],
  coordinates: { lat: 52.52, lng: 13.405, zoom: 13 },
}
```

## Paso 2: Agregar descripciones a `messages/en.json`

Buscar la sección `"neighborhoods"` y agregar:

```json
"berlin": {
  "mitte": "The historic heart of Berlin. Government district, Brandenburg Gate, and Museum Island. Perfect for professionals who need to be at the center of everything.",
  "kreuzberg": "Berlin's alternative and multicultural epicenter. Street art, international food scene, and vibrant nightlife. Ideal for creatives and free spirits.",
  "friedrichshain": "Young, vibrant, and full of energy. Former East Berlin district with clubs, cafés, and a strong creative community. Perfect for digital nomads.",
  "neukolln": "Berlin's trendy up-and-coming neighborhood. International community, artisanal cafés, and a mix of old and new. Great for young professionals."
}
```

## Paso 3: Agregar descripciones a `messages/es.json`

Misma estructura, traducida:

```json
"berlin": {
  "mitte": "El corazón histórico de Berlín. Distrito gubernamental, Puerta de Brandeburgo e Isla de los Museos. Perfecto para profesionales que necesitan estar en el centro.",
  "kreuzberg": "Epicentro alternativo y multicultural de Berlín. Arte urbano, escena gastronómica internacional y vida nocturna vibrante. Ideal para creativos.",
  "friedrichshain": "Joven, vibrante y lleno de energía. Antiguo distrito de Berlín Este con clubs, cafés y fuerte comunidad creativa. Perfecto para nómadas digitales.",
  "neukolln": "El barrio trendy y emergente de Berlín. Comunidad internacional, cafés artesanales y mezcla de lo antiguo y nuevo. Excelente para jóvenes profesionales."
}
```

## Paso 4: Verificar

Reiniciar el servidor y verificar:

1. **Homepage**: Ciudad aparece en grilla y carrusel
2. **Página de ciudad**: `/en/berlin` funciona
3. **Página de barrio**: `/en/berlin/mitte` muestra descripción en inglés
4. **Versión ES**: `/es/berlin/mitte` muestra descripción en español

## Checklist Rápido

- [ ] Ciudad en `CITIES` array
- [ ] Descripciones en `messages/en.json`
- [ ] Descripciones en `messages/es.json`
- [ ] JSON válido (sin comas finales)
- [ ] Server reiniciado
- [ ] URLs funcionan sin 404

## Solución de Problemas

### 404 en la nueva ciudad

Verificar que el middleware está activo:
- Archivo `src/middleware.ts` existe
- Incluye `clerkMiddleware` y `next-intl`

### Descripción no aparece traducida

Verificar la clave en JSON:
```
neighborhoods.{ciudad}.{barrio}
```

Ejemplo: `neighborhoods.berlin.mitte`

### Imagen no carga

Verificar URL de Unsplash incluye parámetros:
```
?w=800&h=600&fit=crop&q=80
```

## Recursos

- **Imágenes Unsplash**: https://unsplash.com (buscar ciudad, copiar URL de imagen)
- **Coordenadas GPS**: Google Maps → Click derecho → "Copiar coordenadas"
- **Códigos ISO de países**: https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2
