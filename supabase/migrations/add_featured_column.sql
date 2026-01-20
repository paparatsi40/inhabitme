-- ============================================
-- FEATURED LISTINGS
-- InhabitMe - Featured property functionality
-- ============================================

-- 1. Agregar columna featured a listings
ALTER TABLE listings 
ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT false;

-- 2. Índice para búsquedas
CREATE INDEX IF NOT EXISTS idx_listings_featured 
ON listings(featured) 
WHERE featured = true AND status = 'active';

-- 3. Índice compuesto para ordenamiento (Featured primero)
CREATE INDEX IF NOT EXISTS idx_listings_featured_created 
ON listings(featured DESC, created_at DESC) 
WHERE status = 'active';

-- Comentario
COMMENT ON COLUMN listings.featured IS 'Propiedad destacada (Featured) - Aparece primero en búsquedas';
