-- ============================================
-- CORE BOOKING COMMUNICATION TABLES
-- InhabitMe PRD foundation
-- ============================================

-- 1) Conversations
CREATE TABLE IF NOT EXISTS conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID NOT NULL,
  inquiry_id UUID,
  booking_id UUID,
  host_id TEXT NOT NULL,
  guest_id TEXT,
  guest_email TEXT,
  status VARCHAR(50) NOT NULL DEFAULT 'inquiry_sent',
  intent_score INTEGER NOT NULL DEFAULT 0,
  message_count INTEGER NOT NULL DEFAULT 0,
  last_message_at TIMESTAMP,
  closed_at TIMESTAMP,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_conversations_host ON conversations(host_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_conversations_listing ON conversations(listing_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_conversations_inquiry ON conversations(inquiry_id);
CREATE INDEX IF NOT EXISTS idx_conversations_booking ON conversations(booking_id);
CREATE INDEX IF NOT EXISTS idx_conversations_status ON conversations(status, created_at DESC);

-- 2) Messages
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  sender_role VARCHAR(30) NOT NULL,
  sender_id TEXT,
  sender_email TEXT,
  body TEXT NOT NULL,
  message_type VARCHAR(30) NOT NULL DEFAULT 'text',
  is_internal BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_messages_conversation ON messages(conversation_id, created_at ASC);
CREATE INDEX IF NOT EXISTS idx_messages_sender ON messages(sender_id, created_at DESC);

-- 3) Booking requests (formal request object)
CREATE TABLE IF NOT EXISTS booking_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  inquiry_id UUID,
  booking_id UUID,
  listing_id UUID NOT NULL,
  host_id TEXT NOT NULL,
  guest_id TEXT,
  guest_email TEXT,
  check_in DATE,
  months_duration INTEGER,
  guests_count INTEGER,
  guest_message TEXT,
  status VARCHAR(50) NOT NULL DEFAULT 'booking_requested',
  host_response TEXT,
  requested_at TIMESTAMP NOT NULL DEFAULT NOW(),
  responded_at TIMESTAMP,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_booking_requests_host ON booking_requests(host_id, requested_at DESC);
CREATE INDEX IF NOT EXISTS idx_booking_requests_conversation ON booking_requests(conversation_id, requested_at DESC);
CREATE INDEX IF NOT EXISTS idx_booking_requests_status ON booking_requests(status, requested_at DESC);

-- 4) Payment transactions (platform fee tracking)
CREATE TABLE IF NOT EXISTS payment_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID,
  booking_request_id UUID,
  inquiry_id UUID,
  conversation_id UUID,
  payer_role VARCHAR(30) NOT NULL,
  payer_id TEXT,
  amount_cents INTEGER NOT NULL,
  currency VARCHAR(10) NOT NULL DEFAULT 'EUR',
  payment_type VARCHAR(50) NOT NULL,
  status VARCHAR(30) NOT NULL DEFAULT 'initiated',
  stripe_session_id TEXT,
  stripe_payment_intent_id TEXT,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_payment_transactions_booking ON payment_transactions(booking_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_payment_transactions_request ON payment_transactions(booking_request_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_payment_transactions_inquiry ON payment_transactions(inquiry_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_payment_transactions_status ON payment_transactions(status, created_at DESC);
CREATE UNIQUE INDEX IF NOT EXISTS uq_payment_transactions_stripe_session ON payment_transactions(stripe_session_id) WHERE stripe_session_id IS NOT NULL;

-- 5) Extend availability_leads for controlled contact release
ALTER TABLE availability_leads
ADD COLUMN IF NOT EXISTS contact_visible BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN IF NOT EXISTS contact_unlocked_at TIMESTAMP;

COMMENT ON COLUMN availability_leads.contact_visible IS 'Guest contact visibility gated by payment completion';
COMMENT ON COLUMN availability_leads.contact_unlocked_at IS 'Timestamp when contact became visible';

-- 6) Constraints / checks
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'chk_conversations_status'
  ) THEN
    ALTER TABLE conversations
    ADD CONSTRAINT chk_conversations_status
    CHECK (status IN (
      'inquiry_sent',
      'awaiting_host_reply',
      'conversation_active',
      'booking_requested',
      'booking_pending_host',
      'payment_pending',
      'confirmed',
      'closed',
      'declined'
    ));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'chk_booking_requests_status'
  ) THEN
    ALTER TABLE booking_requests
    ADD CONSTRAINT chk_booking_requests_status
    CHECK (status IN (
      'booking_requested',
      'booking_pending_host',
      'accepted',
      'changes_requested',
      'declined',
      'closed'
    ));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'chk_payment_transactions_status'
  ) THEN
    ALTER TABLE payment_transactions
    ADD CONSTRAINT chk_payment_transactions_status
    CHECK (status IN ('initiated', 'pending', 'paid', 'failed', 'cancelled'));
  END IF;
END $$;

-- 7) Trigger to keep updated_at fresh
CREATE OR REPLACE FUNCTION set_updated_at_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_conversations_updated_at ON conversations;
CREATE TRIGGER trg_conversations_updated_at
BEFORE UPDATE ON conversations
FOR EACH ROW EXECUTE FUNCTION set_updated_at_timestamp();

DROP TRIGGER IF EXISTS trg_booking_requests_updated_at ON booking_requests;
CREATE TRIGGER trg_booking_requests_updated_at
BEFORE UPDATE ON booking_requests
FOR EACH ROW EXECUTE FUNCTION set_updated_at_timestamp();

DROP TRIGGER IF EXISTS trg_payment_transactions_updated_at ON payment_transactions;
CREATE TRIGGER trg_payment_transactions_updated_at
BEFORE UPDATE ON payment_transactions
FOR EACH ROW EXECUTE FUNCTION set_updated_at_timestamp();

-- 8) Backfill conversation rows for existing inquiries
INSERT INTO conversations (
  listing_id,
  inquiry_id,
  booking_id,
  host_id,
  guest_email,
  status,
  intent_score,
  message_count,
  last_message_at,
  created_at,
  updated_at
)
SELECT
  al.listing_id,
  al.id,
  al.booking_id,
  l.owner_id,
  al.email,
  COALESCE(al.conversation_status, 'inquiry_sent'),
  COALESCE(al.intent_score, 0),
  COALESCE(al.message_count, 1),
  COALESCE(al.last_interaction_at, al.created_at, NOW()),
  al.created_at,
  NOW()
FROM availability_leads al
JOIN listings l ON l.id = al.listing_id
WHERE NOT EXISTS (
  SELECT 1 FROM conversations c WHERE c.inquiry_id = al.id
);