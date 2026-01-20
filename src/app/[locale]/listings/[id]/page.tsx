import { notFound } from 'next/navigation'
import { searchListings } from '@/lib/use-cases/search-listings'
import { ThemedListingPage } from '@/components/listings/ThemedListingPage'
import { createClient } from '@supabase/supabase-js'
import { THEME_PRESETS } from '@/lib/domain/listing-theme'

type PageProps = {
  params: { id: string }
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default async function ListingDetailPage({ params }: PageProps) {
  const listings = await searchListings({})
  const listing = listings.find((l) => l.id === params.id)

  if (!listing) {
    notFound()
  }
  
  // Fetch theme if exists
  let theme = THEME_PRESETS.modern // Default
  try {
    const { data: themeData } = await supabase
      .from('listing_themes')
      .select('*')
      .eq('listing_id', params.id)
      .eq('is_active', true)
      .single()
    
    if (themeData) {
      // Reconstruct theme from DB data
      theme = {
        template: themeData.template,
        colors: {
          primary: themeData.primary_color,
          secondary: themeData.secondary_color,
          accent: themeData.accent_color,
        },
        background: {
          type: themeData.background_type,
          gradient: themeData.background_gradient_start ? {
            start: themeData.background_gradient_start,
            end: themeData.background_gradient_end || themeData.background_gradient_start,
          } : undefined,
          solid: themeData.background_solid_color || undefined,
          image: themeData.background_image_url ? {
            url: themeData.background_image_url,
            overlay: themeData.background_overlay_opacity || 0.5,
          } : undefined,
        },
        layout: {
          header: themeData.header_layout,
          gallery: themeData.gallery_style,
          amenities: themeData.amenities_display,
          cta: themeData.cta_position,
        },
        typography: {
          family: themeData.font_family,
          headingStyle: themeData.heading_style,
        },
        metadata: THEME_PRESETS[themeData.template as keyof typeof THEME_PRESETS]?.metadata || {
          name: themeData.template,
          description: 'Custom theme',
          idealFor: [],
        },
      }
    }
  } catch (error) {
    console.error('Error fetching theme:', error)
    // Use default theme on error
  }

  return <ThemedListingPage listing={listing} theme={theme} />
}
