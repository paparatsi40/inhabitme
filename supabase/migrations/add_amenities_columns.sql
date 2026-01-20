-- ============================================
-- AMENITIES SYSTEM
-- InhabitMe - Extended Property Amenities
-- ============================================

-- Agregar nuevas columnas de amenities a la tabla listings
-- Estas son críticas para nómadas digitales y estancias medianas

-- CLIMA Y CONFORT
ALTER TABLE listings 
ADD COLUMN IF NOT EXISTS has_heating BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS has_ac BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS has_balcony BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS has_terrace BOOLEAN DEFAULT false;

-- HOGAR Y COMODIDADES
ALTER TABLE listings
ADD COLUMN IF NOT EXISTS has_washing_machine BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS has_dryer BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS has_dishwasher BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS has_kitchen BOOLEAN DEFAULT false;

-- EDIFICIO Y ACCESIBILIDAD
ALTER TABLE listings
ADD COLUMN IF NOT EXISTS has_elevator BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS has_parking BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS has_doorman BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS floor_number INTEGER;

-- MASCOTA Y ESTILO DE VIDA
ALTER TABLE listings
ADD COLUMN IF NOT EXISTS pets_allowed BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS smoking_allowed BOOLEAN DEFAULT false;

-- SEGURIDAD
ALTER TABLE listings
ADD COLUMN IF NOT EXISTS has_security_system BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS has_safe BOOLEAN DEFAULT false;

-- Crear índices para performance en búsquedas
CREATE INDEX IF NOT EXISTS idx_listings_heating ON listings(has_heating) WHERE has_heating = true;
CREATE INDEX IF NOT EXISTS idx_listings_ac ON listings(has_ac) WHERE has_ac = true;
CREATE INDEX IF NOT EXISTS idx_listings_elevator ON listings(has_elevator) WHERE has_elevator = true;
CREATE INDEX IF NOT EXISTS idx_listings_pets ON listings(pets_allowed) WHERE pets_allowed = true;
CREATE INDEX IF NOT EXISTS idx_listings_parking ON listings(has_parking) WHERE has_parking = true;
CREATE INDEX IF NOT EXISTS idx_listings_washing_machine ON listings(has_washing_machine) WHERE has_washing_machine = true;

-- Índice compuesto para búsquedas frecuentes
CREATE INDEX IF NOT EXISTS idx_listings_essential_amenities 
ON listings(has_heating, has_ac, has_elevator, pets_allowed, has_parking)
WHERE status = 'active';

-- Comentarios para documentación
COMMENT ON COLUMN listings.has_heating IS 'Calefacción disponible';
COMMENT ON COLUMN listings.has_ac IS 'Aire acondicionado / Climatización';
COMMENT ON COLUMN listings.has_balcony IS 'Balcón privado';
COMMENT ON COLUMN listings.has_terrace IS 'Terraza privada';
COMMENT ON COLUMN listings.has_washing_machine IS 'Lavadora en la unidad';
COMMENT ON COLUMN listings.has_dryer IS 'Secadora en la unidad';
COMMENT ON COLUMN listings.has_dishwasher IS 'Lavavajillas';
COMMENT ON COLUMN listings.has_kitchen IS 'Cocina completa equipada';
COMMENT ON COLUMN listings.has_elevator IS 'Ascensor en el edificio';
COMMENT ON COLUMN listings.has_parking IS 'Plaza de parking/garaje';
COMMENT ON COLUMN listings.has_doorman IS 'Portero/Conserje';
COMMENT ON COLUMN listings.floor_number IS 'Número de piso (útil si no hay ascensor)';
COMMENT ON COLUMN listings.pets_allowed IS 'Se permiten mascotas';
COMMENT ON COLUMN listings.smoking_allowed IS 'Se permite fumar';
COMMENT ON COLUMN listings.has_security_system IS 'Sistema de seguridad/alarma';
COMMENT ON COLUMN listings.has_safe IS 'Caja fuerte en la propiedad';

-- Vista para análisis de amenities más populares
CREATE OR REPLACE VIEW amenities_popularity AS
SELECT 
  'Calefacción' as amenity,
  COUNT(*) FILTER (WHERE has_heating = true) as count,
  ROUND(100.0 * COUNT(*) FILTER (WHERE has_heating = true) / COUNT(*), 1) as percentage
FROM listings WHERE status = 'active'
UNION ALL
SELECT 
  'Aire Acondicionado',
  COUNT(*) FILTER (WHERE has_ac = true),
  ROUND(100.0 * COUNT(*) FILTER (WHERE has_ac = true) / COUNT(*), 1)
FROM listings WHERE status = 'active'
UNION ALL
SELECT 
  'Ascensor',
  COUNT(*) FILTER (WHERE has_elevator = true),
  ROUND(100.0 * COUNT(*) FILTER (WHERE has_elevator = true) / COUNT(*), 1)
FROM listings WHERE status = 'active'
UNION ALL
SELECT 
  'Parking',
  COUNT(*) FILTER (WHERE has_parking = true),
  ROUND(100.0 * COUNT(*) FILTER (WHERE has_parking = true) / COUNT(*), 1)
FROM listings WHERE status = 'active'
UNION ALL
SELECT 
  'Mascotas Permitidas',
  COUNT(*) FILTER (WHERE pets_allowed = true),
  ROUND(100.0 * COUNT(*) FILTER (WHERE pets_allowed = true) / COUNT(*), 1)
FROM listings WHERE status = 'active'
UNION ALL
SELECT 
  'Lavadora',
  COUNT(*) FILTER (WHERE has_washing_machine = true),
  ROUND(100.0 * COUNT(*) FILTER (WHERE has_washing_machine = true) / COUNT(*), 1)
FROM listings WHERE status = 'active'
ORDER BY count DESC;

-- Script de ejemplo para actualizar propiedades existentes (opcional)
-- Ejecutar solo si quieres que las propiedades existentes tengan algunos amenities por defecto
/*
UPDATE listings 
SET 
  has_kitchen = true,
  has_washing_machine = true,
  has_heating = true
WHERE status = 'active' 
  AND created_at < NOW();
*/
