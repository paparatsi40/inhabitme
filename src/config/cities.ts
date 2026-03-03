// src/config/cities.ts
export type City = {
  slug: string;
  name: string;
  subtitle: string;
  description: string;       // para metadata/SEO
  imageUrl?: string;         // para carousel/grid
  fromPriceEur?: number;     // para el grid (opcional)
  gradient?: string;         // si quieres estilos por ciudad
  hoverBorder?: string;
  textColor?: string;
};

export const CITIES: City[] = [
  {
    slug: "madrid",
    name: "Madrid",
    subtitle: "Capital de España",
    description: "Descubre Madrid: alojamientos verificados para estancias de 1-12 meses.",
    imageUrl:
      "https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=800&h=600&fit=crop&q=80",
    fromPriceEur: 800,
    gradient: "from-blue-600 to-blue-800",
    hoverBorder: "hover:border-blue-400",
    textColor: "text-blue-600",
  },
  // ... resto
  {
    slug: "austin",
    name: "Austin",
    subtitle: "Tech hub de Texas",
    description: "Austin, Texas: capital tech del Lone Star State.",
    imageUrl:
      "https://images.unsplash.com/photo-1531218150217-54595bc2b934?w=800&h=600&fit=crop&q=80",
  },
];

export const CITIES_BY_SLUG: Record<string, City> = Object.fromEntries(
  CITIES.map((c) => [c.slug, c]),
);