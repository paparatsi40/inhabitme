import { NextRequest, NextResponse } from 'next/server';
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
    const body = await request.json() as ListingTheme;
    
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Verificar que el usuario es owner del listing
    const { data: listing, error: listingError } = await supabase
      .from('listings')
      .select('host_user_id, status')
      .eq('id', listingId)
      .single();

    if (listingError || !listing) {
      return NextResponse.json({ error: 'Listing not found' }, { status: 404 });
    }

    if (listing.host_user_id !== userId) {
      return NextResponse.json({ error: 'Unauthorized - not listing owner' }, { status: 403 });
    }

    // Verificar si el template requiere Founding Host
    if (isFoundingHostTemplate(body.template)) {
      const isFounding = await isFoundingHost(userId);
      if (!isFounding) {
        return NextResponse.json({ 
          error: 'This template requires Founding Host status',
          requiredTier: 'founding'
        }, { status: 403 });
      }
    }

    // Verificar custom background (solo Founding Host)
    if (body.background.type === 'image') {
      const isFounding = await isFoundingHost(userId);
      if (!isFounding) {
        return NextResponse.json({ 
          error: 'Custom background requires Founding Host status',
          requiredTier: 'founding'
        }, { status: 403 });
      }
    }

    // Validar colores
    if (!validateThemeColors(body.colors)) {
      return NextResponse.json({ 
        error: 'Invalid color format. Use hex colors (#RRGGBB)' 
      }, { status: 400 });
    }

    // Preparar datos para inserción
    const themeData = {
      listing_id: listingId,
      template: body.template,
      
      primary_color: body.colors.primary,
      secondary_color: body.colors.secondary,
      accent_color: body.colors.accent,
      
      background_type: body.background.type,
      background_gradient_start: body.background.gradient?.start || null,
      background_gradient_end: body.background.gradient?.end || null,
      background_solid_color: body.background.solid || null,
      background_image_url: body.background.image?.url || null,
      background_overlay_opacity: body.background.image?.overlay || 0.5,
      
      header_layout: body.layout.header,
      gallery_style: body.layout.gallery,
      amenities_display: body.layout.amenities,
      cta_position: body.layout.cta,
      
      font_family: body.typography.family,
      heading_style: body.typography.headingStyle,
      
      custom_logo_url: body.advanced?.customLogo || null,
      video_intro_url: body.advanced?.videoIntro || null,
      host_bio_extended: body.advanced?.hostBioExtended || null,
      host_tagline: body.advanced?.hostTagline || null,
      show_host_badge: body.advanced?.showHostBadge ?? true,
      
      is_active: true,
      updated_at: new Date().toISOString(),
    };

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
      .select('host_user_id')
      .eq('id', listingId)
      .single();

    if (listingError || !listing) {
      return NextResponse.json({ error: 'Listing not found' }, { status: 404 });
    }

    if (listing.host_user_id !== userId) {
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
