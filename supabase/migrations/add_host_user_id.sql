-- ============================================
-- Add host_user_id to listings
-- ============================================

-- Agregar columna host_user_id (probablemente ya existe como owner_id)
-- Verificar primero qué columna existe
DO $$ 
BEGIN
    -- Si existe owner_id pero no host_user_id, crear alias
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'listings' AND column_name = 'owner_id'
    ) AND NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'listings' AND column_name = 'host_user_id'
    ) THEN
        -- Agregar host_user_id como columna
        ALTER TABLE listings ADD COLUMN host_user_id TEXT;
        
        -- Copiar datos de owner_id a host_user_id
        UPDATE listings SET host_user_id = owner_id WHERE host_user_id IS NULL;
        
        -- O crear una vista (más seguro)
        -- No hacemos nada y usamos owner_id directamente en el código
    END IF;
    
    -- Si no existe ninguna, crear host_user_id
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'listings' AND column_name = 'host_user_id'
    ) AND NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'listings' AND column_name = 'owner_id'
    ) THEN
        ALTER TABLE listings ADD COLUMN host_user_id TEXT NOT NULL;
    END IF;
END $$;
