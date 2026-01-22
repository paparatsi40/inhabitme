import { notFound } from 'next/navigation'
import { searchListings } from '@/lib/use-cases/search-listings'
import { ThemedListingPage } from '@/components/listings/ThemedListingPage'
import { ThemedListingWrapper } from '@/components/listings/ThemedListingWrapper'
import { ViewTracker } from '@/components/listings/ViewTracker'
import { createClient } from '@supabase/supabase-js'
import { THEME_PRESETS } from '@/lib/domain/listing-theme'

// Desactivar caché para esta página - siempre obtener datos frescos
export const dynamic = 'force-dynamic'
export const revalidate = 0

type PageProps = {
  params: { id: string }
}

export default async function PropertyDetailPage({ params }: PageProps) {
  console.log('[PropertyPage] 🔍 Loading property ID:', params.id)
  
  try {
    // Buscar el listing específico
    console.log('[PropertyPage] 📡 Calling searchListings...')
    const listings = await searchListings({
      page: 1,
      limit: 1,
      listingId: params.id,
    })

    console.log('[PropertyPage] 📊 Got', listings.length, 'listings')
    console.log('[PropertyPage] 📋 Listing IDs:', listings.map(l => l.id))

    // Buscar el listing correcto por ID
    const listing = listings.find(l => l.id === params.id)

    if (!listing) {
      console.log('[PropertyPage] ❌ Listing not found for ID:', params.id)
      notFound()
    }
    
    console.log('[PropertyPage] ✅ Found listing:', listing.title)

    // Crear cliente de Supabase
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    // Obtener el tema del listing (si existe)
    const { data: themeData } = await supabase
      .from('listing_themes')
      .select('*')
      .eq('listing_id', params.id)
      .single()

    // Transformar datos planos de DB a estructura anidada que espera el código
    const theme = themeData ? {
      template: themeData.template || 'modern',
      colors: {
        primary: themeData.primary_color || THEME_PRESETS.modern.colors.primary,
        secondary: themeData.secondary_color || THEME_PRESETS.modern.colors.secondary,
        accent: themeData.accent_color || THEME_PRESETS.modern.colors.accent,
      },
      background: {
        type: themeData.background_type || 'gradient',
        ...(themeData.background_type === 'gradient' && {
          gradient: {
            start: themeData.background_gradient_start || THEME_PRESETS.modern.background.gradient!.start,
            end: themeData.background_gradient_end || THEME_PRESETS.modern.background.gradient!.end,
          }
        }),
        ...(themeData.background_type === 'solid' && {
          solid: themeData.background_solid_color || '#ffffff'
        }),
        ...(themeData.background_type === 'image' && themeData.background_image_url && {
          image: {
            url: themeData.background_image_url,
            overlay: themeData.background_overlay_opacity || 0.5
          }
        }),
      },
      layout: {
        header: themeData.header_layout || 'hero',
        gallery: themeData.gallery_style || 'grid',
        amenities: themeData.amenities_display || 'grid',
        cta: themeData.cta_position || 'fixed',
      },
      typography: {
        family: themeData.font_family || 'inter',
        headingStyle: themeData.heading_style || 'bold',
      },
      customLogo: themeData.custom_logo_url || undefined,
      videoIntro: themeData.video_intro_url || undefined,
      hostBioExtended: themeData.host_bio_extended || undefined,
    } : THEME_PRESETS.modern

    return (
      <ThemedListingWrapper theme={theme}>
        <ViewTracker listingId={params.id} />
        <ThemedListingPage listing={listing} theme={theme} />
      </ThemedListingWrapper>
    )
  } catch (error) {
    console.error('[PropertyPage] Error:', error)
    notFound()
  }
}
