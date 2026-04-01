-- ============================================
-- BOOKING FLOW STATES + EVENTS (P1/P2 foundation)
-- InhabitMe
-- ============================================

-- 1) Extend availability_leads with conversation/intent state
ALTER TABLE availability_leads
ADD COLUMN IF NOT EXISTS conversation_status VARCHAR(50) DEFAULT 'inquiry_sent',
ADD COLUMN IF NOT EXISTS intent_score INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS message_count INTEGER DEFAULT 1,
ADD COLUMN IF NOT EXISTS booking_id UUID,
ADD COLUMN IF NOT EXISTS last_interaction_at TIMESTAMP DEFAULT NOW();

COMMENT ON COLUMN availability_leads.conversation_status IS 'Inquiry lifecycle: inquiry_sent, awaiting_host_reply, conversation_active, booking_requested, booking_pending_host, payment_pending, confirmed, closed, declined';
COMMENT ON COLUMN availability_leads.intent_score IS 'Automated intent score to trigger nudges';
COMMENT ON COLUMN availability_leads.message_count IS 'Conversation message count proxy';
COMMENT ON COLUMN availability_leads.booking_id IS 'Linked booking when request booking is created';
COMMENT ON COLUMN availability_leads.last_interaction_at IS 'Last interaction timestamp for SLA/notifications';

-- 2) Add flow state directly on bookings for explicit machine state
ALTER TABLE bookings
ADD COLUMN IF NOT EXISTS flow_state VARCHAR(50) DEFAULT 'booking_pending_host';

COMMENT ON COLUMN bookings.flow_state IS 'Flow state machine: inquiry_sent, awaiting_host_reply, conversation_active, booking_requested, booking_pending_host, payment_pending, confirmed, closed, declined';

-- 3) Event log table for analytics + debugging transitions
CREATE TABLE IF NOT EXISTS booking_flow_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID,
  inquiry_id UUID,
  event_name VARCHAR(100) NOT NULL,
  actor_role VARCHAR(30),
  actor_id TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_booking_flow_events_booking ON booking_flow_events(booking_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_booking_flow_events_inquiry ON booking_flow_events(inquiry_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_booking_flow_events_name ON booking_flow_events(event_name, created_at DESC);

COMMENT ON TABLE booking_flow_events IS 'Event stream for booking funnel instrumentation';

-- 4) Backfill defaults safely
UPDATE availability_leads
SET conversation_status = COALESCE(conversation_status, 'inquiry_sent'),
    intent_score = COALESCE(intent_score, 0),
    message_count = COALESCE(message_count, 1),
    last_interaction_at = COALESCE(last_interaction_at, created_at, NOW())
WHERE conversation_status IS NULL
   OR intent_score IS NULL
   OR message_count IS NULL
   OR last_interaction_at IS NULL;

UPDATE bookings
SET flow_state = CASE
  WHEN status = 'pending_host_approval' THEN 'booking_pending_host'
  WHEN status = 'pending_guest_payment' THEN 'payment_pending'
  WHEN status = 'pending_host_payment' THEN 'payment_pending'
  WHEN status = 'confirmed' THEN 'confirmed'
  WHEN status = 'cancelled' THEN 'declined'
  ELSE 'booking_pending_host'
END
WHERE flow_state IS NULL;
