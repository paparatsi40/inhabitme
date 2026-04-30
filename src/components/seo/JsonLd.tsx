/**
 * Componente genérico para inyectar JSON-LD en cualquier página.
 *
 * Uso:
 *   <JsonLd data={{ '@context': 'https://schema.org', '@type': 'Organization', ... }} />
 *
 * Notas:
 * - Usamos dangerouslySetInnerHTML para no escapar caracteres válidos de JSON.
 * - El script va con type="application/ld+json" que Google espera para Rich Results.
 */
export function JsonLd({ data, id }: { data: Record<string, unknown>; id?: string }) {
  return (
    <script
      type="application/ld+json"
      id={id}
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, '\\u003c'),
      }}
    />
  )
}
