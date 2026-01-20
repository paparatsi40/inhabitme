/**
 * Schema.org para Reviews y Ratings
 * 
 * Prepara estructura para cuando tengamos reviews reales
 * Por ahora muestra 0 reviews (no fake data)
 */

interface ReviewSchemaProps {
  propertyId: string
  propertyName: string
  propertyUrl: string
  reviewCount?: number
  averageRating?: number
  reviews?: Array<{
    author: string
    rating: number
    reviewBody: string
    datePublished: string
  }>
}

export function ReviewSchema({
  propertyId,
  propertyName,
  propertyUrl,
  reviewCount = 0,
  averageRating = 0,
  reviews = []
}: ReviewSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": propertyName,
    "url": propertyUrl,
    "aggregateRating": reviewCount > 0 ? {
      "@type": "AggregateRating",
      "ratingValue": averageRating.toFixed(1),
      "reviewCount": reviewCount,
      "bestRating": "5",
      "worstRating": "1"
    } : undefined,
    "review": reviews.map(review => ({
      "@type": "Review",
      "author": {
        "@type": "Person",
        "name": review.author
      },
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": review.rating,
        "bestRating": "5",
        "worstRating": "1"
      },
      "reviewBody": review.reviewBody,
      "datePublished": review.datePublished
    }))
  }

  // Limpiar undefined
  if (!schema.aggregateRating) {
    delete schema.aggregateRating
  }
  if (schema.review.length === 0) {
    delete schema.review
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

/**
 * Componente UI para mostrar reviews futuras
 */
interface ReviewsListProps {
  reviews?: Array<{
    id: string
    author: string
    avatar?: string
    rating: number
    comment: string
    date: string
  }>
}

export function ReviewsList({ reviews = [] }: ReviewsListProps) {
  if (reviews.length === 0) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
        <div className="text-gray-400 mb-3">
          <svg className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-700 mb-2">
          Aún no hay valoraciones
        </h3>
        <p className="text-sm text-gray-500">
          Esta propiedad es nueva. Sé el primero en dejar una valoración después de tu estancia.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {reviews.map(review => (
        <div key={review.id} className="bg-white border rounded-lg p-6">
          <div className="flex items-start gap-4">
            {review.avatar ? (
              <img src={review.avatar} alt={review.author} className="h-12 w-12 rounded-full" />
            ) : (
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                {review.author.charAt(0).toUpperCase()}
              </div>
            )}
            
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="font-semibold">{review.author}</p>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <svg
                        key={i}
                        className={`h-4 w-4 ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
                <time className="text-sm text-gray-500">{review.date}</time>
              </div>
              <p className="text-gray-700">{review.comment}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
