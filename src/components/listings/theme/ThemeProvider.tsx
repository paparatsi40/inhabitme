'use client'

import { createContext, useContext, ReactNode } from 'react'
import { ListingTheme, generateThemeStyles, FONT_FAMILIES } from '@/lib/domain/listing-theme'

interface ThemeContextValue {
  theme: ListingTheme
  isDefault: boolean
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

export function useListingTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useListingTheme must be used within ThemeProvider')
  }
  return context
}

interface ThemeProviderProps {
  theme: ListingTheme
  isDefault?: boolean
  children: ReactNode
}

export function ThemeProvider({ theme, isDefault = false, children }: ThemeProviderProps) {
  const styles = generateThemeStyles(theme)
  const fontFamily = FONT_FAMILIES[theme?.typography?.family || 'inter'] || FONT_FAMILIES.inter

  return (
    <ThemeContext.Provider value={{ theme, isDefault }}>
      <style jsx global>{`
        ${fontFamily.import}
        
        .themed-listing {
          font-family: ${fontFamily.cssFamily};
        }
        
        .themed-listing h1,
        .themed-listing h2,
        .themed-listing h3,
        .themed-listing h4 {
          font-family: ${fontFamily.cssFamily};
        }
        
        /* Heading styles */
        .heading-bold h1,
        .heading-bold h2,
        .heading-bold h3 {
          font-weight: 800;
          letter-spacing: -0.02em;
        }
        
        .heading-elegant h1,
        .heading-elegant h2,
        .heading-elegant h3 {
          font-weight: 600;
          letter-spacing: 0.01em;
        }
        
        .heading-clean h1,
        .heading-clean h2,
        .heading-clean h3 {
          font-weight: 500;
          letter-spacing: -0.01em;
        }
        
        /* Primary button using theme colors */
        .btn-primary {
          background-color: var(--color-primary);
          border-color: var(--color-primary);
        }
        
        .btn-primary:hover {
          background-color: var(--color-secondary);
          border-color: var(--color-secondary);
        }
        
        .btn-accent {
          background-color: var(--color-accent);
          border-color: var(--color-accent);
        }
        
        /* Link colors */
        .themed-listing a {
          color: var(--color-primary);
        }
        
        .themed-listing a:hover {
          color: var(--color-secondary);
        }
        
        /* Badge with accent color */
        .badge-accent {
          background-color: var(--color-accent);
          color: white;
        }
        
        /* Smooth transitions */
        .themed-listing * {
          transition: background-color 0.2s ease, color 0.2s ease;
        }
      `}</style>
      
      <div 
        className={`themed-listing heading-${theme.typography.headingStyle}`}
        style={styles}
      >
        {children}
      </div>
    </ThemeContext.Provider>
  )
}
