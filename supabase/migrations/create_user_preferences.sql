-- =============================================
-- TABLA: USER PREFERENCES
-- Preferencias y configuración de notificaciones por usuario
-- =============================================

-- 1. Crear tabla de preferencias de usuario
CREATE TABLE IF NOT EXISTS user_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id VARCHAR(255) NOT NULL UNIQUE, -- Clerk user ID
  
  -- Notificaciones por email
  email_new_leads BOOLEAN DEFAULT true,
  email_new_bookings BOOLEAN DEFAULT true,
  email_booking_updates BOOLEAN DEFAULT true,
  email_messages BOOLEAN DEFAULT true,
  email_marketing BOOLEAN DEFAULT true,
  
  -- Notificaciones push (futuro)
  push_notifications BOOLEAN DEFAULT false,
  
  -- Preferencias de comunicación
  newsletter_subscribed BOOLEAN DEFAULT true,
  product_updates BOOLEAN DEFAULT true,
  tips_and_guides BOOLEAN DEFAULT true,
  
  -- Preferencias de idioma y región
  preferred_language VARCHAR(10) DEFAULT 'es',
  timezone VARCHAR(50) DEFAULT 'Europe/Madrid',
  currency VARCHAR(3) DEFAULT 'EUR',
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT valid_language CHECK (preferred_language IN ('en', 'es')),
  CONSTRAINT valid_currency CHECK (currency IN ('EUR', 'USD', 'GBP'))
);

-- 2. Índices para performance
CREATE INDEX IF NOT EXISTS idx_user_preferences_user_id ON user_preferences(user_id);

-- 3. Trigger para actualizar updated_at
CREATE OR REPLACE FUNCTION update_user_preferences_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER user_preferences_updated_at
  BEFORE UPDATE ON user_preferences
  FOR EACH ROW
  EXECUTE FUNCTION update_user_preferences_updated_at();

-- 4. Función para obtener o crear preferencias por defecto
CREATE OR REPLACE FUNCTION get_or_create_user_preferences(p_user_id VARCHAR)
RETURNS user_preferences AS $$
DECLARE
  prefs user_preferences;
BEGIN
  -- Intentar obtener preferencias existentes
  SELECT * INTO prefs FROM user_preferences WHERE user_id = p_user_id;
  
  -- Si no existen, crear con valores por defecto
  IF NOT FOUND THEN
    INSERT INTO user_preferences (user_id)
    VALUES (p_user_id)
    RETURNING * INTO prefs;
  END IF;
  
  RETURN prefs;
END;
$$ LANGUAGE plpgsql;

-- 5. Función para actualizar preferencias
CREATE OR REPLACE FUNCTION update_user_preference(
  p_user_id VARCHAR,
  p_preference_key VARCHAR,
  p_value BOOLEAN
)
RETURNS user_preferences AS $$
DECLARE
  prefs user_preferences;
BEGIN
  -- Asegurar que existen las preferencias
  PERFORM get_or_create_user_preferences(p_user_id);
  
  -- Actualizar la preferencia específica
  EXECUTE format(
    'UPDATE user_preferences SET %I = $1 WHERE user_id = $2 RETURNING *',
    p_preference_key
  ) USING p_value, p_user_id INTO prefs;
  
  RETURN prefs;
END;
$$ LANGUAGE plpgsql;

-- 6. RLS Policies
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

-- Los usuarios solo pueden ver sus propias preferencias
CREATE POLICY "Users can view their own preferences"
  ON user_preferences FOR SELECT
  USING (user_id = auth.uid()::text);

-- Los usuarios pueden insertar sus propias preferencias
CREATE POLICY "Users can insert their own preferences"
  ON user_preferences FOR INSERT
  WITH CHECK (user_id = auth.uid()::text);

-- Los usuarios pueden actualizar sus propias preferencias
CREATE POLICY "Users can update their own preferences"
  ON user_preferences FOR UPDATE
  USING (user_id = auth.uid()::text);

-- Comentarios
COMMENT ON TABLE user_preferences IS 'Preferencias y configuración de notificaciones por usuario';
COMMENT ON COLUMN user_preferences.email_new_leads IS 'Recibir emails cuando llega un nuevo lead';
COMMENT ON COLUMN user_preferences.email_new_bookings IS 'Recibir emails de nuevas solicitudes de reserva';
COMMENT ON COLUMN user_preferences.newsletter_subscribed IS 'Suscripción a newsletter con tips y novedades';
COMMENT ON FUNCTION get_or_create_user_preferences IS 'Obtiene las preferencias del usuario o las crea con valores por defecto';
COMMENT ON FUNCTION update_user_preference IS 'Actualiza una preferencia específica del usuario';
