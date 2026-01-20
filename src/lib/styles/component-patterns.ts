/**
 * Component Patterns - inhabitme Design System
 * 
 * Clases reutilizables para mantener consistencia visual
 */

// CARDS
export const cardPatterns = {
  base: 'bg-white rounded-xl border border-gray-200 p-6',
  hover: 'hover:shadow-md hover:border-brand-600 transition-all duration-300',
  featured: 'bg-gradient-to-br from-brand-50 to-accent-50 border-2 border-brand-200',
}

// BUTTONS
export const buttonPatterns = {
  primary: 'bg-brand-600 hover:bg-brand-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors',
  secondary: 'bg-white border-2 border-brand-600 text-brand-600 hover:bg-brand-50 font-semibold px-6 py-3 rounded-lg transition-colors',
  ghost: 'text-brand-600 hover:bg-brand-50 font-semibold px-6 py-3 rounded-lg transition-colors',
}

// TYPOGRAPHY
export const typographyPatterns = {
  h1: 'text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight',
  h2: 'text-2xl md:text-3xl font-bold text-gray-900',
  h3: 'text-xl md:text-2xl font-semibold text-gray-900',
  body: 'text-base text-gray-700 leading-relaxed',
  small: 'text-sm text-gray-600',
}

// SECTIONS
export const sectionPatterns = {
  container: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8',
  spacing: 'py-12 lg:py-16',
  spacingSmall: 'py-8 lg:py-10',
}

// BADGES
export const badgePatterns = {
  primary: 'bg-brand-100 text-brand-700 px-3 py-1 rounded-full text-sm font-semibold',
  accent: 'bg-accent-100 text-accent-700 px-3 py-1 rounded-full text-sm font-semibold',
  success: 'bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold',
}

// TOUCH TARGETS (Mobile)
export const touchPatterns = {
  button: 'min-h-[44px] min-w-[44px]', // Apple/Google guidelines
  icon: 'p-3', // Ensure 44x44px minimum
}
