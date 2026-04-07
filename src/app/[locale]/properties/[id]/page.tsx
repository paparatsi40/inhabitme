import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { ThemedListingPage } from '@/components/listings/ThemedListingPage'
import { ThemedListingWrapper } from '@/components/listings/ThemedListingWrapper'
import { ViewTracker } from '@/components/listings/ViewTracker'
import { getSupabaseServerClient } from '@/lib/supabase/server'
import { THEME_PRESETS } from '@/lib/domain/listing-theme'
import { generatePropertyMetadata } from '@/lib/seo/metadata-helpers'

// ISR: regenerar la página a lo sumo cada 60 segundos
export const revalidate = 60

type PageProps = {
  params: Promise<{ id: string; locale: string }>
}

async function getListingById(id: string) {
  try {
    const supabase = getSupabaseServerClient()
    const { data, error } = await supabase
      .from('listings')
      .select('*')
      .eq('id', id)
      .eq('status', 'active')
      .single()

    if (error || !data) return null
    return data
  } catch (err: any) {
    console.error('[PropertyPage] Error fetching listing:', err?.message)
    return null
  }
}

/**
 * Generate dynamic metadata for property pages
 */
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id, locale } = await params
  
  try {
    const listing = await getListingById(id)

    if (!listing) {
      return {
        title: 'Property Not Found | InhabitMe',
        description: 'The property you are looking for could not be found.',
      }
    }

    // Convert listing data to property format for metadata
    const property = {
      id: listing.id,
      title: listing.title,
      description: listing.description,
      city: listing.city_name,
      neighborhood: listing.neighborhood || undefined,
      monthlyPrice: listing.monthly_price,
      images: (listing.images || []).map((img: any) => ({
        url: typeof img === 'string' ? img : img.url,
        alt: `${listing.title} - Image`,
      })),
    }

    return generatePropertyMetadata({
      property,
      locale: locale as 'en' | 'es',
    })
  } catch (error) {
    console.error('[PropertyMetadata] Error generating metadata:', error)
    return {
      title: 'Property | InhabitMe',
      description: 'View this property on InhabitMe',
    }
  }
}

export default async function PropertyDetailPage({ params }: PageProps) {
  const { id } = await params
  console.log('[PropertyPage] 🔍 Loading property ID:', id)
  
  try {
    // Obtener el listing directamente de Supabase
    const listing = await getListingById(id)

    if (!listing) {
      console.log('[PropertyPage] ❌ Listing not found for ID:', id)
      notFound()
    }
    
    console.log('[PropertyPage] ✅ Found listing:', listing.title)

    // Crear cliente de Supabase para tema
    const supabase = getSupabaseServerClient()

    // Obtener el tema del listing (si existe)
    const { data: themeData } = await supabase
      .from('listing_themes')
      .select('*')
      .eq('listing_id', id)
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
        <ViewTracker listingId={id} />
        <ThemedListingPage listing={listing} theme={theme} />
      </ThemedListingWrapper>
    )
  } catch (error) {
    console.error('[PropertyPage] Error:', error)
    notFound()
  }
}
