import { ImageResponse } from 'next/og'
import { NextRequest } from 'next/server'

export const runtime = 'edge'

// City configurations
const CITIES = {
  madrid: {
    name: 'Madrid',
    color: '#E63946',
    emoji: '🏛️',
    gradient: ['#E63946', '#F77F00'],
  },
  barcelona: {
    name: 'Barcelona',
    color: '#06AED5',
    emoji: '🏖️',
    gradient: ['#06AED5', '#086788'],
  },
  valencia: {
    name: 'Valencia',
    color: '#F77F00',
    emoji: '🍊',
    gradient: ['#F77F00', '#FCBF49'],
  },
  default: {
    name: 'InhabitMe',
    color: '#3B82F6',
    emoji: '🏠',
    gradient: ['#3B82F6', '#8B5CF6'],
  },
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    const city = searchParams.get('city')?.toLowerCase() || 'default'
    const title = searchParams.get('title') || 'Medium-term rentals for digital nomads'
    const subtitle = searchParams.get('subtitle') || 'Verified stays with workspace, fast WiFi & transparent pricing'
    
    const cityConfig = CITIES[city as keyof typeof CITIES] || CITIES.default

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: `linear-gradient(135deg, ${cityConfig.gradient[0]} 0%, ${cityConfig.gradient[1]} 100%)`,
            fontFamily: 'Inter, system-ui, sans-serif',
          }}
        >
          {/* Background pattern */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              opacity: 0.1,
              background: 'radial-gradient(circle at 25% 25%, white 2%, transparent 0%), radial-gradient(circle at 75% 75%, white 2%, transparent 0%)',
              backgroundSize: '60px 60px',
            }}
          />

          {/* Content container */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '80px',
              textAlign: 'center',
              position: 'relative',
            }}
          >
            {/* Emoji/Icon */}
            <div
              style={{
                fontSize: '120px',
                marginBottom: '40px',
              }}
            >
              {cityConfig.emoji}
            </div>

            {/* City name (if not default) */}
            {city !== 'default' && (
              <div
                style={{
                  fontSize: '80px',
                  fontWeight: 'bold',
                  color: 'white',
                  marginBottom: '20px',
                  textShadow: '0 4px 20px rgba(0,0,0,0.2)',
                }}
              >
                {cityConfig.name}
              </div>
            )}

            {/* Title */}
            <div
              style={{
                fontSize: city === 'default' ? '72px' : '56px',
                fontWeight: 'bold',
                color: 'white',
                marginBottom: '30px',
                lineHeight: 1.2,
                textShadow: '0 4px 20px rgba(0,0,0,0.2)',
                maxWidth: '1000px',
              }}
            >
              {title}
            </div>

            {/* Subtitle */}
            <div
              style={{
                fontSize: '32px',
                color: 'rgba(255,255,255,0.95)',
                maxWidth: '900px',
                lineHeight: 1.4,
                textShadow: '0 2px 10px rgba(0,0,0,0.2)',
              }}
            >
              {subtitle}
            </div>

            {/* Bottom branding */}
            <div
              style={{
                position: 'absolute',
                bottom: '60px',
                display: 'flex',
                alignItems: 'center',
                gap: '20px',
              }}
            >
              <div
                style={{
                  fontSize: '40px',
                  fontWeight: 'bold',
                  color: 'white',
                  textShadow: '0 2px 10px rgba(0,0,0,0.3)',
                }}
              >
                InhabitMe
              </div>
              <div
                style={{
                  fontSize: '32px',
                  color: 'rgba(255,255,255,0.8)',
                }}
              >
                •
              </div>
              <div
                style={{
                  fontSize: '32px',
                  color: 'rgba(255,255,255,0.9)',
                  textShadow: '0 2px 10px rgba(0,0,0,0.2)',
                }}
              >
                www.inhabitme.com
              </div>
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    )
  } catch (e: any) {
    console.error('Error generating OG image:', e)
    return new Response(`Failed to generate image: ${e.message}`, {
      status: 500,
    })
  }
}
