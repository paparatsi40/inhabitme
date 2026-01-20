-- ============================================
-- ADD GUEST EMAIL TO BOOKINGS
-- InhabitMe - Store guest email for reliability
-- ============================================

-- Add guest_email column to bookings table
ALTER TABLE bookings
ADD COLUMN IF NOT EXISTS guest_email TEXT;

-- Add comment
COMMENT ON COLUMN bookings.guest_email IS 'Guest email stored at booking creation for transactional reliability';

-- Index for quick lookups
CREATE INDEX IF NOT EXISTS idx_bookings_guest_email 
ON bookings(guest_email);
