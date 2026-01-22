-- =============================================
-- TABLA: LISTING VIEWS TRACKING
-- Registra cada visita a un listing para analytics
-- =============================================

-- 1. Crear tabla de vistas
CREATE TABLE IF NOT EXISTS listing_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  
  -- Información del visitante
  viewer_id VARCHAR(255), -- NULL si es anónimo, user_id si está autenticado
  visitor_ip VARCHAR(45), -- IPv4 o IPv6
  user_agent TEXT,
  
  -- Información de la visita
  viewed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  referrer_url TEXT,
  session_id VARCHAR(255), -- Para agrupar vistas de la misma sesión
  
  -- Metadata adicional
  country_code VARCHAR(2),
  city_name VARCHAR(100),
  device_type VARCHAR(20), -- mobile, desktop, tablet
  
  -- Índice compuesto para evitar duplicados en la misma sesión
  UNIQUE(listing_id, session_id, viewed_at),
  
  CONSTRAINT valid_device_type CHECK (device_type IN ('mobile', 'desktop', 'tablet', 'unknown'))
);

-- 2. Índices para performance
CREATE INDEX IF NOT EXISTS idx_listing_views_listing ON listing_views(listing_id);
CREATE INDEX IF NOT EXISTS idx_listing_views_viewer ON listing_views(viewer_id) WHERE viewer_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_listing_views_date ON listing_views(viewed_at DESC);
CREATE INDEX IF NOT EXISTS idx_listing_views_session ON listing_views(session_id);

-- 3. Vista agregada: vistas por listing
CREATE OR REPLACE VIEW listing_views_summary AS
SELECT 
  l.id as listing_id,
  l.title,
  l.owner_id,
  COUNT(DISTINCT lv.id) as total_views,
  COUNT(DISTINCT lv.session_id) as unique_sessions,
  COUNT(DISTINCT lv.viewer_id) FILTER (WHERE lv.viewer_id IS NOT NULL) as authenticated_views,
  COUNT(*) FILTER (WHERE lv.viewed_at >= NOW() - INTERVAL '7 days') as views_last_7_days,
  COUNT(*) FILTER (WHERE lv.viewed_at >= NOW() - INTERVAL '30 days') as views_last_30_days,
  COUNT(*) FILTER (WHERE lv.device_type = 'mobile') as mobile_views,
  COUNT(*) FILTER (WHERE lv.device_type = 'desktop') as desktop_views,
  MAX(lv.viewed_at) as last_viewed_at,
  MIN(lv.viewed_at) as first_viewed_at
FROM listings l
LEFT JOIN listing_views lv ON l.id = lv.listing_id
GROUP BY l.id, l.title, l.owner_id;

-- 4. Función para obtener stats de un owner
CREATE OR REPLACE FUNCTION get_owner_views_stats(p_owner_id VARCHAR)
RETURNS TABLE (
  total_views BIGINT,
  unique_sessions BIGINT,
  views_today BIGINT,
  views_this_week BIGINT,
  views_this_month BIGINT,
  avg_views_per_listing NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(DISTINCT lv.id) as total_views,
    COUNT(DISTINCT lv.session_id) as unique_sessions,
    COUNT(*) FILTER (WHERE lv.viewed_at >= CURRENT_DATE) as views_today,
    COUNT(*) FILTER (WHERE lv.viewed_at >= CURRENT_DATE - INTERVAL '7 days') as views_this_week,
    COUNT(*) FILTER (WHERE lv.viewed_at >= CURRENT_DATE - INTERVAL '30 days') as views_this_month,
    ROUND(COUNT(DISTINCT lv.id)::numeric / NULLIF(COUNT(DISTINCT l.id), 0), 2) as avg_views_per_listing
  FROM listings l
  LEFT JOIN listing_views lv ON l.id = lv.listing_id
  WHERE l.owner_id = p_owner_id;
END;
$$ LANGUAGE plpgsql;

-- 5. Función para registrar una vista (con deduplicación)
CREATE OR REPLACE FUNCTION record_listing_view(
  p_listing_id UUID,
  p_viewer_id VARCHAR DEFAULT NULL,
  p_session_id VARCHAR DEFAULT NULL,
  p_visitor_ip VARCHAR DEFAULT NULL,
  p_user_agent TEXT DEFAULT NULL,
  p_referrer_url TEXT DEFAULT NULL,
  p_device_type VARCHAR DEFAULT 'unknown'
)
RETURNS UUID AS $$
DECLARE
  view_id UUID;
  last_view_time TIMESTAMP;
BEGIN
  -- Verificar si ya existe una vista reciente (últimos 30 minutos) de la misma sesión
  SELECT viewed_at INTO last_view_time
  FROM listing_views
  WHERE listing_id = p_listing_id
    AND session_id = p_session_id
  ORDER BY viewed_at DESC
  LIMIT 1;
  
  -- Si la última vista fue hace menos de 30 minutos, no registrar nueva vista
  IF last_view_time IS NOT NULL AND last_view_time > NOW() - INTERVAL '30 minutes' THEN
    RETURN NULL;
  END IF;
  
  -- Registrar la vista
  INSERT INTO listing_views (
    listing_id,
    viewer_id,
    session_id,
    visitor_ip,
    user_agent,
    referrer_url,
    device_type
  ) VALUES (
    p_listing_id,
    p_viewer_id,
    p_session_id,
    p_visitor_ip,
    p_user_agent,
    p_referrer_url,
    p_device_type
  )
  ON CONFLICT (listing_id, session_id, viewed_at) DO NOTHING
  RETURNING id INTO view_id;
  
  RETURN view_id;
END;
$$ LANGUAGE plpgsql;

-- 6. RLS Policies
ALTER TABLE listing_views ENABLE ROW LEVEL SECURITY;

-- Eliminar policies existentes si existen
DROP POLICY IF EXISTS "Anyone can record a view" ON listing_views;
DROP POLICY IF EXISTS "Owners can view their listing views" ON listing_views;

-- Cualquiera puede insertar una vista
CREATE POLICY "Anyone can record a view"
  ON listing_views FOR INSERT
  WITH CHECK (true);

-- Solo los owners pueden ver las vistas de sus listings
CREATE POLICY "Owners can view their listing views"
  ON listing_views FOR SELECT
  USING (
    listing_id IN (
      SELECT id FROM listings WHERE owner_id = auth.uid()::text
    )
  );

-- Comentarios
COMMENT ON TABLE listing_views IS 'Tracking de vistas de listings para analytics';
COMMENT ON COLUMN listing_views.session_id IS 'ID único de sesión para deduplicar vistas múltiples';
COMMENT ON FUNCTION record_listing_view IS 'Registra una vista con deduplicación automática (30 min)';
COMMENT ON VIEW listing_views_summary IS 'Resumen agregado de vistas por listing';
COMMENT ON FUNCTION get_owner_views_stats IS 'Obtiene estadísticas globales de vistas para un owner';
