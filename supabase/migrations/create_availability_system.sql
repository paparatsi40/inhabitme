-- ============================================
-- SISTEMA DE DISPONIBILIDAD PROFESIONAL
-- InhabitMe - Property Availability Management
-- ============================================

-- 1. Crear tabla de periodos de disponibilidad
CREATE TABLE IF NOT EXISTS property_availability_periods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'available',
  notes TEXT,
  tenant_reference VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by VARCHAR(255),
  
  -- Constraints para integridad de datos
  CONSTRAINT valid_date_range CHECK (end_date >= start_date),
  CONSTRAINT valid_status CHECK (status IN ('available', 'rented', 'blocked', 'maintenance'))
);

-- 2. Crear índices para performance
CREATE INDEX IF NOT EXISTS idx_availability_listing 
  ON property_availability_periods(listing_id);

CREATE INDEX IF NOT EXISTS idx_availability_dates 
  ON property_availability_periods(start_date, end_date);

CREATE INDEX IF NOT EXISTS idx_availability_status 
  ON property_availability_periods(listing_id, status);

CREATE INDEX IF NOT EXISTS idx_availability_lookup 
  ON property_availability_periods(listing_id, status, start_date, end_date);

-- 3. Función para detectar overlaps (validación)
CREATE OR REPLACE FUNCTION check_availability_overlap(
  p_listing_id UUID,
  p_start_date DATE,
  p_end_date DATE,
  p_exclude_id UUID DEFAULT NULL
)
RETURNS BOOLEAN AS $$
DECLARE
  overlap_count INTEGER;
BEGIN
  SELECT COUNT(*)
  INTO overlap_count
  FROM property_availability_periods
  WHERE listing_id = p_listing_id
    AND status IN ('rented', 'blocked', 'maintenance')
    AND (id IS NULL OR id != COALESCE(p_exclude_id, '00000000-0000-0000-0000-000000000000'::UUID))
    AND (
      (start_date <= p_end_date AND end_date >= p_start_date)
    );
  
  RETURN overlap_count > 0;
END;
$$ LANGUAGE plpgsql;

-- 4. Trigger para actualizar updated_at
CREATE OR REPLACE FUNCTION update_availability_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER availability_updated_at
  BEFORE UPDATE ON property_availability_periods
  FOR EACH ROW
  EXECUTE FUNCTION update_availability_updated_at();

-- 5. Función para obtener próxima fecha disponible
CREATE OR REPLACE FUNCTION get_next_available_date(p_listing_id UUID)
RETURNS DATE AS $$
DECLARE
  next_date DATE;
BEGIN
  SELECT MIN(end_date) + 1
  INTO next_date
  FROM property_availability_periods
  WHERE listing_id = p_listing_id
    AND status IN ('rented', 'blocked')
    AND end_date >= CURRENT_DATE;
  
  RETURN COALESCE(next_date, CURRENT_DATE);
END;
$$ LANGUAGE plpgsql;

-- 6. Función para verificar si está disponible en rango
CREATE OR REPLACE FUNCTION is_available_in_range(
  p_listing_id UUID,
  p_start_date DATE,
  p_end_date DATE
)
RETURNS BOOLEAN AS $$
DECLARE
  blocked_count INTEGER;
BEGIN
  SELECT COUNT(*)
  INTO blocked_count
  FROM property_availability_periods
  WHERE listing_id = p_listing_id
    AND status IN ('rented', 'blocked', 'maintenance')
    AND start_date < p_end_date
    AND end_date > p_start_date;
  
  RETURN blocked_count = 0;
END;
$$ LANGUAGE plpgsql;

-- 7. Vista para disponibilidad actual
CREATE OR REPLACE VIEW listing_availability_status AS
SELECT 
  l.id as listing_id,
  l.title,
  l.city_name,
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM property_availability_periods p
      WHERE p.listing_id = l.id
        AND p.status IN ('rented', 'blocked')
        AND p.start_date <= CURRENT_DATE
        AND p.end_date >= CURRENT_DATE
    ) THEN 'occupied'
    ELSE 'available'
  END as current_status,
  get_next_available_date(l.id) as next_available_date,
  (
    SELECT COUNT(*)
    FROM property_availability_periods p
    WHERE p.listing_id = l.id
      AND p.status = 'rented'
  ) as total_rentals
FROM listings l
WHERE l.status = 'active';

-- 8. Comentarios para documentación
COMMENT ON TABLE property_availability_periods IS 'Gestión de periodos de disponibilidad de propiedades';
COMMENT ON COLUMN property_availability_periods.status IS 'Estado del periodo: available, rented, blocked, maintenance';
COMMENT ON COLUMN property_availability_periods.tenant_reference IS 'Referencia opcional del inquilino (no expuesta públicamente)';
COMMENT ON FUNCTION check_availability_overlap IS 'Detecta si hay overlap con periodos existentes';
COMMENT ON FUNCTION get_next_available_date IS 'Retorna la próxima fecha disponible de una propiedad';
COMMENT ON FUNCTION is_available_in_range IS 'Verifica si una propiedad está disponible en un rango de fechas';

-- 9. Grant permissions (ajustar según tu setup)
-- GRANT ALL ON property_availability_periods TO authenticated;
-- GRANT SELECT ON listing_availability_status TO authenticated;
