-- Fix images column to be array type
-- This allows storing multiple images instead of just one

-- Step 1: Check if column exists and is not already an array
DO $$
BEGIN
    -- First, rename old column as backup
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'listings' 
        AND column_name = 'images'
        AND data_type != 'ARRAY'
    ) THEN
        ALTER TABLE listings RENAME COLUMN images TO images_old;
        
        -- Create new column as text array
        ALTER TABLE listings ADD COLUMN images text[];
        
        -- Copy single values to array (if they exist)
        UPDATE listings 
        SET images = ARRAY[images_old]
        WHERE images_old IS NOT NULL AND images_old != '';
        
        -- Drop old column
        ALTER TABLE listings DROP COLUMN images_old;
        
        RAISE NOTICE 'Successfully converted images column to text[]';
    ELSE
        RAISE NOTICE 'Column is already an array or does not exist';
    END IF;
END $$;

-- Add comment
COMMENT ON COLUMN listings.images IS 'Array of image URLs from Cloudinary';
