import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { auth } from '@clerk/nextjs/server';
import { createClient } from '@supabase/supabase-js';
import { ListingTheme, validateThemeColors, THEME_PRESETS } from '@/lib/domain/listing-theme';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

type Ctx = { params: Promise<{ id: string }> };

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
export async function GET(request: NextRequest, { params }: Ctx) {
  try {
    const { id: listingId } = await params;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data: theme, error } = await supabase
      .from('listing_themes')
      .select('*')
      .eq('listing_id', listingId)
      .eq('is_active', true)
      .single();

    if (error && (error as any).code !== 'PGRST116') {
      console.error('Error fetching theme:', error);
      return NextResponse.json({ error: 'Failed to fetch theme' }, { status: 500 });
    }

    if (!theme) {
      return NextResponse.json({
        theme: THEME_PRESETS.modern,
        isDefault: true
      });
    }

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

// POST - Crear o actualizar theme
export async function POST(request: NextRequest, { params }: Ctx) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: listingId } = await params;
    const body = await request.json();


    if (!body || typeof body !== 'object') {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    const theme = {
      ...(body.customizations || body),
      ...(body.advanced && { advanced: body.advanced }),
      ...(body.background && { background: body.background }),
    };


    const supabase = createClient(supabaseUrl, supabaseKey);

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

    if (theme.colors && !validateThemeColors(theme.colors)) {
      return NextResponse.json(
        { error: 'Invalid color format. Use hex colors (#RRGGBB)' },
        { status: 400 }
      );
    }

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


    const { data: savedTheme, error: saveError } = await supabase
      .from('listing_themes')
      .upsert(themeData, { onConflict: 'listing_id' })
      .select()
      .single();

    if (saveError) {
      console.error('Error saving theme:', saveError);
      return NextResponse.json({ error: 'Failed to save theme' }, { status: 500 });
    }

    revalidatePath(`/properties/${listingId}`);
    revalidatePath(`/es/properties/${listingId}`);
    revalidatePath(`/en/properties/${listingId}`);

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
export async function PUT(request: NextRequest, ctx: Ctx) {
  return POST(request, ctx);
}

// DELETE - Reset theme a default
export async function DELETE(request: NextRequest, { params }: Ctx) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: listingId } = await params;
    const supabase = createClient(supabaseUrl, supabaseKey);

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