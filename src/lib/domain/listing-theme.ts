// ============================================
// LISTING THEME TYPES & PRESETS
// InhabitMe - Personalizable Listing Pages
// ============================================

export type TemplateId = 'modern' | 'cozy' | 'vibrant' | 'minimal' | 'luxury'

export type BackgroundType = 'gradient' | 'solid' | 'image'
export type HeaderLayout = 'hero' | 'split' | 'compact' | 'minimal' | 'fullscreen'
export type GalleryStyle = 'grid' | 'masonry' | 'slider' | 'fullscreen'
export type AmenitiesDisplay = 'list' | 'grid' | 'badges' | 'icons'
export type CtaPosition = 'fixed' | 'floating' | 'inline'
export type FontFamily = 'inter' | 'playfair' | 'montserrat' | 'roboto' | 'lora'
export type HeadingStyle = 'bold' | 'elegant' | 'clean'

export interface ThemeColors {
  primary: string
  secondary: string
  accent: string
}

export interface ThemeBackground {
  type: BackgroundType
  gradient?: {
    start: string
    end: string
  }
  solid?: string
  image?: {
    url: string
    overlay: number
  }
}

export interface ThemeLayout {
  header: HeaderLayout
  gallery: GalleryStyle
  amenities: AmenitiesDisplay
  cta: CtaPosition
}

export interface ThemeTypography {
  family: FontFamily
  headingStyle: HeadingStyle
}

export interface ThemeAdvanced {
  customLogo?: string
  videoIntro?: string
  hostBioExtended?: string
  hostTagline?: string
  showHostBadge?: boolean
}

export interface ListingTheme {
  template: TemplateId
  colors: ThemeColors
  background: ThemeBackground
  layout: ThemeLayout
  typography: ThemeTypography
  advanced?: ThemeAdvanced
}

// ============================================
// TEMPLATE PRESETS
// ============================================

export const THEME_PRESETS: Record<TemplateId, ListingTheme> = {
  modern: {
    template: 'modern',
    colors: {
      primary: '#667eea',
      secondary: '#764ba2',
      accent: '#10b981',
    },
    background: {
      type: 'gradient',
      gradient: {
        start: '#667eea',
        end: '#764ba2',
      },
    },
    layout: {
      header: 'hero',
      gallery: 'grid',
      amenities: 'grid',
      cta: 'fixed',
    },
    typography: {
      family: 'inter',
      headingStyle: 'bold',
    },
  },

  cozy: {
    template: 'cozy',
    colors: {
      primary: '#d97706',
      secondary: '#f59e0b',
      accent: '#ef4444',
    },
    background: {
      type: 'gradient',
      gradient: {
        start: '#fef3c7',
        end: '#fed7aa',
      },
    },
    layout: {
      header: 'split',
      gallery: 'slider',
      amenities: 'list',
      cta: 'inline',
    },
    typography: {
      family: 'playfair',
      headingStyle: 'elegant',
    },
  },

  vibrant: {
    template: 'vibrant',
    colors: {
      primary: '#ec4899',
      secondary: '#8b5cf6',
      accent: '#f59e0b',
    },
    background: {
      type: 'gradient',
      gradient: {
        start: '#fae8ff',
        end: '#fbcfe8',
      },
    },
    layout: {
      header: 'hero',
      gallery: 'masonry',
      amenities: 'badges',
      cta: 'fixed', // Cambiar a fixed para mejor visibilidad de ambos botones
    },
    typography: {
      family: 'montserrat',
      headingStyle: 'bold',
    },
  },

  minimal: {
    template: 'minimal',
    colors: {
      primary: '#1f2937',
      secondary: '#6b7280',
      accent: '#3b82f6',
    },
    background: {
      type: 'solid',
      solid: '#ffffff',
    },
    layout: {
      header: 'compact',
      gallery: 'grid',
      amenities: 'icons',
      cta: 'inline',
    },
    typography: {
      family: 'inter',
      headingStyle: 'clean',
    },
  },

  luxury: {
    template: 'luxury',
    colors: {
      primary: '#000000',
      secondary: '#1f2937',
      accent: '#d97706',
    },
    background: {
      type: 'gradient',
      gradient: {
        start: '#111827',
        end: '#1f2937',
      },
    },
    layout: {
      header: 'fullscreen',
      gallery: 'slider',
      amenities: 'icons',
      cta: 'fixed',
    },
    typography: {
      family: 'playfair',
      headingStyle: 'elegant',
    },
  },
}

// ============================================
// TEMPLATE METADATA
// ============================================

export interface TemplateMetadata {
  id: TemplateId
  name: string
  description: string
  preview: string
  idealFor: string[]
  features: string[]
  tier: 'free' | 'founding' | 'premium'
}

export const TEMPLATE_METADATA: Record<TemplateId, TemplateMetadata> = {
  modern: {
    id: 'modern',
    name: 'Modern Professional',
    description: 'Clean, modern design perfect for digital nomads and professionals',
    preview: '/templates/modern-preview.jpg',
    idealFor: ['Digital Nomads', 'Professionals', 'Remote Workers'],
    features: ['Hero header', 'Grid gallery', 'Fixed CTA'],
    tier: 'free',
  },

  cozy: {
    id: 'cozy',
    name: 'Cozy & Warm',
    description: 'Warm, inviting design for families and long-term stays',
    preview: '/templates/cozy-preview.jpg',
    idealFor: ['Families', 'Long-term Stays', 'Homey Atmosphere'],
    features: ['Split header', 'Slider gallery', 'Inline CTA'],
    tier: 'free',
  },

  vibrant: {
    id: 'vibrant',
    name: 'Vibrant & Creative',
    description: 'Bold, creative design for unique properties and artistic spaces',
    preview: '/templates/vibrant-preview.jpg',
    idealFor: ['Artists', 'Creatives', 'Young Professionals', 'Unique Spaces'],
    features: ['Masonry gallery', 'Badge amenities', 'Floating CTA'],
    tier: 'founding',
  },

  minimal: {
    id: 'minimal',
    name: 'Minimalist & Clean',
    description: 'Ultra-clean, minimal design for modern spaces',
    preview: '/templates/minimal-preview.jpg',
    idealFor: ['Minimalists', 'Modern Spaces', 'Professionals'],
    features: ['Compact header', 'Icon amenities', 'Clean layout'],
    tier: 'founding',
  },

  luxury: {
    id: 'luxury',
    name: 'Luxury Premium',
    description: 'Elegant, high-end design for luxury properties',
    preview: '/templates/luxury-preview.jpg',
    idealFor: ['Luxury Properties', 'High-End Rentals', 'Premium Spaces'],
    features: ['Fullscreen header', 'Elegant typography', 'Premium feel'],
    tier: 'founding',
  },
}

// ============================================
// HELPER FUNCTIONS
// ============================================

export function getDefaultTheme(): ListingTheme {
  return THEME_PRESETS.modern
}

export function getThemePreset(templateId: TemplateId): ListingTheme {
  return THEME_PRESETS[templateId] || THEME_PRESETS.modern
}

export function isFoundingHostTemplate(templateId: TemplateId): boolean {
  return TEMPLATE_METADATA[templateId].tier === 'founding'
}

export function getAvailableTemplates(isFoundingHost: boolean): TemplateId[] {
  // Todos los templates están disponibles para todos los hosts
  return Object.keys(THEME_PRESETS) as TemplateId[]
}

export function validateThemeColors(colors: ThemeColors): boolean {
  const hexColorRegex = /^#[0-9A-F]{6}$/i
  
  return (
    hexColorRegex.test(colors.primary) &&
    hexColorRegex.test(colors.secondary) &&
    hexColorRegex.test(colors.accent)
  )
}

export function getContrastingTextColor(hexColor: string): 'light' | 'dark' {
  // Convertir hex a RGB
  const r = parseInt(hexColor.slice(1, 3), 16)
  const g = parseInt(hexColor.slice(3, 5), 16)
  const b = parseInt(hexColor.slice(5, 7), 16)
  
  // Calcular luminosidad
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  
  return luminance > 0.5 ? 'dark' : 'light'
}

// Font families con sus respectivos Google Fonts imports
export const FONT_FAMILIES = {
  inter: {
    name: 'Inter',
    import: '@import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap");',
    cssFamily: "'Inter', sans-serif",
  },
  playfair: {
    name: 'Playfair Display',
    import: '@import url("https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700;800&display=swap");',
    cssFamily: "'Playfair Display', serif",
  },
  montserrat: {
    name: 'Montserrat',
    import: '@import url("https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&display=swap");',
    cssFamily: "'Montserrat', sans-serif",
  },
  roboto: {
    name: 'Roboto',
    import: '@import url("https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700;900&display=swap");',
    cssFamily: "'Roboto', sans-serif",
  },
  lora: {
    name: 'Lora',
    import: '@import url("https://fonts.googleapis.com/css2?family=Lora:wght@400;500;600;700&display=swap");',
    cssFamily: "'Lora', serif",
  },
}

// Generar CSS inline styles desde theme
export function generateThemeStyles(theme: ListingTheme): React.CSSProperties {
  const { colors, background } = theme
  
  let backgroundStyle: React.CSSProperties = {}
  
  // Protección: verificar que background existe
  if (background && background.type) {
    if (background.type === 'gradient' && background.gradient) {
      backgroundStyle.background = `linear-gradient(135deg, ${background.gradient.start} 0%, ${background.gradient.end} 100%)`
    } else if (background.type === 'solid' && background.solid) {
      backgroundStyle.backgroundColor = background.solid
    } else if (background.type === 'image' && background.image) {
      backgroundStyle.backgroundImage = `linear-gradient(rgba(0,0,0,${background.image.overlay}), rgba(0,0,0,${background.image.overlay})), url('${background.image.url}')`
      backgroundStyle.backgroundSize = 'cover'
      backgroundStyle.backgroundPosition = 'center'
    }
  }
  
  return {
    ...backgroundStyle,
    '--color-primary': colors?.primary || '#667eea',
    '--color-secondary': colors?.secondary || '#764ba2',
    '--color-accent': colors?.accent || '#10b981',
  } as React.CSSProperties
}
