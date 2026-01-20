-- ============================================
-- LISTING THEMES SYSTEM
-- InhabitMe - Personalizable Listing Pages
-- ============================================

-- 1. Crear tabla de themes
CREATE TABLE IF NOT EXISTS listing_themes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  
  -- Plantilla base
  template VARCHAR(50) NOT NULL DEFAULT 'modern',
  
  -- Personalización de colores
  primary_color VARCHAR(7) NOT NULL DEFAULT '#667eea',
  secondary_color VARCHAR(7) NOT NULL DEFAULT '#764ba2',
  accent_color VARCHAR(7) NOT NULL DEFAULT '#10b981',
  
  -- Background
  background_type VARCHAR(20) NOT NULL DEFAULT 'gradient',
  background_gradient_start VARCHAR(7),
  background_gradient_end VARCHAR(7),
  background_solid_color VARCHAR(7),
  background_image_url TEXT,
  background_overlay_opacity DECIMAL(3,2) DEFAULT 0.5,
  
  -- Layout preferences
  header_layout VARCHAR(20) NOT NULL DEFAULT 'hero',
  gallery_style VARCHAR(20) NOT NULL DEFAULT 'grid',
  amenities_display VARCHAR(20) NOT NULL DEFAULT 'grid',
  cta_position VARCHAR(20) NOT NULL DEFAULT 'fixed',
  
  -- Typography
  font_family VARCHAR(50) NOT NULL DEFAULT 'inter',
  heading_style VARCHAR(20) NOT NULL DEFAULT 'bold',
  
  -- Advanced features (Founding Host only)
  custom_logo_url TEXT,
  video_intro_url TEXT,
  host_bio_extended TEXT,
  host_tagline VARCHAR(100),
  show_host_badge BOOLEAN DEFAULT true,
  
  -- Meta
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_active BOOLEAN DEFAULT true,
  
  -- Constraints
  UNIQUE(listing_id),
  CONSTRAINT valid_template CHECK (template IN ('modern', 'cozy', 'vibrant', 'minimal', 'luxury')),
  CONSTRAINT valid_background_type CHECK (background_type IN ('gradient', 'solid', 'image')),
  CONSTRAINT valid_header_layout CHECK (header_layout IN ('hero', 'split', 'compact', 'minimal', 'fullscreen')),
  CONSTRAINT valid_gallery_style CHECK (gallery_style IN ('grid', 'masonry', 'slider', 'fullscreen')),
  CONSTRAINT valid_amenities_display CHECK (amenities_display IN ('list', 'grid', 'badges', 'icons')),
  CONSTRAINT valid_cta_position CHECK (cta_position IN ('fixed', 'floating', 'inline')),
  CONSTRAINT valid_font_family CHECK (font_family IN ('inter', 'playfair', 'montserrat', 'roboto', 'lora')),
  CONSTRAINT valid_heading_style CHECK (heading_style IN ('bold', 'elegant', 'clean')),
  CONSTRAINT valid_overlay_opacity CHECK (background_overlay_opacity BETWEEN 0 AND 1)
);

-- 2. Índices para performance
CREATE INDEX IF NOT EXISTS idx_listing_themes_listing ON listing_themes(listing_id);
CREATE INDEX IF NOT EXISTS idx_listing_themes_template ON listing_themes(template);
CREATE INDEX IF NOT EXISTS idx_listing_themes_active ON listing_themes(is_active) WHERE is_active = true;

-- 3. Trigger para actualizar updated_at
CREATE OR REPLACE FUNCTION update_listing_themes_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER listing_themes_updated_at
  BEFORE UPDATE ON listing_themes
  FOR EACH ROW
  EXECUTE FUNCTION update_listing_themes_updated_at();

-- 4. Función para crear theme por defecto al crear listing
CREATE OR REPLACE FUNCTION create_default_theme_for_listing()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO listing_themes (listing_id, template)
  VALUES (NEW.id, 'modern')
  ON CONFLICT (listing_id) DO NOTHING;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER create_default_theme
  AFTER INSERT ON listings
  FOR EACH ROW
  EXECUTE FUNCTION create_default_theme_for_listing();

-- 5. Template presets (datos iniciales)
COMMENT ON TABLE listing_themes IS 'Configuración de personalización visual de listings';
COMMENT ON COLUMN listing_themes.template IS 'Plantilla base: modern, cozy, vibrant, minimal, luxury';
COMMENT ON COLUMN listing_themes.background_type IS 'Tipo de fondo: gradient, solid, image';
COMMENT ON COLUMN listing_themes.custom_logo_url IS 'Logo personalizado (solo Founding Host)';
COMMENT ON COLUMN listing_themes.video_intro_url IS 'Video de introducción (solo Founding Host)';
COMMENT ON COLUMN listing_themes.host_bio_extended IS 'Biografía extendida del host (solo Founding Host)';

-- 6. Vista para obtener listing con su theme
CREATE OR REPLACE VIEW listings_with_themes AS
SELECT 
  l.*,
  CASE 
    WHEN lt.id IS NOT NULL THEN 
      jsonb_build_object(
        'template', lt.template,
        'colors', jsonb_build_object(
          'primary', lt.primary_color,
          'secondary', lt.secondary_color,
          'accent', lt.accent_color
        ),
        'background', jsonb_build_object(
          'type', lt.background_type,
          'gradient', CASE 
            WHEN lt.background_type = 'gradient' THEN jsonb_build_object(
              'start', lt.background_gradient_start,
              'end', lt.background_gradient_end
            )
            ELSE NULL
          END,
          'solid', lt.background_solid_color,
          'image', CASE 
            WHEN lt.background_type = 'image' THEN jsonb_build_object(
              'url', lt.background_image_url,
              'overlay', lt.background_overlay_opacity
            )
            ELSE NULL
          END
        ),
        'layout', jsonb_build_object(
          'header', lt.header_layout,
          'gallery', lt.gallery_style,
          'amenities', lt.amenities_display,
          'cta', lt.cta_position
        ),
        'typography', jsonb_build_object(
          'family', lt.font_family,
          'headingStyle', lt.heading_style
        ),
        'advanced', jsonb_build_object(
          'customLogo', lt.custom_logo_url,
          'videoIntro', lt.video_intro_url,
          'hostBioExtended', lt.host_bio_extended,
          'hostTagline', lt.host_tagline,
          'showHostBadge', lt.show_host_badge
        )
      )
    ELSE 
      jsonb_build_object(
        'template', 'modern',
        'colors', jsonb_build_object(
          'primary', '#667eea',
          'secondary', '#764ba2',
          'accent', '#10b981'
        )
      )
  END as theme_config
FROM listings l
LEFT JOIN listing_themes lt ON l.id = lt.listing_id AND lt.is_active = true
WHERE l.status = 'active';

-- 7. Analytics: Popularidad de plantillas
CREATE OR REPLACE VIEW theme_analytics AS
SELECT 
  template,
  COUNT(*) as usage_count,
  ROUND(100.0 * COUNT(*) / SUM(COUNT(*)) OVER (), 1) as percentage,
  COUNT(*) FILTER (WHERE l.featured = true) as featured_count,
  AVG(CASE WHEN b.id IS NOT NULL THEN 1 ELSE 0 END) * 100 as avg_booking_rate
FROM listing_themes lt
JOIN listings l ON lt.listing_id = l.id
LEFT JOIN bookings b ON b.property_id = l.id AND b.status = 'confirmed'
WHERE lt.is_active = true AND l.status = 'active'
GROUP BY template
ORDER BY usage_count DESC;

-- 8. Función helper para clonar theme
CREATE OR REPLACE FUNCTION clone_theme(
  source_listing_id UUID,
  target_listing_id UUID
)
RETURNS UUID AS $$
DECLARE
  new_theme_id UUID;
BEGIN
  INSERT INTO listing_themes (
    listing_id,
    template,
    primary_color,
    secondary_color,
    accent_color,
    background_type,
    background_gradient_start,
    background_gradient_end,
    background_solid_color,
    header_layout,
    gallery_style,
    amenities_display,
    cta_position,
    font_family,
    heading_style
  )
  SELECT 
    target_listing_id,
    template,
    primary_color,
    secondary_color,
    accent_color,
    background_type,
    background_gradient_start,
    background_gradient_end,
    background_solid_color,
    header_layout,
    gallery_style,
    amenities_display,
    cta_position,
    font_family,
    heading_style
  FROM listing_themes
  WHERE listing_id = source_listing_id
  RETURNING id INTO new_theme_id;
  
  RETURN new_theme_id;
END;
$$ LANGUAGE plpgsql;

-- 9. RLS Policies (Row Level Security)
ALTER TABLE listing_themes ENABLE ROW LEVEL SECURITY;

-- Los usuarios autenticados pueden ver themes de listings activos
CREATE POLICY "Anyone can view active listing themes"
  ON listing_themes FOR SELECT
  USING (is_active = true);

-- Solo el owner del listing puede actualizar su theme
CREATE POLICY "Owners can update their listing themes"
  ON listing_themes FOR UPDATE
  USING (
    listing_id IN (
      SELECT id FROM listings WHERE host_user_id = auth.uid()
    )
  );

-- Solo el owner puede insertar themes para sus listings
CREATE POLICY "Owners can insert themes for their listings"
  ON listing_themes FOR INSERT
  WITH CHECK (
    listing_id IN (
      SELECT id FROM listings WHERE host_user_id = auth.uid()
    )
  );

COMMENT ON FUNCTION clone_theme IS 'Clona configuración de theme de un listing a otro (útil para hosts con múltiples propiedades)';
COMMENT ON VIEW listings_with_themes IS 'Vista con listings y su configuración de theme en formato JSON';
COMMENT ON VIEW theme_analytics IS 'Analytics de uso de plantillas y su efectividad';

-- 10. Datos de seed para listings existentes
-- Crear themes por defecto para listings que no tienen
INSERT INTO listing_themes (listing_id, template)
SELECT id, 'modern'
FROM listings
WHERE id NOT IN (SELECT listing_id FROM listing_themes)
ON CONFLICT (listing_id) DO NOTHING;
