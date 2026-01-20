import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/features/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      // inhabitme Design System Tokens
      colors: {
        // Brand colors (consistencia en gradientes)
        brand: {
          blue: {
            50: '#eff6ff',
            100: '#dbeafe',
            500: '#3b82f6',
            600: '#2563eb',
            700: '#1d4ed8',
          },
          purple: {
            50: '#faf5ff',
            100: '#f3e8ff',
            500: '#a855f7',
            600: '#9333ea',
            700: '#7e22ce',
          },
        },
        // Trust colors
        trust: {
          success: '#10b981',
          warning: '#f59e0b',
          info: '#3b82f6',
        },
      },
      spacing: {
        // Consistent spacing scale
        section: '3rem',      // 48px - espaciado entre secciones
        'section-lg': '4rem', // 64px - espaciado grande entre secciones
        card: '1.5rem',       // 24px - padding interno de cards
        'card-sm': '1rem',    // 16px - padding pequeño de cards
      },
      fontSize: {
        // Typography scale
        'hero': ['2.5rem', { lineHeight: '1.2', fontWeight: '700' }],      // 40px
        'hero-lg': ['3rem', { lineHeight: '1.1', fontWeight: '700' }],     // 48px
        'section-title': ['1.5rem', { lineHeight: '1.3', fontWeight: '600' }], // 24px
        'card-title': ['1.125rem', { lineHeight: '1.4', fontWeight: '600' }],  // 18px
      },
      borderRadius: {
        // Consistent border radius
        card: '0.75rem',      // 12px - cards estándar
        'card-lg': '1rem',    // 16px - cards grandes
        'card-xl': '1.5rem',  // 24px - secciones destacadas
      },
    },
  },
  plugins: [],
};

export default config;
