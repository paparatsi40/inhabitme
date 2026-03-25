-- Add explicit currency to bookings to avoid pricing ambiguity
ALTER TABLE bookings
ADD COLUMN IF NOT EXISTS currency VARCHAR(3) DEFAULT 'EUR';

UPDATE bookings
SET currency = COALESCE(currency, 'EUR')
WHERE currency IS NULL;

ALTER TABLE bookings
ALTER COLUMN currency SET DEFAULT 'EUR';

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'bookings_valid_currency'
  ) THEN
    ALTER TABLE bookings
    ADD CONSTRAINT bookings_valid_currency CHECK (currency IN ('EUR', 'USD'));
  END IF;
END
$$;

CREATE INDEX IF NOT EXISTS idx_bookings_currency ON bookings(currency);

COMMENT ON COLUMN bookings.currency IS 'Booking currency code (EUR or USD). All *_amount fields are stored in minor units of this currency.';
