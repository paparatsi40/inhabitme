'use client'

import { ThemeProvider } from './theme/ThemeProvider'
import { HeroHeader } from './variants/headers/HeroHeader'
import { SplitHeader } from './variants/headers/SplitHeader'
import { CompactHeader } from './variants/headers/CompactHeader'
import { MinimalHeader } from './variants/headers/MinimalHeader'
import { FullscreenHeader } from './variants/headers/FullscreenHeader'
import { GridGallery } from './variants/galleries/GridGallery'
import { SliderGallery } from './variants/galleries/SliderGallery'
import { MasonryGallery } from './variants/galleries/MasonryGallery'
import { FullscreenGallery } from './variants/galleries/FullscreenGallery'
import { AmenitiesDisplay } from './variants/amenities/AmenitiesDisplay'
import { CTASection } from './variants/cta/CTASection'
import { ListingTheme, THEME_PRESETS } from '@/lib/domain/listing-theme'

interface ThemedListingPageProps {
  listing: {
    id: string
    title: string
    city: string
    country: string
    rating?: number
    review_count?: number
    images: string[]
    featured?: boolean
    description: string
    monthly_price: number
    amenities?: any[]
  }
  theme?: ListingTheme
}

export function ThemedListingPage({ listing, theme }: ThemedListingPageProps) {
  // Use provided theme or default to modern
  const activeTheme = theme || THEME_PRESETS.modern
  
  const location = `${listing.city}, ${listing.country}`
  
  // Select Header Component
  const HeaderComponent = {
    hero: HeroHeader,
    split: SplitHeader,
    compact: CompactHeader,
    minimal: MinimalHeader,
    fullscreen: FullscreenHeader,
  }[activeTheme.layout.header] || HeroHeader
  
  // Select Gallery Component
  const GalleryComponent = {
    grid: GridGallery,
    slider: SliderGallery,
    masonry: MasonryGallery,
    fullscreen: FullscreenGallery,
  }[activeTheme.layout.gallery] || GridGallery
  
  return (
    <ThemeProvider theme={activeTheme}>
      <div className="min-h-screen">
        {/* Header */}
        <HeaderComponent
          title={listing.title}
          location={location}
          rating={listing.rating}
          reviewCount={listing.review_count}
          images={listing.images}
          primaryColor={activeTheme.colors.primary}
          isFeatured={listing.featured}
        />
        
        {/* Gallery */}
        <div className="container mx-auto px-4">
          <GalleryComponent
            images={listing.images}
            title={listing.title}
            primaryColor={activeTheme.colors.primary}
          />
          
          {/* Description */}
          <div className="mb-12">
            <h2 
              className="text-2xl font-bold mb-4"
              style={{ color: activeTheme.colors.primary }}
            >
              About this place
            </h2>
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-700 leading-relaxed">{listing.description}</p>
            </div>
          </div>
          
          {/* Amenities */}
          {listing.amenities && Object.keys(listing.amenities).length > 0 && (
            <div className="mb-12">
              <h2 
                className="text-2xl font-bold mb-6"
                style={{ color: activeTheme.colors.primary }}
              >
                Comodidades
              </h2>
              <AmenitiesDisplay
                amenities={listing.amenities as unknown as Record<string, boolean | number>}
                variant={activeTheme.layout.amenities}
                colors={activeTheme.colors}
              />
            </div>
          )}
          
          {/* CTA Section */}
          <CTASection
            variant={activeTheme.layout.cta}
            colors={activeTheme.colors}
            monthlyPrice={listing.monthly_price}
            onBooking={() => {
              // Handle booking modal or redirect
              console.log('Book now clicked')
            }}
          />
        </div>
      </div>
    </ThemeProvider>
  )
}
