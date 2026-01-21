-- ============================================
-- TIERED PRICING UPDATE
-- InhabitMe - Value-based fee structure
-- ============================================

-- Drop old function
DROP FUNCTION IF EXISTS calculate_host_fee(UUID, TEXT);

-- Create new function that calculates fees based on booking value
CREATE OR REPLACE FUNCTION calculate_tiered_fees(
  p_monthly_rent INTEGER,
  p_months INTEGER,
  p_is_featured BOOLEAN DEFAULT false,
  p_is_founding_host BOOLEAN DEFAULT false
) RETURNS TABLE (
  guest_fee INTEGER,
  host_fee INTEGER,
  total_booking_value INTEGER,
  tier_name TEXT
) AS $$
DECLARE
  v_total_value INTEGER;
  v_total_euros DECIMAL;
BEGIN
  -- Calculate total booking value
  v_total_value := p_monthly_rent * p_months;
  v_total_euros := v_total_value / 100.0;
  
  -- Founding Hosts pay €0
  IF p_is_founding_host THEN
    RETURN QUERY SELECT 
      8900::INTEGER,  -- Guest still pays
      0::INTEGER,     -- Host pays €0
      v_total_value,
      'Founding Host'::TEXT;
    RETURN;
  END IF;
  
  -- Tier 1: €0-2,000
  IF v_total_euros <= 2000 THEN
    RETURN QUERY SELECT 
      8900::INTEGER,  -- €89 guest
      CASE WHEN p_is_featured THEN 8000::INTEGER ELSE 5000::INTEGER END,  -- €80 featured, €50 regular
      v_total_value,
      'Tier 1 (€0-2,000)'::TEXT;
    RETURN;
  END IF;
  
  -- Tier 2: €2,001-4,000
  IF v_total_euros <= 4000 THEN
    RETURN QUERY SELECT 
      14900::INTEGER,  -- €149 guest
      CASE WHEN p_is_featured THEN 13900::INTEGER ELSE 8900::INTEGER END,  -- €139 featured, €89 regular
      v_total_value,
      'Tier 2 (€2,001-4,000)'::TEXT;
    RETURN;
  END IF;
  
  -- Tier 3: €4,001-6,000
  IF v_total_euros <= 6000 THEN
    RETURN QUERY SELECT 
      19900::INTEGER,  -- €199 guest
      CASE WHEN p_is_featured THEN 16900::INTEGER ELSE 11900::INTEGER END,  -- €169 featured, €119 regular
      v_total_value,
      'Tier 3 (€4,001-6,000)'::TEXT;
    RETURN;
  END IF;
  
  -- Tier 4: €6,000+
  RETURN QUERY SELECT 
    24900::INTEGER,  -- €249 guest
    CASE WHEN p_is_featured THEN 19900::INTEGER ELSE 14900::INTEGER END,  -- €199 featured, €149 regular
    v_total_value,
    'Tier 4 (€6,000+)'::TEXT;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION calculate_tiered_fees IS 'Calculate value-based tiered fees for bookings';

-- Add column to store guest fee (we only had host fee before)
ALTER TABLE bookings
ADD COLUMN IF NOT EXISTS guest_fee_amount INTEGER,
ADD COLUMN IF NOT EXISTS guest_payment_status VARCHAR(50) DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS guest_payment_intent_id TEXT,
ADD COLUMN IF NOT EXISTS guest_paid_at TIMESTAMP,
ADD COLUMN IF NOT EXISTS pricing_tier TEXT;

-- Comments for new columns
COMMENT ON COLUMN bookings.guest_fee_amount IS 'Guest fee amount in cents (tiered based on booking value)';
COMMENT ON COLUMN bookings.guest_payment_status IS 'Guest payment status: pending, paid, failed';
COMMENT ON COLUMN bookings.guest_payment_intent_id IS 'Stripe payment intent ID for guest fee';
COMMENT ON COLUMN bookings.guest_paid_at IS 'Timestamp when guest paid their fee';
COMMENT ON COLUMN bookings.pricing_tier IS 'Pricing tier applied to this booking (Tier 1-4 or Founding Host)';

-- Update trigger to set both guest and host fees
CREATE OR REPLACE FUNCTION set_tiered_fees_on_booking()
RETURNS TRIGGER AS $$
DECLARE
  v_fees RECORD;
  v_is_featured BOOLEAN;
  v_is_founding_host BOOLEAN;
  v_monthly_rent INTEGER;
  v_months INTEGER;
BEGIN
  -- Get property featured status
  SELECT featured INTO v_is_featured
  FROM listings
  WHERE id = NEW.property_id;
  
  -- Check if host is Founding Host (this should come from Clerk metadata in app layer)
  -- For now, we'll default to false
  v_is_founding_host := false;
  
  -- Calculate monthly rent and duration
  -- Assuming we have these fields in bookings table
  v_monthly_rent := NEW.total_price; -- This should be monthly rent in cents
  v_months := NEW.duration_months; -- This should be number of months
  
  -- Calculate fees using new tiered function
  SELECT * INTO v_fees
  FROM calculate_tiered_fees(v_monthly_rent, v_months, v_is_featured, v_is_founding_host);
  
  -- Set both fees
  NEW.guest_fee_amount := v_fees.guest_fee;
  NEW.host_fee_amount := v_fees.host_fee;
  NEW.pricing_tier := v_fees.tier_name;
  
  -- If host fee is 0 (Founding Host), mark as waived immediately
  IF NEW.host_fee_amount = 0 THEN
    NEW.host_payment_status := 'waived';
    NEW.host_paid_at := NOW();
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Update trigger
DROP TRIGGER IF EXISTS trigger_set_host_fee ON bookings;
DROP TRIGGER IF EXISTS trigger_set_tiered_fees ON bookings;

CREATE TRIGGER trigger_set_tiered_fees
  BEFORE INSERT ON bookings
  FOR EACH ROW
  EXECUTE FUNCTION set_tiered_fees_on_booking();

-- Update analytics view to include guest fees
DROP VIEW IF EXISTS host_fee_revenue;
CREATE OR REPLACE VIEW booking_revenue AS
SELECT 
  DATE_TRUNC('month', created_at) as month,
  COUNT(*) as total_bookings,
  
  -- Guest revenue
  SUM(guest_fee_amount) FILTER (WHERE guest_payment_status = 'paid') as guest_revenue_cents,
  ROUND(SUM(guest_fee_amount) FILTER (WHERE guest_payment_status = 'paid') / 100.0, 2) as guest_revenue_euros,
  
  -- Host revenue
  SUM(host_fee_amount) FILTER (WHERE host_payment_status = 'paid') as host_revenue_cents,
  ROUND(SUM(host_fee_amount) FILTER (WHERE host_payment_status = 'paid') / 100.0, 2) as host_revenue_euros,
  
  -- Total revenue
  SUM(guest_fee_amount + host_fee_amount) FILTER (WHERE guest_payment_status = 'paid' AND host_payment_status = 'paid') as total_revenue_cents,
  ROUND(SUM(guest_fee_amount + host_fee_amount) FILTER (WHERE guest_payment_status = 'paid' AND host_payment_status = 'paid') / 100.0, 2) as total_revenue_euros,
  
  -- Breakdown by tier
  COUNT(*) FILTER (WHERE pricing_tier = 'Tier 1 (€0-2,000)') as tier1_count,
  COUNT(*) FILTER (WHERE pricing_tier = 'Tier 2 (€2,001-4,000)') as tier2_count,
  COUNT(*) FILTER (WHERE pricing_tier = 'Tier 3 (€4,001-6,000)') as tier3_count,
  COUNT(*) FILTER (WHERE pricing_tier = 'Tier 4 (€6,000+)') as tier4_count,
  COUNT(*) FILTER (WHERE pricing_tier = 'Founding Host') as founding_host_count
  
FROM bookings
WHERE status != 'cancelled'
GROUP BY month
ORDER BY month DESC;

COMMENT ON VIEW booking_revenue IS 'Monthly breakdown of booking revenue (guest + host fees) with tier analysis';

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_bookings_guest_payment 
ON bookings(guest_payment_status, created_at)
WHERE guest_payment_status = 'pending';

CREATE INDEX IF NOT EXISTS idx_bookings_pricing_tier 
ON bookings(pricing_tier, created_at);
