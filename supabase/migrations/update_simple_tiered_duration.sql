-- ============================================
-- SIMPLE TIERED PRICING BY DURATION
-- InhabitMe - Duration-based fee structure
-- ============================================

-- Drop old function
DROP FUNCTION IF EXISTS calculate_tiered_fees(INTEGER, INTEGER, BOOLEAN, BOOLEAN);

-- Create new function that calculates fees based on booking DURATION
CREATE OR REPLACE FUNCTION calculate_duration_fees(
  p_months INTEGER,
  p_is_featured BOOLEAN DEFAULT false,
  p_is_founding_host BOOLEAN DEFAULT false
) RETURNS TABLE (
  guest_fee INTEGER,
  host_fee INTEGER,
  tier_name TEXT
) AS $$
BEGIN
  -- Founding Hosts pay €0
  IF p_is_founding_host THEN
    RETURN QUERY SELECT 
      7900::INTEGER,  -- Guest still pays €79 for 1 month (or adjust based on duration)
      0::INTEGER,     -- Host pays €0
      'Founding Host'::TEXT;
    RETURN;
  END IF;
  
  -- Tier 1: 1 month
  IF p_months = 1 THEN
    RETURN QUERY SELECT 
      7900::INTEGER,  -- €79 guest
      CASE WHEN p_is_featured THEN 6900::INTEGER ELSE 4900::INTEGER END,  -- €69 featured, €49 regular
      'Tier 1 (1 month)'::TEXT;
    RETURN;
  END IF;
  
  -- Tier 2: 2-3 months
  IF p_months >= 2 AND p_months <= 3 THEN
    RETURN QUERY SELECT 
      13900::INTEGER,  -- €139 guest
      CASE WHEN p_is_featured THEN 9900::INTEGER ELSE 7900::INTEGER END,  -- €99 featured, €79 regular
      'Tier 2 (2-3 months)'::TEXT;
    RETURN;
  END IF;
  
  -- Tier 3: 4-6 months
  IF p_months >= 4 AND p_months <= 6 THEN
    RETURN QUERY SELECT 
      18900::INTEGER,  -- €189 guest
      CASE WHEN p_is_featured THEN 12900::INTEGER ELSE 9900::INTEGER END,  -- €129 featured, €99 regular
      'Tier 3 (4-6 months)'::TEXT;
    RETURN;
  END IF;
  
  -- Tier 4: 7+ months
  RETURN QUERY SELECT 
    23900::INTEGER,  -- €239 guest
    CASE WHEN p_is_featured THEN 15900::INTEGER ELSE 11900::INTEGER END,  -- €159 featured, €119 regular
    'Tier 4 (7+ months)'::TEXT;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION calculate_duration_fees IS 'Calculate duration-based tiered fees: €79-239 guest, €49-119 host';

-- Update trigger to use new duration-based function
CREATE OR REPLACE FUNCTION set_duration_fees_on_booking()
RETURNS TRIGGER AS $$
DECLARE
  v_fees RECORD;
  v_is_featured BOOLEAN;
  v_is_founding_host BOOLEAN;
  v_months INTEGER;
BEGIN
  -- Get property featured status
  SELECT featured INTO v_is_featured
  FROM listings
  WHERE id = NEW.property_id;
  
  -- Check if host is Founding Host (this should come from Clerk metadata in app layer)
  -- For now, we'll default to false
  v_is_founding_host := false;
  
  -- Calculate duration in months
  -- Assuming NEW has duration_months field, or calculate from dates
  v_months := NEW.duration_months;
  
  -- If duration_months doesn't exist, calculate from check_in/check_out dates
  IF v_months IS NULL THEN
    v_months := GREATEST(1, ROUND(EXTRACT(EPOCH FROM (NEW.check_out - NEW.check_in)) / (30 * 24 * 60 * 60)));
  END IF;
  
  -- Calculate fees using new duration-based function
  SELECT * INTO v_fees
  FROM calculate_duration_fees(v_months, v_is_featured, v_is_founding_host);
  
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
DROP TRIGGER IF EXISTS trigger_set_tiered_fees ON bookings;
DROP TRIGGER IF EXISTS trigger_set_duration_fees ON bookings;

CREATE TRIGGER trigger_set_duration_fees
  BEFORE INSERT ON bookings
  FOR EACH ROW
  EXECUTE FUNCTION set_duration_fees_on_booking();

-- Update analytics view
DROP VIEW IF EXISTS booking_revenue;
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
  
  -- Breakdown by tier (duration-based)
  COUNT(*) FILTER (WHERE pricing_tier = 'Tier 1 (1 month)') as tier1_count,
  COUNT(*) FILTER (WHERE pricing_tier = 'Tier 2 (2-3 months)') as tier2_count,
  COUNT(*) FILTER (WHERE pricing_tier = 'Tier 3 (4-6 months)') as tier3_count,
  COUNT(*) FILTER (WHERE pricing_tier = 'Tier 4 (7+ months)') as tier4_count,
  COUNT(*) FILTER (WHERE pricing_tier = 'Founding Host') as founding_host_count,
  
  -- Average fees
  ROUND(AVG(guest_fee_amount) / 100.0, 2) as avg_guest_fee_euros,
  ROUND(AVG(host_fee_amount) / 100.0, 2) as avg_host_fee_euros
  
FROM bookings
WHERE status != 'cancelled'
GROUP BY month
ORDER BY month DESC;

COMMENT ON VIEW booking_revenue IS 'Monthly breakdown of duration-based booking revenue with tier analysis';
