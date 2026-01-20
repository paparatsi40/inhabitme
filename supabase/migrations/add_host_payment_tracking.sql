-- ============================================
-- HOST PAYMENT TRACKING
-- InhabitMe - Track host fee payments
-- ============================================

-- Add columns to track host payment
ALTER TABLE bookings
ADD COLUMN IF NOT EXISTS host_fee_amount INTEGER, -- Fee amount in cents (€50 = 5000, €0 for Founding Host)
ADD COLUMN IF NOT EXISTS host_payment_status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'paid', 'waived'
ADD COLUMN IF NOT EXISTS host_payment_intent_id TEXT, -- Stripe payment intent ID
ADD COLUMN IF NOT EXISTS host_paid_at TIMESTAMP;

-- Comments for documentation
COMMENT ON COLUMN bookings.host_fee_amount IS 'Host fee amount in cents (€50 = 5000, €0 for Founding Host)';
COMMENT ON COLUMN bookings.host_payment_status IS 'Host payment status: pending, paid, waived (for Founding Hosts)';
COMMENT ON COLUMN bookings.host_payment_intent_id IS 'Stripe payment intent ID for host fee';
COMMENT ON COLUMN bookings.host_paid_at IS 'Timestamp when host paid their fee';

-- Create index for queries
CREATE INDEX IF NOT EXISTS idx_bookings_host_payment 
ON bookings(host_payment_status, created_at)
WHERE host_payment_status = 'pending';

-- View for analytics: Host fee revenue
CREATE OR REPLACE VIEW host_fee_revenue AS
SELECT 
  DATE_TRUNC('month', host_paid_at) as month,
  COUNT(*) as total_bookings_paid,
  SUM(host_fee_amount) as total_revenue_cents,
  ROUND(SUM(host_fee_amount) / 100.0, 2) as total_revenue_euros,
  COUNT(*) FILTER (WHERE host_fee_amount = 5000) as regular_hosts,
  COUNT(*) FILTER (WHERE host_fee_amount = 8000) as featured_hosts,
  COUNT(*) FILTER (WHERE host_fee_amount = 0 AND host_payment_status = 'waived') as founding_hosts
FROM bookings
WHERE host_payment_status = 'paid' OR host_payment_status = 'waived'
GROUP BY month
ORDER BY month DESC;

COMMENT ON VIEW host_fee_revenue IS 'Monthly breakdown of host fee revenue';

-- Function to calculate host fee based on property features
CREATE OR REPLACE FUNCTION calculate_host_fee(
  p_property_id UUID,
  p_host_id TEXT
) RETURNS INTEGER AS $$
DECLARE
  v_is_featured BOOLEAN;
  v_is_founding_host BOOLEAN;
  v_fee_amount INTEGER;
BEGIN
  -- Check if property is featured
  SELECT featured INTO v_is_featured
  FROM listings
  WHERE id = p_property_id;
  
  -- Check if host is Founding Host (this should come from Clerk metadata)
  -- For now, we'll default to false and check in the application layer
  v_is_founding_host := false;
  
  -- Calculate fee
  IF v_is_founding_host THEN
    v_fee_amount := 0; -- Founding Host pays €0
  ELSIF v_is_featured THEN
    v_fee_amount := 8000; -- Featured listing: €80
  ELSE
    v_fee_amount := 5000; -- Regular: €50
  END IF;
  
  RETURN v_fee_amount;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION calculate_host_fee IS 'Calculate host fee: €0 for Founding Host, €80 for Featured, €50 for Regular';

-- Trigger to set host_fee_amount when booking is created
CREATE OR REPLACE FUNCTION set_host_fee_on_booking()
RETURNS TRIGGER AS $$
BEGIN
  -- Calculate and set host fee amount
  NEW.host_fee_amount := calculate_host_fee(NEW.property_id, NEW.host_id);
  
  -- If fee is 0, mark as waived immediately
  IF NEW.host_fee_amount = 0 THEN
    NEW.host_payment_status := 'waived';
    NEW.host_paid_at := NOW();
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
DROP TRIGGER IF EXISTS trigger_set_host_fee ON bookings;
CREATE TRIGGER trigger_set_host_fee
  BEFORE INSERT ON bookings
  FOR EACH ROW
  EXECUTE FUNCTION set_host_fee_on_booking();

-- Update existing bookings (one-time migration)
-- Set default fees for bookings that don't have them yet
UPDATE bookings
SET 
  host_fee_amount = 5000, -- Default to €50
  host_payment_status = 'pending'
WHERE host_fee_amount IS NULL
  AND status != 'cancelled';

-- Mark old completed bookings as paid (assume they paid)
UPDATE bookings
SET 
  host_payment_status = 'paid',
  host_paid_at = created_at
WHERE host_fee_amount IS NOT NULL
  AND host_payment_status = 'pending'
  AND status = 'confirmed'
  AND created_at < NOW() - INTERVAL '7 days';
