-- Fix images column to be array type
-- This allows storing multiple images instead of just one

-- Check current type and alter if needed
DO $$
BEGIN
    -- Try to alter column to text array
    ALTER TABLE listings 
    ALTER COLUMN images TYPE text[] 
    USING CASE 
        WHEN images IS NULL THEN NULL
        WHEN images::text ~ '^\[.*\]$' THEN 
            -- If it's already JSON array string, parse it
            (SELECT array_agg(value::text) FROM json_array_elements_text(images::json))
        ELSE 
            -- If it's a single value, convert to array
            ARRAY[images::text]
    END;
    
    RAISE NOTICE 'Successfully converted images column to text[]';
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Column might already be text[] or error occurred: %', SQLERRM;
END $$;

-- Add comment
COMMENT ON COLUMN listings.images IS 'Array of image URLs from Cloudinary';
