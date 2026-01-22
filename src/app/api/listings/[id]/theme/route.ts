import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { auth } from '@clerk/nextjs/server';
import { createClient } from '@supabase/supabase-js';
import { ListingTheme, validateThemeColors, THEME_PRESETS, isFoundingHostTemplate } from '@/lib/domain/listing-theme';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Helper para verificar si es Founding Host
async function isFoundingHost(userId: string): Promise<boolean> {
  try {
    const { sessionClaims } = await auth();
    const publicMetadata = (sessionClaims as any)?.public_metadata || {};
    const unsafeMetadata = (sessionClaims as any)?.unsafe_metadata || {};
    const metadata = { ...publicMetadata, ...unsafeMetadata };
    
    return (
      metadata.role === 'founding_host' && 
      (metadata.founding_host_year === 2026 || metadata.founding_host_year === '2026')
    );
  } catch {
    return false;
  }
}

// GET - Obtener theme de un listing
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const listingId = params.id;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Obtener theme del listing
    const { data: theme, error } = await supabase
      .from('listing_themes')
      .select('*')
      .eq('listing_id', listingId)
      .eq('is_active', true)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows found
      console.error('Error fetching theme:', error);
      return NextResponse.json({ error: 'Failed to fetch theme' }, { status: 500 });
    }

    // Si no hay theme, retornar default
    if (!theme) {
      return NextResponse.json({
        theme: THEME_PRESETS.modern,
        isDefault: true
      });
    }

    // Mapear datos de DB a formato del dominio
    const themeConfig: ListingTheme = {
      template: theme.template,
      colors: {
        primary: theme.primary_color,
        secondary: theme.secondary_color,
        accent: theme.accent_color,
      },
      background: {
        type: theme.background_type,
        gradient: theme.background_type === 'gradient' ? {
          start: theme.background_gradient_start,
          end: theme.background_gradient_end,
        } : undefined,
        solid: theme.background_type === 'solid' ? theme.background_solid_color : undefined,
        image: theme.background_type === 'image' ? {
          url: theme.background_image_url,
          overlay: theme.background_overlay_opacity,
        } : undefined,
      },
      layout: {
        header: theme.header_layout,
        gallery: theme.gallery_style,
        amenities: theme.amenities_display,
        cta: theme.cta_position,
      },
      typography: {
        family: theme.font_family,
        headingStyle: theme.heading_style,
      },
      advanced: {
        customLogo: theme.custom_logo_url,
        videoIntro: theme.video_intro_url,
        hostBioExtended: theme.host_bio_extended,
        hostTagline: theme.host_tagline,
        showHostBadge: theme.show_host_badge,
      },
    };

    return NextResponse.json({
      theme: themeConfig,
      isDefault: false,
      createdAt: theme.created_at,
      updatedAt: theme.updated_at,
    });

  } catch (error) {
    console.error('Theme GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST/PUT - Crear o actualizar theme
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const listingId = params.id;
    const body = await request.json();
    
    console.log('[Theme API] Received payload:', JSON.stringify(body, null, 2));
    
    // Validar estructura básica del payload
    if (!body || typeof body !== 'object') {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    // Extraer customizations si viene envuelto, y merge con advanced y background del root
    const theme = {
      ...(body.customizations || body),
      // Si advanced y background vienen en el root, los usamos (tienen prioridad)
      ...(body.advanced && { advanced: body.advanced }),
      ...(body.background && { background: body.background }),
    };
    
    console.log('[Theme API] Processing theme:', JSON.stringify(theme, null, 2));
    
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Verificar que el usuario es owner del listing
    const { data: listing, error: listingError } = await supabase
      .from('listings')
      .select('owner_id, status')
      .eq('id', listingId)
      .single();

    if (listingError || !listing) {
      return NextResponse.json({ error: 'Listing not found' }, { status: 404 });
    }

    if (listing.owner_id !== userId) {
      return NextResponse.json({ error: 'Unauthorized - not listing owner' }, { status: 403 });
    }

    // Todos los templates y funcionalidades están disponibles para todos los hosts
    // (Restricciones de Founding Host eliminadas)

    // Validar colores
    if (theme.colors && !validateThemeColors(theme.colors)) {
      return NextResponse.json({ 
        error: 'Invalid color format. Use hex colors (#RRGGBB)' 
      }, { status: 400 });
    }

    // Preparar datos para inserción con valores por defecto
    const themeData = {
      listing_id: listingId,
      template: theme.template || 'modern',
      
      primary_color: theme.colors?.primary || '#3B82F6',
      secondary_color: theme.colors?.secondary || '#1E293B',
      accent_color: theme.colors?.accent || '#F59E0B',
      
      background_type: theme.background?.type || 'gradient',
      background_gradient_start: theme.background?.gradient?.start || null,
      background_gradient_end: theme.background?.gradient?.end || null,
      background_solid_color: theme.background?.solid || null,
      background_image_url: theme.background?.image?.url || null,
      background_overlay_opacity: theme.background?.image?.overlay || 0.5,
      
      header_layout: theme.layout?.header || 'centered',
      gallery_style: theme.layout?.gallery || 'grid',
      amenities_display: theme.layout?.amenities || 'icons',
      cta_position: theme.layout?.cta || 'floating',
      
      font_family: theme.typography?.family || 'inter',
      heading_style: theme.typography?.headingStyle || 'bold',
      
      custom_logo_url: theme.advanced?.customLogo || null,
      video_intro_url: theme.advanced?.videoIntro || null,
      host_bio_extended: theme.advanced?.hostBioExtended || null,
      host_tagline: theme.advanced?.hostTagline || null,
      show_host_badge: theme.advanced?.showHostBadge ?? true,
      
      is_active: true,
      updated_at: new Date().toISOString(),
    };
    
    console.log('[Theme API] Prepared themeData:', JSON.stringify(themeData, null, 2));

    // Upsert (insert o update si ya existe)
    const { data: savedTheme, error: saveError } = await supabase
      .from('listing_themes')
      .upsert(themeData, { onConflict: 'listing_id' })
      .select()
      .single();

    if (saveError) {
      console.error('Error saving theme:', saveError);
      return NextResponse.json({ error: 'Failed to save theme' }, { status: 500 });
    }

    // Invalidar el caché de Next.js para que la página pública muestre el nuevo tema
    revalidatePath(`/properties/${listingId}`);
    revalidatePath(`/es/properties/${listingId}`);
    revalidatePath(`/en/properties/${listingId}`);
    console.log('[Theme API] 🔄 Cache invalidated for listing:', listingId);

    return NextResponse.json({
      success: true,
      theme: savedTheme,
      message: 'Theme saved successfully'
    });

  } catch (error) {
    console.error('Theme POST error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT - Alias para POST (mismo comportamiento)
export async function PUT(
  request: NextRequest,
  context: { params: { id: string } }
) {
  return POST(request, context);
}

// DELETE - Reset theme a default
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const listingId = params.id;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Verificar que el usuario es owner del listing
    const { data: listing, error: listingError } = await supabase
      .from('listings')
      .select('owner_id')
      .eq('id', listingId)
      .single();

    if (listingError || !listing) {
      return NextResponse.json({ error: 'Listing not found' }, { status: 404 });
    }

    if (listing.owner_id !== userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Marcar theme como inactivo (soft delete)
    const { error: deleteError } = await supabase
      .from('listing_themes')
      .update({ is_active: false, updated_at: new Date().toISOString() })
      .eq('listing_id', listingId);

    if (deleteError) {
      console.error('Error deleting theme:', deleteError);
      return NextResponse.json({ error: 'Failed to delete theme' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'Theme reset to default'
    });

  } catch (error) {
    console.error('Theme DELETE error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
